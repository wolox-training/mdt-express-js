const nock = require('nock'),
  config = require('../config'),
  { url } = config.common.albumsApi;

exports.mockedUser = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo.bar@wolox.com.ar',
  password: 'Wolox1189!'
};

exports.otherUser = {
  firstName: 'other',
  lastName: 'user',
  email: 'other.user@wolox.com.ar',
  password: 'Wolox1189!'
};

exports.adminUser = {
  firstName: 'admin',
  lastName: 'pro',
  email: 'admin@wolox.com',
  password: 'Wolox1189!',
  admin: true
};

exports.mockPurchaseInexistentAlbum = () => {
  nock(url)
    .get('/albums/0')
    .reply(200, {});
};

exports.mockPurchaseAlbum = () => {
  nock(url)
    .get('/albums/1')
    .reply(200, {
      userId: 1,
      id: 1,
      title: 'quidem molestiae enim'
    });
};
