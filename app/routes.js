const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums');
const { createUser } = require('./controllers/users');
const { userParamsValidations } = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', userParamsValidations, createUser);
};
