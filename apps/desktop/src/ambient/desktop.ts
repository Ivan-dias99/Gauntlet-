// Desktop ambient — Tauri webview.
//
// Same Composer, different host. Reads clipboard + active window via
// Tauri plugins. No DOM to execute against, no per-domain settings.
// Streaming SSE is currently undefined (the Composer's ComposerClient
// falls back to the non-streaming /composer/dom_plan endpoint); a future
// Rust-side fetch helper can populate transport.streamSse.

import type {
  Ambient,
  AmbientStorage,
  AmbientTransport,
  ContextSnapshot,
} from "@gauntlet/composer/ambient";
import {
  captureContextSnapshot,
  captureScreenRegion,
} from "../adapters/tauri";

const DEFAULT_BACKEND = "http://127.0.0.1:3002";

class DesktopComposerError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ComposerError";
    this.status = status;
    this.body = body;
  }
}

const desktopTransport: AmbientTransport = {
  async requestJson<T>(
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
      throw new DesktopComposerError(
        `composer: ${res.status} ${res.statusText}`,
        res.status,
        parsed,
      );
    }
    return parsed as T;
  },
  // streamSse intentionally undefined — Composer falls back to
  // non-streaming /composer/dom_plan when this is missing.
};

const desktopStorage: AmbientStorage = {
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) return undefined;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return undefined;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Non-fatal — pref doesn't survive but the cápsula keeps working.
    }
  },
};

async function captureDesktopContext(): Promise<ContextSnapshot> {
  const snap = await captureContextSnapshot();
  return {
    source: "desktop",
    text: snap.clipboard,
    url: `desktop://${snap.appName || "gauntlet"}`,
    pageTitle: snap.windowTitle,
    pageText: "",
    domSkeleton: "",
    bbox: null,
    appName: snap.appName,
  };
}

// Region screenshot — invokes the Tauri command, gets back a path on
// disk. Read it as base64 and return a data URL the Composer can
// attach to the next request's metadata.
async function desktopScreenshotAsDataUrl(): Promise<string | null> {
  const path = await captureScreenRegion();
  if (!path) return null;
  try {
    // Tauri 2 ships convertFileSrc which we could use, but we want a
    // base64 data URL the backend can ingest as an image block. The
    // simplest path: use the asset protocol via fetch, then FileReader.
    // We dynamically import to keep the desktop ambient lazy on
    // platforms that don't ship a screenshot binary.
    const { convertFileSrc } = await import("@tauri-apps/api/core");
    const assetUrl = convertFileSrc(path);
    const res = await fetch(assetUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function buildDesktopAmbient(): Ambient {
  return {
    runtime: "desktop",
    transport: desktopTransport,
    storage: desktopStorage,
    backendUrl: DEFAULT_BACKEND,
    capabilities: {
      // Region screenshot is supported via Tauri command; the toggle
      // lets the operator opt in just like on web.
      showScreenshot: true,
      // No per-domain concept on desktop.
      showDomainDismiss: false,
      // No DOM to actuate.
      showActions: false,
      showSettings: true,
    },
    captureContext: captureDesktopContext,
    refreshContext: captureDesktopContext,
    captureScreenshot: desktopScreenshotAsDataUrl,
    // executeActions intentionally undefined — desktop has no DOM.
    // currentHostname intentionally undefined — desktop has no domains.
  };
}
