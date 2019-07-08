const errors = require('../errors');

exports.isValidEmail = email => /[a-z0-9._%+-]+@wolox+\.[a-z]{2,3}(\.[a-z]{2})?/.test(email);

exports.haveAllParams = user => user.firstName && user.lastName && user.email && user.password;

exports.paginate = ({ page = 0, pageSize = 5 }) => {
  if (page < 0 || pageSize < 0) {
    throw errors.invalidInputError('page and pageSize must be positive integers');
  }
  const offset = page * pageSize;
  const limit = pageSize;
  return {
    offset,
    limit
  };
};
