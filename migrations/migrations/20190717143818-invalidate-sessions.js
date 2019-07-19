'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'session_time', {
      type: Sequelize.BIGINT
    }),
  down: queryInterface => queryInterface.dropTable('users')
};
