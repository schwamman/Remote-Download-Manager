'use strict';
//REQUEST IS DEPRECATED
const request = require('request');
const progress = require('request-progress');
const fs = require('fs');

class DownloadRequest {
  constructor(path, folder, name) {
    this.path = path;
    this.folder = folder || '';
    this.name = name;
    this.state = {
      "time": {
        "elapsed": 0,
        "remaining": '???'
      },
      "speed": '???',
      "percent": 0,
      "size": {
        "total": '???',
        "transferred": '???'
      }
    }
  }
}

function makeDownloadFolderIfNotExists(path) {
  const folders = path.split(/(!\.)\//);
  let current = '';
  //recursive option of mkdirSync wasn't working, gave up
  while (folders.length) {
    current = `${current}${folders.shift()}/`;
    if (!fs.existsSync(current)) {
      fs.mkdirSync(current);
    }
  }
}

class DownloadManager {
  constructor() {
    this.queue = [];
    this.currentDownload = null;
  }

  addDownload(filePath, folder, name) {
    const download = new DownloadRequest(filePath, folder, name);
    this.queue.push(download);
    this.startDownload();
  }

  startDownload() {
    if (this.currentDownload) {
      return; //Already downloading.
    }
    const currentDownload = this.currentDownload = this.queue.shift();
    
    if(!currentDownload) {
      console.log('Finished: No more downloads in queue!')
      return; //Queue is empty
    }

    const downloadPath = `./downloads/${currentDownload.folder}`;

    makeDownloadFolderIfNotExists(downloadPath);
    progress(request(currentDownload.path), {
      // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
      delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
      // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
    })
    .on('progress', (state) => {
      currentDownload.state = state;

      let percentage = `${(state.percent * 100).toFixed(2)}%`;
      let speed = state.speed > 1048576 ? `${(state.speed / 1048576).toFixed(2)} MBps` : `${(state.speed / 1024).toFixed(2)} KBps`;
      let size = state.size.total > 1073741824 ? `${(state.size.transferred / 1073741824).toFixed(2)} GB / ${(state.size.total / 1073741824).toFixed(2)} GB` :
      `${(state.size.transferred / 1048576).toFixed(2)} MB / ${(state.size.total / 1048576).toFixed(2)} MB`;
      
      let remainingSize = state.size.total - state.size.transferred;
      let remainingTime = "Calculating ...";
      
      switch (true) {
        case remainingSize < 60 * state.speed:
          remainingTime = `Time Remaining: ${remainingSize / state.speed} sec`;
          break;
        case remainingSize >= 60 * state.speed && remainingSize < 3600 * state.speed:
          remainingTime = `Time Remaining: ${Math.floor((remainingSize / state.speed) / 60) } mins ${Math.floor((remainingSize / state.speed) % 60)} secs`;
          break;
        case remainingSize >= 3600 * state.speed && remainingSize < 86400 * state.speed:
          remainingTime = `Time Remaining: ${Math.floor((remainingSize / state.speed) / 3600)} hours ${Math.floor(((remainingSize / state.speed) % 3600) / 60)} mins`;
          break
        case remainingSize >= 86400 * state.speed:
          remainingTime = `Time Remaining: ${Math.floor((remainingSize / state.speed) / 86400)} days ${Math.floor(((remainingSize / state.speed) % 86400) / 3600)} hours`;
          break
        default:
          remainingTime = "Calculating ...";
          break;
      }

      console.log('Progress:', percentage, speed, remainingTime);
    })
    .on('error', (err) => {
      console.log(`Error occured while downloading file ${currentDownload.path}:\n`, err);
      this.currentDownload = null;
      this.startDownload();
    })
    .on('end', () => {
      this.currentDownload = null;
      this.startDownload();
    })
    .pipe(fs.createWriteStream(`${downloadPath}/${currentDownload.name}`));
  }
}

module.exports = DownloadManager;