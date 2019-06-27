const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums } = require('./controllers/albums');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
};
