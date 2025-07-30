'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Photos', [
      // Для placeId: 1 (Felix) - 2 фото
      {
        url: '/uploads/photos-1753191377603-328367354.jpg',
        isMain: true,
        placeId: 1,
        notPlaceId: null,
        dimensions: JSON.stringify({ width: 1920, height: 1080 }),
        path: 'uploads/photos-1753191377603-328367354.jpg',
        externalUrl: null,
        metadata: JSON.stringify({
          camera: 'Canon EOS 5D Mark IV',
          exposure: '1/250',
          aperture: 'f/2.8',
          iso: 400,
          focalLength: '50mm',
        }),
        fullUrl: 'http://localhost:3000/uploads/photos-1753191377603-328367354.jpg',
        originalName: 'felix-interior.jpg',
        fileSize: 1024567,
        mimeType: 'image/jpeg',
        storageType: 'local',
        createdAt: now,
        updatedAt: now,
      },
      {
        url: '/uploads/photos-1753191377615-158020525.jpg',
        isMain: false,
        placeId: 1,
        notPlaceId: null,
        dimensions: JSON.stringify({ width: 1920, height: 1080 }),
        path: 'uploads/photos-1753191377615-158020525.jpg',
        externalUrl: null,
        metadata: JSON.stringify({
          camera: 'Canon EOS 5D Mark IV',
          exposure: '1/250',
          aperture: 'f/2.8',
          iso: 400,
          focalLength: '50mm',
        }),
        fullUrl: 'http://localhost:3000/uploads/photos-1753191377615-158020525.jpg',
        originalName: 'felix-exterior.jpg',
        fileSize: 876543,
        mimeType: 'image/jpeg',
        storageType: 'local',
        createdAt: now,
        updatedAt: now,
      },

      // Для placeId: 2 (Кинотеатр) - 1 фото
      {
        url: '/uploads/photos-1753191389379-824027024.jpg',
        isMain: true,
        placeId: 2,
        notPlaceId: null,
        dimensions: JSON.stringify({ width: 1920, height: 1080 }),
        path: 'uploads/photos-1753191389379-824027024.jpg',
        externalUrl: null,
        metadata: JSON.stringify({
          camera: 'Canon EOS 5D Mark IV',
          exposure: '1/250',
          aperture: 'f/2.8',
          iso: 400,
          focalLength: '50mm',
        }),
        fullUrl: 'http://localhost:3000/uploads/photos-1753191389379-824027024.jpg',
        originalName: 'cinema-hall.jpg',
        fileSize: 1234567,
        mimeType: 'image/jpeg',
        storageType: 'local',
        createdAt: now,
        updatedAt: now,
      },

      // Для placeId: 3 (Bar Друзья) - 1 фото
      {
        url: '/uploads/photos-1753191389394-38508052.jpg',
        isMain: true,
        placeId: 3,
        notPlaceId: null,
        dimensions: JSON.stringify({ width: 1920, height: 1080 }),
        path: 'uploads/photos-1753191389394-38508052.jpg',
        externalUrl: null,
        metadata: JSON.stringify({
          camera: 'Canon EOS 5D Mark IV',
          exposure: '1/250',
          aperture: 'f/2.8',
          iso: 400,
          focalLength: '50mm',
        }),
        fullUrl: 'http://localhost:3000/uploads/photos-1753191389394-38508052.jpg',
        originalName: 'bar-friends.jpg',
        fileSize: 2345678,
        mimeType: 'image/jpeg',
        storageType: 'local',
        createdAt: now,
        updatedAt: now,
      },

      // Оставшееся фото для notPlace (если нужно)
      {
        url: '/uploads/photos-1753192225438-265011430.JPG',
        isMain: true,
        placeId: null,
        notPlaceId: 1,
        dimensions: JSON.stringify({ width: 1920, height: 1080 }),
        path: 'uploads/photos-1753192225438-265011430.JPG',
        externalUrl: null,
        metadata: JSON.stringify({
          camera: 'Canon EOS 5D Mark IV',
          exposure: '1/250',
          aperture: 'f/2.8',
          iso: 400,
          focalLength: '50mm',
        }),
        fullUrl: 'http://localhost:3000/uploads/photos-1753192225438-265011430.JPG',
        originalName: 'new-place-proposal.jpg',
        fileSize: 987654,
        mimeType: 'image/jpeg',
        storageType: 'local',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Photos', null, {});
  },
};
