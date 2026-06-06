const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { triggerRCA } = require('./triggerService');

let watcher = null;

const startFileWatcher = (watchPath) => {
  if (watcher) {
    console.log('File watcher already running');
    return;
  }

  console.log(`Starting file watcher for: ${watchPath}`);

  watcher = chokidar.watch(watchPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });

  watcher.on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);
    handleFailureLog(filePath);
  });

  watcher.on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
    handleFailureLog(filePath);
  });

  watcher.on('error', (error) => {
    console.error(`File watcher error: ${error}`);
  });

  console.log('File watcher started successfully');
};

const handleFailureLog = async (filePath) => {
  try {
    const fileName = path.basename(filePath);
    
    if (fileName !== 'failure.log') {
      console.log(`Ignoring non-failure.log file: ${fileName}`);
      return;
    }

    console.log(`Processing failure.log: ${filePath}`);
    
    // Read the failure log content
    const failureLogContent = fs.readFileSync(filePath, 'utf8');
    
    // Trigger RCA generation
    await triggerRCA(failureLogContent, filePath);
    
  } catch (error) {
    console.error(`Error handling failure log: ${error.message}`);
  }
};

const stopFileWatcher = () => {
  if (watcher) {
    watcher.close();
    watcher = null;
    console.log('File watcher stopped');
  }
};

module.exports = {
  startFileWatcher,
  stopFileWatcher
};
