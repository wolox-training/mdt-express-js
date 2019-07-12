'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('purchases', {
      userId: {
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      albumId: {
        allowNull: false,
        field: 'album_id',
        unique: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }),
  down: queryInterface => queryInterface.dropTable('purchases')
};
