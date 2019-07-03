const { createUser } = require('../app/services/users');

const mockedUser = {
  firstName: 'Manuel',
  lastName: 'Tuero',
  email: 'manuel.tuero@wolox.com.ar',
  password: 'Wolox1189!'
};

describe('users api tests', () => {
  test('createUser with valid input and the user does not exist creates correctly', () =>
    expect(createUser(mockedUser)).resolves.toMatch(/manuel.tuero@wolox.com.ar/));

  test('createUser with existing user failed creation', async () => {
    await createUser(mockedUser);
    const userWithExistingEmail = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };
    await expect(createUser(userWithExistingEmail)).rejects.toEqual({
      internalCode: 'conflict_error',
      message: 'The user "manuel.tuero@wolox.com.ar" already exists'
    });
  });

  test('createUser with invalid password failed creation', async () => {
    const userWithInvalidPassword = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox'
    };
    await expect(createUser(userWithInvalidPassword)).rejects.toEqual({
      internalCode: 'bad_request_error',
      message: 'Validation error: minimum 8 characters are required in the password'
    });
  });

  test('createUser with missing lastName param failed creation', async () => {
    const userWithoutLastName = {
      firstName: 'Foo',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };
    await expect(createUser(userWithoutLastName)).rejects.toEqual({
      internalCode: 'bad_request_error',
      message: 'Validation error: firstName, lastName, email and password are required'
    });
  });
});
