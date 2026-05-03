import { defineConfig } from 'wxt';

// Ruberra Composer — browser extension (Manifest V3).
//
// Production-ready scope:
//   - capture page selection
//   - global hotkey (Alt+Space — Cmd+Space is reserved by macOS Spotlight)
//   - minimal capsule: input + Compor + preview + Copy
//   - calls the four /composer/* routes on the configured backend
//
// host_permissions covers both the production Railway backend (default
// in lib/composer-client.ts) and localhost for developers running the
// brain locally. The alternative Railway hostname is included so the
// extension keeps working if the primary domain is rotated.
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Ruberra Composer',
    description:
      'Cursor capsule. Press Alt+Space anywhere on the web to talk to the brain.',
    permissions: ['activeTab', 'scripting', 'storage'],
    host_permissions: [
      'https://ruberra-backend-jkpf-production.up.railway.app/*',
      'https://ruberra-backend-jkpf-production-2c4d.up.railway.app/*',
      'http://127.0.0.1:3002/*',
      'http://localhost:3002/*',
    ],
    commands: {
      'summon-capsule': {
        suggested_key: {
          default: 'Alt+Space',
          mac: 'Alt+Space',
        },
        description: 'Summon the Ruberra capsule on the active page',
      },
    },
    action: {
      default_title: 'Ruberra Composer',
      default_popup: 'popup.html',
    },
  },
});
