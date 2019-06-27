const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getAlbumById } = require('./controllers/albums');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbumById);
};
