const { User } = require('../../app/models'),
  server = require('../../app'),
  dictum = require('dictum.js'),
  { adminUser } = require('../utils'),
  request = require('supertest');

const mockedUser = {
  firstName: 'Manuel',
  lastName: 'Tuero',
  email: 'manuel.tuero@wolox.com.ar',
  password: 'Wolox1189!'
};

describe('users api tests', () => {
  test('create user with valid input and the user does not exist creates correctly', () =>
    User.createWithHashedPassword(mockedUser).then(user =>
      expect(user).toMatchObject({
        firstName: 'Manuel',
        lastName: 'Tuero',
        email: 'manuel.tuero@wolox.com.ar'
      })
    ));

  test('create user with existing user failed creation', async () => {
    await User.createWithHashedPassword(mockedUser);
    const userWithExistingEmail = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };
    await expect(User.createWithHashedPassword(userWithExistingEmail)).rejects.toEqual({
      internalCode: 'database_error',
      message: 'email must be unique'
    });
  });

  test('create user with invalid password failed creation', done => {
    request(server)
      .post('/users')
      .send({
        firstName: 'Manuel',
        lastName: 'Tuero',
        email: 'manuel.tuero@wolox.com.ar',
        password: 'Wolox'
      })
      .expect(400)
      .end(err => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  test('create user with missing lastName param failed creation', done => {
    request(server)
      .post('/users')
      .send({
        firstName: 'Foo',
        email: 'manuel.tuero@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .expect(400)
      .end(err => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  test('login with invalid password fails token creation', done => {
    request(server)
      .post('/users/sessions')
      .send({
        email: 'manuel.tuero@wolox.com.ar',
        password: 'Wolox'
      })
      .expect(400)
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  test('login with missing email fails token creation', done => {
    request(server)
      .post('/users/sessions')
      .send({
        password: 'Wolox1189!'
      })
      .expect(400)
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  test('login with inexistent user fails token creation', () =>
    request(server)
      .post('/users/sessions')
      .send({
        email: 'unknownuser@wolox.com.ar',
        password: 'Wolox1189!'
      })
      .expect(403)
      .then(result =>
        expect(JSON.parse(result.text)).toEqual({
          message: 'Incorrect username or password',
          internal_code: 'forbidden_error'
        })
      ));

  test('getAll without send page and pageSize params returns the first page users', () =>
    User.createWithHashedPassword(mockedUser)
      .then(user => user)
      .then(() => User.getAll())
      .then(users => expect(users.length).toEqual(1)));

  test('getAll with one user returns all users', () =>
    User.createWithHashedPassword(mockedUser)
      .then(user => user)
      .then(() => User.getAll(0, 1))
      .then(users => expect(users.length).toEqual(1)));

  test('checkToken with invalid jwt returns invalid token error', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .send({
            email: 'manuel.tuero@wolox.com.ar',
            password: 'Wolox1189!'
          })
      )
      .then(() =>
        request(server)
          .get('/users')
          .set('Authorization', 'a.invalid.token')
          .expect(403)
          .then(response =>
            expect(JSON.parse(response.text)).toEqual({
              internal_code: 'forbidden_error',
              message: 'invalid token'
            })
          )
      ));

  test('checkToken with valid jwt returns the users list', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'manuel.tuero@wolox.com.ar',
            password: 'Wolox1189!'
          })
      )
      .then(res =>
        request(server)
          .get('/users')
          .set('Authorization', res.body.token)
          .then(response => {
            expect(response.body.length).toEqual(1);
            dictum.chai(response, 'This endpoint gets the users list or creates a new regular user');
          })
      ));

  test('createUserAdmin without jwt returns an forbidden error', () =>
    request(server)
      .post('/admin/users')
      .expect(403)
      .then(response =>
        expect(JSON.parse(response.text)).toEqual({
          message: 'jwt must be provided',
          internal_code: 'forbidden_error'
        })
      ));

  test('createUserAdmin with jwt and regular user returns unauthorized error', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'manuel.tuero@wolox.com.ar',
            password: 'Wolox1189!'
          })
      )
      .then(res =>
        request(server)
          .post('/admin/users')
          .set('Authorization', res.body.token)
          .then(response =>
            expect(response.body).toEqual({
              internal_code: 'unauthorized_error',
              message: 'You must be admin user for use this service'
            })
          )
      ));

  test('createUserAdmin with jwt and user admin and another existent user modify regular permissions to admin', () =>
    User.createWithHashedPassword(adminUser)
      .then(User.createWithHashedPassword(mockedUser))
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@wolox.com',
            password: 'Wolox1189!'
          })
      )
      .then(res =>
        request(server)
          .post('/admin/users')
          .query(mockedUser)
          .set('Authorization', res.body.token)
          .then(response => expect(response.text).toEqual('[1]'))
      ));

  test('createUserAdmin with jwt and all params and user admin and inexistent user creates a new admin user', () =>
    User.createWithHashedPassword(adminUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@wolox.com',
            password: 'Wolox1189!'
          })
      )
      .then(res =>
        request(server)
          .post('/admin/users')
          .query({
            firstName: 'foo',
            lastName: 'bar',
            email: 'unknownuser@wolox.com.ar',
            password: 'Wolox1189!'
          })
          .set('Authorization', res.body.token)
          .then(response => expect(JSON.parse(response.text).admin).toEqual(true))
      ));
});
