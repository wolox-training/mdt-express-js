'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('purchases', {
      userId: {
        field: 'user_id',
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      albumId: {
        allowNull: false,
        field: 'album_id',
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }),
  down: queryInterface => queryInterface.dropTable('purchases')
};
