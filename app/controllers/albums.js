const fetch = require('node-fetch');
const logger = require('../logger');

exports.getAlbums = async (_, res) => {
  try {
    logger.info('Fetching albums from online store...');
    const response = await fetch('https://jsonplaceholder.typicode.com/albums');
    const albums = await response.json();
    res.status(200).send(albums);
  } catch (err) {
    res.status(404).send(err.message);
  }
};
