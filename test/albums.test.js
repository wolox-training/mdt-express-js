const server = require('../app'),
  { User, Album } = require('../app/models'),
  { mockedUser, adminUser, otherUser, mockPurchaseInexistentAlbum, mockPurchaseAlbum } = require('./utils'),
  request = require('supertest'),
  dictum = require('dictum.js'),
  { expect } = require('chai');

describe('albums api tests', () => {
  test('purchaseAlbum without jwt returns forbidden error', done => {
    request(server)
      .post('/albums/1')
      .end((err, res) => {
        expect(res.body.internal_code).to.equal('forbidden_error');
        expect(res.body.message).to.equal('jwt must be provided');
        done();
      });
  });

  test('purchaseAlbum with jwt and album inexistent returns not found error', done => {
    User.createWithHashedPassword(mockedUser).then(user =>
      request(server)
        .post('/users/sessions')
        .query({
          email: user.email,
          password: 'Wolox1189!'
        })
        .then(response => {
          mockPurchaseInexistentAlbum();
          request(server)
            .post('/albums/0')
            .set('Authorization', response.body.token)
            .then(res => {
              expect(res.body.internal_code).to.equal('not_found_error');
              expect(res.body.message).to.equal('Cannot get the album, please review the id');
              done();
            });
        })
    );
  });

  test('purchaseAlbum with jwt and album purchased by user 1 returns the purchased album', done => {
    User.createWithHashedPassword(mockedUser).then(user =>
      request(server)
        .post('/users/sessions')
        .query({
          email: user.email,
          password: 'Wolox1189!'
        })
        .then(response => {
          mockPurchaseAlbum();
          request(server)
            .post('/albums/1')
            .set('Authorization', response.body.token)
            .then(res => {
              expect(res.body.userId).to.equal(1);
              expect(res.body.albumId).to.equal(1);
              expect(res.body.title).to.equal('quidem molestiae enim');
              done();
              dictum.chai(
                res,
                'This endpoint get the albums from an external API and let that a user to buy an album'
              );
            });
        })
    );
  });

  test('purchaseAlbum with jwt and album already purchased returns conflict error', done => {
    User.createWithHashedPassword(mockedUser).then(() =>
      Album.create({
        userId: 1,
        albumId: 1,
        title: 'quidem molestiae enim'
      }).then(
        request(server)
          .post('/users/sessions')
          .query({
            email: 'foo.bar@wolox.com.ar',
            password: 'Wolox1189!'
          })
          .then(response => {
            mockPurchaseAlbum();
            request(server)
              .post('/albums/1')
              .set('Authorization', response.body.token)
              .then(res => {
                expect(res.body.internalCode).to.equal('conflict_error');
                expect(res.body.message).to.equal('You already have the album "quidem molestiae enim"');
                done();
              });
          })
      )
    );
  });

  test('getAlbumsByUser without jwt returns forbidden error', done =>
    request(server)
      .get('/users/1/albums')
      .then(response => {
        expect(response.body.message).to.equal('jwt must be provided');
        expect(response.body.internal_code).to.equal('forbidden_error');
        done();
      }));

  test('getAlbumsByUser with jwt and regular user and id of another user returns unauthorized error', done =>
    User.createWithHashedPassword(mockedUser).then(() =>
      User.createWithHashedPassword(otherUser).then(user =>
        request(server)
          .post('/users/sessions')
          .query({
            email: user.email,
            password: 'Wolox1189!'
          })
          .then(res =>
            request(server)
              .get('/users/1/albums')
              .set('Authorization', res.body.token)
              .then(response => {
                expect(response.body.message).to.equal(
                  'You must have admin permissions to get the albums of another user'
                );
                expect(response.body.internal_code).to.equal('unauthorized_error');
                done();
              })
          )
      )
    ));

  test('getAlbumsByUser with jwt and regular user and own id returns his albums', done => {
    User.createWithHashedPassword(mockedUser).then(user =>
      request(server)
        .post('/users/sessions')
        .query({
          email: user.email,
          password: 'Wolox1189!'
        })
        .then(res => {
          mockPurchaseAlbum();
          request(server)
            .post('/albums/1')
            .set('Authorization', res.body.token)
            .then(() =>
              request(server)
                .get('/users/1/albums')
                .set('Authorization', res.body.token)
                .then(response => {
                  expect(response.body).to.eql([{ userId: 1, albumId: 1, title: 'quidem molestiae enim' }]);
                  done();
                  dictum.chai(response, 'This endpoint gets the albums purchased by user');
                })
            );
        })
    );
  });

  test('getAlbumsByUser with jwt and admin user with id of other user get all albums of this user', done =>
    User.createWithHashedPassword(adminUser).then(() =>
      User.createWithHashedPassword(mockedUser).then(() =>
        Album.create({ userId: 2, albumId: 1, title: 'test album' }).then(() =>
          request(server)
            .post('/users/sessions')
            .query({
              email: 'admin@wolox.com',
              password: 'Wolox1189!'
            })
            .then(res =>
              request(server)
                .get('/users/2/albums')
                .set('Authorization', res.body.token)
                .then(response => {
                  expect(response.body).to.eql([{ userId: 2, albumId: 1, title: 'test album' }]);
                  done();
                  dictum.chai(response, 'This endpoint gets the albums purchased by user');
                })
            )
        )
      )
    ));

  test('getAlbumsByUser with jwt and admin user with id of inexistent user returns not found error', done =>
    User.createWithHashedPassword(adminUser).then(admin =>
      request(server)
        .post('/users/sessions')
        .query({
          email: admin.email,
          password: 'Wolox1189!'
        })
        .then(res =>
          request(server)
            .get('/users/0/albums')
            .set('Authorization', res.body.token)
            .then(response => {
              expect(response.body.internal_code).to.equal('not_found_error');
              expect(response.body.message).to.equal("The id 0 user's albums could not be obtained");
              done();
            })
        )
    ));
});
