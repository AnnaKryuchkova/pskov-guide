const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotPlace extends Model {
    static associate({ Photo, Category }) {
      // Деструктуризация нужных моделей
      this.belongsTo(Category, { foreignKey: 'categoryId' });
      this.hasMany(Photo, {
        foreignKey: 'notPlaceId',
        as: 'photos',
      });
    }
  }

  NotPlace.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      latitude: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      longitude: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      workingHours: {
        type: DataTypes.STRING,
      },
      placeType: {
        type: DataTypes.STRING,
      },
      isBooking: {
        type: DataTypes.BOOLEAN,
      },
      maxBooking: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
    },
    {
      sequelize,
      modelName: 'NotPlace',
      tableName: 'NotPlaces',
    },
  );
  return NotPlace;
};
