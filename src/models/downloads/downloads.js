
const Model = require('../mongo');
const schema = require('./downloads-schema');

class Downloads extends Model {
  constructor() {
    super(schema);
  }

  async setAvgSpeed(downloadId, avgSpeed) {
    let download = await schema.findByIdAndUpdate(downloadId, { avg_speed: avgSpeed });
  }

  async setSize(downloadId, size) {
    let download = await schema.findByIdAndUpdate(downloadId, { total_size: size });
  }

  async setStatus(downloadId, status) {
    let updateObj = { status: status };
    if(status == 1) {
      updateObj = { ...updateObj, start_time: Date.now() };
    } else if(status == 2 || status == 3) {
      updateObj = { ...updateObj, end_time: Date.now() };
    }

    return await schema.findByIdAndUpdate(downloadId, updateObj, { new: true });
  } 
  
  async addProgress(downloadId, state) {
    let progress = {
      time: Date.now(),
      percent_complete: state.percent,
      speed: state.speed,
      transferred_size: state.size.transferred
    }

    let download = await this.get(downloadId);
    download.progress_instances.addToSet(progress);
    return await download.save();
  }
  
}

module.exports = Downloads;