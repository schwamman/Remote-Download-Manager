'use strict';

const mongoose = require('mongoose');

const Downloads = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
  status: { type: Number, required: true, default}
  total_size:
  url:
  filepath:
  filename:
  start_time:
  end_time:
  avg_speed:
})