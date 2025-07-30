import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist', // ← Должно быть относительно client/, а не корня
  }, // соберет файлы в корень проекта
  plugins: [
    react(),
    svgr(), // Добавьте плагин
  ],
  server: {
    proxy: {
      '/api': 'https://pskov-guide.onrender.com',
    },
  },
});
