// seeders/XXXX-demo-places.js

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Places', [
      {
        id: 1,
        categoryId: 1, // Еда
        name: 'At Felix',
        description: 'Сеть ресторанов быстрого питания',
        latitude: 57.816529,
        longitude: 28.302235,
        address: 'Рижский проспект 41/1',
        phone: '+7 (993) 442-44-14',
        workingHours: '10:00 - 23:00',
        placeType: 'фаст-фуд',
        isBooking: false,
        maxBooking: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        categoryId: 2, // Досуг
        name: 'Кинотеатр «Cilver Cinema»',
        description: 'кинотеатр в новом торговом центре',
        latitude: 57.806374,
        longitude: 28.261154,
        address: 'Завеличенская ул. 23',
        phone: '+7 (800) 201-91-86',
        workingHours: '10:00 - 01:00',
        placeType: 'кино',
        isBooking: true,
        maxBooking: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        categoryId: 3, // Бары
        name: 'Друзья',
        description: 'уютный бар для комфортного вечера',
        latitude: 57.837237,
        longitude: 28.342177,
        address: 'ул. Сиреневый бульвар 1А',
        phone: '+7 (951) 759-50-50',
        workingHours: '14:00 - 01:00/-02:00',
        placeType: 'бар',
        isBooking: true,
        maxBooking: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Places', null, {});
  },
};
