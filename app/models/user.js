'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: DataTypes.STRING,
        required: true
      },
      last_name: {
        type: DataTypes.STRING,
        required: true
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        required: true
      }
    },
    {}
  );
  /* User.associate = function(models) {
    // associations can be defined here
  }; */
  return User;
};
