const { User } = require('../app/models'),
  { generateUserToken } = require('../app/services/users'),
  server = require('../app'),
  request = require('supertest'),
  config = require('../config'),
  jwt = require('jsonwebtoken'),
  { secret } = config.common.session;

const mockedUser = {
  firstName: 'Manuel',
  lastName: 'Tuero',
  email: 'manuel.tuero@wolox.com.ar',
  password: 'Wolox1189!'
};

describe('users api tests', () => {
  test('create user with valid input and the user does not exist creates correctly', async () => {
    await expect(User.createWithHashedPassword(mockedUser)).resolves.toMatchObject({
      firstName: 'Manuel',
      lastName: 'Tuero',
      email: 'manuel.tuero@wolox.com.ar'
    });
  });

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

  test('sign in with inexistent user fails token creation', () => {
    const token = generateUserToken({
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    });
    return expect(token).rejects.toEqual({
      internalCode: 'database_error',
      message: 'Database Error'
    });
  });

  test('sign in with existent user and valid credentials returns a new token', async () => {
    expect.assertions(1);
    await expect(User.createWithHashedPassword(mockedUser)).resolves.toMatchObject({
      firstName: 'Manuel',
      lastName: 'Tuero',
      email: 'manuel.tuero@wolox.com.ar'
    });
    const token = jwt.verify(JSON.stringify({ email: 'manuel.tuero@wolox.com.ar' }, null, 2), secret);
    await expect(token).resolves.toMatchObject({});
  });
});
