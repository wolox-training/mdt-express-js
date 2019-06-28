const { getAll, getAlbumPhotos } = require('../services/albums');

exports.getAlbums = async (req, res, next) => {
  try {
    const response = await getAll(req.url);
    const albums = await response.json();
    res.status(200).send(albums);
  } catch (err) {
    next(err);
  }
};

exports.getAlbumPhotos = async (req, res, next) => {
  try {
    const response = await getAlbumPhotos(req.params.id);
    const photos = await response.json();
    res.status(200).send(photos);
  } catch (err) {
    next(err);
  }
};
