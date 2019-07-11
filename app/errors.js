const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.UNAUTHORIZED_ERROR = 'unauthorized_error';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED_ERROR);

exports.FORBIDDEN_ERROR = 'forbidden_error';
exports.forbiddenError = message => internalError(message, exports.FORBIDDEN_ERROR);

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.invalidInputError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.NOT_FOUND_ERROR = 'not_found_error';
exports.notFoundError = message => internalError(message, exports.NOT_FOUND_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = err =>
  internalError(err.errors ? err.errors[0].message : err.message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
