// Wave L — Browser Runtime / Preview Bridge.
//
// The Surface Final chamber needs to talk to the rendered preview to:
//   1. take screenshots for VisualDiff (Wave K)
//   2. let the operator click an element and translate that into a
//      "fix this here" issue
//   3. inspect DOM-to-component mapping
//
// The runtime is an iframe pointing at the Vercel preview URL (or
// localhost during dev). The chamber communicates with the iframe
// via postMessage with a typed protocol — the iframe-side script
// (loaded as part of the app build) listens and responds.
//
// This file is the **chamber side**. The matching iframe-side script
// would live in src/preview-agent/ and be conditionally loaded under
// `?previewAgent=1` on the URL. v1 here is the protocol + a typed
// client; the iframe-side is a follow-up wave.

export type PreviewMessageKind =
  | "ping"
  | "pong"
  | "screenshot"
  | "screenshot_result"
  | "select_element"
  | "element_selected"
  | "list_components"
  | "components_listed"
  | "navigate"
  | "navigate_result"
  | "error";

export interface PreviewEnvelope<T extends PreviewMessageKind = PreviewMessageKind> {
  /** Protocol version. Bumped on breaking changes. */
  v: 1;
  /** Match request ↔ response. */
  id: string;
  /** Discriminating kind. */
  kind: T;
  /** Optional payload, kind-specific. */
  payload?: Record<string, unknown>;
}

export interface ScreenshotRequest extends PreviewEnvelope<"screenshot"> {
  payload?: {
    /** CSS selector of element to capture; defaults to <html>. */
    selector?: string;
    /** Output format. */
    format?: "png" | "jpeg";
  };
}

export interface ScreenshotResult extends PreviewEnvelope<"screenshot_result"> {
  payload: {
    dataUrl: string; // data:image/png;base64,...
    width: number;
    height: number;
  };
}

export interface ElementSelected extends PreviewEnvelope<"element_selected"> {
  payload: {
    selector: string;
    text: string;
    rect: { x: number; y: number; width: number; height: number };
    componentHint?: string; // when the iframe knows the React component
  };
}

export interface ComponentsListed extends PreviewEnvelope<"components_listed"> {
  payload: {
    components: Array<{
      name: string;
      selector: string;
      sourcePath?: string; // when sourcemap is available
    }>;
  };
}

// ── Bridge helper ──────────────────────────────────────────────────────────

function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export interface BridgeOptions {
  /** Origin allowed to talk to us. Refuses messages from other origins. */
  expectedOrigin: string;
  /** ms to wait before timing out a request. */
  timeoutMs?: number;
}

/**
 * Typed RPC over postMessage to a preview iframe. Caller passes the
 * iframe element + the URL it loaded so we can validate origin on
 * inbound messages.
 */
export class PreviewBridge {
  private iframe: HTMLIFrameElement;
  private opts: Required<BridgeOptions>;
  private pending = new Map<
    string,
    { resolve: (env: PreviewEnvelope) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }
  >();
  private listener?: (e: MessageEvent) => void;

  constructor(iframe: HTMLIFrameElement, opts: BridgeOptions) {
    this.iframe = iframe;
    this.opts = { timeoutMs: 5000, ...opts };
  }

  attach(): void {
    if (this.listener) return;
    this.listener = (e: MessageEvent) => this.onMessage(e);
    window.addEventListener("message", this.listener);
  }

  detach(): void {
    if (this.listener) {
      window.removeEventListener("message", this.listener);
      this.listener = undefined;
    }
    for (const p of this.pending.values()) {
      clearTimeout(p.timer);
      p.reject(new Error("PreviewBridge detached"));
    }
    this.pending.clear();
  }

  private onMessage(e: MessageEvent): void {
    if (e.origin !== this.opts.expectedOrigin) return;
    const env = e.data as PreviewEnvelope | null;
    if (!env || typeof env !== "object" || env.v !== 1 || !env.id) return;
    const pending = this.pending.get(env.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    this.pending.delete(env.id);
    pending.resolve(env);
  }

  send<T extends PreviewEnvelope>(envelope: Omit<T, "v" | "id"> & Partial<Pick<T, "id">>): Promise<PreviewEnvelope> {
    if (!this.iframe.contentWindow) {
      return Promise.reject(new Error("iframe has no contentWindow"));
    }
    const id = envelope.id ?? uid();
    const out: PreviewEnvelope = { v: 1, id, kind: envelope.kind, payload: envelope.payload };
    return new Promise<PreviewEnvelope>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`PreviewBridge timeout for kind=${envelope.kind}`));
      }, this.opts.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.iframe.contentWindow!.postMessage(out, this.opts.expectedOrigin);
    });
  }

  // ── Typed wrappers ───────────────────────────────────────────────────

  ping(): Promise<PreviewEnvelope> {
    return this.send({ kind: "ping" });
  }

  screenshot(payload?: ScreenshotRequest["payload"]): Promise<ScreenshotResult> {
    return this.send<ScreenshotRequest>({ kind: "screenshot", payload }) as Promise<ScreenshotResult>;
  }

  selectElement(): Promise<ElementSelected> {
    return this.send({ kind: "select_element" }) as Promise<ElementSelected>;
  }

  listComponents(): Promise<ComponentsListed> {
    return this.send({ kind: "list_components" }) as Promise<ComponentsListed>;
  }

  navigate(href: string): Promise<PreviewEnvelope> {
    return this.send({ kind: "navigate", payload: { href } });
  }
}
