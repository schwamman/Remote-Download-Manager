const express = require('express');
const router = express.Router();
const DownloadQueue = require('./downloadQueue');

let queue = new DownloadQueue();

router.get('/:filePath/:folder/:fileName', downloadFile)
router.get('*', (req, res) => {
  res.send('Don\'t forget the /:filePath/:folder/:fileName');
})

async function downloadFile(req, res) {
  let { filePath, folder, fileName } = req.params;
  console.log('Request Params:', filePath, folder, fileName);
  queue.addDownload(filePath, folder, fileName)
  console.log(queue);
  res.send('Download Started!');
}

module.exports = router