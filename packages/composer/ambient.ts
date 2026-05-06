// Gauntlet Composer — Ambient contract.
//
// The Composer is a single component (Capsule + Pill + ComposerClient).
// It runs in three runtime contexts ("ambients"):
//
//   web-inpage  — content script, shadow DOM, page selection + DOM exec
//   web-popup   — chrome-extension://composer.html (chrome:// pages, blank
//                 tabs, web store — places the content script can't reach)
//   desktop     — Tauri webview, clipboard + active window title
//
// Doctrine: "Existe um único Gauntlet Composer com duas shells de runtime."
// (web extension, desktop Tauri). The Composer never branches on `runtime`
// to decide what to do — it asks the Ambient what's available and renders
// only the buttons the Ambient supports. Drop a fourth ambient (mobile, IDE
// panel, terminal TUI) and the Composer doesn't change a line.
//
// This file defines the Ambient interface and nothing else. Each app
// implements its own concrete Ambient and passes it as a prop.

import type { DomAction, DomActionResult } from "./dom-actions";
import type { SelectionRect } from "./selection-types";

export type Runtime = "web-inpage" | "web-popup" | "desktop";

// What the Composer asks the host for at summon time. The same shape
// is sent to /composer/context — the wire field "source" is "browser"
// for the two web ambients and "desktop" for Tauri.
export interface ContextSnapshot {
  source: "browser" | "desktop";
  // Free-form text the operator was pointing at. Web: page selection.
  // Desktop: clipboard contents.
  text: string;
  // URL or scheme://identifier the host is on.
  url: string;
  // Page title (web) or window title (desktop).
  pageTitle: string;
  // Visible page text — web only; desktop sends "".
  pageText: string;
  // DOM JSON skeleton — web only; desktop sends "".
  domSkeleton: string;
  // Selection bounding box in viewport coords — web only; desktop sends null.
  bbox: SelectionRect | null;
  // Optional desktop-only metadata; web ambients leave undefined.
  appName?: string;
}

// Per-runtime persisted preferences. Web uses chrome.storage.local; desktop
// can use Tauri Store, localStorage, or whatever the host wires in. The
// Composer never touches platform storage APIs directly.
export interface AmbientStorage {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
}

// SSE callbacks for streaming /composer/dom_plan_stream. Web routes
// through chrome.runtime.connect so requests originate from the extension
// origin (CORS bypass). Desktop will eventually wire a Rust-side helper;
// for now `streamSse` is undefined on desktop and the client falls back
// to the non-streaming /composer/dom_plan endpoint.
export interface SseCallbacks {
  onDelta: (text: string) => void;
  onDone: (data: unknown) => void;
  onError: (err: string) => void;
}

// HTTP transport. Wraps both regular JSON requests and (optionally) the
// streaming dom_plan endpoint. The ComposerClient class consumes this
// directly; consumers don't construct one themselves.
export interface AmbientTransport {
  requestJson<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: unknown,
    signal?: AbortSignal,
  ): Promise<T>;

  // Optional streaming. When undefined, ComposerClient falls back to the
  // non-streaming dom_plan path.
  streamSse?(url: string, body: unknown, callbacks: SseCallbacks): () => void;
}

// What the Composer renders depends on these flags. The Composer never
// hardcodes "if web do X" — it reads capabilities and adapts.
export interface AmbientCapabilities {
  // Show the "include screenshot" toggle in the settings drawer.
  // web-inpage: yes (chrome.tabs.captureVisibleTab).
  // web-popup:  no (would screenshot itself).
  // desktop:    yes (interactive region capture via Tauri).
  showScreenshot: boolean;

  // Show "domínios escondidos" management in the settings drawer.
  // web-inpage: yes.
  // web-popup:  yes (same chrome.storage backing).
  // desktop:    no (desktop has no per-domain concept).
  showDomainDismiss: boolean;

  // Show the "Acionar" button when the planner returns DOM actions.
  // web-inpage: yes.
  // web-popup:  no (no live page).
  // desktop:    no (no DOM).
  showActions: boolean;

  // Show settings drawer at all. When false, the "···" button hides.
  showSettings: boolean;
}

// The full Ambient — one object the Capsule receives as a prop. Each app
// constructs and owns its instance.
export interface Ambient {
  runtime: Runtime;
  transport: AmbientTransport;
  storage: AmbientStorage;
  capabilities: AmbientCapabilities;

  // Backend URL the ComposerClient should target. Each ambient picks
  // its own default (extension uses Railway in prod, dev override via
  // VITE_BACKEND_URL; desktop uses the Tauri capability allow-list).
  backendUrl: string;

  // Snapshot the host context. Synchronous when possible (web: read
  // selection); async when not (desktop: clipboard + active window).
  captureContext(): ContextSnapshot | Promise<ContextSnapshot>;

  // Re-read the snapshot — bound to the "re-read" button in the cápsula.
  refreshContext?(): ContextSnapshot | Promise<ContextSnapshot>;

  // Optional: capture a screenshot and return a data URL. web-inpage uses
  // chrome.tabs.captureVisibleTab via background.ts; desktop invokes the
  // Tauri `capture_screen_region` command. web-popup doesn't implement it.
  captureScreenshot?(): Promise<string | null>;

  // Optional: execute DOM actions. Only web-inpage implements this.
  executeActions?(actions: DomAction[]): Promise<DomActionResult[]>;

  // Optional: hostname for per-domain settings. Returns undefined on desktop.
  currentHostname?(): string | undefined;
}
