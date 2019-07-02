const { User } = require('../models'),
  config = require('../../config/'),
  logger = require('../logger'),
  errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  { saltRounds } = config.common.usersApi;

exports.createUser = async data => {
  try {
    let user = await User.findOne({
      where: {
        email: data.email
      }
    });
    let message = '';
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
