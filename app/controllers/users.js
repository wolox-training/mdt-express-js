const { User } = require('../models'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  errors = require('../errors'),
  logger = require('../logger'),
  config = require('../../config'),
  { secret } = config.common.session;

exports.createUser = (req, res, next) =>
  User.createWithHashedPassword(req.query)
    .then(user => res.status(201).send(user))
    .catch(next);

exports.getUsers = (req, res, next) =>
  User.getAll(req.query.page, req.query.pageSize)
    .then(users => res.status(200).send(users))
    .catch(next);

exports.login = async (req, res, next) => {
  try {
    const user = await User.findUser(req.query);
    if (user) {
      const matches = await bcrypt.compare(req.query.password, user.password);
      if (matches) {
        const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, secret);
        res.status(201).send({
          message: 'Authentication successful!',
          token
        });
        return;
      }
    }
    logger.error('Incorrect username or password');
    throw errors.forbiddenError('Incorrect username or password');
  } catch (err) {
    next(err);
  }
};

exports.createUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findUser(req.query);
    let response = null;
    if (user) {
      response = await User.update({ admin: true }, { where: { id: user.id } });
    } else {
      response = await User.createWithHashedPassword({
        admin: true,
        ...req.query
      });
    }
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

exports.invalidateSessions = (req, res, next) =>
  User.update(
    { sessionTime: Math.floor(Date.now() / 1000) },
    { returning: true, plain: true, where: { email: req.decoded.email } }
  )
    .then(([, userUpdated]) => {
      res.status(200).send(userUpdated);
    })
    .catch(next);
