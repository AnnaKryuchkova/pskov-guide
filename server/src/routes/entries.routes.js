const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Category, Place, Photo, Like, NotPlace } = require('../../db/models');
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Middleware для проверки JWT токена22
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(201).json(undefined);
  }
};

// Регистрация пользователя
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, phone, role = 'user' } = req.body;

    // Создаем пользователя с валидацией через модель Sequelize
    const user = await User.create({
      name,
      email,
      password,
      age,
      phone,
      role,
    });

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Установка токена в куки
    res.cookie('jwt', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'strict',
    });

    // Формирование ответа без пароля
    const userData = user.get({ plain: true });
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      user: userData,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);

    // Обработка ошибок валидации Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path] = {
          message: err.message,
          type: err.type,
          validatorKey: err.validatorKey,
        };
        return acc;
      }, {});

      return res.status(400).json({
        error: 'Ошибка валидации данных',
        fields: errors,
      });
    }

    // Обработка ошибок уникальности
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Ошибка базы данных',
        message: 'Пользователь с таким email уже существует',
        field: 'email',
        type: 'UNIQUE_VIOLATION',
      });
    }

    // Обработка других ошибок Sequelize
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        error: 'Ошибка базы данных',
        message: error.message,
        type: error.parent?.code,
      });
    }

    // Общая ошибка сервера
    res.status(500).json({
      error: 'Ошибка сервера',
      message: 'Произошла внутренняя ошибка сервера',
      details:
        process.env.NODE_ENV === 'development'
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
    });
  }
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // Установка токена в куки
    res.cookie('jwt', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'strict',
    });

    // Не возвращаем пароль в ответе
    const userData = user.get({ plain: true });
    delete userData.password;

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Выход пользователя
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Проверка аутентификации
router.get('/place/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const places = await Place.findAll({
      where: {
        categoryId: categoryId,
      },
      attributes: [
        'id',
        'categoryId',
        'name',
        'description',
        'latitude',
        'longitude',
        'address',
        'phone',
        'workingHours',
        'maxBooking',
        'isBooking',
        'placeType',
      ],
      include: [
        {
          model: Photo,
          attributes: [
            'id',
            'url',
            'fullUrl',
            'originalName',
            'fileSize',
            'mimeType',
            'isMain',
            'storageType',
          ], // Явно указываем нужные поля
        },
        {
          model: Like,
          attributes: ['id', 'userId'],
        },
      ],
    });

    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Получить текущего пользователя (защищенный маршрут)
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(200).json({ error: 'Server error' });
  }
});
// Обновление данных пользователя (защищенный маршрут)
router.put('/update-user', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.user; // Получаем ID из JWT токена
    const { name, email, phone } = req.body;

    // Проверяем, что переданы данные для обновления
    if (!name && !email && !phone) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    // Проверяем, существует ли пользователь
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Проверяем, не занят ли новый email другим пользователем
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Обновляем данные
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;

    await user.update(updatedFields);

    // Возвращаем обновленные данные пользователя (без пароля)
    const updatedUser = user.get({ plain: true });
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// получить все категории
router.get('/category', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'icon', 'description'],
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});
// получить все места
router.get('/place/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const places = await Place.findAll({
      where: {
        categoryId: categoryId,
      },
      attributes: [
        'id',
        'categoryId',
        'name',
        'description',
        'latitude',
        'longitude',
        'address',
        'phone',
        'workingHours',
        'maxBooking',
        'isBooking',
        'placeType',
      ],
      include: [
        {
          model: Photo,
        },
        {
          model: Like,
          attributes: ['id', 'userId'], // Include likes if needed
        },
      ],
    });

    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Добавить место в избранное
