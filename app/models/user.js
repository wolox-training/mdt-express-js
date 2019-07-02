'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        allowNull: false,
        field: 'first_name',
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        field: 'last_name',
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          validateEmail(email) {
            const regEx = /[a-z0-9._%+-]+@wolox+\.[a-z]{2,3}(\.[a-z]{2})?/;
            if (!regEx.test(email)) {
              throw new Error('invalid email');
            }
          }
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [8],
            msg: 'Minimum 8 characters are required in the password'
          }
        }
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: 'users'
    }
  );
  return User;
};
