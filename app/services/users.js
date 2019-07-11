const bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  { User } = require('../models'),
  errors = require('../errors'),
  logger = require('../logger'),
  config = require('../../config'),
  { secret } = config.common.session;

exports.auth = async data => {
  try {
    const user = await User.findUser(data);
    if (user) {
      const matches = await bcrypt.compare(data.password, user.password);
      if (matches) {
        const token = jwt.sign({ email: user.email }, secret);
        return {
          message: 'Authentication successful!',
          token
        };
      }
    }
    logger.error('Incorrect username or password');
    return errors.forbiddenError('Incorrect username or password');
  } catch (err) {
    logger.error('Database error');
    throw errors.databaseError(err);
  }
};
