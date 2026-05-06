// Tauri host adapter (Sprint 6).
//
// Doctrine: a única alma que muda entre web e local. The Capsule UI is
// identical to the browser-extension; this module is the seam where
// platform-specific calls (clipboard, global shortcut, screenshot,
// active-window metadata) get sourced from Tauri's plugin APIs instead
// of chrome.* APIs.
//
// Each function is best-effort and never throws past this layer — the
// cápsula must keep working even if a plugin permission is not yet
// wired in tauri.conf.json or the platform refuses (Wayland clipboard
// can deny silently, macOS prompts for accessibility permissions, etc).

import { readText as readClipboardText } from "@tauri-apps/plugin-clipboard-manager";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const DEFAULT_DESKTOP_SHORTCUT = "CommandOrControl+Shift+Space";

export interface DesktopContextSnapshot {
  // The current OS clipboard text. Pulled fresh on every summon so the
  // cápsula has a fast "what was I just looking at" hook without any
  // user gesture.
  clipboard: string;
  // Active window title — Tauri 2.x doesn't expose foreign-window
  // titles cross-platform out of the box, so we fall back to our own
  // window's title, which is at least honest about the source.
  windowTitle: string;
  // Best-effort source identifier. "desktop" for Tauri runs, lifted to
  // the backend's ContextSource enum.
  source: "desktop";
}

export async function readClipboardSafe(): Promise<string> {
  try {
    const text = await readClipboardText();
    return typeof text === "string" ? text : "";
  } catch {
    return "";
  }
}

export async function readActiveWindowTitle(): Promise<string> {
  try {
    return await getCurrentWindow().title();
  } catch {
    return "";
  }
}

export async function captureContextSnapshot(): Promise<DesktopContextSnapshot> {
  const [clipboard, windowTitle] = await Promise.all([
    readClipboardSafe(),
    readActiveWindowTitle(),
  ]);
  return {
    clipboard,
    windowTitle,
    source: "desktop",
  };
}

// Global shortcut wrapper. The Tauri plugin's API takes a string spec
// and a callback fired on the main thread of the JS runtime. We
// register lazily and provide an unregister function so React's
// useEffect cleanup keeps the binding tidy across hot reloads.
export async function bindGlobalShortcut(
  spec: string,
  handler: () => void,
): Promise<() => Promise<void>> {
  try {
    await register(spec, (event) => {
      // The plugin emits both keydown and keyup; only fire the handler
      // on press so a hold doesn't repeat-summon.
      if (event.state === "Pressed") {
        handler();
      }
    });
  } catch (err) {
    // Common cause: another app already bound the same shortcut.
    // Surface a console warning but don't propagate — the cápsula is
    // still summonable via the tray icon (Sprint 7+ scope).
    console.warn("[gauntlet/desktop] failed to bind global shortcut:", err);
  }
  return async () => {
    try {
      await unregister(spec);
    } catch {
      // Already gone, plugin not initialized, etc — ignore.
    }
  };
}

// The desktop window itself — show / hide for global shortcut toggling.
export async function toggleCapsuleWindow(): Promise<void> {
  try {
    const w = getCurrentWindow();
    const visible = await w.isVisible();
    if (visible) {
      await w.hide();
    } else {
      await w.show();
      await w.setFocus();
    }
  } catch (err) {
    console.warn("[gauntlet/desktop] toggle failed:", err);
  }
}
