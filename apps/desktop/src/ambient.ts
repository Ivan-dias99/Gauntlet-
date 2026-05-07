// DesktopAmbient — concrete Ambient for the Tauri shell.
//
// Tauri's webview can fetch any URL whitelisted in the capability so we
// don't need a service-worker proxy. The remaining adapters wrap Tauri
// plugin APIs (clipboard, active window, screenshot) to emit the same
// shapes the shared Composer expects from the browser ambient.

import {
  type Ambient,
  type AmbientCapabilities,
  type AmbientFilesystem,
  type AmbientNotifications,
  type AmbientShell,
  type AmbientStorage,
  type SelectionSnapshot,
} from "@gauntlet/composer";
import {
  captureContextSnapshot,
  captureScreenFull,
  captureScreenRegion,
  notify,
  pickFile,
  pickSavePath,
  readFileBase64At,
  readTextFileAt,
  runShell,
  writeFileBase64At,
  writeTextFileAt,
} from "./adapters/tauri";

const CAPABILITIES: AmbientCapabilities = {
  domExecution: false, // there is no host page DOM to actuate
  pillSurface: false, // the Tauri window itself is the cápsula container
  screenshot: true, // capture_screen_region command exists
  dismissDomain: false, // no domain in this shell
  voice:
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
  streaming: false, // SSE bridge not wired through Tauri yet
  refreshSelection: true, // re-reads clipboard + window snapshot
  filesystemRead: true, // pick_file / read_*_at Tauri commands
  filesystemWrite: true, // pick_save_path + write_*_at Tauri commands
  screenCapture: true, // capture_screen_full Tauri command
  remoteVoice: true, // backend can transcribe via /voice/transcribe
  shellExecute: true, // run_shell Tauri command (env-gated + allowlisted)
  notifications: true, // tauri-plugin-notification (OS popup)
};

// In-memory snapshot cache so the synchronous selection.read() can
// answer instantly. captureContextSnapshot is async; we refresh it
// behind the scenes and return whatever the last refresh produced.
let cached: SelectionSnapshot = {
  text: "",
  url: "desktop://capsule",
  pageTitle: "",
  pageText: "",
  domSkeleton: "",
  bbox: null,
};

async function refreshSnapshot(): Promise<SelectionSnapshot> {
  try {
    const snap = await captureContextSnapshot();
    cached = {
      text: snap.clipboard ?? "",
      url: `desktop://${snap.appName || "unknown"}`,
      pageTitle: snap.windowTitle ?? "",
      pageText: snap.clipboard ?? "",
      domSkeleton: "",
      bbox: null,
    };
  } catch {
    // Tauri plugin may be unavailable during dev — keep last cache.
  }
  return cached;
}

// Storage — Tauri exposes a store plugin but it's optional. We fall
// back to localStorage so the cápsula keeps working without an extra
// permission. Keys live under a "gauntlet:" prefix.
const storage: AmbientStorage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // non-fatal
    }
  },
  async remove(key: string): Promise<void> {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // non-fatal
    }
  },
};

export function createDesktopAmbient(): Ambient {
  // Kick off an initial refresh in the background so the first
  // synchronous selection.read() has something better than the empty
  // default snapshot.
  void refreshSnapshot();

  return {
    shell: "desktop",
    capabilities: CAPABILITIES,
    transport: {
      async fetchJson<T>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,
        body?: unknown,
        signal?: AbortSignal,
      ): Promise<T> {
        const res = await fetch(url, {
          method,
          headers: { "content-type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal,
        });
        let parsed: unknown = null;
        try {
          parsed = await res.json();
        } catch {
          parsed = await res.text().catch(() => null);
        }
        if (!res.ok) {
          throw new Error(`composer: ${res.status} ${res.statusText}`);
        }
        return parsed as T;
      },
      // No streaming yet — leave undefined; cápsula falls back to
      // requestDomPlan automatically.
    },
    storage,
    selection: {
      read: (): SelectionSnapshot => cached,
      readAsync: refreshSnapshot,
    },
    screenshot: {
      async capture(): Promise<string | null> {
        // capture_screen_region is interactive (operator drag-selects).
        // Browser-equivalent of "the viewport screenshot" — kept as a
        // path-only reply for backward compat with the existing capsule
        // flow; A1's full-screen path lives in captureScreen() below.
        const path = await captureScreenRegion();
        return path ? `file://${path}` : null;
      },
      async captureScreen() {
        return await captureScreenFull();
      },
    },
    filesystem: filesystem(),
    shellExec: shellExec(),
    notifications: notifications(),
  };
}

function notifications(): AmbientNotifications {
  return {
    async notify(title, body) {
      return await notify(title, body);
    },
  };
}

function shellExec(): AmbientShell {
  return {
    async run(cmd, args, cwd) {
      const r = await runShell(cmd, args, cwd);
      return {
        stdout: r.stdout,
        stderr: r.stderr,
        exitCode: r.exit_code,
        durationMs: r.duration_ms,
      };
    },
  };
}

// AmbientFilesystem implementation — the dialog is the consent gate;
// std::fs (in Rust) is the reader. We keep this as a thin wrapper so
// the cápsula doesn't import Tauri APIs directly.
function filesystem(): AmbientFilesystem {
  return {
    async pickFile(accept?: string[]) {
      const got = await pickFile(accept);
      if (!got) return null;
      return { path: got.path, name: got.name };
    },
    async readTextFile(path: string) {
      return await readTextFileAt(path);
    },
    async readFileBase64(path: string) {
      return await readFileBase64At(path);
    },
    async pickSavePath(suggestedName?: string, accept?: string[]) {
      return await pickSavePath(suggestedName, accept);
    },
    async writeTextFile(path: string, content: string) {
      return await writeTextFileAt(path, content);
    },
    async writeFileBase64(path: string, base64: string) {
      return await writeFileBase64At(path, base64);
    },
  };
}
