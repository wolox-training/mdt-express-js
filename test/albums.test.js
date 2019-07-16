const server = require('../app'),
  { User } = require('../app/models'),
  config = require('../config'),
  { url } = config.common.albumsApi,
  request = require('supertest'),
  // dictum = require('dictum.js'),
  { expect } = require('chai'),
  nock = require('nock');

const mockedUser = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo.bar@wolox.com.ar',
  password: 'Wolox1189!'
};

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
    nock(url)
      .get('/albums/0')
      .reply(200, {});

    User.createWithHashedPassword(mockedUser).then(user =>
      request(server)
        .post('/users/sessions')
        .query({
          email: user.email,
          password: 'Wolox1189!'
        })
        .then(response => {
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
    nock(url)
      .get('/albums/1')
      .reply(200, {
        userId: 1,
        id: 1,
        title: 'quidem molestiae enim'
      });

    User.createWithHashedPassword(mockedUser).then(user =>
      request(server)
        .post('/users/sessions')
        .query({
          email: user.email,
          password: 'Wolox1189!'
        })
        .then(response =>
          request(server)
            .post('/albums/1')
            .set('Authorization', response.body.token)
        )
        .then(res => {
          expect(res.body.userId).to.equal(1);
          expect(res.body.albumId).to.equal(1);
          expect(res.body.title).to.equal('quidem molestiae enim');
          done();
        })
    );
  });

  /* test('purchaseAlbum with jwt and album already purchased by user returns conflict error', done => {
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
  });*/
});
