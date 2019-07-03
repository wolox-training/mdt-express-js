const { invalidInputError } = require('../errors');
const { isValidEmail } = require('../helpers');
const { check, validationResult } = require('express-validator');

const paramValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(invalidInputError);
  }
};

module.exports = {
  userParamsValidations: [
    check('firstName')
      .isLength({ min: 1 })
      .withMessage('firstName required'),
    check('lastName')
      .isLength({ min: 1 })
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
  ]
};
