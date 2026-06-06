const Pipeline = require('../models/Pipeline');

const createPipeline = async (req, res) => {
  const { pipelineName, description } = req.body;

  try {
    const pipeline = await Pipeline.create({
      pipelineName,
      description,
      owner: req.user._id,
    });
    res.status(201).json(pipeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPipelines = async (req, res) => {
  try {
    let pipelines;
    if (req.user.role === 'Admin') {
      pipelines = await Pipeline.find().populate('owner', 'username email');
    } else {
      pipelines = await Pipeline.find({ owner: req.user._id });
    }
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPipelineById = async (req, res) => {
  try {
    const pipeline = await Pipeline.findById(req.params.id).populate('owner', 'username email');
    
    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    if (req.user.role !== 'Admin' && pipeline.owner._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);

    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }

    if (req.user.role !== 'Admin' && pipeline.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await pipeline.deleteOne();
    res.json({ message: 'Pipeline removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPipeline, getPipelines, getPipelineById, deletePipeline };
