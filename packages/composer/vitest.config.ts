import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // happy-dom gives us HTMLInputElement / document for the dom-actions
    // tests + RTL renders; the placement + helpers tests don't touch
    // globals so they run identically here.
    environment: 'happy-dom',
    // RTL leaks rendered nodes between tests under happy-dom unless we
    // tear them down explicitly — setupFiles fires `cleanup()` in an
    // afterEach hook so screen.getByText() finds one element, not many.
    setupFiles: ['./src/test-setup.ts'],
  },
});
