const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Like, { foreignKey: 'userId' });
      User.hasMany(models.Booking, { foreignKey: 'userId' });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue('password', bcrypt.hashSync(value, 10));
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
        },
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          is: /^\+?[\d\s-]+$/,
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
          isIn: [['user', 'admin', 'moderator']],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
