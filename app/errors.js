const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.invalidEmailError = message => internalError(message, exports.BAD_REQUEST_ERROR);
exports.paramsRequiredError = message => internalError(message, exports.BAD_REQUEST_ERROR);
exports.passwordTooShortError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.CONFLICT_ERROR = 'conflict_error';
exports.userAlreadyExistsError = message => internalError(message, exports.CONFLICT_ERROR);

exports.ALBUMS_API_ERROR = 'albums_api_error';
exports.albumsApiError = message => internalError(message, exports.ALBUMS_API_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
