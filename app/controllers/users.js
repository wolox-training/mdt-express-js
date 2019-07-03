const { User } = require('../models');

exports.createUser = async (req, res, _) => {
  try {
    const user = await User.createWithHashedPassword(req.query);
    res.status(201).send(user);
  } catch (err) {
    res.send(err);
  }
};
