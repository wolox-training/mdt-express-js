const { User } = require('../models');
const { auth } = require('../services/users.js');

exports.createUser = (req, res, next) =>
  User.createWithHashedPassword(req.query)
    .then(user => res.status(201).send(user))
    .catch(next);

exports.login = (req, res, next) =>
  auth(req.query)
    .then(result => res.status(201).send(result))
    .catch(next);

exports.getUsers = (req, res, next) =>
  User.getAll(req.query)
    .then(users => res.status(200).send(users))
    .catch(next);

exports.createUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findUser(req.body);
    let response = null;
    if (user) {
      response = await User.update({ admin: true }, { where: { id: user.id } });
    } else {
      response = await User.createWithHashedPassword({
        admin: true,
        ...req.body
      });
    }
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};
