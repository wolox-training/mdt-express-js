'use strict';
const bcrypt = require('bcrypt'),
  logger = require('../logger'),
  { databaseError } = require('../errors'),
  config = require('../../config'),
  { saltRounds } = config.common.usersApi;

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
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: 'users'
    }
  );

  User.createWithHashedPassword = user => {
    const hashedPassword = bcrypt.hashSync(user.password, Number(saltRounds));
    return User.create({ ...user, password: hashedPassword })
      .then(userCreated => {
        logger.info(`The new user "${userCreated.email}" was created successfully`);
        return userCreated;
      })
      .catch(err => {
        logger.error('Database error has occurred');
        throw databaseError(err);
      });
  };

  User.getAll = () =>
    User.findAll()
      .then(users => users)
      .catch(err => databaseError(err));

  return User;
};
