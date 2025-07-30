// models/photo.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate({ Place, NotPlace }) {
      this.belongsTo(Place, { foreignKey: 'placeId' });
      this.belongsTo(NotPlace, { foreignKey: 'notPlaceId', as: 'notPlace' });
    }
  }

  Photo.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isMain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notPlaceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dimensions: {
        type: DataTypes.JSONB,
      },
      path: {
        type: DataTypes.STRING(500), // Для локальных путей
        allowNull: true,
      },
      externalUrl: {
        type: DataTypes.TEXT, // Для облачных URL
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB, // Дополнительные данные (размеры, EXIF и т.д.)
        allowNull: true,
      },
      fullUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      storageType: {
        type: DataTypes.ENUM('local', 's3', 'cloudinary'),
        defaultValue: 'local',
      },
    },
    {
      sequelize,
      modelName: 'Photo',
    },
  );
  return Photo;
};
