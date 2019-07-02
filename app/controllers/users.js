const { createUser } = require('../services/users');

exports.createUser = async (req, res, next) => {
  try {
    const message = await createUser(req.query);
    res.status(200).send(message);
  } catch (err) {
    next(err);
  }
};
