'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      notPlaceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'NotPlaces',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isMain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      dimensions: {
        type: Sequelize.JSONB,
      },
      path: {
        type: Sequelize.STRING(500), // Для локальных путей
        allowNull: true,
      },
      externalUrl: {
        type: Sequelize.TEXT, // Для облачных URL
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB, // Дополнительные данные (размеры, EXIF и т.д.)
        allowNull: true,
      },
      fullUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      originalName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      mimeType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storageType: {
        type: Sequelize.ENUM('local', 's3', 'cloudinary'),
        defaultValue: 'local',
      },
    });

    // Сначала создаем функцию
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_photos_updated_at()
      RETURNS TRIGGER AS $BODY$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $BODY$ LANGUAGE plpgsql;
    `);

    // Затем создаем триггер (без проверки IF NOT EXISTS)
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_photos_updated_at ON "Photos";
      CREATE TRIGGER trigger_update_photos_updated_at
      BEFORE UPDATE ON "Photos"
      FOR EACH ROW
      EXECUTE FUNCTION update_photos_updated_at();
    `);

    await queryInterface.addIndex('Photos', ['notPlaceId']);
    await queryInterface.addIndex('Photos', ['placeId']);
    await queryInterface.addIndex('Photos', ['isMain']);
    await queryInterface.addIndex('Photos', ['storageType']);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_photos_updated_at ON "Photos";
      DROP FUNCTION IF EXISTS update_photos_updated_at();
    `);
    await queryInterface.dropTable('Photos');
  },
};
