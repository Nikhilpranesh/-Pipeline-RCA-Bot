require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startFileWatcher } = require('./services/fileWatcherService');
const fs = require('fs');
const path = require('path');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pipelines', require('./routes/pipelineRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/rca', require('./routes/rcaRoutes'));

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Start file watcher for failure.log
const failureLogPath = process.env.FAILURE_LOG_PATH || './uploads/failure.log';
const watchDir = path.dirname(failureLogPath);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start file watcher after server starts
  startFileWatcher(watchDir);
});
