'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
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
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      slotsCount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Триггер для updatedAt
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_bookings_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_bookings_updated_at
      BEFORE UPDATE ON "Bookings"
      FOR EACH ROW
      EXECUTE FUNCTION update_bookings_updated_at();
    `);

    // Индексы для внешних ключей и часто используемых полей
    await queryInterface.addIndex('Bookings', ['userId']);
    await queryInterface.addIndex('Bookings', ['placeId']);
    await queryInterface.addIndex('Bookings', ['status']);
    await queryInterface.addIndex('Bookings', ['date']);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_bookings_updated_at ON "Bookings";
      DROP FUNCTION IF EXISTS update_bookings_updated_at();
    `);
    await queryInterface.dropTable('Bookings');
  },
};
