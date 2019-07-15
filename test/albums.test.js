const server = require('../app'),
  { User } = require('../app/models'),
  request = require('supertest'),
  nock = require('nock');

const mockedUser = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo.bar@wolox.com.ar',
  password: 'Wolox1189!'
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
});
