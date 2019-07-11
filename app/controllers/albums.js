const { getAll, getAlbumPhotos } = require('../services/albums'),
  { Purchase } = require('../models');

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

exports.purchaseAlbum = async (req, res, next) => {
  try {
    const purchase = await Purchase.buyAlbum(req.purchase);
    res.status(201).send(purchase);
  } catch (err) {
    next(err);
  }
};
