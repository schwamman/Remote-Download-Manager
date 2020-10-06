'use strict';

const mongoose = require('mongoose');

const Downloads = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  status: { type: Number, required: true, default: 0 },
  total_size: { type: Number, required: true, default: 0 },
  url: { type: String, required: true },
  filepath: { type: String, required: true },
  filename: { type: String, required: true },
  add_time: { type: Number, require: true },
  start_time: { type: Number, required: false },
  end_time: { type: Number, required: false },
  avg_speed: { type: Number, required: false },
  type: { type: String, required: true, default: 'Unknown'},
  progress_instances: { 
    type: [ 
      {
        time: { type: Number, required: true },
        percent_complete: { type: Number, required: true },
        speed: { type: Number, required: true },
        transferred_size: { type: Number, required: true }
      }
    ]
   }, 
   default: []
})

module.exports = mongoose.model('Downloads ', Downloads);