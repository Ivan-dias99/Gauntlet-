// Wave P-5 — Preview iframe-side runtime.
//
// Wave L (PR #234) shipped the chamber-side typed RPC client
// (src/lib/previewBridge.ts). This file is the matching iframe-side
// runtime: it listens for envelopes posted by the parent chamber and
// answers each with the corresponding result (or error) frame.
//
// Loaded conditionally from src/main.tsx when the URL carries
// `?previewAgent=1` so a normal browser session never installs these
// listeners. The same React app boots either way; the agent just adds
// a thin overlay for select-element interactions.
//
// Protocol surface answered here (mirrors previewBridge RESPONSE_KIND):
//   ping            → pong
//   list_components → components_listed
//   navigate        → navigate_result
//   select_element  → element_selected (click-to-pick overlay)
//   screenshot      → error (browsers don't expose a native screenshot
//                     API without user-mediated capture; surfaced as a
//                     typed protocol error so the typed wrapper rejects
//                     cleanly instead of timing out).

type Kind =
  | "ping" | "pong"
  | "screenshot" | "screenshot_result"
  | "select_element" | "element_selected"
  | "list_components" | "components_listed"
  | "navigate" | "navigate_result"
  | "error";

interface Envelope {
  v: 1;
  id: string;
  kind: Kind;
  payload?: Record<string, unknown>;
}

// Origin allowlist for inbound envelopes. Default policy: same-origin
// only — the agent runs inside the same site that hosts the chamber.
// Operators that mount Surface Final on a different host can extend
// the list via `VITE_PREVIEW_AGENT_ALLOWED_ORIGINS` at build time
// (comma-separated). Reads safely when the env var isn't set.
const ALLOWED_ORIGINS: ReadonlySet<string> = (() => {
  const set = new Set<string>();
  if (typeof window !== "undefined" && window.location?.origin) {
    set.add(window.location.origin);
  }
  // Vite injects import.meta.env.* at build time; gate access so the
  // agent still loads in environments without Vite's helper.
  const env =
    typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string | undefined> }).env
      ? (import.meta as { env: Record<string, string | undefined> }).env
      : undefined;
  const extra = env?.VITE_PREVIEW_AGENT_ALLOWED_ORIGINS;
  if (typeof extra === "string") {
    // Codex P2 (discussion_r3164786811): MessageEvent.origin is always
    // a bare origin string (`scheme://host[:port]`). Operators may
    // copy-paste a full URL with path/query into the env var; without
    // normalisation those entries silently never match and every RPC
    // is dropped. Run each value through `new URL().origin` (mirrors
    // PreviewBridge's expectedOrigin handling) and skip anything that
    // can't parse so a typo can't poison the entire allowlist.
    for (const o of extra.split(",")) {
      const trimmed = o.trim();
      if (!trimmed) continue;
      try {
        set.add(new URL(trimmed).origin);
      } catch {
        // Ignore malformed entries — silently dropping is preferable
        // to throwing during module init and breaking the agent boot.
      }
    }
  }
  return set;
})();

function reply(target: Window, origin: string, env: Envelope) {
  target.postMessage(env, origin);
}

function errorEnvelope(id: string, message: string): Envelope {
  return { v: 1, id, kind: "error", payload: { message } };
}

// ── Component listing ──────────────────────────────────────────────────────
//
// Walk the DOM for elements carrying `data-component="…"`. The
// spec-to-code scaffolds (Wave J) emit this attribute on every
// generated component, so list_components is a useful inspection
// surface even before sourcemaps are wired.

function listComponents(): Envelope["payload"] {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-component]"),
  );
  const components = nodes.map((el) => ({
    name: el.getAttribute("data-component") ?? "",
    selector: cssPath(el),
    sourcePath: el.getAttribute("data-source-path") ?? undefined,
  }));
  return { components };
}

// ── Element selector ───────────────────────────────────────────────────────
//
// Builds a stable CSS path from <body> down to the target. Uses ids
// when present, falls back to nth-child indices otherwise so the path
// uniquely identifies a node even when the same component repeats.

function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && node !== document.body) {
    const tag = node.tagName.toLowerCase();
    if (node.id) {
      parts.unshift(`${tag}#${CSS.escape(node.id)}`);
      break;
    }
    const parent = node.parentElement;
    if (!parent) {
      parts.unshift(tag);
      break;
    }
    const siblings = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
    if (siblings.length > 1) {
      const idx = siblings.indexOf(node) + 1;
      parts.unshift(`${tag}:nth-of-type(${idx})`);
    } else {
      parts.unshift(tag);
    }
    node = parent;
  }
  return parts.length > 0 ? `body > ${parts.join(" > ")}` : "body";
}

