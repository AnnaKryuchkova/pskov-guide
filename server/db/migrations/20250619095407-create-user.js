'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      phone: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user',
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

    // Триггер для автоматического обновления updatedAt
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_users_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_users_updated_at
      BEFORE UPDATE ON "Users"
      FOR EACH ROW
      EXECUTE FUNCTION update_users_updated_at();
    `);

    // Индекс для email
    await queryInterface.addIndex('Users', ['email'], { unique: true });
  },

  async down(queryInterface) {
    // Удаляем триггер и функцию
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS trigger_update_users_updated_at ON "Users";
      DROP FUNCTION IF EXISTS update_users_updated_at();
    `);
    await queryInterface.dropTable('Users');
  },
};
