// Wave P-8 — Surface Final operator panel.
//
// Wave L (#234) shipped the chamber-side typed RPC (previewBridge);
// Wave P-5 (#245) shipped the iframe-side runtime (preview-agent).
// This panel is the operator's first surface that USES the bridge:
// embed a preview, ping it, list components, click-to-select an
// element, navigate. The result of each call lands inline so the
// operator can iterate on a candidate against a live preview.
//
// Wave P-28 — Visual diff first cut. The preview-agent now attempts
// html2canvas via dynamic import; if it's installed we get a real
// screenshot data URL. The chamber holds a "before" snapshot, lets
// the operator capture an "after", then POSTs both to /visual-diff
// and renders the returned bounding box overlaid on the after image.
// Full UX (region inspection, severity gating, side-by-side compare)
// is a follow-up wave; v1 is just the bbox preview.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PreviewBridge,
  type ScreenshotRequest,
  type ScreenshotResult,
  type ElementSelected,
  type ComponentsListed,
} from "../../lib/previewBridge";
import {
  signalFetch,
  isBackendUnreachable,
  compareScreenshots,
  type DiffResult,
} from "../../lib/signalApi";

// P-13 — issue draft form data. Populated from the most recent
// select_element pick; mission_id sticks across multiple drafts in
// the same session.
interface PickedElement {
  selector: string;
  text: string;
  componentHint?: string;
}

type IssueKind = "bug" | "polish" | "feature" | "regression" | "design" | "perf";
type IssueSeverity = "low" | "medium" | "high";

interface Props {
  /** URL the iframe should load. Caller is responsible for adding
   *  `?previewAgent=1` so the preview-agent runtime attaches. */
  previewUrl: string;
  /** Optional spine mission id to tag any issue draft created via
   *  the "report this" form. Used as IssueDraft.mission_id when
   *  posting to /issues/draft. */
  missionId?: string | null;
}

type LogEntry = {
  id: string;
  ts: number;
  kind: "info" | "ok" | "error";
  text: string;
};

