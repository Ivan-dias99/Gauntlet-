// DesktopAmbient — concrete Ambient for the Tauri shell.
//
// Tauri's webview can fetch any URL whitelisted in the capability so we
// don't need a service-worker proxy. The remaining adapters wrap Tauri
// plugin APIs (clipboard, active window, screenshot) to emit the same
// shapes the shared Composer expects from the browser ambient.

import {
  type Ambient,
  type AmbientCapabilities,
  type AmbientComputerUse,
  type AmbientFilesystem,
  type AmbientNotifications,
  type AmbientShell,
  type AmbientStorage,
  type ComputerUseButton,
  type SelectionSnapshot,
} from "@gauntlet/composer";
import {
  captureContextSnapshot,
  captureScreenFull,
  cuMouseClick,
  cuMouseMove,
  cuPress,
  cuType,
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
  pillSurface: true, // separate Tauri pill window owns the resting state
  screenshot: true, // capture_screen_region command exists
  dismissDomain: false, // no domain in this shell
  voice:
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
  streaming: true, // SSE bridge wired via fetch + ReadableStream below
  refreshSelection: true, // re-reads clipboard + window snapshot
  filesystemRead: true, // pick_file / read_*_at Tauri commands
  filesystemWrite: true, // pick_save_path + write_*_at Tauri commands
  screenCapture: true, // capture_screen_full Tauri command
  remoteVoice: true, // backend can transcribe via /voice/transcribe
  shellExecute: true, // run_shell Tauri command (env-gated + allowlisted)
  notifications: true, // tauri-plugin-notification (OS popup)
  computerUse: true, // cu_* Tauri commands (enigo); gated UI-side, not env-side
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
          // Surfacing the backend's structured detail (FastAPI returns
          // {"detail": {"error": "...", "message": "..."}}) so the
          // operator vê o erro real (ex: "401 Unauthorized" da Groq)
          // em vez do genérico "502 Bad Gateway" da camada HTTP.
          let detailMsg: string | undefined;
          if (parsed && typeof parsed === "object") {
            const d = (parsed as { detail?: unknown }).detail;
            if (typeof d === "string") {
              detailMsg = d;
            } else if (d && typeof d === "object") {
              const obj = d as { message?: unknown; error?: unknown };
              if (typeof obj.message === "string") detailMsg = obj.message;
              else if (typeof obj.error === "string") detailMsg = obj.error;
            }
          }
          throw new Error(
            `composer: ${res.status} ${res.statusText}${
              detailMsg ? ` — ${detailMsg}` : ""
            }`,
          );
        }
        return parsed as T;
      },
      stream(url, body, callbacks) {
        // Direct SSE consumer: open a POST stream, read line-buffered
        // `event: <name>\ndata: <json>\n\n` frames produced by the
        // backend's StreamingResponse. No service-worker hop because
        // Tauri's webview can hold a long-lived fetch on its own.
        const ctrl = new AbortController();
        let settled = false;
        const settle = () => {
          settled = true;
          try {
            ctrl.abort();
          } catch {
            // already aborted
          }
        };

        (async () => {
          let res: Response;
          try {
            res = await fetch(url, {
              method: "POST",
              headers: { "content-type": "application/json", accept: "text/event-stream" },
              body: JSON.stringify(body),
              signal: ctrl.signal,
            });
          } catch (err) {
            if (settled) return;
            callbacks.onError(err instanceof Error ? err.message : String(err));
            return;
          }
          if (!res.ok || !res.body) {
            callbacks.onError(`stream: ${res.status} ${res.statusText}`);
            return;
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buf = "";

          const dispatch = (event: string | null, data: string) => {
            if (!event || !data) return;
            let parsed: unknown = null;
            try {
              parsed = JSON.parse(data);
            } catch {
              callbacks.onError("malformed SSE payload");
              settle();
              return;
            }
            if (event === "delta") {
              const text = (parsed as { text?: string }).text ?? "";
              callbacks.onDelta(text);
            } else if (event === "done") {
              const d = parsed as Record<string, unknown>;
              callbacks.onDone({
                plan_id: (d.plan_id as string) ?? "",
                context_id: (d.context_id as string) ?? "",
                actions: (d.actions as never[]) ?? [],
                compose: (d.compose as string | null) ?? null,
                reason: (d.reason as string | null) ?? null,
                model_used: (d.model_used as string) ?? "",
                latency_ms: (d.latency_ms as number) ?? 0,
                raw_response: null,
              });
              settle();
            } else if (event === "error") {
              const err = (parsed as { error?: string }).error ?? "model error";
              callbacks.onError(err);
              settle();
            }
          };

          try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              buf += decoder.decode(value, { stream: true });
              // Frames end at a blank line (\n\n). Walk the buffer and
              // dispatch as many complete frames as we have.
              let sep = buf.indexOf("\n\n");
              while (sep !== -1) {
                const frame = buf.slice(0, sep);
                buf = buf.slice(sep + 2);
                let event: string | null = null;
                let data = "";
                for (const line of frame.split("\n")) {
                  if (line.startsWith("event:")) event = line.slice(6).trim();
                  else if (line.startsWith("data:")) data += (data ? "\n" : "") + line.slice(5).trim();
                }
                dispatch(event, data);
                sep = buf.indexOf("\n\n");
              }
            }
            if (!settled) {
              callbacks.onDone({
                plan_id: "",
                context_id: "",
                actions: [],
                compose: null,
                reason: "stream ended without result",
                model_used: "",
                latency_ms: 0,
                raw_response: null,
              });
              settled = true;
            }
          } catch (err) {
            if (settled) return;
            if (err instanceof DOMException && err.name === "AbortError") return;
            callbacks.onError(err instanceof Error ? err.message : String(err));
          }
        })();

        return () => {
          if (settled) return;
          settle();
        };
      },
    },
    storage,
    selection: {
      read: (): SelectionSnapshot => cached,
      readAsync: refreshSnapshot,
    },
    screenshot: {
      async capture(): Promise<string | null> {
        // Auto-capture for context (cápsula open, planning). On desktop
        // "the viewport" = the full screen — the model needs this to
        // reason about computer_use coordinates and active windows.
        // capture_screen_region is the *interactive* path reserved for
        // the explicit "ANEXAR ECRÃ" attach button (captureScreen()
        // below); using it for auto-capture would prompt the operator
        // every time the cápsula opens — broken UX and a hard block on
        // computer_use vision.
        const cap = await captureScreenFull();
        if (!cap?.base64) return null;
        return `data:image/png;base64,${cap.base64}`;
      },
      async captureScreen() {
        // Explicit operator action ("ANEXAR ECRÃ") — full-screen,
        // structured payload (base64 + path) so useAttachments can
        // surface the file path next to the chip.
        return await captureScreenFull();
      },
    },
    filesystem: filesystem(),
    shellExec: shellExec(),
    notifications: notifications(),
    computerUse: computerUse(),
  };
}

function computerUse(): AmbientComputerUse {
  return {
    async moveCursor(x: number, y: number) {
      await cuMouseMove(Math.round(x), Math.round(y));
    },
    async click(button: ComputerUseButton) {
      await cuMouseClick(button);
    },
    async typeText(text: string) {
      await cuType(text);
    },
    async pressKey(key: string) {
      await cuPress(key);
    },
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
