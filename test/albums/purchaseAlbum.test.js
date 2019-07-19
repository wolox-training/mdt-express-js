const server = require('../../app'),
  request = require('supertest'),
  dictum = require('dictum.js'),
  { User, Album } = require('../../app/models'),
  { expect } = require('chai'),
  { mockedUser, mockPurchaseInexistentAlbum, mockPurchaseAlbum } = require('../utils');

describe('purchaseAlbum api tests', () => {
  test('purchaseAlbum without jwt returns forbidden error', done => {
    request(server)
      .post('/albums/1')
      .then(response => {
        expect(response.body.message).to.equal('jwt must be provided');
        expect(response.body.internal_code).to.equal('forbidden_error');
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
});
