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
