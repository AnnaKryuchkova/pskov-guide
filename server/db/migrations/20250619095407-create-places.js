'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Places', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      workingHours: {
        type: Sequelize.STRING,
      },
      placeType: {
        type: Sequelize.STRING,
      },
      isBooking: {
        type: Sequelize.BOOLEAN,
      },

      maxBooking: {
        type: Sequelize.INTEGER,
        defaultValue: 10,
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
      CREATE OR REPLACE FUNCTION update_places_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_places_updated_at
      BEFORE UPDATE ON "Places"
      FOR EACH ROW
      EXECUTE FUNCTION update_places_updated_at();
    `);

    // Индексы для внешних ключей
    await queryInterface.addIndex('Places', ['categoryId']);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_places_updated_at ON "Places";
      DROP FUNCTION IF EXISTS update_places_updated_at();
    `);
    await queryInterface.dropTable('Places');
  },
};
