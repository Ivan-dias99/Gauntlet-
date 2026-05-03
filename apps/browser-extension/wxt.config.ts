import { defineConfig } from 'wxt';

// Gauntlet — browser extension (Manifest V3).
//
// Surgical scope:
//   - capture page selection
//   - global hotkey (Alt+Space — Cmd+Space is reserved by macOS Spotlight)
//   - minimal capsule: input + Compor + preview + Copy
//   - calls the four /composer/* routes on the local backend
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Gauntlet',
    description:
      'Cursor capsule. Press Alt+Space anywhere on the web to talk to the brain.',
    permissions: ['activeTab', 'scripting', 'storage'],
    host_permissions: [
      'http://127.0.0.1:3002/*',
      'http://localhost:3002/*',
    ],
    commands: {
      'summon-capsule': {
        suggested_key: {
          default: 'Alt+Space',
          mac: 'Alt+Space',
        },
        description: 'Summon the Gauntlet capsule on the active page',
      },
    },
    action: {
      default_title: 'Gauntlet',
      default_popup: 'popup.html',
    },
  },
});
