// seeders/XXXX-demo-users.js
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

module.exports = {
  async up(queryInterface) {
    const hashedAdminPass = await bcrypt.hash('admin123', SALT_ROUNDS);
    const hashedUserPass = await bcrypt.hash('user123', SALT_ROUNDS);

    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedAdminPass,
        role: 'admin',
        age: 30,
        phone: '+7 (999) 123-45-67',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: hashedUserPass,
        role: 'user',
        age: 25,
        phone: '+7 (888) 765-43-21',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Мария Петрова',
        email: 'maria@example.com',
        password: hashedUserPass,
        role: 'user',
        age: 28,
        phone: '+7 (777) 111-22-33',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
