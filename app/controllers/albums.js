const { getAll, getAlbumPhotos } = require('../services/albums');

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
    const album = await getAll(`albums/${req.params.id}`);
    res.status(200).send(album);
  } catch (err) {
    next(err);
  }
};
