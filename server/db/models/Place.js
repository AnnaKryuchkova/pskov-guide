const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    static associate(models) {
      Place.belongsTo(models.Category, { foreignKey: 'categoryId' });
      Place.hasMany(models.Photo, { foreignKey: 'placeId' });
      Place.hasMany(models.Like, { foreignKey: 'placeId' });
      Place.hasMany(models.Booking, { foreignKey: 'placeId' });
    }
  }

  Place.init(
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
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: DataTypes.FLOAT,
        validate: {
          min: -180,
          max: 180,
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
      modelName: 'Place',
    },
  );
  return Place;
};
