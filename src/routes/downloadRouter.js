const express = require('express');
const router = express.Router();
const DownloadManager = require('../downloadQueue');
const Downloads = require('../models/downloads/downloads');
const auth = require('../auth/auth-middleware');
const { wrap, get401, verifyExists, send } = require('../route-helpers');

let queue = new DownloadManager();
const downloads = new Downloads();


router.get('/', auth, wrap(getDownloads))

//Download new file
// type = 'Movies', 'TV Shows', etc.
router.get('/:type/:downloadURL/:fileName', auth, wrap(downloadFile));
router.get('/:type/:downloadURL/:fileName/:folder', auth, wrap(downloadFile));



router.get('*', (req, res) => {
  res.send('Don\'t forget the /:type/:downloadURL/:fileName/:folder');
})

async function getDownloads(req, res) {
  const record = await downloads.get();
  send(record, res);
}

async function downloadFile(req, res) {
  let { type, downloadURL, folder, fileName } = req.params;
  
  let newDownload = {
    user_id: req.user._id,
    status: 0,
    url: downloadURL,
    filepath: `./downloads/${type}${folder ? '/' + folder : ''}`,
    filename: fileName,
    add_time: Date.now()
  }

  const record = await downloads.post(newDownload);

  (async () => queue.addDownload(record._id, type, downloadURL, folder, fileName))().catch(console.error);
 
  send(record, res, 201);
}

module.exports = router