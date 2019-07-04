const { User } = require('../app/models'),
  server = require('../app'),
  request = require('supertest');

const mockedUser = {
  firstName: 'Manuel',
  lastName: 'Tuero',
  email: 'manuel.tuero@wolox.com.ar',
  password: 'Wolox1189!'
};

describe('users api tests', () => {
  test('createUser with valid input and the user does not exist creates correctly', async () => {
    await expect(User.createWithHashedPassword(mockedUser)).resolves.toMatchObject({
      firstName: 'Manuel',
      lastName: 'Tuero',
      email: 'manuel.tuero@wolox.com.ar'
    });
  });

  test('createUser with existing user failed creation', async () => {
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

  test('createUser with invalid password failed creation', done => {
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

  test('createUser with missing lastName param failed creation', done => {
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
});
