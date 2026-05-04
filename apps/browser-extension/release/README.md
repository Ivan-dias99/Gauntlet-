# Pre-built extension

`gauntlet-extension.zip` is a ready-to-load Chromium extension package
(Chrome, Edge, Brave, Arc, Vivaldi, etc.). It is committed so operators
without a Node toolchain can install the extension directly from GitHub.

## Install

1. Download `gauntlet-extension.zip` from the GitHub UI: open the file
   on the branch page and click **Download raw file**.
2. Unzip it anywhere (Desktop is fine). You will get a folder containing
   `manifest.json`, `composer.html`, `background.js`, etc.
3. Open `chrome://extensions` (or `edge://extensions`).
4. Toggle **Developer mode** on (top-right).
5. Click **Load unpacked** and pick the unzipped folder.
6. Click the Gauntlet icon in the toolbar — a 1200×800 composer window
   opens. Same window via the global hotkey `Ctrl+Shift+Space`
   (`⌘+Shift+Space` on macOS).

## Rebuilding

For developers: `cd apps/browser-extension && npm run zip` regenerates
`.output/gauntletbrowser-extension-*.zip`. Copy it over this file and
commit when shipping a new build.
