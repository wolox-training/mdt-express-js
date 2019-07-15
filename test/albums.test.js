/* eslint-disable max-lines */
const server = require('../app'),
  { User, Album } = require('../app/models'),
  request = require('supertest'),
  nock = require('nock');

const mockedUser = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo.bar@wolox.com.ar',
  password: 'Wolox1189!'
};

const adminUser = {
  firstName: 'admin',
  lastName: 'pro',
  email: 'admin@wolox.com',
  password: 'Wolox1189!',
  admin: true
};

describe('albums api tests', () => {
  beforeEach(() => User.createWithHashedPassword(mockedUser));

  test('purchaseAlbum without jwt returns forbidden error', done => {
    nock(process.env.DB_HOST)
      .post('/albums/1')
      .replyWithError({ message: 'jwt must be provided', internal_code: 'forbidden_error' });

    request(server)
      .post('/albums/1')
      .end((err, res) => {
        expect(res.body).toEqual({ message: 'jwt must be provided', internal_code: 'forbidden_error' });
        done();
      });
  });

  test('purchaseAlbum with jwt and album inexistent returns not found error', done => {
    nock(process.env.DB_HOST)
      .post('/albums/0')
      .replyWithError({
        internal_code: 'not_found_error',
        message: 'Cannot get the album, please review the id'
      });

    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .end((error, response) =>
        request(server)
          .post('/albums/0')
          .set('Authorization', response.body.token)
          .end((err, res) => {
            expect(res.body).toEqual({
              internal_code: 'not_found_error',
              message: 'Cannot get the album, please review the id'
            });
            done();
          })
      );
  });

  test('purchaseAlbum with jwt and album existent returns the purchased album', done => {
    nock(process.env.DB_HOST)
      .post('/albums/1')
      .reply({
        albumId: 1,
        title: 'quidem molestiae enim',
        userId: 1
      });

    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .end((error, response) =>
        request(server)
          .post('/albums/1')
          .set('Authorization', response.body.token)
          .end((err, res) => {
            expect(res.body).toEqual({
              albumId: 1,
              title: 'quidem molestiae enim',
              userId: 1
            });
            done();
          })
      );
  });

  test('purchaseAlbum with jwt and album already purchased by user returns conflict error', done => {
    nock(process.env.DB_HOST)
      .post('/albums/1')
      .reply({
        albumId: 1,
        title: 'quidem molestiae enim',
        userId: 1
      });

    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .end((_, response) =>
        request(server)
          .post('/albums/1')
          .set('Authorization', response.body.token)
          .end(() =>
            request(server)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .end((err, res) => {
                expect(res.body).toEqual({
                  internalCode: 'conflict_error',
                  message: 'You already have the album "quidem molestiae enim"'
                });
                done();
              })
          )
      );
  });

  test('getAlbumsByUser without jwt returns forbidden error', () =>
    request(server)
      .get('/users/1/albums')
      .expect(403)
      .then(response =>
        expect(JSON.parse(response.text)).toEqual({
          message: 'jwt must be provided',
          internal_code: 'forbidden_error'
        })
      ));

  test('getAlbumsByUser with jwt and regular user and id of another user returns unauthorized error', () =>
    User.createWithHashedPassword(adminUser).then(() =>
      request(server)
        .post('/users/sessions')
        .query({
          email: 'foo.bar@wolox.com.ar',
          password: 'Wolox1189!'
        })
        .then(res =>
          request(server)
            .get('/users/2/albums')
            .set('Authorization', res.body.token)
            .then(response =>
              expect(response.body).toEqual({
                internalCode: 'unauthorized_error',
                message: 'You must have admin permissions to get the albums of another user'
              })
            )
        )
    ));

  test('getAlbumsByUser with jwt and regular user and own id returns his albums', () =>
    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .then(res =>
        request(server)
          .post('/albums/1')
          .set('Authorization', res.body.token)
          .then(() =>
            request(server)
              .get('/users/1/albums')
              .set('Authorization', res.body.token)
              .then(response =>
                expect(response.body).toEqual([{ albumId: 1, title: 'quidem molestiae enim', userId: 1 }])
              )
          )
      ));

  test('getAlbumsByUser with jwt and admin user with id of other user get all albums of this user', () =>
    User.createWithHashedPassword(adminUser).then(() =>
      Album.create({ userId: 1, albumId: 1, title: 'test album' }).then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@wolox.com',
            password: 'Wolox1189!'
          })
          .then(res =>
            request(server)
              .get('/users/1/albums')
              .set('Authorization', res.body.token)
              .then(response =>
                expect(response.body).toEqual([{ userId: 1, albumId: 1, title: 'test album' }])
              )
          )
      )
    ));

  test('getAlbumsByUser with jwt and admin user with id of inexistent user returns not found error', () =>
    User.createWithHashedPassword(adminUser).then(() =>
      request(server)
        .post('/users/sessions')
        .query({
          email: 'admin@wolox.com',
          password: 'Wolox1189!'
        })
        .then(res =>
          request(server)
            .get('/users/0/albums')
            .set('Authorization', res.body.token)
            .then(response =>
              expect(response.body).toEqual({
                internal_code: 'not_found_error',
                message: "The id 0 user's albums could not be obtained"
              })
            )
        )
    ));

  test('get album photos without jwt returns forbidden error', done => {
    nock(process.env.DB_HOST)
      .get('/users/albums/1/photos')
      .replyWithError({ message: 'jwt must be provided', internal_code: 'forbidden_error' });

    request(server)
      .get('/users/albums/1/photos')
      .end((err, res) => {
        expect(res.body).toEqual({ message: 'jwt must be provided', internal_code: 'forbidden_error' });
        done();
      });
  });

  test('get album photos with jwt and regular user and no albums bought returns not found error', done => {
    nock(process.env.DB_HOST)
      .get('/users/albums/1/photos')
      .replyWithError({
        message: 'The album id 1 photos could not be obtained',
        internal_code: 'not_found_error'
      });

    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .end((_, response) =>
        request(server)
          .get('/users/albums/1/photos')
          .set('Authorization', response.body.token)
          .end((err, res) => {
            expect(res.body).toEqual({
              message: 'The album id 1 photos could not be obtained',
              internal_code: 'not_found_error'
            });
            done();
          })
      );
  });

  test('get album photos with jwt and regular user and one album bought returns the photos list', done => {
    nock(process.env.DB_HOST)
      .get('/users/albums/1/photos')
      .reply([
        {
          albumId: 1,
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          url: 'https://via.placeholder.com/600/92c952',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        }
      ]);

    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .end((_, response) =>
        request(server)
          .post('/albums/1')
          .set('Authorization', response.body.token)
          .end(() =>
            request(server)
              .get('/users/albums/1/photos')
              .set('Authorization', response.body.token)
              .end((err, res) => {
                expect(res.body).toEqual(
                  expect.arrayContaining([
                    {
                      albumId: 1,
                      id: 1,
                      title: 'accusamus beatae ad facilis cum similique qui sunt',
                      url: 'https://via.placeholder.com/600/92c952',
                      thumbnailUrl: 'https://via.placeholder.com/150/92c952'
                    }
                  ])
                );
                done();
              })
          )
      );
  });

  test('get album photos with jwt and regular user and one album bought for other user returns error', () =>
    Promise.resolve());
});
