// Ambient — the seam between the shared Composer and its runtime shell.
//
// The Composer is identical across shells. Differences (transport
// origin, where selection comes from, whether the page is actuatable,
// whether a screenshot can be captured) are expressed here as
// capabilities + adapters. The cápsula reads ambient.capabilities to
// decide which UI elements to render; it calls ambient.transport,
// ambient.selection, etc. for behaviour.
//
// Each shell ships a concrete Ambient and constructs <Capsule
// ambient={...} />. The shell stays thin; the Composer stays single.

import type {
  DomPlanResult,
  SelectionSnapshot,
} from './types';
import type { DomAction, DomActionResult } from './dom-actions';

// Feature flags — every shell answers the same questions, even if some
// answers are always false. Keeps the cápsula's conditional rendering
// readable and uniform.
export interface AmbientCapabilities {
  // Can the shell actuate the host surface (click/fill/scroll DOM)?
  // Browser: yes. Desktop: no — there is no DOM to actuate against.
  readonly domExecution: boolean;
  // Does the shell render the resting pill, or is the surface always
  // present (e.g. the desktop window itself is the cápsula container)?
  readonly pillSurface: boolean;
  // Can the shell hand back a viewport screenshot for multimodal context?
  readonly screenshot: boolean;
  // Does the per-domain hide preference make sense in this shell?
  // Browser: yes. Desktop: no — there's no domain.
  readonly dismissDomain: boolean;
  // Web Speech API (or equivalent) available — gates the mic button.
  readonly voice: boolean;
  // Does the transport support SSE streaming for /composer/dom_plan_stream?
  readonly streaming: boolean;
  // Can the cápsula ask the shell to re-read the current selection
  // mid-session? Browser supports this (refresh from page DOM); desktop
  // refreshes the clipboard + window snapshot instead.
  readonly refreshSelection: boolean;
}

// Transport — single-shot JSON for /composer/* and (optional) SSE for
// the streaming planner. Browser routes through chrome.runtime so the
// origin is chrome-extension://; desktop fetches direct because
// Tauri's webview is on a configurable origin already.
export interface AmbientTransport {
  fetchJson<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: unknown,
    signal?: AbortSignal,
  ): Promise<T>;
  stream?(
    url: string,
    body: unknown,
    callbacks: StreamCallbacks,
  ): () => void;
}

export interface StreamCallbacks {
  onDelta(text: string): void;
  onDone(result: DomPlanResult): void;
  onError(err: string): void;
}

// Storage — key/value scoped to the shell's persistent backing store.
// Browser uses chrome.storage.local; desktop uses Tauri's store plugin
// (or a JSON file under the app config dir as a fallback). The
// cápsula treats it as opaque — never persists secrets, only prefs.
export interface AmbientStorage {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface AmbientDomActions {
  execute(actions: DomAction[]): Promise<DomActionResult[]>;
}

export interface AmbientScreenshot {
  capture(): Promise<string | null>; // returns a data URL or null
}

// Selection — synchronous "what is the user pointing at right now".
// Browser reads window.getSelection() + bbox; desktop reads clipboard
// + active window title and packs it into the same snapshot shape so
// the Composer doesn't need a second code path.
export interface AmbientSelection {
  read(): SelectionSnapshot;
  readAsync?(): Promise<SelectionSnapshot>; // browser uses for iframes
}

// Diagnostics — used by the cápsula to surface "why did fallback fire"
// in the debug pane. Optional because not every shell has a meaningful
// fallback story.
export interface AmbientDebug {
  lastSummon(): Promise<unknown | null>;
}

export interface Ambient {
  readonly shell: 'browser' | 'desktop';
  readonly capabilities: AmbientCapabilities;
  readonly transport: AmbientTransport;
  readonly storage: AmbientStorage;
  readonly selection: AmbientSelection;
  // Optional adapters — present iff the matching capability is true.
  readonly domActions?: AmbientDomActions;
  readonly screenshot?: AmbientScreenshot;
  readonly debug?: AmbientDebug;
}