router.post('/like', authenticateJWT, async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const place = await Place.findByPk(placeId);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    const [like, created] = await Like.findOrCreate({
      where: { userId, placeId },
      defaults: { userId, placeId },
    });

    if (!created) {
      return res.status(200).json({ message: 'Place already in favorites' });
    }

    res.status(201).json({
      message: 'Place added to favorites',
      like,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      error: 'Failed to add place to favorites',
      details: error.message,
    });
  }
});
// Удалить место из избранного
router.delete('/like/:placeId', authenticateJWT, async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user.id;

    // Удаляем лайк
    const deleted = await Like.destroy({
      where: {
        userId,
        placeId,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Like not found' });
    }

    res.status(200).json({ message: 'Place removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove place from favorites' });
  }
});
// Проверить, лайкнул ли пользователь место
router.get('/like/:placeId', authenticateJWT, async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({
      where: {
        userId,
        placeId,
      },
    });

    res.json({ isLiked: !!like });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ error: 'Failed to check like status' });
  }
});
// Получение всех лайков пользователя
router.get('/user/likes', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    const likes = await Like.findAll({
      where: { userId },
      include: [
        {
          model: Place,
          include: [
            {
              model: Category,
              attributes: ['id', 'name', 'icon'],
            },
            {
              model: Photo,
              attributes: ['id', 'fullUrl'],
              limit: 1,
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Добавляем проверку на null и преобразуем данные
    const formattedLikes = likes
      .map((like) => {
        // Проверяем, что like и like.Place существуют
        if (!like || !like.Place) {
          console.warn('Invalid like entry:', like);
          return null;
        }

        return {
          id: like.id,
          place: {
            id: like.Place.id,
            name: like.Place.name,
            address: like.Place.address || '',
            latitude: like.Place.latitude || 0,
            longitude: like.Place.longitude || 0,
            description: like.Place.description || '',
            phone: like.Place.phone || '',
            category: like.Place.Category || null,
            mainPhoto: like.Place.Photos?.[0]?.fullUrl || null,
            workingHours: like.Place.workingHours || '',
            placeType: like.Place.placeType || '',
            isBooking: like.Place.isBooking || false,
          },
          createdAt: like.createdAt,
        };
      })
      .filter((like) => like !== null); // Фильтруем null-значения

    res.json(formattedLikes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({
      error: 'Failed to fetch favorites',
      details: error.message,
    });
  }
});
// изменение места
router.put('/place/:id', upload.array('photos'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      latitude,
      longitude,
      address,
      phone,
      workingHours,
      placeType,
      isBooking,
      maxBooking,
      categoryId,
      deletePhotos, // массив ID фотографий для удаления
    } = req.body;
    const photosToDelete =
      deletePhotos && deletePhotos !== '[]' ? JSON.parse(deletePhotos) : [];
    // Проверяем существование места
    const place = await Place.findByPk(id, {
      include: [Photo],
    });
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Обновляем данные места
    await place.update({
      name: name || place.name,
      description: description || place.description,
      latitude: latitude ? parseFloat(latitude) : place.latitude,
      longitude: longitude ? parseFloat(longitude) : place.longitude,
      address: address || place.address,
      phone: phone || place.phone,
      workingHours: workingHours || place.workingHours,
      placeType: placeType || place.placeType,
      isBooking: isBooking !== undefined ? Boolean(isBooking) : place.isBooking,
      maxBooking: maxBooking ? parseInt(maxBooking, 10) : place.maxBooking,
      categoryId: categoryId || place.categoryId,
    });

    // // Удаляем отмеченные фото
    if (photosToDelete.length > 0) {
      await Photo.destroy({
        where: {
          id: photosToDelete,
          placeId: id,
        },
      });
    }

    // Добавляем новые фото
    if (req.files && req.files.length > 0) {
      await Promise.all(
        req.files.map(async (file, index) => {
          const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

          await Photo.create({
            url: `/uploads/${file.filename}`,
            fullUrl,
            originalName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            isMain: index === 0 && place.Photos.length === 0,
            placeId: id,
            storageType: 'local',
          });
        }),
      );
    }

    // Получаем обновленное место с фотографиями
    const updatedPlace = await Place.findByPk(id, {
      include: [Photo],
    });

    res.json(updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ error: 'Failed to update place' });
  }
});
// Добавление нового места (для пользователей)
router.post('/not-place', upload.array('photos'), async (req, res) => {
  try {
    // Проверяем наличие файлов
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photos uploaded' });
    }

    // Получаем данные из формы
    const {
      name,
      description,
      latitude,
      longitude,
      address,
      phone,
      workingHours,
      placeType,
      isBooking,
      maxBooking,
      categoryId,
    } = req.body;

    // Валидация обязательных полей
    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    // Проверяем существование категории
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Создаем запись о месте
    const notPlace = await NotPlace.create({
      name,
      description: description || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      address: address || null,
      phone: phone || null,
      workingHours: workingHours || null,
      placeType: placeType || null,
      isBooking: Boolean(isBooking),
      maxBooking: maxBooking ? parseInt(maxBooking, 10) : 10,
      categoryId,
    });

    // Обрабатываем загруженные фото
    await Promise.all(
      req.files.map(async (file, index) => {
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        await Photo.create({
          url: `/uploads/${file.filename}`,
          fullUrl,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          isMain: index === 0, // Первое фото делаем основным
          notPlaceId: notPlace.id,
          storageType: 'local',
        });
      }),
    );

    // Получаем созданное место с привязанными фото
    const result = await NotPlace.findByPk(notPlace.id, {
      include: [
        {
          model: Photo,
          as: 'photos',
        },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating not-place:', error);

    // Обрабатываем ошибки валидации Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Обрабатываем ошибки уникальности
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Duplicate entry',
        details: error.errors.map((e) => ({ field: e.path, message: e.message })),
      });
    }

    res.status(500).json({
      error: 'Failed to create new place for moderation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
// Получение списка мест для модерации (только для админов)
// moderation.route.ts
router.get('/moderation', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const notPlaces = await NotPlace.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'icon'],
          required: false,
        },
        {
          model: Photo,
          as: 'photos',

          required: false,
        },
      ],
      order: [
        ['createdAt', 'DESC'],
        // Изменено здесь - указываем через алиас 'photos'
      ],
    });

    const placesWithFullUrls = notPlaces.map((place) => ({
      ...place.toJSON(),
      photos:
        place.photos?.map((photo) => ({
          ...photo.toJSON(),
          url: `${req.protocol}://${req.get('host')}${photo.url}`,
        })) || [],
    }));

    res.json(placesWithFullUrls);
  } catch (error) {
    console.error('Moderation error:', error);
    res.status(500).json({
      error: 'Failed to fetch places for moderation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Одобрение места (перенос в Places)
router.post('/not-place/approve/:id', authenticateJWT, async (req, res) => {
  try {
    const notPlace = await NotPlace.findByPk(req.params.id, {
      include: [
        {
          model: Photo,
          as: 'photos',
        },
      ],
    });

    if (!notPlace) {
      return res.status(404).json({ error: 'Place not found for moderation' });
    }

    // Создаем новое место в основной таблице
    const placeData = notPlace.toJSON();
    delete placeData.id; // Удаляем id, чтобы создать новую запись
    delete placeData.photos;

    const place = await Place.create(placeData);

    // Переносим фотографии
    if (notPlace.photos?.length) {
      await Promise.all(
        notPlace.photos.map((photo) =>
          Photo.create({
            ...photo.toJSON(),
            placeId: place.id, // Привязываем к новому месту
            id: undefined, // Позволяем создать новый ID
            notPlaceId: undefined, // Удаляем старую привязку
          }),
        ),
      );
    }

    // Удаляем из NotPlaces и связанные фото (если остались)
    await Photo.destroy({ where: { notPlaceId: req.params.id } });
    await NotPlace.destroy({ where: { id: req.params.id } });
    // 6. Возвращаем созданное место с фото

    res.json('Approval process completed successfully');
  } catch (error) {
    console.error('Error approving place:', error);
    res.status(500).json({
      error: 'Failed to approve place',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Отклонение места (удаление из NotPlaces)
router.delete('/not-place/reject/:id', authenticateJWT, async (req, res) => {
  try {
    const notPlace = await NotPlace.findByPk(req.params.id);

    if (!notPlace) {
      // Возвращаем JSON вместо HTML
      return res.status(404).json({
        error: 'Place not found',
        status: 404,
      });
    }

    await Photo.destroy({ where: { notPlaceId: notPlace.id } });
    await NotPlace.destroy({ where: { id: notPlace.id } });

    res.json({
      success: true,
      message: 'Place rejected successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to reject place',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});
// Удаление места (Places)
router.delete('/place/:id', authenticateJWT, async (req, res) => {
  try {
    await Place.destroy({ where: { id: req.params.id } });
    await Photo.destroy({ where: { placeId: req.params.id } });

    res.json({ message: 'Place and deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject place' });
  }
});

module.exports = router;
