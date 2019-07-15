const server = require('../app'),
  { User, Album } = require('../app/models'),
  request = require('supertest');

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

  test('purchaseAlbum without jwt returns forbidden error', () => {
    request(server)
      .post('/albums/1')
      .expect(403)
      .then(response =>
        expect(JSON.parse(response.text)).toEqual({
          message: 'jwt must be provided',
          internal_code: 'forbidden_error'
        })
      );
  });

  test('purchaseAlbum with jwt and album inexistent returns not found error', () =>
    request(server)
      .post('/users/sessions')
      .query({
        email: 'foo.bar@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .then(res =>
        request(server)
          .post('/albums/0')
          .set('Authorization', res.body.token)
          .then(response =>
            expect(response.body).toEqual({
              internal_code: 'not_found_error',
              message: 'Cannot get the album, please review the id'
            })
          )
      ));

  test('purchaseAlbum with jwt and album existent returns the purchased album', () =>
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
          .then(response =>
            expect(response.body).toEqual({
              albumId: 1,
              title: 'quidem molestiae enim',
              userId: 1
            })
          )
      ));

  test('purchaseAlbum with jwt and album already purchased by user returns conflict error', () =>
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
              .post('/albums/1')
              .set('Authorization', res.body.token)
              .then(response =>
                expect(response.body).toEqual({
                  internalCode: 'conflict_error',
                  message: 'You already have the album "quidem molestiae enim"'
                })
              )
          )
      ));

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
});
