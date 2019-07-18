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

exports.mockAlbumNotPurchasedError = id => {
  console.log(`********************************* /users/albums/${id}/photos`);
  nock(url)
    .get(`/users/albums/${id}/photos`)
    .replyWithError({
      message: `The album id ${id} photos could not be obtained`,
      internal_code: 'not_found_error'
    });
};

exports.mockAlbumPhotos = id => {
  const photos = [
    {
      albumId: 1,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
    },
    {
      albumId: 2,
      id: 51,
      thumbnailUrl: 'https://via.placeholder.com/150/8e973b',
      title: 'non sunt voluptatem placeat consequuntur rem incidunt',
      url: 'https://via.placeholder.com/600/8e973b'
    }
  ];
  nock(url)
    .get(`/users/albums/${id}/photos`)
    .reply(200, photos[id - 1]);
};
