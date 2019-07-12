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
          Purchase.belongsTo(models.User, {
            as: 'userId',
            onDelete: 'CASCADE'
          })
      }
    }
  );

  Purchase.buyAlbum = async data => {
    try {
      let result = null;
      const purchase = await Purchase.findOne({
        where: { userId: data.userId, albumId: data.albumId }
      });
      if (purchase) {
        result = 'You already buy this album';
      }
      result = await Purchase.create(data);
      logger.info(`The album "${purchase.title}" was purchased successfully`);
      return result;
    } catch (err) {
      logger.error('A database error has occurred during the purchase of the album');
      throw databaseError(err);
    }
  };

  sequelize.sync();

  return Purchase;
};
