'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        field: 'first_name',
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        field: 'last_name',
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      admin: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      }
    }),
  down: queryInterface => queryInterface.dropTable('users')
};
