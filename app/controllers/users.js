const { createUser } = require('../services/users');

exports.createUser = async (req, res, next) => {
  try {
    const userName = await createUser(req.query);
    res.status(200).send(userName);
  } catch (err) {
    next(err);
  }
};
