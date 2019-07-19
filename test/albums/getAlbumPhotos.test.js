const server = require('../../app'),
  request = require('supertest'),
  { User, Album } = require('../../app/models'),
  { expect } = require('chai'),
  { mockedUser, adminUser, otherUser, mockAlbumPhotos } = require('../utils');

describe('getAlbumPhotos api tests', () => {
  test('get album photos without jwt returns forbidden error', done => {
    request(server)
      .get('/users/albums/1/photos')
      .end((err, res) => {
        expect(res.body.message).to.equal('jwt must be provided');
        expect(res.body.internal_code).to.equal('forbidden_error');
        done();
      });
  });

  test('get album photos with jwt and regular user and no albums bought returns not found error', done =>
    User.createWithHashedPassword(mockedUser).then(() =>
      request(server)
        .post('/users/sessions')
        .query({
          email: 'foo.bar@wolox.com.ar',
          password: 'Wolox1189!'
        })
        .then(response => {
          request(server)
            .get('/users/albums/1/photos')
            .set('Authorization', response.body.token)
            .then(res => {
              expect(res.body.message).to.equal('The album id 1 photos could not be obtained');
              expect(res.body.internal_code).to.equal('not_found_error');
              done();
            });
        })
    ));

  test('get album photos with jwt and regular user and one album bought returns the photos list', done =>
    User.createWithHashedPassword(mockedUser).then(() =>
      Album.create({
        userId: 1,
        albumId: 1,
        title: 'quidem molestiae enim'
      }).then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'foo.bar@wolox.com.ar',
            password: 'Wolox1189!'
          })
          .then(response => {
            mockAlbumPhotos();
            request(server)
              .get('/users/albums/1/photos')
              .set('Authorization', response.body.token)
              .then(res => {
                expect(res.body).to.eql([
                  {
                    albumId: 1,
                    id: 1,
                    title: 'accusamus beatae ad facilis cum similique qui sunt',
                    url: 'https://via.placeholder.com/600/92c952',
                    thumbnailUrl: 'https://via.placeholder.com/150/92c952'
                  }
                ]);
                done();
              });
          })
      )
    ));

  test('get album photos with jwt and regular user and one album bought for other user returns error', async done => {
    const user1 = await User.createWithHashedPassword(mockedUser);
    const user2 = await User.createWithHashedPassword(otherUser);
    await Album.create({
      userId: user1.id,
      albumId: 1,
      title: 'quidem molestiae enim'
    });

    const {
      body: { token }
    } = await request(server)
      .post('/users/sessions')
      .query({
        email: user2.email,
        password: 'Wolox1189!'
      });

    const response = await request(server)
      .get('/users/albums/1/photos')
      .set('Authorization', token);

    expect(response.body.message).to.equal('The album id 1 photos could not be obtained');
    expect(response.body.internal_code).to.equal('not_found_error');
    done();
  });

  test('get album photos with jwt and admin user and one album bought for other user returns photos', async () => {
    const admin = await User.createWithHashedPassword(adminUser);
    const user = await User.createWithHashedPassword(mockedUser);
    await Album.create({
      userId: user.id,
      albumId: 1,
      title: 'quidem molestiae enim'
    });

    const {
      body: { token }
    } = await request(server)
      .post('/users/sessions')
      .query({ email: admin.email, password: 'Wolox1189!' });

    mockAlbumPhotos();
    const response = await request(server)
      .get('/users/albums/1/photos')
      .set('Authorization', token);
    expect(response.body).to.eql([
      {
        albumId: 1,
        id: 1,
        title: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      }
    ]);
  });
});
