const { getAll, getAlbumPhotos } = require('../services/albums'),
  logger = require('../logger'),
  { notFoundError } = require('../errors'),
  { Album } = require('../models');

exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await getAll(req.url);
    res.status(200).send(albums);
  } catch (err) {
    next(err);
  }
};

exports.getAlbumPhotos = async (req, res, next) => {
  try {
    const photos = await getAlbumPhotos(req.params.id);
    res.status(200).send(photos);
  } catch (err) {
    next(err);
  }
};

exports.purchaseAlbum = (req, res, next) =>
  Album.buyAlbum(req.purchase)
    .then(result => res.status(201).send(result))
    .catch(next);

exports.getAlbumsByUser = (req, res, next) =>
  Album.findAlbumsByUser(req)
    .then(albums => res.status(200).send(albums))
    .catch(next);

exports.getPurchasedAlbumPhotos = async (req, res, next) => {
  try {
    const query = { albumId: req.params.id };
    if (!req.decoded.admin) {
      query.userId = req.decoded.id;
    }
    const album = await Album.findAlbum(query);
    if (album) {
      logger.info(`Finding the photos of album ${album.albumId} ...`);
      const photos = await getAll(`photos?albumId=${query.albumId}`);
      return res.status(200).send(photos);
    }
    logger.error(`The album id ${query.albumId} photos could not be obtained`);
    return next(notFoundError(`The album id ${query.albumId} photos could not be obtained`));
  } catch (err) {
    return next(err);
  }
};