export default function SurfaceFinalPanel({ previewUrl, missionId }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [bridge, setBridge] = useState<PreviewBridge | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [navigateInput, setNavigateInput] = useState("");
  // P-13 — issue draft form. `picked` is the most recent select_element
  // result; the form lifts state per pick. Submitting POSTs to
  // /issues/draft and clears the form so the operator can chain
  // multiple reports in one session.
  const [picked, setPicked] = useState<PickedElement | null>(null);
  const [issueKind, setIssueKind] = useState<IssueKind>("bug");
  const [issueSeverity, setIssueSeverity] = useState<IssueSeverity>("medium");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  // P-28 — visual diff state. `before`/`after` are screenshot data
  // URLs captured via the preview-agent's html2canvas RPC. `diff`
  // holds the most recent /visual-diff response so the panel can
  // render the bbox over the "after" image.
  const [diffBefore, setDiffBefore] = useState<ScreenshotResult["payload"] | null>(null);
  const [diffAfter, setDiffAfter] = useState<ScreenshotResult["payload"] | null>(null);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

  // Origin for the bridge — derived from the previewUrl so callers
  // can pass full URLs and the bridge does the right thing.
  const expectedOrigin = useMemo(() => {
    try {
      // Resolve relative URLs against the current document so
      // same-origin paths like "/preview?previewAgent=1" produce a
      // valid origin instead of throwing and leaving postMessage
      // with a non-origin string.
      return new URL(previewUrl, window.location.href).origin;
    } catch {
      // Last-resort fallback — postMessage requires a real origin,
      // so stick to the current document's origin rather than the
      // raw input string.
      return window.location.origin;
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
      // P-13 — populate the issue form. Default title from the
      // element's text (clipped); operator can edit before submit.
      setPicked({
        selector: result.selector,
        text: result.text,
        componentHint: result.componentHint,
      });
      // Codex thread #253: signal-backend's IssueDraftRequest.title
      // rejects > 200 chars; deep CSS selectors easily exceed that.
      // Cap the selector-based fallback the same way the text-based
      // branch is capped so the one-click flow never 422s.
      setIssueTitle(
        result.text
          ? `[fix this here] ${result.text.slice(0, 60)}${result.text.length > 60 ? "…" : ""}`
          : `[fix this here] ${result.selector.slice(0, 60)}${result.selector.length > 60 ? "…" : ""}`,
      );
      setIssueBody("");
    }
  }

  async function submitIssue() {
    if (!picked) return;
    if (busy) {
      pushLog("error", "another RPC is in flight");
      return;
    }
    const title = issueTitle.trim();
    if (!title) {
      pushLog("error", "issue title is empty");
      return;
    }
    setBusy(true);
    pushLog("info", `POST /issues/draft (${issueKind}/${issueSeverity})`);
    try {
      const res = await signalFetch("/issues/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body: issueBody || `Reported via Surface Final.\n\nSelector: ${picked.selector}`,
          kind: issueKind,
          severity: issueSeverity,
          chamber: "surface_final",
          mission_id: missionId ?? undefined,
          selector: picked.selector,
          provider: "github",
        }),
      });
      if (!res.ok) {
        pushLog("error", `issue draft → HTTP ${res.status}`);
        return;
      }
      const body = await res.json() as { provider: string; kwargs: Record<string, unknown> };
      pushLog("ok", `issue draft ready (${body.provider}) — labels: ${(body.kwargs.labels as string[] | undefined)?.join(", ") ?? "?"}`);
      setPicked(null);
      setIssueTitle("");
      setIssueBody("");
    } catch (e) {
      if (isBackendUnreachable(e)) {
        pushLog("error", "backend unreachable");
      } else {
        pushLog("error", (e as Error).message);
      }
    } finally {
      setBusy(false);
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
    // P-28 — agent now attempts html2canvas via dynamic import. If the
    // package isn't installed, the bridge rejects with a typed error
    // (`html2canvas_unavailable`); we surface that in the log without
    // crashing the panel. On success the result is left visible in the
    // log; the diff workflow uses captureBefore/After below.
    const env = (await withBusy("screenshot", async () =>
      bridge!.screenshot({} as ScreenshotRequest["payload"]),
    )) as ScreenshotResult | null;
    if (env?.payload) {
      pushLog("info", `screenshot ${env.payload.width}×${env.payload.height} captured`);
    }
  }

  // P-28 — capture-before / capture-after / compare. Each capture
  // re-runs the screenshot RPC; the result lives in component state
  // until the operator hits "compare" which POSTs to /visual-diff.
  async function captureScreenshotInto(
    label: "before" | "after",
  ): Promise<void> {
    const env = (await withBusy(`capture ${label}`, async () =>
      bridge!.screenshot({} as ScreenshotRequest["payload"]),
    )) as ScreenshotResult | null;
    if (!env?.payload) return;
    if (label === "before") {
      setDiffBefore(env.payload);
      setDiffResult(null);
    } else {
      setDiffAfter(env.payload);
      setDiffResult(null);
    }
    pushLog("info", `${label} = ${env.payload.width}×${env.payload.height}`);
  }

  async function runVisualDiff(): Promise<void> {
    if (!diffBefore || !diffAfter) {
      pushLog("error", "need both before + after to diff");
      return;
    }
    if (busy) {
      pushLog("error", "another RPC is in flight");
      return;
    }
    setBusy(true);
    pushLog("info", "POST /visual-diff");
    try {
      const result = await compareScreenshots(diffBefore.dataUrl, diffAfter.dataUrl);
      setDiffResult(result);
      pushLog(
        "ok",
        `diff ratio=${(result.ratio * 100).toFixed(2)}% sev=${result.severity} regions=${result.regions.length}`,
      );
    } catch (e) {
      if (isBackendUnreachable(e)) {
        pushLog("error", "backend unreachable");
      } else {
        pushLog("error", (e as Error).message);
      }
    } finally {
      setBusy(false);
    }
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
            screenshot
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

        {/* P-13 — issue draft form, populated after select_element. */}
        {picked && (
          <div
            data-issue-form
            style={{
              borderTop: "1px solid currentColor",
              paddingTop: 6,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ fontSize: "0.7em", opacity: 0.65, fontFamily: "var(--mono)" }}>
              picked: {picked.selector.slice(0, 50)}
              {picked.selector.length > 50 ? "…" : ""}
            </div>
            <input
              type="text"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              disabled={busy}
              placeholder="issue title"
              style={fieldStyle}
            />
            <textarea
              value={issueBody}
              onChange={(e) => setIssueBody(e.target.value)}
              disabled={busy}
              placeholder="why is this wrong? what should it look like?"
              rows={3}
              style={{ ...fieldStyle, resize: "vertical", fontFamily: "inherit" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              <select
                value={issueKind}
                onChange={(e) => setIssueKind(e.target.value as IssueKind)}
                disabled={busy}
                style={fieldStyle}
              >
                <option value="bug">bug</option>
                <option value="polish">polish</option>
                <option value="feature">feature</option>
                <option value="regression">regression</option>
                <option value="design">design</option>
                <option value="perf">perf</option>
              </select>
              <select
                value={issueSeverity}
                onChange={(e) => setIssueSeverity(e.target.value as IssueSeverity)}
                disabled={busy}
                style={fieldStyle}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button type="button" onClick={submitIssue} disabled={busy} style={{ ...btnStyle, flex: 1 }}>
                report (POST /issues/draft)
              </button>
              <button
                type="button"
                onClick={() => { setPicked(null); setIssueTitle(""); setIssueBody(""); }}
                disabled={busy}
                style={btnStyle}
              >
                cancel
              </button>
            </div>
          </div>
        )}

        {/* P-28 — visual diff. Capture before, capture after, compare. */}
        <div
          data-visual-diff
          style={{
            borderTop: "1px solid currentColor",
            paddingTop: 6,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ fontSize: "0.7em", opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            visual diff
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            <button type="button" onClick={() => captureScreenshotInto("before")} disabled={busy} style={btnStyle}>
              before {diffBefore ? "✓" : ""}
            </button>
            <button type="button" onClick={() => captureScreenshotInto("after")} disabled={busy} style={btnStyle}>
              after {diffAfter ? "✓" : ""}
            </button>
            <button
              type="button"
              onClick={runVisualDiff}
              disabled={busy || !diffBefore || !diffAfter}
              style={btnStyle}
            >
              compare
            </button>
          </div>
          {diffResult && diffAfter && (
            <div data-visual-diff-preview style={{ position: "relative", maxWidth: "100%" }}>
              <img
                src={diffAfter.dataUrl}
                alt="after"
                style={{ width: "100%", display: "block", border: "1px solid currentColor", borderRadius: 4 }}
              />
              {diffResult.regions.map((r, i) => {
                // Region coords are in source-pixel space; the rendered
                // <img> may be scaled. Normalise via the result.width/
                // height so the bbox aligns regardless of CSS scaling.
                const sx = diffResult.width || 1;
                const sy = diffResult.height || 1;
                return (
                  <div
                    key={i}
                    data-diff-region
                    style={{
                      position: "absolute",
                      left: `${(r.x / sx) * 100}%`,
                      top: `${(r.y / sy) * 100}%`,
                      width: `${(r.width / sx) * 100}%`,
                      height: `${(r.height / sy) * 100}%`,
                      outline: "2px solid #f33",
                      background: "rgba(255,51,51,0.12)",
                      pointerEvents: "none",
                    }}
                  />
                );
              })}
              <div style={{ fontSize: "0.7em", opacity: 0.65, marginTop: 2, fontFamily: "var(--mono)" }}>
                ratio={(diffResult.ratio * 100).toFixed(2)}% ·
                changed={diffResult.changed_pixels}/{diffResult.total_pixels} ·
                sev={diffResult.severity}
                {diffResult.note ? ` · ${diffResult.note}` : ""}
              </div>
            </div>
          )}
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

const fieldStyle: React.CSSProperties = {
  fontSize: "0.85em",
  padding: "4px 6px",
  border: "1px solid currentColor",
  borderRadius: 4,
  background: "transparent",
  color: "inherit",
};
