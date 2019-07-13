'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'admin', {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN
    }),
  down: queryInterface => queryInterface.dropTable('users')
};
