const { User } = require('../models');

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.createWithHashedPassword(req.query);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};
