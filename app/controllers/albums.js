const fetch = require('node-fetch');
const logger = require('../logger');

const ALBUMS_URL = 'https://jsonplaceholder.typicode.com/albums';
const PHOTOS_URL = 'https://jsonplaceholder.typicode.com/photos';

exports.getAlbums = async (_, res) => {
  try {
    logger.info('Fetching albums from online store...');
    const response = await fetch(ALBUMS_URL);
    const albums = await response.json();
    res.status(200).send(albums);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    logger.info(`Fetching album with id ${req.params.id} from online store...`);
    const response = await fetch(`${ALBUMS_URL}/${req.params.id}`);
    const album = await response.json();
    if (Object.keys(album).length > 0) {
      res.status(200).send(album);
    } else {
      res.status(404).send('Album not exists');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAlbumPhotos = async (req, res) => {
  try {
    logger.info(`Fetching the photos of album with id ${req.params.id} from online store...`);
    const response = await fetch(`${PHOTOS_URL}?albumId=${req.params.id}`);
    const photos = await response.json();
    if (Object.keys(photos).length > 0) {
      res.status(200).send(photos);
    } else {
      res.status(404).send('Not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
