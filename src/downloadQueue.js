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
    const downloadPath = `./downloads/${currentDownload.folder}`;
    makeDownloadFolderIfNotExists(downloadPath);
    progress(request(currentDownload.path), {
      // throttle: 2000,                    // Throttle the progress event to 2000ms, defaults to 1000ms
      delay: 1000,                       // Only start to emit after 1000ms delay, defaults to 0ms
      // lengthHeader: 'x-transfer-length'  // Length header to use, defaults to content-length
    })
    .on('progress', (state) => {
      currentDownload.state = state;
      console.log('Progress', state.percent, state.speed);
      console.log(JSON.stringify(state, null, 2));
      // this.percent = state.percent;
      // this.speed = state.speed;
      // this.size = state.size;
      // this.time = state.time;
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