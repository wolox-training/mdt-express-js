const { User } = require('../models');
const { generateUserToken } = require('../services/users.js');

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const user = await User.createWithHashedPassword(req.query);
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  },
  createUserToken: async (req, res, next) => {
    try {
      const result = await generateUserToken(req.query);
      res.status(201).send(result);
    } catch (err) {
      next(err);
    }
  }
};
