const express = require('express');
const router = express.Router();
const { createPipeline, getPipelines, getPipelineById, deletePipeline } = require('../controllers/pipelineController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createPipeline)
  .get(protect, getPipelines);

router.route('/:id')
  .get(protect, getPipelineById)
  .delete(protect, deletePipeline);

module.exports = router;
