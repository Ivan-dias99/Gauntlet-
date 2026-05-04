# Pre-built extension

`unpacked/` is a ready-to-load Chromium extension build (Chrome, Edge,
Brave, Arc, Vivaldi, etc.). It is committed so operators without a
Node toolchain can install the extension directly from a GitHub
download.

## Install (no build tools required)

1. On GitHub, open the branch you want to install from. Click the
   green **Code** button → **Download ZIP**. This gives you a zip of
   the entire repository.
2. Extract the zip anywhere — Desktop is fine.
3. Inside the extracted folder, navigate to:
   `apps/browser-extension/release/unpacked/`
4. Open `chrome://extensions` (or `edge://extensions`).
5. Toggle **Developer mode** on (top-right of the page).
6. Click **Load unpacked** and select the `unpacked/` folder you found
   in step 3.
7. Click the Gauntlet icon in the toolbar — a 1200×800 composer window
   opens. The same window also opens via the global hotkey
   `Ctrl+Shift+Space` (`⌘+Shift+Space` on macOS).

To upgrade later: re-download the repo zip, replace the `unpacked/`
folder, and click the **Reload** button in `chrome://extensions`.

## Rebuilding (developer flow)

For developers with Node installed:

```bash
cd apps/browser-extension
npm install
npm run build      # writes .output/chrome-mv3/
```

To refresh the committed `release/unpacked/` after a build, copy the
contents of `.output/chrome-mv3/` over the folder and commit.
