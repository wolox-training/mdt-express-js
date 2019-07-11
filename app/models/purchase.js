'use strict';

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'purchases',
    {
      userId: {
        allowNull: false,
        field: 'user_id',
        type: DataTypes.INTEGER
      },
      albumId: {
        allowNull: false,
        field: 'album_id',
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false,
      classMethods: {
        associate: models =>
          Purchase.belongsTo(models.user, {
            as: 'userId',
            onDelete: 'CASCADE'
          })
      }
    }
  );
  sequelize.sync();
  return Purchase;
};
