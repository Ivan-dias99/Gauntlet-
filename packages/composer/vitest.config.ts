import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // happy-dom gives us HTMLInputElement / document for the dom-actions
    // tests; the placement + helpers tests don't touch globals so they
    // run identically here.
    environment: 'happy-dom',
  },
});
