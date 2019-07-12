'use strict';
const bcrypt = require('bcrypt'),
  logger = require('../logger'),
  { databaseError } = require('../errors'),
  config = require('../../config'),
  { paginate } = require('../helpers'),
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
      },
      admin: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: 'users'
    }
  );

  User.associate = models => {
    User.hasMany(models.Album);
  };

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

  User.getAll = data =>
    User.findAll({
      ...paginate(data)
    })
      .then(users => users)
      .catch(err => {
        logger.error('Database error has occurred');
        throw databaseError(err);
      });

  User.findUser = data =>
    User.findOne({
      where: { email: data.email }
    })
      .then(user => user)
      .catch(err => {
        logger.error('Database error has occurred');
        throw databaseError(err);
      });

  return User;
};
