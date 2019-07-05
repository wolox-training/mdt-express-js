const { check, validationResult } = require('express-validator'),
  jwt = require('jsonwebtoken'),
  { invalidInputError, forbiddenError } = require('../errors'),
  { isValidEmail } = require('../helpers'),
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

const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      throw forbiddenError(err.message);
    } else {
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

exports.authValidations = [checkToken];
