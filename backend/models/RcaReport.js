const mongoose = require('mongoose');

const rcaReportSchema = new mongoose.Schema({
  pipelineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pipeline',
    required: true
  },
  jobName: {
    type: String
  },
  failureTime: {
    type: String
  },
  rootCause: {
    type: String
  },
  evidence: {
    type: [String]
  },
  impact: {
    type: String
  },
  recommendedAction: {
    type: [String]
  },
  confidenceScore: {
    type: String
  },
  logDifferences: {
    missingInFailure: [String],
    unexpectedInFailure: [String]
  },
  gitDiff: {
    filesChanged: [String],
    linesAdded: Number,
    linesDeleted: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RcaReport', rcaReportSchema);
