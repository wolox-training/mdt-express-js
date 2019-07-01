'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('user', {
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
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('user')
};
