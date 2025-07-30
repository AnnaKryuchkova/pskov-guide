const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Place, { foreignKey: 'placeId' });
    }
  }

  Booking.init(
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      slotsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'confirmed', 'canceled']],
        },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      timestamps: true,
    },
  );
  return Booking;
};
