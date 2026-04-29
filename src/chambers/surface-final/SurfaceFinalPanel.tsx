// Wave P-8 — Surface Final operator panel.
//
// Wave L (#234) shipped the chamber-side typed RPC (previewBridge);
// Wave P-5 (#245) shipped the iframe-side runtime (preview-agent).
// This panel is the operator's first surface that USES the bridge:
// embed a preview, ping it, list components, click-to-select an
// element, navigate. The result of each call lands inline so the
// operator can iterate on a candidate against a live preview.
//
// Visual diff (Wave K) is intentionally out of scope here — the
// schema is in main but a real diff requires baseline+candidate
// screenshots. Screenshot is currently a typed error from the
// preview-agent (no native browser API), so VisualDiff display
// stays a follow-up wave once html2canvas (or external capture)
// lands.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PreviewBridge,
  type ScreenshotRequest,
  type ElementSelected,
  type ComponentsListed,
} from "../../lib/previewBridge";

interface Props {
  /** URL the iframe should load. Caller is responsible for adding
   *  `?previewAgent=1` so the preview-agent runtime attaches. */
  previewUrl: string;
}

type LogEntry = {
  id: string;
  ts: number;
  kind: "info" | "ok" | "error";
  text: string;
};

export default function SurfaceFinalPanel({ previewUrl }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [bridge, setBridge] = useState<PreviewBridge | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [navigateInput, setNavigateInput] = useState("");

  // Origin for the bridge — derived from the previewUrl so callers
  // can pass full URLs and the bridge does the right thing.
  const expectedOrigin = useMemo(() => {
    try {
      return new URL(previewUrl).origin;
    } catch {
      return previewUrl;
    }
  }, [previewUrl]);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;
    const b = new PreviewBridge(el, { expectedOrigin, timeoutMs: 8000 });
    b.attach();
    setBridge(b);
    return () => {
      b.detach();
      setBridge(null);
    };
  }, [expectedOrigin]);

  function pushLog(kind: LogEntry["kind"], text: string) {
    setLog((prev) =>
      [
        { id: Math.random().toString(36).slice(2), ts: Date.now(), kind, text },
        ...prev,
      ].slice(0, 30),
    );
  }

  async function withBusy<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
    if (!bridge) {
      pushLog("error", "preview bridge not attached yet");
      return null;
    }
    if (busy) {
      pushLog("error", "another RPC is in flight");
      return null;
    }
    setBusy(true);
    pushLog("info", label);
    try {
      const result = await fn();
      pushLog("ok", `${label} ✓`);
      return result;
    } catch (e) {
      pushLog("error", `${label} ✗ ${(e as Error).message}`);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function ping() {
    await withBusy("ping", async () => {
      const env = await bridge!.ping();
      return env;
    });
  }

  async function listComponents() {
    const result = await withBusy("list_components", async () => {
      const env = (await bridge!.listComponents()) as ComponentsListed;
      return env.payload;
    });
    if (result) {
      const summary = `${result.components.length} component(s): ${result.components
        .slice(0, 5)
        .map((c) => c.name)
        .join(", ")}${result.components.length > 5 ? "…" : ""}`;
      pushLog("info", summary);
    }
  }

  async function selectElement() {
    const result = await withBusy("select_element", async () => {
      const env = (await bridge!.selectElement()) as ElementSelected;
      return env.payload;
    });
    if (result) {
      pushLog(
        "info",
        `picked ${result.selector} (${Math.round(result.rect.width)}×${Math.round(
          result.rect.height,
        )}px${result.componentHint ? ` · ${result.componentHint}` : ""})`,
      );
    }
  }

  async function navigate() {
    const target = navigateInput.trim();
    if (!target) {
      pushLog("error", "navigate href is empty");
      return;
    }
    await withBusy(`navigate ${target}`, async () => bridge!.navigate(target));
  }

  async function screenshot() {
    // v1 of the agent returns a typed error for screenshot — surface it
    // honestly so the operator knows the limitation isn't a bug.
    await withBusy("screenshot", async () =>
      bridge!.screenshot({} as ScreenshotRequest["payload"]),
    );
  }

  return (
    <div
      data-surface-final-panel
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 320px",
        gap: "var(--space-3)",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", minHeight: 480 }}>
        <iframe
          ref={iframeRef}
          src={previewUrl}
          title="surface-final-preview"
          // Sandbox kept permissive for the agent's same-origin needs;
          // the bridge already validates origin + e.source so untrusted
          // frames can't satisfy our pending RPCs.
          style={{ width: "100%", height: "100%", border: "1px solid currentColor", borderRadius: 6 }}
        />
      </div>
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          padding: "var(--space-2)",
          border: "1px solid currentColor",
          borderRadius: 6,
          fontSize: "0.85em",
        }}
      >
        <div style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.75em" }}>
          surface final · operator
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
          <button type="button" onClick={ping} disabled={busy} style={btnStyle}>
            ping
          </button>
          <button type="button" onClick={listComponents} disabled={busy} style={btnStyle}>
            list components
          </button>
          <button type="button" onClick={selectElement} disabled={busy} style={btnStyle}>
            select element
          </button>
          <button type="button" onClick={screenshot} disabled={busy} style={btnStyle}>
            screenshot (v1: error)
          </button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <input
            type="text"
            value={navigateInput}
            onChange={(e) => setNavigateInput(e.target.value)}
            placeholder="/path or absolute URL"
            disabled={busy}
            style={{
              flex: 1,
              fontSize: "0.85em",
              padding: "4px 6px",
              border: "1px solid currentColor",
              borderRadius: 4,
              background: "transparent",
              color: "inherit",
            }}
          />
          <button type="button" onClick={navigate} disabled={busy} style={btnStyle}>
            go
          </button>
        </div>
        <div style={{ borderTop: "1px solid currentColor", paddingTop: 6, opacity: 0.85, flex: 1, overflowY: "auto" }}>
          {log.length === 0 ? (
            <div style={{ opacity: 0.5, fontStyle: "italic" }}>
              dispara um comando e o resultado aparece aqui
            </div>
          ) : (
            log.map((e) => (
              <div
                key={e.id}
                data-log-kind={e.kind}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.8em",
                  marginBottom: 2,
                  opacity: e.kind === "error" ? 1 : 0.85,
                }}
              >
                {e.kind === "ok" ? "✓ " : e.kind === "error" ? "✗ " : "· "}
                {e.text}
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  fontSize: "0.85em",
  padding: "4px 8px",
  border: "1px solid currentColor",
  borderRadius: 4,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};
