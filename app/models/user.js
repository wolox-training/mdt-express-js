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
          isEmail: true
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
