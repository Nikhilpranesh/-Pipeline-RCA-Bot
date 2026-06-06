const RcaReport = require('../models/RcaReport');
const Log = require('../models/Log');
const Pipeline = require('../models/Pipeline');
const fs = require('fs');
const Diff = require('diff');
const PDFDocument = require('pdfkit');
const { generateRCA } = require('../services/aiService');
const { analyzeGitChanges } = require('../services/gitService');
const { compareLogs } = require('../utils/logComparator');

const generateReport = async (req, res) => {
  try {
    const { pipelineId } = req.body;
    console.log('Generating RCA for pipeline:', pipelineId);

    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) {
      console.log('Pipeline not found:', pipelineId);
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    const log = await Log.findOne({ pipelineId }).sort({ uploadedAt: -1 });
    if (!log) {
      console.log('No logs found for pipeline:', pipelineId);
      return res.status(400).json({ message: 'No logs found for this pipeline' });
    }

    console.log('Log found:', log._id);
    console.log('Success log path:', log.successLogPath);
    console.log('Failure log path:', log.failureLogPath);

    let successLogData = '';
    let failureLogData = '';

    if (log.successLogPath && fs.existsSync(log.successLogPath)) {
      successLogData = fs.readFileSync(log.successLogPath, 'utf8');
      console.log('Success log loaded, length:', successLogData.length);
    } else {
      console.log('Success log file not found or empty');
    }
    if (log.failureLogPath && fs.existsSync(log.failureLogPath)) {
      failureLogData = fs.readFileSync(log.failureLogPath, 'utf8');
      console.log('Failure log loaded, length:', failureLogData.length);
    } else {
      console.log('Failure log file not found or empty');
    }

    // Git Analysis
    console.log('Starting git analysis...');
    const gitDiff = await analyzeGitChanges(process.cwd());
    console.log('Git analysis completed');

    // Log Comparison
    console.log('Starting log comparison...');
    const logDifferences = compareLogs(successLogData, failureLogData);
    console.log('Log comparison completed');

    // Generate RCA via Groq AI
    console.log('Starting AI RCA generation...');
    const aiResponse = await generateRCA(failureLogData, successLogData, gitDiff);
    console.log('AI RCA generation completed');

    // Save Report with new format
    const rcaReport = await RcaReport.create({
      pipelineId,
      jobName: aiResponse.jobName || 'Unknown Pipeline',
      failureTime: aiResponse.failureTime || new Date().toISOString().replace('T', ' ').substring(0, 16),
      rootCause: aiResponse.rootCause,
      evidence: aiResponse.evidence || [],
      impact: aiResponse.impact,
      recommendedAction: aiResponse.recommendedAction || [],
      confidenceScore: aiResponse.confidenceScore,
      logDifferences,
      gitDiff
    });

    pipeline.status = 'FAILED';
    await pipeline.save();

    console.log('RCA Report created with ID:', rcaReport._id);
    res.status(201).json(rcaReport);
  } catch (error) {
    console.error('Error in generateReport:', error);
    res.status(500).json({ message: error.message });
  }
};

const getReportsByPipeline = async (req, res) => {
  try {
    const reports = await RcaReport.find({ pipelineId: req.params.pipelineId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadPDF = async (req, res) => {
  try {
    const report = await RcaReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `RCA_Report_${report._id}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    doc.pipe(res);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('PIPELINE FAILURE RCA REPORT', { align: 'center' });
    doc.moveDown();

    // Job Name and Failure Time
    doc.fontSize(14).font('Helvetica-Bold').text('Job Name:');
    doc.fontSize(12).font('Helvetica').text(report.jobName || 'N/A');
    doc.moveDown();

    doc.fontSize(14).font('Helvetica-Bold').text('Failure Time:');
    doc.fontSize(12).font('Helvetica').text(report.failureTime || 'N/A');
    doc.moveDown();

    // Root Cause
    doc.fontSize(14).font('Helvetica-Bold').text('Root Cause:');
    doc.fontSize(12).font('Helvetica').text(report.rootCause || 'N/A');
    doc.moveDown();

    // Evidence
    doc.fontSize(14).font('Helvetica-Bold').text('Evidence:');
    if (report.evidence && report.evidence.length > 0) {
      report.evidence.forEach((item, index) => {
        doc.fontSize(12).font('Helvetica').text(`• ${item}`);
      });
    } else {
      doc.fontSize(12).font('Helvetica').text('No evidence available');
    }
    doc.moveDown();

    // Log Differences
    if (report.logDifferences && (report.logDifferences.missingInFailure?.length > 0 || report.logDifferences.unexpectedInFailure?.length > 0)) {
      doc.fontSize(14).font('Helvetica-Bold').text('Log Differences:');
      doc.moveDown();

      if (report.logDifferences.missingInFailure && report.logDifferences.missingInFailure.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('orange').text('Missing in failure:');
        doc.fillColor('black');
        report.logDifferences.missingInFailure.forEach((line, index) => {
          doc.fontSize(10).font('Courier').text(`  - ${line}`);
        });
        doc.moveDown();
      }

      if (report.logDifferences.unexpectedInFailure && report.logDifferences.unexpectedInFailure.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').fillColor('red').text('Unexpected in failure:');
        doc.fillColor('black');
        report.logDifferences.unexpectedInFailure.forEach((line, index) => {
          doc.fontSize(10).font('Courier').text(`  + ${line}`);
        });
        doc.moveDown();
      }

      if (report.logDifferences.flowDivergence) {
        doc.fontSize(11).font('Helvetica-Bold').fillColor('orange').text('⚠️ Flow divergence detected');
        doc.fillColor('black');
        doc.moveDown();
      }
    }
    doc.moveDown();

    // Impact
    doc.fontSize(14).font('Helvetica-Bold').text('Impact:');
    doc.fontSize(12).font('Helvetica').text(report.impact || 'N/A');
    doc.moveDown();

    // Recommended Action
    doc.fontSize(14).font('Helvetica-Bold').text('Recommended Action:');
    if (report.recommendedAction && report.recommendedAction.length > 0) {
      report.recommendedAction.forEach((action, index) => {
        doc.fontSize(12).font('Helvetica').text(`${index + 1}. ${action}`);
      });
    } else {
      doc.fontSize(12).font('Helvetica').text('No recommendations available');
    }
    doc.moveDown();

    // Confidence Score
    doc.fontSize(14).font('Helvetica-Bold').text('Confidence Score:');
    doc.fontSize(12).font('Helvetica').text(`${report.confidenceScore || 'N/A'}%`);
    doc.moveDown();

    // Generated timestamp
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

module.exports = { generateReport, getReportsByPipeline, downloadPDF };
