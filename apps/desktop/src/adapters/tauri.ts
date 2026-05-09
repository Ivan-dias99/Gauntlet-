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
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
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

// A1 — full-screen capture (non-interactive). Wraps the Rust command
// that writes a PNG to the temp dir and returns it base64-encoded so
// the cápsula can preview without round-tripping the file:// URL
// (Tauri's asset protocol is configurable but not enabled by default).
export interface ScreenCaptureFull {
  base64: string;
  path: string;
}

export async function captureScreenFull(): Promise<ScreenCaptureFull | null> {
  try {
    return await invoke<ScreenCaptureFull>("capture_screen_full");
  } catch {
    // Caller (useAttachments → attachError) renders the failure to UI.
    return null;
  }
}

// A1 — file picker + read. The dialog plugin is the consent gate; once
// the operator picks a file we read it via std::fs in Rust and stream
// the result back to the cápsula.
export interface PickedFile {
  path: string;
  name: string;
}

export async function pickFile(
  accept?: string[],
): Promise<PickedFile | null> {
  try {
    return await invoke<PickedFile | null>("pick_file", { accept });
  } catch {
    // Caller (useAttachments → attachError) renders the failure to UI.
    return null;
  }
}

export async function readTextFileAt(path: string): Promise<string> {
  return await invoke<string>("read_text_file_at", { path });
}

export interface Base64Payload {
  base64: string;
  mime: string;
}

export async function readFileBase64At(path: string): Promise<Base64Payload> {
  return await invoke<Base64Payload>("read_file_base64_at", { path });
}

// A2 — operator-driven write. Save dialog is the consent gate; every
// write is a path the operator just confirmed.
export async function pickSavePath(
  suggestedName?: string,
  accept?: string[],
): Promise<string | null> {
  try {
    return await invoke<string | null>("pick_save_path", {
      suggestedName,
      accept,
    });
  } catch {
    // Caller (useAttachments saveComposeToDisk) sees the null and
    // renders the failure as a savedToDiskFlash with an error tone.
    return null;
  }
}

export async function writeTextFileAt(
  path: string,
  content: string,
): Promise<number> {
  return await invoke<number>("write_text_file_at", { path, content });
}

export async function writeFileBase64At(
  path: string,
  base64: string,
): Promise<number> {
  return await invoke<number>("write_file_base64_at", { path, base64 });
}

// A3 — shell execute. The Rust side enforces both the env gate
// (GAUNTLET_ALLOW_CODE_EXEC) and the binary allowlist; we just relay.
export interface ShellResult {
  stdout: string;
  stderr: string;
  exit_code: number | null;
  duration_ms: number;
}

export async function runShell(
  cmd: string,
  args?: string[],
  cwd?: string,
): Promise<ShellResult> {
  return await invoke<ShellResult>("run_shell", { cmd, args, cwd });
}

// A4 — native OS notifications. The first call may prompt the operator
// for permission (macOS) or pop a system bubble immediately (Windows /
// Linux). We treat denial as fatal: return false so the cápsula can
// fall back to its in-window flash. The capability flag is set to true
// at ambient construction; only the runtime permission can downgrade.
export async function notify(
  title: string,
  body: string,
): Promise<boolean> {
  try {
    let granted = await isPermissionGranted();
    if (!granted) {
      const reply = await requestPermission();
      granted = reply === "granted";
    }
    if (!granted) return false;
    await sendNotification({ title, body });
    return true;
  } catch {
    // Native notify is best-effort; cápsula falls back to in-window
    // flash when this returns false.
    return false;
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
  } catch {
    // Common cause: another app already bound the same shortcut.
    // Don't propagate — the cápsula is still summonable via the tray
    // icon (Sprint 7+ scope). The caller (App init) chains a .catch
    // and surfaces a one-time toast when this happens.
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
// On show we route through the Rust `show_capsule` command which moves
// the window to the OS cursor before unhiding it, so the cápsula opens
// magnetic to whatever the operator was pointing at — same doctrine as
// the browser pill, just at the OS level instead of inside a page.
export async function toggleCapsuleWindow(): Promise<void> {
  try {
    const w = getCurrentWindow();
    const visible = await w.isVisible();
    if (visible) {
      await invoke<void>("hide_capsule");
    } else {
      await invoke<void>("show_capsule");
    }
  } catch {
    // Window already torn down, runtime not yet ready, etc — toggle
    // is best-effort UX; user notices the no-op and re-presses.
  }
}

export async function moveCapsuleToCursor(): Promise<void> {
  try {
    await invoke<void>("move_window_to_cursor");
  } catch {
    // Best-effort positioning; the cápsula opens at its last known
    // location if the move fails. Cursor coordinates only matter
    // for the magnetic-summon UX.
  }
}

// Computer-use primitives — thin invoke wrappers around the cu_*
// Tauri commands. We deliberately do NOT swallow errors here: the
// gate UI in Capsule must surface "Wayland not supported" or "macOS
// Accessibility denied" so the operator knows why nothing happened.
// Compare with moveCapsuleToCursor() above which warns-and-continues
// — that helper is best-effort UX; these are user-initiated input
// and silent failure would be hostile.
export async function cuMouseMove(x: number, y: number): Promise<void> {
  await invoke<void>("cu_mouse_move", { x, y });
}

export async function cuMouseClick(
  button: "left" | "right" | "middle",
): Promise<void> {
  await invoke<void>("cu_mouse_click", { button });
}

export async function cuType(text: string): Promise<void> {
  await invoke<void>("cu_type", { text });
}

export async function cuPress(key: string): Promise<void> {
  await invoke<void>("cu_press", { key });
}
