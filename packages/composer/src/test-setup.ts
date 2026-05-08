// Vitest setup — RTL cleanup after each test so DOM nodes don't leak
// between test cases under happy-dom.

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
