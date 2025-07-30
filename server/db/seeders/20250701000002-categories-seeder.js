// seeders/XXXX-demo-categories.js

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: 'Еда',
        icon: 'https://static.tildacdn.com/tild3038-3931-4137-b034-376464353731/IMG_6056_resized_.jpg',
        description: 'Рестораны, кафе и фастфуд',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Досуг',
        icon: 'https://static.tildacdn.com/tild3035-6163-4335-a438-363531353761/__2021-07-15__122453.png',
        description: 'Кино, театры, активности',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Бары',
        icon: 'https://avatars.mds.yandex.net/get-altay/6487610/2a00000183139c9b9d3251b212c11f2ac7fd/L_height',
        description: 'Бары, пабы и винотеки',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Здоровье',
        icon: 'https://bezdnaspa.tmweb.ru/wp-content/uploads/2019/12/5-13.jpg',
        description: 'Спа, бани, бассейны, салоны красоты',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {});
  },
};
