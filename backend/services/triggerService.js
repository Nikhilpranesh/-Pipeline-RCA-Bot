const Pipeline = require('../models/Pipeline');
const Log = require('../models/Log');
const RcaReport = require('../models/RcaReport');
const fs = require('fs');
const path = require('path');
const { generateRCA } = require('./aiService');
const { analyzeGitChanges } = require('./gitService');
const { compareLogs } = require('../utils/logComparator');

const triggerRCA = async (failureLogContent, failureLogPath) => {
  try {
    console.log('Triggering automatic RCA generation...');

    // Extract job name and failure time from failure log
    const jobName = extractJobName(failureLogContent) || 'Auto-Detected Pipeline Failure';
    const failureTime = extractFailureTime(failureLogContent) || new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Find or create a default pipeline for automatic triggers
    let pipeline = await Pipeline.findOne({ pipelineName: jobName });
    
    if (!pipeline) {
      pipeline = await Pipeline.create({
        pipelineName: jobName,
        description: 'Automatically detected from failure.log monitoring',
        owner: null,
        status: 'FAILED'
      });
    } else {
      pipeline.status = 'FAILED';
      await pipeline.save();
    }

    // Try to find the last successful log for this pipeline
    const lastLog = await Log.findOne({ pipelineId: pipeline._id })
      .sort({ uploadedAt: -1 });

    let successLogData = '';
    if (lastLog && lastLog.successLogPath && fs.existsSync(lastLog.successLogPath)) {
      successLogData = fs.readFileSync(lastLog.successLogPath, 'utf8');
      console.log('Found previous success log for comparison');
    } else {
      console.log('No previous success log found, proceeding without comparison');
    }

    // Perform git analysis
    const gitDiff = await analyzeGitChanges(process.cwd());
    console.log('Git diff analysis completed');

    // Log Comparison
    const logDifferences = compareLogs(successLogData, failureLogContent);
    console.log('Log comparison completed');

    // Generate RCA using AI service
    const aiResponse = await generateRCA(failureLogContent, successLogData, gitDiff);
    console.log('RCA generated successfully');

    // Save the failure log for future reference
    const logDir = path.join(__dirname, '../uploads/logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const savedFailureLogPath = path.join(logDir, `failure-${timestamp}.log`);
    fs.writeFileSync(savedFailureLogPath, failureLogContent);

    // Create log entry
    await Log.create({
      pipelineId: pipeline._id,
      successLogPath: lastLog?.successLogPath || '',
      failureLogPath: savedFailureLogPath
    });

    // Save RCA report with new format
    const rcaReport = await RcaReport.create({
      pipelineId: pipeline._id,
      jobName: aiResponse.jobName || jobName,
      failureTime: aiResponse.failureTime || failureTime,
      rootCause: aiResponse.rootCause,
      evidence: aiResponse.evidence || [],
      impact: aiResponse.impact,
      recommendedAction: aiResponse.recommendedAction || [],
      confidenceScore: aiResponse.confidenceScore,
      logDifferences,
      gitDiff
    });

    console.log(`RCA Report created with ID: ${rcaReport._id}`);
    console.log(`Job Name: ${rcaReport.jobName}`);
    console.log(`Failure Time: ${rcaReport.failureTime}`);
    console.log(`Root Cause: ${rcaReport.rootCause}`);

    return rcaReport;

  } catch (error) {
    console.error('Error in triggerRCA:', error.message);
    throw error;
  }
};

const extractJobName = (logContent) => {
  const jobNamePatterns = [
    /Job Name:\s*(.+)/i,
    /Pipeline:\s*(.+)/i,
    /Job:\s*(.+)/i,
    /Pipeline Name:\s*(.+)/i,
    /ETL Job:\s*(.+)/i
  ];
  
  for (const pattern of jobNamePatterns) {
    const match = logContent.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
};

const extractFailureTime = (logContent) => {
  const timePatterns = [
    /Failure Time:\s*(.+)/i,
    /Timestamp:\s*(.+)/i,
    /Time:\s*(.+)/i,
    /(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/,
    /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/
  ];
  
  for (const pattern of timePatterns) {
    const match = logContent.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
};

module.exports = { triggerRCA };
