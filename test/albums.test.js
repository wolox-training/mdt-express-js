const server = require('../app'),
  { User } = require('../app/models'),
  request = require('supertest');

const mockedUser = {
  firstName: 'foo',
  lastName: 'bar',
  email: 'foo.bar@wolox.com.ar',
  password: 'Wolox1189!'
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
});
