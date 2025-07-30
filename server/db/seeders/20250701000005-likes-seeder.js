// seeders/XXXX-demo-likes.js

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Likes', [
      // Иван (id=2) лайкает at felix (id=1)
      {
        userId: 2,
        placeId: 1,
        createdAt: new Date(),
      },
      // Мария (id=3) лайкает Кинотеатр (id=2)
      {
        userId: 3,
        placeId: 2,
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Likes', null, {});
  },
};
