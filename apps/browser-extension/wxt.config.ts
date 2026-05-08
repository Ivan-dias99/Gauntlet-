import { defineConfig } from 'wxt';
import { fileURLToPath } from 'node:url';

// Gauntlet — browser extension (Manifest V3).
//
// Surgical scope:
//   - capture page selection
//   - global hotkey (Alt+Space — Cmd+Space is reserved by macOS Spotlight)
//   - minimal capsule: input + Compor + preview + Copy
//   - calls the four /composer/* routes on the local backend

// Production backend — read from build env so the URL is not hardcoded
// and the manifest can follow a Railway rename without a code edit.
//   * VITE_GAUNTLET_BACKEND_URL canonical (aligned with the server's
//     GAUNTLET_BACKEND_URL).
//   * VITE_BACKEND_URL kept as a legacy fallback until v1.1.0.
// Dev builds (`wxt dev`) don't need it — host_permissions covers
// localhost separately. Production zips throw if it's missing so the
// operator never ships an extension that can't reach the backend.
const ENV_BACKEND_URL =
  process.env.VITE_GAUNTLET_BACKEND_URL || process.env.VITE_BACKEND_URL || '';
const IS_PROD_BUILD =
  process.env.NODE_ENV === 'production' || process.argv.includes('zip');
if (IS_PROD_BUILD && !ENV_BACKEND_URL) {
  throw new Error(
    'wxt.config: VITE_GAUNTLET_BACKEND_URL is not set. ' +
      'Define it before running `npm run build` / `npm run zip`.',
  );
}

const PROD_BACKEND_HOST_PERM = ENV_BACKEND_URL
  ? [`${ENV_BACKEND_URL.replace(/\/+$/, '')}/*`]
  : [];

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  // Single Composer — vite alias resolves @gauntlet/composer to the
  // shared package source without needing npm workspaces. Mirrors the
  // TS path mapping in tsconfig.json.
  vite: () => ({
    resolve: {
      alias: {
        '@gauntlet/composer': fileURLToPath(
          new URL('../../packages/composer/src/index.ts', import.meta.url),
        ),
      },
    },
  }),
  manifest: {
    name: 'Gauntlet',
    description:
      'Cursor capsule. Press Alt+Space anywhere on the web to talk to the brain.',
    permissions: ['activeTab', 'tabs', 'scripting', 'storage'],
    host_permissions: [
      // <all_urls> is required so the content script can read the live DOM
      // of any page the user invokes the capsule on. Without it, the
      // composer is blind to everything outside the popup window.
      '<all_urls>',
      ...PROD_BACKEND_HOST_PERM,
      'http://127.0.0.1:3002/*',
      'http://localhost:3002/*',
    ],
    commands: {
      'summon-capsule': {
        suggested_key: {
          // Alt+Space conflicts with the Windows window menu, so the
          // capsule never gets the keypress on Windows. Ctrl+Shift+Space
          // is the convention for extension hotkeys on Chrome / Edge
          // and is unclaimed across Windows / Linux / macOS shells.
          default: 'Ctrl+Shift+Space',
          mac: 'Command+Shift+Space',
        },
        description: 'Summon the Gauntlet capsule on the active page',
      },
    },
    action: {
      default_title: 'Gauntlet',
      // No default_popup: the icon click is handled in background.ts and
      // opens a real window via chrome.windows.create. Toolbar popups are
      // capped at 800x600 by the browser, which is too small to host the
      // capsule's two-panel layout — a separate window has no such cap.
    },
  },
});
