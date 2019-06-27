const fetch = require('node-fetch');
const logger = require('../logger');

exports.getAlbums = async (_, res) => {
  try {
    logger.info('Fetching albums from online store...');
    const response = await fetch('https://jsonplaceholder.typicode.com/albums');
    const albums = await response.json();
    res.status(200).send(albums);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    logger.info(`Fetching album with id ${req.params.id} from online store...`);
    const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${req.params.id}`);
    const album = await response.json();
    logger.info(JSON.stringify(album, null, 2));
    if (Object.keys(album).length > 0) {
      res.status(200).send(album);
    } else {
      res.status(404).send('Album not exists');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
