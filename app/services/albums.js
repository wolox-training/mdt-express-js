const fetch = require('node-fetch'),
  config = require('../../config'),
  errors = require('../errors'),
  logger = require('../logger'),
  { url } = config.common.albumsApi;

exports.getAll = source =>
  fetch(`${url}${source}`)
    .then(res => res.json())
    .catch(err => {
      logger.error(err);
      throw errors.albumsApiError(err);
    });

exports.getAlbumPhotos = id =>
  fetch(`${url}/photos?albumId=${id}`)
    .then(res => res.json())
    .catch(err => {
      logger.error(err);
      throw errors.albumsApiError(err);
    });
