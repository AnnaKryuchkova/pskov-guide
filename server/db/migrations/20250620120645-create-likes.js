'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      placeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Places',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Индексы для внешних ключей
    await queryInterface.addIndex('Likes', ['userId']);
    await queryInterface.addIndex('Likes', ['placeId']);
    // Уникальный индекс, чтобы пользователь не мог лайкнуть место дважды
    await queryInterface.addIndex('Likes', ['userId', 'placeId'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Likes');
  },
};
