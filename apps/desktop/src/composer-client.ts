// Desktop composer client.
//
// Identical wire contract to apps/browser-extension/lib/composer-client.ts
// — different transport. We don't proxy through a service worker here;
// Tauri's webview can fetch any URL declared in the Tauri capability
// (default config in src-tauri/capabilities/default.json adds the
// localhost backend). All routes:
//
//   /composer/{context,intent,preview,apply}
//   /composer/dom_plan, /composer/dom_plan_stream  (compose path only —
//     desktop never executes DOM actions because there is no DOM to
//     execute on)
//   /composer/execution     (Sprint 3 — recorded as rejected when the
//     user dismisses the cápsula, executed for compose-only completions)
//   /composer/settings      (Sprint 4 — read on mount)
//
// The cápsula UI is identical to the browser-extension version; only
// the host adapter (clipboard, shortcut, screenshot) differs. Keeping
// the wire types as exact copies costs us a small amount of
// duplication but means no dependency on the extension's bundler tree
// from Tauri's bundler tree.

const DEFAULT_BACKEND = "http://127.0.0.1:3002";

export type ContextSource =
  | "browser"
  | "desktop"
  | "ide"
  | "terminal"
  | "file"
  | "image"
  | "clipboard";

export interface ContextCaptureRequest {
  source: ContextSource;
  url?: string;
  page_title?: string;
  app_name?: string;
  window_title?: string;
  selection?: string;
  clipboard?: string;
  metadata?: Record<string, unknown>;
}

export interface ContextCaptureResponse {
  context_id: string;
  confidence: number;
  expires_at: string;
}

export interface DomPlanResult {
  plan_id: string;
  context_id: string;
  actions: unknown[];
  compose: string | null;
  reason: string | null;
  model_used: string;
  latency_ms: number;
  raw_response: string | null;
}

export interface DomainPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

export interface ActionPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

export interface ToolPolicy {
  allowed: boolean;
  require_approval: boolean;
}

export interface ComposerSettings {
  domains: Record<string, DomainPolicy>;
  actions: Record<string, ActionPolicy>;
  default_domain_policy: DomainPolicy;
  default_action_policy: ActionPolicy;
  tool_policies: Record<string, ToolPolicy>;
  max_page_text_chars: number;
  max_dom_skeleton_chars: number;
  screenshot_default: boolean;
  execution_reporting_required: boolean;
  updated_at: string;
}

export const DEFAULT_COMPOSER_SETTINGS: ComposerSettings = {
  domains: {},
  actions: {},
  default_domain_policy: { allowed: true, require_danger_ack: false },
  default_action_policy: { allowed: true, require_danger_ack: false },
  tool_policies: {},
  max_page_text_chars: 6000,
  max_dom_skeleton_chars: 4000,
  screenshot_default: false,
  execution_reporting_required: false,
  updated_at: "",
};

export class ComposerError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ComposerError";
    this.status = status;
    this.body = body;
  }
}

async function requestJson<T>(
  method: string,
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
    throw new ComposerError(
      `composer: ${res.status} ${res.statusText}`,
      res.status,
      parsed,
    );
  }
  return parsed as T;
}

export class DesktopComposerClient {
  readonly backendUrl: string;
  constructor(backendUrl: string = DEFAULT_BACKEND) {
    this.backendUrl = backendUrl.replace(/\/+$/, "");
  }

  captureContext(
    req: ContextCaptureRequest,
    signal?: AbortSignal,
  ): Promise<ContextCaptureResponse> {
    return requestJson("POST", `${this.backendUrl}/composer/context`, req, signal);
  }

  // Non-streaming dom_plan — used by desktop because Tauri's webview
  // can't easily proxy SSE through a port the way the extension's
  // background.ts does. Streaming lands in a later iteration when we
  // wire a Rust-side fetch helper.
  requestDomPlan(
    contextId: string,
    userInput: string,
    signal?: AbortSignal,
  ): Promise<DomPlanResult> {
    return requestJson(
      "POST",
      `${this.backendUrl}/composer/dom_plan`,
      { context_id: contextId, user_input: userInput },
      signal,
    );
  }

  getSettings(signal?: AbortSignal): Promise<ComposerSettings> {
    return requestJson("GET", `${this.backendUrl}/composer/settings`, undefined, signal);
  }
}
