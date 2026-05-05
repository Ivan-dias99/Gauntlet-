import { defineConfig } from 'wxt';

// Gauntlet — browser extension (Manifest V3).
//
// Surgical scope:
//   - capture page selection
//   - global hotkey (Ctrl+Shift+Space / Cmd+Shift+Space)
//   - minimal capsule: input + Compor + preview + Copy
//   - calls the four /composer/* routes on the production backend
//
// Production host_permissions list ONLY the Railway origin so the
// Microsoft Edge Add-ons and Chrome Web Store reviewers don't flag
// the build. Localhost origins are appended only for `wxt dev`
// builds, where developers run the FastAPI server on :3002.
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: ({ mode }) => {
    const isDev = mode === 'development';
    return {
      name: 'Gauntlet',
      description:
        'Cursor capsule. Press Ctrl+Shift+Space anywhere on the web to talk to the brain.',
      permissions: ['activeTab', 'tabs', 'scripting', 'storage'],
      host_permissions: [
        // <all_urls> is required so the content script can read the live DOM
        // of any page the user invokes the capsule on. Without it, the
        // composer is blind to everything outside the popup window.
        '<all_urls>',
        'https://ruberra-backend-jkpf-production.up.railway.app/*',
        ...(isDev
          ? ['http://127.0.0.1:3002/*', 'http://localhost:3002/*']
          : []),
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
    };
  },
});
