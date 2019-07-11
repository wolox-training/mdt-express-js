/* eslint-disable max-len */
const { User } = require('../app/models'),
  { auth } = require('../app/services/users'),
  server = require('../app'),
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

  test('sign in with invalid password fails token creation', done => {
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

  test('sign in with missing email fails token creation', done => {
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

  test('sign in with inexistent user fails token creation', () =>
    auth({
      email: 'unknownuser@wolox.com.ar',
      password: 'Wolox1189!'
    }).then(result =>
      expect(result).toEqual({
        message: 'Incorrect username or password',
        internalCode: 'forbidden_error'
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
      .then(() => User.getAll({ page: 0, pageSize: 1 }))
      .then(users => expect(users.length).toEqual(1)));

  test('checkToken with invalid jwt returns the users list', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        auth({
          email: 'manuel.tuero@wolox.com.ar',
          password: 'Wolox1189!'
        })
      )
      .then(() =>
        request(server)
          .get('/users')
          .set('Authorization', 'a.invalid.token')
          .then(response =>
            expect(response.text).toEqual('{"message":"invalid token","internal_code":"forbidden_error"}')
          )
      ));

  test('checkToken with valid jwt returns the users list', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        auth({
          email: 'manuel.tuero@wolox.com.ar',
          password: 'Wolox1189!'
        })
      )
      .then(result =>
        request(server)
          .get('/users')
          .set('Authorization', result.token)
          .then(response => expect(response.body.length).toEqual(1))
      ));

  test('createUserAdmin without jwt returns an forbidden error', () =>
    request(server)
      .post('/admin/users')
      .expect(403)
      .then(response =>
        expect(response.text).toEqual('{"message":"jwt must be provided","internal_code":"forbidden_error"}')
      ));

  test('createUserAdmin with jwt and missing params returns bad request error', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        auth({
          email: 'manuel.tuero@wolox.com.ar',
          password: 'Wolox1189!'
        })
      )
      .then(result =>
        request(server)
          .post('/admin/users')
          .set('Authorization', result.token)
          .then(response => expect(response.body.internal_code).toEqual('bad_request_error'))
      ));

  test('createUserAdmin with jwt and all params and existent user modify the regular user permissions to admin', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        auth({
          email: 'manuel.tuero@wolox.com.ar',
          password: 'Wolox1189!'
        })
      )
      .then(result =>
        request(server)
          .post('/admin/users')
          .send(mockedUser)
          .set('Authorization', result.token)
          .expect(201)
          // Sequelize returns an array with the ids that were modified
          .then(response => expect(response.text).toEqual('[1]'))
      ));

  test.only('createUserAdmin with jwt and all params and an inexistent user creates a new admin user', () =>
    User.createWithHashedPassword(mockedUser)
      .then(() =>
        auth({
          email: 'manuel.tuero@wolox.com.ar',
          password: 'Wolox1189!'
        })
      )
      .then(result =>
        request(server)
          .post('/admin/users')
          .send({
            firstName: 'foo',
            lastName: 'bar',
            email: 'unknownuser@wolox.com.ar',
            password: 'Wolox1189!'
          })
          .set('Authorization', result.token)
          .then(response => expect(JSON.parse(response.text).admin).toEqual(true))
      ));
});
