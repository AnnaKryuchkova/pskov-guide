// server/src/services/uploadService.js
const path = require('path');
const fs = require('fs').promises;

const savePhoto = async (file) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
};

module.exports = {
  savePhoto,
};
