const { User } = require('../models');
const { auth, createUserAdmin } = require('../services/users.js');

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

exports.createUserAdmin = (req, res, next) =>
  createUserAdmin(req.body)
    .then(admin => res.status(201).send(admin))
    .catch(next);
