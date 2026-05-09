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
// Dev / `wxt prepare` (run on every npm install) don't need it; only
// the actual build/zip needs it for the manifest's host_permissions
// list. The real hard-throw lives in composer-client.ts so a build
// without env aborts when the JS runtime evaluates the module — that
// gate fires both for the cápsula bundle and for the desktop bundle,
// without breaking `npm ci` for first-time clones.
const ENV_BACKEND_URL =
  process.env.VITE_GAUNTLET_BACKEND_URL || process.env.VITE_BACKEND_URL || '';
const IS_PROD_BUILD = process.argv.some(
  (a) => a === 'build' || a === 'zip' || a === 'zip:firefox',
);
if (IS_PROD_BUILD && !ENV_BACKEND_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    '[wxt.config] VITE_GAUNTLET_BACKEND_URL is not set. ' +
      'host_permissions will not list the production backend explicitly. ' +
      'composer-client will still throw at JS runtime if no env is found.',
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
