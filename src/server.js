// const app = require('./app');
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server started on port: ${PORT}`);
//   console.log(`Uploads available at: http://localhost:${PORT}/uploads/`);
// });
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  // Явно указываем хост
  console.log(`Server started on port: ${PORT}`);

  // Для продакшна используйте process.env.URL
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.RENDER_EXTERNAL_URL || `https://pskov-guide.onrender.com`
      : `http://localhost:3000`;

  console.log(`Uploads available at: ${baseUrl}/uploads/`);
  console.log(`API docs: ${baseUrl}/api-docs`);
});
