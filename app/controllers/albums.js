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
    const albumId = req.params.id;
    let response = {};
    let query = {};
    if (req.decoded.admin) {
      query = { albumId };
    } else {
      query = { albumId, userId: req.decoded.id };
    }
    const album = await Album.findOne({
      where: query
    });
    if (album) {
      logger.info(`Finding the photos of album ${album} ...`);
      response = await getAll(`photos?albumId=${albumId}`);
    } else {
      logger.error(`The album id ${albumId} photos could not be obtained`);
      throw notFoundError(`The album id ${albumId} photos could not be obtained`);
    }
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};
