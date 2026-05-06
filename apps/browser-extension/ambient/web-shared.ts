// Web ambient — shared transport + storage primitives.
//
// Both the in-page (content script, shadow DOM) and the popup
// (chrome-extension://composer.html) ambients share the same
// chrome.runtime fetch proxy, chrome.runtime.connect SSE port, and
// chrome.storage.local backing. Only the context capture / screenshot /
// DOM execution differ — those live in web-inpage.ts and web-popup.ts.

import type {
  AmbientStorage,
  AmbientTransport,
  SseCallbacks,
} from "@gauntlet/composer/ambient";

// Production backend (Railway). For local dev against the FastAPI server
// on http://localhost:3002, build the extension with:
//   VITE_BACKEND_URL=http://localhost:3002 npm run build
const PRODUCTION_BACKEND =
  "https://ruberra-backend-jkpf-production.up.railway.app";

const BUILD_TIME_BACKEND: string | undefined =
  typeof import.meta !== "undefined"
    ? (import.meta as { env?: Record<string, string | undefined> }).env
        ?.VITE_BACKEND_URL
    : undefined;

export const WEB_BACKEND_URL = (BUILD_TIME_BACKEND ?? PRODUCTION_BACKEND).replace(
  /\/+$/,
  "",
);

interface BackgroundFetchResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
  body?: string;
  headers?: Record<string, string>;
  error?: string;
}

class ComposerError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ComposerError";
    this.status = status;
    this.body = body;
  }
}

// Background fetch — content scripts can't talk to backends that aren't
// on the host page's origin (CORS). The service worker fetches under
// the chrome-extension:// origin which the backend allows.
async function backgroundFetchJson<T>(
  method: string,
  url: string,
  body: unknown,
): Promise<T> {
  const reply: BackgroundFetchResponse | undefined = await chrome.runtime.sendMessage({
    type: "gauntlet:fetch",
    url,
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!reply || !reply.ok) {
    throw new ComposerError(
      `composer: background fetch failed — ${reply?.error ?? "unknown error"}`,
      0,
      reply ?? null,
    );
  }
  let parsed: unknown = null;
  if (reply.body != null && reply.body !== "") {
    try {
      parsed = JSON.parse(reply.body);
    } catch {
      parsed = reply.body;
    }
  }
  const status = reply.status ?? 0;
  if (status < 200 || status >= 300) {
    throw new ComposerError(
      `composer: ${status} ${reply.statusText ?? ""}`.trim(),
      status,
      parsed,
    );
  }
  return parsed as T;
}

export const webTransport: AmbientTransport = {
  async requestJson<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
  ): Promise<T> {
    return backgroundFetchJson<T>(method, url, body);
  },

  // SSE bridge through a long-lived chrome.runtime.Port. The service
  // worker forwards each text/event-stream chunk as it arrives so the
  // cápsula can render token-by-token.
  streamSse(url: string, body: unknown, callbacks: SseCallbacks): () => void {
    const port = chrome.runtime.connect({ name: "gauntlet:stream" });
    let settled = false;

    function settle() {
      if (settled) return;
      settled = true;
      try {
        port.disconnect();
      } catch {
        // already disconnected
      }
    }

    port.onMessage.addListener((rawMsg: unknown) => {
      if (!rawMsg || typeof rawMsg !== "object") return;
      const msg = rawMsg as {
        type?: string;
        event?: string;
        data?: string;
        error?: string;
      };
      if (msg.type === "sse" && typeof msg.data === "string") {
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(msg.data);
        } catch {
          callbacks.onError("malformed SSE payload");
          settle();
          return;
        }
        if (msg.event === "delta") {
          const text = (parsed as { text?: string }).text ?? "";
          callbacks.onDelta(text);
        } else if (msg.event === "done") {
          callbacks.onDone(parsed);
          settle();
        } else if (msg.event === "error") {
          const err = (parsed as { error?: string }).error ?? "model error";
          callbacks.onError(err);
          settle();
        }
      } else if (msg.type === "error") {
        callbacks.onError(msg.error ?? "transport error");
        settle();
      } else if (msg.type === "closed" && !settled) {
        callbacks.onDone({ reason: "stream ended without result" });
        settled = true;
      }
    });

    port.onDisconnect.addListener(() => {
      if (settled) return;
      const lastError = chrome.runtime.lastError?.message;
      callbacks.onError(lastError ?? "disconnected");
      settled = true;
    });

    port.postMessage({ type: "start", url, body });

    return () => {
      if (settled) return;
      try {
        port.postMessage({ type: "abort" });
      } catch {
        // ignore — port may already be down
      }
      settle();
    };
  },
};

export const webStorage: AmbientStorage = {
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const got = await chrome.storage.local.get(key);
      return got[key] as T | undefined;
    } catch {
      return undefined;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch {
      // Non-fatal — pref doesn't survive but the cápsula keeps working.
    }
  },
};

// Capture a screenshot of the visible part of the active tab via the
// service worker (chrome.tabs.captureVisibleTab requires extension
// privileges). Returns a data URL or null on failure.
export async function webCaptureScreenshot(): Promise<string | null> {
  try {
    const reply = (await chrome.runtime.sendMessage({
      type: "gauntlet:capture_screenshot",
    })) as { ok?: boolean; dataUrl?: string } | undefined;
    if (reply?.ok && reply.dataUrl) return reply.dataUrl;
    return null;
  } catch {
    return null;
  }
}
