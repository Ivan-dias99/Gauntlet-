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

import { invoke } from "@tauri-apps/api/core";
import { readText as readClipboardText } from "@tauri-apps/plugin-clipboard-manager";
import { register, unregister } from "@tauri-apps/plugin-global-shortcut";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const DEFAULT_DESKTOP_SHORTCUT = "CommandOrControl+Shift+Space";

export interface DesktopContextSnapshot {
  // The current OS clipboard text. Pulled fresh on every summon so the
  // cápsula has a fast "what was I just looking at" hook without any
  // user gesture.
  clipboard: string;
  // Active window title — captured via Tauri command get_active_window
  // (xdotool / osascript / PowerShell shellout). Falls back to the
  // cápsula's own window title when the OS lookup fails so the operator
  // still sees something.
  windowTitle: string;
  // Active app name — populated when the OS lookup yields it
  // (osascript/PowerShell on macOS/Windows; empty on Linux/xdotool).
  appName: string;
  // Best-effort source identifier. "desktop" for Tauri runs, lifted to
  // the backend's ContextSource enum.
  source: "desktop";
}

interface ActiveWindowInfo {
  title: string;
  app: string;
}

export async function readClipboardSafe(): Promise<string> {
  try {
    const text = await readClipboardText();
    return typeof text === "string" ? text : "";
  } catch {
    return "";
  }
}

export async function readActiveWindowOwn(): Promise<string> {
  try {
    return await getCurrentWindow().title();
  } catch {
    return "";
  }
}

export async function readActiveWindowOS(): Promise<ActiveWindowInfo | null> {
  try {
    const info = await invoke<ActiveWindowInfo>("get_active_window");
    if (!info || typeof info.title !== "string") return null;
    return info;
  } catch {
    // OS-level lookup not available on this platform / xdotool missing
    // on Linux / accessibility permission denied on macOS. Caller will
    // fall back to our own window title, which is at least honest.
    return null;
  }
}

export async function captureContextSnapshot(): Promise<DesktopContextSnapshot> {
  const [clipboard, fromOS] = await Promise.all([
    readClipboardSafe(),
    readActiveWindowOS(),
  ]);
  if (fromOS) {
    return {
      clipboard,
      windowTitle: fromOS.title,
      appName: fromOS.app,
      source: "desktop",
    };
  }
  // OS lookup failed — surface our own window title so the cápsula
  // still has *some* context for the model.
  const ownTitle = await readActiveWindowOwn();
  return {
    clipboard,
    windowTitle: ownTitle,
    appName: "gauntlet-desktop",
    source: "desktop",
  };
}

// Sprint 6 close — interactive screen-region capture via the Tauri
// command capture_screen_region, which shells out to the OS native
// screenshot binary. Returns the path to a PNG in the temp dir, or
// null when the platform/binary isn't available. Caller is expected
// to surface the path to the operator (the cápsula doesn't preview
// images yet — Sprint 9+ will).
export async function captureScreenRegion(): Promise<string | null> {
  try {
    return await invoke<string>("capture_screen_region");
  } catch {
    return null;
  }
}

// Backend autostart — opt-in via env var checked Rust-side. Returns
// the start error verbatim when the env isn't enabled OR the spawn
// failed; caller surfaces it as a regular cápsula error band.
export async function startBackend(): Promise<string | null> {
  try {
    await invoke<void>("start_backend");
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

export async function stopBackend(): Promise<void> {
  try {
    await invoke<void>("stop_backend");
  } catch {
    // best-effort
  }
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
