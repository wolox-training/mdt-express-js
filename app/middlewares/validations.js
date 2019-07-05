const { invalidInputError } = require('../errors');
const { isValidEmail } = require('../helpers');
const { check, validationResult } = require('express-validator');

const paramValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(invalidInputError(errors));
  }
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
