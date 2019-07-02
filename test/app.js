const { createUser } = require('../app/services/users'),
  { userAlreadyExistsError } = require('../app/errors');

const mockedUser = {
  firstName: 'Manuel',
  lastName: 'Tuero',
  email: 'manuel.tuero@wolox.com.ar',
  password: 'Wolox1189!'
};

describe('users api tests', () => {
  test('createUser with valid input and the user does not exist creates correctly', () =>
    expect(createUser(mockedUser)).resolves.toMatch(/manuel.tuero@wolox.com.ar/));

  test('createUser with existing user failed creation', () => {
    createUser(mockedUser);
    const userWithExistingEmail = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };
    expect(createUser(userWithExistingEmail)).resolves.toThrow(userAlreadyExistsError);
  });
});
