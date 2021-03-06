const { check, validationResult } = require('express-validator'),
  jwt = require('jsonwebtoken'),
  { invalidInputError, forbiddenError, unauthorizedError, notFoundError } = require('../errors'),
  { isValidEmail } = require('../helpers'),
  logger = require('../logger'),
  { User } = require('../models'),
  { getAll } = require('../services/albums'),
  config = require('../../config'),
  { secret } = config.common.session;

const paramValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(invalidInputError(errors));
  }
};

exports.checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      throw forbiddenError(err.message);
    } else {
      const issuer = decoded.iat;
      const { id } = decoded;
      User.findOne({ where: { id } }).then(user => {
        if (user.sessionTime && user.sessionTime >= issuer) {
          logger.error('Invalid token');
          next(unauthorizedError('Invalid token'));
        }
      });
      req.decoded = decoded;
      next();
    }
  });
};

exports.userParamsValidations = [
  check('firstName')
    .exists()
    .withMessage('firstName required'),
  check('lastName')
    .exists()
    .withMessage('lastName required'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('password must contain more than 8 characters'),
  check('email')
    .isEmail()
    .withMessage('invalid email')
    .custom(email => {
      if (!isValidEmail(email)) {
        throw new Error('Email is not from wolox domain');
      }
      return true;
    }),
  paramValidation
];

exports.sessionParamsValidations = [
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must contain more than 8 characters.'),
  check('email')
    .isEmail()
    .withMessage('invalid email')
    .custom(email => {
      if (!isValidEmail(email)) {
        throw new Error('Email is not from wolox domain');
      }
      return true;
    }),
  paramValidation
];

exports.adminValidations = (req, res, next) => {
  if (req.decoded.admin) {
    next();
  } else {
    next(unauthorizedError('You must be admin user for use this service'));
  }
};

exports.albumIdValidations = async (req, res, next) => {
  try {
    const album = await getAll(`albums/${req.params.id}`);
    if (album.id) {
      req.purchase = {
        userId: req.decoded.id,
        albumId: album.id,
        title: album.title
      };
      next();
    } else {
      next(notFoundError('Cannot get the album, please review the id'));
    }
  } catch (err) {
    next(notFoundError('Cannot get the album, API error has occurred'));
  }
};

exports.userExists = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.params.id } });
  if (user) {
    next();
  } else {
    next(notFoundError(`The id ${req.params.id} user's albums could not be obtained`));
  }
};
