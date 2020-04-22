const request = require('request');
const progress = require('request-progress');
const fs = require('fs');

class DownloadInstance {
  constructor(filePath, folder, fileName) {
    this.next = null;
    this.previous = null;
    this.path = filePath;
    this.folder = folder;
    this.name = fileName;
    this.downloading;
    this.download;
    this.percent = 0;
    this.speed = 0;
    this.size = {
      total: 0,
      transferred: 0
    };
    this.time = {
      elapsed: 0,
      remaining: null
    };
  }

  startDownload(next) {
    console.log('Download Started', this.path);
    progress(request(this.path), {
      // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
      delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
      // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
    })
    .on('progress', (state) => {
      console.log('Progress', state.percent, state.speed);
      // this.percent = state.percent;
      // this.speed = state.speed;
      // this.size = state.size;
      // this.time = state.time;
    })
    .on('error', function (err) {
      console.log('Error', err);
    })
    .on('end', function () {
        // Do something after request finishes
        console.log('end');
        next();
    })
    .pipe(fs.createWriteStream(`./downloads/${this.name}`));
    
  }
}

class DownloadQueue {
  constructor() {
    this.front = null;
    this.back = null;
    this.size = 0;
  }

  addDownload(filePath, folder, fileName) {
    let newDownload = new DownloadInstance(filePath, folder, fileName);
    if(this.size === 0) {
      this.front = newDownload;
      this.back = newDownload;
    } else {
      let nextNode = this.back;
      newDownload.next = this.back;
      nextNode.previous = newDownload;
      this.back = newDownload;
    }

    newDownload.startDownload(() => {
      this.removeDownload();
    });
    this.size++;
  }

  removeDownload() {
    console.log('Remove Download');
  }
}

module.exports = DownloadQueue;