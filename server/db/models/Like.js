const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Place, { foreignKey: 'placeId' });
    }
  }

  Like.init(
    {
      // createdAt уже есть по умолчанию в timestamps
    },
    {
      sequelize,
      modelName: 'Like',
      timestamps: true,
      updatedAt: false, // Убираем updatedAt, так как он не нужен
    },
  );
  return Like;
};
