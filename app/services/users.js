const { User } = require('../models'),
  config = require('../../config/'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  { haveAllParams, isValidEmail } = require('../helpers'),
  { saltRounds } = config.common.usersApi;

exports.createUser = async data => {
  try {
    let message = '';
    if (!haveAllParams(data)) {
      message = 'Validation error: firstName, lastName, email and password are required';
      logger.error(message);
      throw errors.paramsRequiredError(message);
    }
    if (!isValidEmail(data.email)) {
      message = 'invalid email';
      logger.error(message);
      throw errors.invalidEmailError(message);
    }
    if (data.password.length < 8) {
      message = 'Validation error: minimum 8 characters are required in the password';
      logger.error(message);
      throw errors.passwordTooShortError(message);
    }
    let user = await User.findOne({
      where: {
        email: data.email
      }
    });
    if (user) {
      message = `The user "${user.email}" already exists`;
      logger.error(message);
      throw errors.userAlreadyExistsError(message);
    }
    const hash = await bcrypt.hash(data.password, Number(saltRounds));
    user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hash
    });
    message = `The new user "${user.email}" was created successfully`;
    logger.info(message);
    return message;
  } catch (err) {
    if (err.name === 'SequelizeDatabaseError') {
      logger.error('Database error has occur');
      throw errors.databaseError(err);
    }
    throw err;
  }
};