// seeders/XXXX-demo-bookings.js

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Bookings', [
      // Иван (id=2) бронирует at felix (id=1)
      {
        userId: 2,
        placeId: 1,
        date: new Date('2025-12-31T19:00:00'),
        slotsCount: 2,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Мария (id=3) бронирует Bar Друзья (id=3)
      {
        userId: 3,
        placeId: 3,
        date: new Date('2025-12-25T21:00:00'),
        slotsCount: 4,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Bookings', null, {});
  },
};
