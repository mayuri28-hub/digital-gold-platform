
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],

  // Use /admin/ in production, but keep local development at /
  base: command === 'build' ? '/admin/' : '/',

  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    testTimeout: 30000,
    clearMocks: true,
    restoreMocks: true,
  },
}));
