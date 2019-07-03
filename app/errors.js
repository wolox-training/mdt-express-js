const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.invalidInputError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.ALBUMS_API_ERROR = 'albums_api_error';
exports.albumsApiError = message => internalError(message, exports.ALBUMS_API_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = err =>
  internalError(err.errors ? err.errors[0].message : 'Database Error', exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
