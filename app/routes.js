const { healthCheck } = require('./controllers/healthCheck'),
  {
    getAlbums,
    getAlbumPhotos,
    purchaseAlbum,
    getAlbumsByUser,
    getPurchasedAlbumPhotos
  } = require('./controllers/albums'),
  { createUser, login, getUsers, createUserAdmin } = require('./controllers/users'),
  {
    userParamsValidations,
    sessionParamsValidations,
    checkToken,
    adminValidations,
    albumIdValidations,
    userExists
  } = require('./middlewares/validations');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id', getAlbums);
  app.post('/albums/:id', [checkToken, albumIdValidations], purchaseAlbum);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', userParamsValidations, createUser);
  app.get('/users', checkToken, getUsers);
  app.get('/users/:id/albums', [checkToken, userExists], getAlbumsByUser);
  app.post('/users/sessions', sessionParamsValidations, login);
  app.get('/users/albums/:id/photos', checkToken, getPurchasedAlbumPhotos);
  app.post('/admin/users', [checkToken, adminValidations, userParamsValidations], createUserAdmin);
};
