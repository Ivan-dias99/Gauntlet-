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

const PARENT_ORIGIN = "*"; // replied to event.origin specifically below.

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

function pickElement(): Promise<PickResult> {
  return new Promise((resolve, reject) => {
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
      // No native browser API exposes raster capture without user
      // mediation (getDisplayMedia requires a click each time). v1
      // surfaces this as a typed error so the chamber wrapper rejects
      // with a clear message instead of timing out.
      reply(source, origin, errorEnvelope(
        env.id,
        "screenshot not implemented in v1 — use external capture or wait for v2 with html2canvas",
      ));
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
    void handle(e.data, e.source, e.origin || PARENT_ORIGIN);
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
