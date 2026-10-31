import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      JWT_SECRET: 'test-secret-test-secret-test-secret-123',
      DATABASE_URL:
        'postgresql://postgres:postgres@localhost:5432/satuwaktu_test?schema=public',
    },
  },
});