// Single-shot click-to-select overlay. Disables existing pointer events
// for the duration so a click on a button doesn't fire its handler.

interface PickResult {
  selector: string;
  text: string;
  rect: { x: number; y: number; width: number; height: number };
  componentHint?: string;
}

// Codex P2 (discussion_r3164786816): a single active-pick lock. Two
// overlapping overlays interfere with `elementFromPoint()` (the older
// overlay can win the hit-test even with pointer-events temporarily
// disabled on the newer one), producing wrong selectors/rects and
// stale overlay state until the 60s timeout fires. Reject concurrent
// requests instead of stacking overlays.
let activePick = false;

function pickElement(): Promise<PickResult> {
  if (activePick) {
    return Promise.reject(new Error("another select_element is already in progress"));
  }
  activePick = true;
  return new Promise((resolve, reject) => {
    const release = () => { activePick = false; };
    const overlay = document.createElement("div");
    overlay.setAttribute("data-preview-agent-overlay", "");
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      cursor: "crosshair",
      background: "rgba(0,0,0,0.05)",
    } as Partial<CSSStyleDeclaration>);

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      window.removeEventListener("keydown", onKey, true);
      overlay.remove();
      if (timeout) clearTimeout(timeout);
      release();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cleanup();
        reject(new Error("element pick cancelled"));
      }
    };

    overlay.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Use elementFromPoint with the overlay temporarily hidden so we
      // hit the actual element underneath, not our own overlay.
      overlay.style.pointerEvents = "none";
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      overlay.style.pointerEvents = "auto";
      cleanup();
      if (!target) {
        reject(new Error("no element under click"));
        return;
      }
      const rect = target.getBoundingClientRect();
      resolve({
        selector: cssPath(target),
        text: (target.textContent ?? "").trim().slice(0, 200),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        componentHint: target.closest("[data-component]")?.getAttribute("data-component") ?? undefined,
      });
    }, true);

    window.addEventListener("keydown", onKey, true);
    document.body.appendChild(overlay);

    // Hard deadline so an idle pick doesn't keep the overlay around forever.
    timeout = setTimeout(() => {
      cleanup();
      reject(new Error("element pick timed out"));
    }, 60_000);
  });
}

// ── Screenshot capture (Wave P-28) ─────────────────────────────────────────
//
// html2canvas is loaded lazily on first call. If it's not installed
// (the project deliberately keeps it out of the dependency manifest
// to keep bundle size small) the dynamic import rejects and we throw
// a typed error with `reason: html2canvas_unavailable`. The chamber
// shows that as "screenshot engine unavailable" rather than a generic
// timeout / stack trace.
//
// We don't cache the module at module-init time — that would force
// bundlers to consider it a hard dep. Caching the resolved module
// after the first successful call IS fine.

interface ScreenshotResultPayload {
  dataUrl: string;
  width: number;
  height: number;
}

interface Html2CanvasModule {
  default: (
    element: HTMLElement,
    options?: { backgroundColor?: string | null; scale?: number; logging?: boolean },
  ) => Promise<HTMLCanvasElement>;
}

let _html2canvasCache: Html2CanvasModule | null = null;

async function loadHtml2Canvas(): Promise<Html2CanvasModule> {
  if (_html2canvasCache) return _html2canvasCache;
  try {
    // html2canvas is intentionally NOT in package.json — we keep the
    // bundle small and let operators install it on demand. To avoid:
    //   (a) Vite resolving the spec at build time (would fail), and
    //   (b) tsc complaining about the missing types,
    // we hide the spec behind a runtime variable and cast through
    // unknown. Vite leaves variable-spec imports alone with the
    // /* @vite-ignore */ pragma; tsc has no literal spec to resolve.
    const spec = "html2canvas";
    const mod = (await import(/* @vite-ignore */ spec)) as unknown as Html2CanvasModule;
    _html2canvasCache = mod;
    return mod;
  } catch (e) {
    const reason = "html2canvas_unavailable";
    const detail = (e as Error).message || String(e);
    const err = new Error(`${reason}: ${detail}`);
    (err as Error & { reason?: string }).reason = reason;
    throw err;
  }
}

