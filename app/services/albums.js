const fetch = require('node-fetch'),
  config = require('../../config'),
  errors = require('../errors'),
  logger = require('../logger'),
  { url } = config.common.albumsApi;

exports.getAll = async source => {
  try {
    return await fetch(`${url}${source}`);
  } catch (err) {
    logger.error(err);
    throw errors.albumsApiError(err);
  }
};

exports.getAlbumPhotos = async id => {
  try {
    return await fetch(`${url}/photos?albumId=${id}`);
  } catch (err) {
    logger.error(err);
    throw errors.albumsApiError(err);
  }
};
