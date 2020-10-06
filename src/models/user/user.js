'use strict';

const Model = require('../mongo');
const schema = require('./user-schema');

class Users extends Model {
  constructor() {
    super(schema);
  }

  async logTime(userId) {
    let user = await schema.findByIdAndUpdate(userId, { last_signin: Date.now() });
  }
}

module.exports = Users;