async function captureScreenshot(
  payload: Envelope["payload"],
): Promise<ScreenshotResultPayload> {
  const selector = (payload && typeof payload.selector === "string") ? payload.selector : null;
  const format = (payload && typeof payload.format === "string" && payload.format === "jpeg")
    ? "jpeg"
    : "png";

  const target: HTMLElement = selector
    ? (document.querySelector(selector) as HTMLElement | null) ?? document.documentElement
    : document.documentElement;

  const html2canvas = (await loadHtml2Canvas()).default;
  const canvas = await html2canvas(target, { backgroundColor: null, logging: false });
  const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  const dataUrl = canvas.toDataURL(mime);
  return { dataUrl, width: canvas.width, height: canvas.height };
}

// ── Message dispatch ───────────────────────────────────────────────────────

async function handle(env: Envelope, source: Window, origin: string): Promise<void> {
  switch (env.kind) {
    case "ping":
      reply(source, origin, { v: 1, id: env.id, kind: "pong" });
      return;

    case "list_components":
      reply(source, origin, {
        v: 1, id: env.id, kind: "components_listed",
        payload: listComponents(),
      });
      return;

    case "navigate": {
      const href = (env.payload && typeof env.payload.href === "string") ? env.payload.href : null;
      if (!href) {
        reply(source, origin, errorEnvelope(env.id, "navigate requires payload.href"));
        return;
      }
      try {
        // Stay same-origin only — the parent shouldn't push us across
        // origins via this RPC.
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) {
          reply(source, origin, errorEnvelope(env.id, "cross-origin navigate refused"));
          return;
        }
        // Reply BEFORE navigation so the parent's promise resolves.
        reply(source, origin, {
          v: 1, id: env.id, kind: "navigate_result",
          payload: { href: url.href },
        });
        location.href = url.href;
      } catch (e) {
        reply(source, origin, errorEnvelope(env.id, `invalid href: ${(e as Error).message}`));
      }
      return;
    }

    case "select_element":
      try {
        const result = await pickElement();
        reply(source, origin, {
          v: 1, id: env.id, kind: "element_selected",
          payload: result as unknown as Record<string, unknown>,
        });
      } catch (e) {
        reply(source, origin, errorEnvelope(env.id, (e as Error).message));
      }
      return;

    case "screenshot":
      // Wave P-28 — try html2canvas via dynamic import. If the package
      // isn't installed (it's intentionally NOT a hard dep — small
      // bundle wins over feature breadth), surface a typed error so
      // the chamber can show "screenshot engine unavailable" instead
      // of timing out. Selector + format pulled from env.payload when
      // present; defaults: full document, PNG.
      try {
        const result = await captureScreenshot(env.payload);
        reply(source, origin, {
          v: 1, id: env.id, kind: "screenshot_result",
          payload: result as unknown as Record<string, unknown>,
        });
      } catch (e) {
        const msg = (e as Error).message || "screenshot failed";
        reply(source, origin, errorEnvelope(env.id, msg));
      }
      return;

    default:
      reply(source, origin, errorEnvelope(env.id, `unsupported kind: ${env.kind}`));
  }
}

function isEnvelope(data: unknown): data is Envelope {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return d.v === 1 && typeof d.id === "string" && typeof d.kind === "string";
}

export function attachPreviewAgent(): () => void {
  const listener = (e: MessageEvent) => {
    if (!isEnvelope(e.data)) return;
    if (!e.source || !(e.source instanceof Window)) return;
    // Reject same-window self-talk (the agent's own error replies
    // would otherwise loop). Also reject non-parent sources so
    // sibling frames or popups can't drive RPC calls.
    if (e.source === window) return;
    if (window.parent && e.source !== window.parent) return;
    // Codex P1: enforce an origin allowlist before dispatching RPCs.
    // Without this gate, embedding the agent on an arbitrary site via
    // ?previewAgent=1 would let the embedder drive list_components /
    // navigate / select_element cross-origin and read back metadata
    // SOP would normally hide.
    if (!ALLOWED_ORIGINS.has(e.origin)) return;
    void handle(e.data, e.source, e.origin);
  };
  window.addEventListener("message", listener);
  // Send a one-shot "agent_ready" frame to window.parent on boot so
  // the chamber can know the iframe is alive without polling.
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage(
        { v: 1, id: "agent_ready", kind: "pong" } as Envelope,
        "*",
      );
    } catch {
      // Cross-origin parent may refuse; chamber falls back to ping().
    }
  }
  return () => window.removeEventListener("message", listener);
}

// Auto-attach on import — main.tsx imports this module conditionally
// when the URL carries ?previewAgent=1, so the side effect is gated.
attachPreviewAgent();
