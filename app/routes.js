const { healthCheck } = require('./controllers/healthCheck'),
  { getAlbums, getAlbumPhotos } = require('./controllers/albums'),
  { createUser, login, getUsers } = require('./controllers/users'),
  { userParamsValidations, sessionParamsValidations, checkToken } = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', userParamsValidations, createUser);
  app.get('/users', checkToken, getUsers);
  app.post('/users/sessions', sessionParamsValidations, login);
};
