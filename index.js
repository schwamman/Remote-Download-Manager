'use strict';

require('dotenv').config();

// Start DB Server
const mongoose = require('mongoose');
const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/remote_download_manager';
mongoose.connect(MONGODB_URI, mongooseOptions);

let PORT = process.env.PORT || 6333;

require('./src/server').start(PORT);