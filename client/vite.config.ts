import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [
    react(),
    svgr(), // Добавьте плагин
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
