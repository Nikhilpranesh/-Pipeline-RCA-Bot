const express = require('express');
const router = express.Router();
const { uploadLogs, getLogsByPipeline, compareLogsAPI } = require('../controllers/logController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.fields([
  { name: 'successLog', maxCount: 1 },
  { name: 'failureLog', maxCount: 1 }
]), uploadLogs);

router.get('/:pipelineId', protect, getLogsByPipeline);

router.post('/compare', protect, compareLogsAPI);

module.exports = router;
