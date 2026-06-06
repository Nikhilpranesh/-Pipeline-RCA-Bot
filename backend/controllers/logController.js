const Log = require('../models/Log');
const Pipeline = require('../models/Pipeline');
const fs = require('fs');
const Diff = require('diff');

const uploadLogs = async (req, res) => {
  try {
    const { pipelineId } = req.body;
    
    if (!pipelineId) {
      return res.status(400).json({ message: 'pipelineId is required' });
    }

    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    let successLogPath = '';
    let failureLogPath = '';

    if (req.files && req.files.successLog) {
      successLogPath = req.files.successLog[0].path;
    }
    if (req.files && req.files.failureLog) {
      failureLogPath = req.files.failureLog[0].path;
    }

    const log = await Log.create({
      pipelineId,
      successLogPath,
      failureLogPath
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLogsByPipeline = async (req, res) => {
  try {
    const logs = await Log.find({ pipelineId: req.params.pipelineId }).sort({ uploadedAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const compareLogsAPI = async (req, res) => {
  try {
    const { successLog, failureLog } = req.body;

    if (!successLog || !failureLog) {
      return res.status(400).json({ message: 'Both successLog and failureLog texts are required' });
    }

    const differences = Diff.diffLines(successLog, failureLog);

    res.json({ differences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadLogs, getLogsByPipeline, compareLogsAPI };
