const bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  { User } = require('../models'),
  errors = require('../errors'),
  config = require('../../config'),
  { secret } = config.common.session;

exports.auth = async data => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email
      }
    });
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
    throw errors.forbiddenError('Incorrect username or password');
  } catch (err) {
    throw errors.databaseError(err);
  }
};
