const { createUser } = require('../app/services/users'),
  { userAlreadyExistsError, passwordTooShortError, paramsRequiredError } = require('../app/errors');

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

  test('createUser with invalid password failed creation', () => {
    const userWithInvalidPassword = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox'
    };
    expect(createUser(userWithInvalidPassword)).resolves.toThrow(passwordTooShortError);
  });

  test('createUser with missing lastName param failed creation', () => {
    const userWithoutLastName = {
      firstName: 'Foo',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };

    expect(createUser(userWithoutLastName)).resolves.toThrow(paramsRequiredError);
  });
});
