import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['data/**/*.test.ts', 'back/**/*.test.ts'],
    environment: 'node',
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'back/src/ap/schema.ts',
        'back/src/ap/reconcile.ts',
        'back/src/payouts/schema.ts',
        'data/generators/orders/policy.ts',
        'data/generators/rng.ts',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
