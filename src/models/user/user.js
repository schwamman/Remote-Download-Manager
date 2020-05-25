'use strict';

const Model = require('../mongo');
const schema = require('./user-schema');

class Users extends Model {
  constructor() {
    super(schema);
  }

  // async addSubscription(userId, businessId) {
  //   let user = await this.get(userId);
  //   user.subscriptions.addToSet(businessId);
  //   return await user.save();
  // }

  // async removeSubscription(userId, businessId) {
  //   let user = await this.get(userId);
  //   user.subscriptions.pull(businessId);
  //   return await user.save();
  // }

  async logTime(userId) {
    let user = await schema.findByIdAndUpdate(userId, { last_signin: Date.now() });
  }
}

module.exports = Users;
