const express = require('express');
const router = express.Router();
const { generateReport, getReportsByPipeline, downloadPDF } = require('../controllers/rcaController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateReport);
router.get('/pipeline/:pipelineId', protect, getReportsByPipeline);
router.get('/:id/download', protect, downloadPDF);

module.exports = router;
