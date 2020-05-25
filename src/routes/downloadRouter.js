const express = require('express');
const router = express.Router();
const DownloadManager = require('../downloadQueue');

let queue = new DownloadManager();

router.get('/:filePath/:folder/:fileName', downloadFile)
router.get('*', (req, res) => {
  res.send('Don\'t forget the /:filePath/:folder/:fileName');
})

async function downloadFile(req, res) {
  let { filePath, folder, fileName } = req.params;
  //console.log('Request Params:', filePath, folder, fileName);
  (async () => queue.addDownload(filePath, folder, fileName))().catch(console.error);
  //console.log(queue);
  res.send('Download Started!');
}

module.exports = router