'use strict';
const logger = require('../logger'),
  { databaseError, conflictError, unauthorizedError } = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'Album',
    {
      userId: {
        field: 'user_id',
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      albumId: {
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
      tableName: 'albums'
    }
  );

  Album.associate = models => {
    Album.belongsTo(models.User, { foreignKey: 'userId' });
  };

  Album.buyAlbum = async data => {
    try {
      const existentAlbum = await Album.findOne({
        where: { userId: data.userId, albumId: data.albumId }
      });
      if (existentAlbum) {
        logger.error(`You already have the album "${existentAlbum.title}`);
        return conflictError(`You already have the album "${existentAlbum.title}"`);
      }
      return await Album.create(data);
    } catch (err) {
      logger.error('A database error has occurred during the purchase of the album');
      throw databaseError(err);
    }
  };

  Album.findAlbumsByUser = async req => {
    try {
      if (!req.decoded.admin && Number(req.params.id) !== req.decoded.id) {
        logger.error('You must have admin permissions to get the albums of another user');
        return unauthorizedError('You must have admin permissions to get the albums of another user');
      }
      logger.info(`Searching the albums of user ${req.params.id}...`);
      return await Album.findAll({
        where: {
          userId: req.params.id
        }
      });
    } catch (err) {
      logger.error('A database error has occurred during the search of albums');
      throw databaseError(err);
    }
  };

  return Album;
};
