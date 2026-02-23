import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
  resolve: {
    alias: {
      'react-native': path.resolve(
        __dirname,
        'src/__tests__/mocks/react-native.ts'
      ),
      '@react-native-async-storage/async-storage': path.resolve(
        __dirname,
        'src/__tests__/mocks/async-storage.ts'
      ),
      'react-native-safe-area-context': path.resolve(
        __dirname,
        'src/__tests__/mocks/safe-area-context.ts'
      ),
      'react-i18next': path.resolve(
        __dirname,
        'src/__tests__/mocks/react-i18next.ts'
      ),
    },
  },
});
