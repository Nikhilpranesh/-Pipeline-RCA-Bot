const mongoose = require('mongoose');

const pipelineSchema = new mongoose.Schema({
  pipelineName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'FAILED', 'SUCCESS'],
    default: 'ACTIVE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pipeline', pipelineSchema);
