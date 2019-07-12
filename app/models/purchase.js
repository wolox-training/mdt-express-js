'use strict';
const logger = require('../logger'),
  { databaseError } = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'Purchase',
    {
      userId: {
        allowNull: false,
        field: 'user_id',
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      albumId: {
        allowNull: false,
        field: 'album_id',
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: 'purchases',
      classMethods: {
        associate: models =>
          Purchase.belongsTo(models.user, {
            as: 'userId',
            onDelete: 'CASCADE'
          })
      }
    }
  );

  Purchase.buyAlbum = async data => {
    try {
      console.log('******************* data: ', data);
      const purchase = await Purchase.findOne({
        where: { userId: data.userId, albumId: data.albumId }
      });
      if (purchase) {
        throw new Error('You already buy this album');
      } else {
        Purchase.create(data);
      }
    } catch (err) {
      logger.error('Database error has occurred');
      throw databaseError(err);
    }
  };

  sequelize.sync();
  return Purchase;
};
