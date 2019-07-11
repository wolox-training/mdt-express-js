const server = require('../app'),
  request = require('supertest');

describe('albums api tests', () => {
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

  /* test('purchaseAlbum with jwt and album inexistent returns not found error', () => {
    request(server)
      .post('/albums/200')
      .expect(404)
      .then(response =>
        expect(JSON.parse(response.text)).toEqual({
          message: 'jwt must be provided',
          internal_code: 'forbidden_error'
        })
      );
  }); */
});
