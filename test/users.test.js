const { User } = require('../app/models');

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
  /* test('createUser with invalid password failed creation', async () => {
    const userWithInvalidPassword = {
      firstName: 'Foo',
      lastName: 'bar',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox'
    };
    await expect(User.createWithHashedPassword(userWithInvalidPassword)).rejects.toEqual({
      internalCode: 'database_error',
      message: 'email must be unique'
    });
  });

  test('createUser with missing lastName param failed creation', () => {
    const userWithoutLastName = {
      firstName: 'Foo',
      email: 'manuel.tuero@wolox.com.ar',
      password: 'Wolox1189!'
    };

    expect(createUser(userWithoutLastName)).resolves.toThrow(paramsRequiredError);
  }); */
});
