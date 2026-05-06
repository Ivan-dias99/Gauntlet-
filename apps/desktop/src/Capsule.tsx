// Desktop Capsule (Sprint 6).
//
// Mirrors apps/browser-extension/components/Capsule.tsx in identity and
// glass aesthetic; the differences are scoped to:
//   * context source = "desktop" (no URL / page text / dom_skeleton —
//     instead clipboard + active window title)
//   * no Executar button — there is no DOM to actuate against
//   * no dismiss-domain — that pref is browser-extension specific
//
// Backend wire contract is identical: /composer/{context,dom_plan,
// settings}. The cápsula is text-only on this surface; tool calls
// happen through the agent's existing /dev path which the desktop
// surface doesn't drive yet (Sprint 7+).

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ContextCaptureRequest,
  type DomPlanResult,
  DesktopComposerClient,
} from "./composer-client";
import {
  captureContextSnapshot,
  type DesktopContextSnapshot,
} from "./adapters/tauri";

type Phase = "idle" | "planning" | "ready" | "error";

export function Capsule({ onDismiss }: { onDismiss: () => void }) {
  const clientRef = useRef(new DesktopComposerClient());
  const [snapshot, setSnapshot] = useState<DesktopContextSnapshot | null>(null);
  const [userInput, setUserInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [plan, setPlan] = useState<DomPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Capture clipboard + window title at mount, refresh-able via the
  // re-read button. Sprint 6 desktop is text-only and doesn't yet
  // honour /composer/settings — when the desktop surface gains
  // screenshot_default and execution_reporting_required, the GET will
  // come back here.
  useEffect(() => {
    let cancelled = false;
    void captureContextSnapshot().then((snap) => {
      if (!cancelled) setSnapshot(snap);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        onDismiss();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onDismiss]);

  const refreshContext = useCallback(() => {
    void captureContextSnapshot().then(setSnapshot);
  }, []);

  const submit = useCallback(async () => {
    if (!userInput.trim() || phase === "planning") return;
    setPhase("planning");
    setPlan(null);
    setError(null);
    try {
      const capture: ContextCaptureRequest = {
        source: "desktop",
        clipboard: snapshot?.clipboard || undefined,
        window_title: snapshot?.windowTitle || undefined,
        app_name: "gauntlet-desktop",
      };
      const ctx = await clientRef.current.captureContext(capture);
      const result = await clientRef.current.requestDomPlan(
        ctx.context_id,
        userInput.trim(),
      );
      setPlan(result);
      setPhase("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("error");
    }
  }, [userInput, phase, snapshot]);

  const copy = useCallback(async () => {
    if (!plan?.compose) return;
    try {
      await navigator.clipboard.writeText(plan.compose);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("clipboard write blocked");
    }
  }, [plan]);

  const onTextareaKey = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key !== "Enter") return;
      if (ev.shiftKey) return;
      ev.preventDefault();
      void submit();
    },
    [submit],
  );

  return (
    <div className="gauntlet-capsule" role="dialog" aria-label="Gauntlet">
      <div className="gauntlet-capsule__aurora" aria-hidden />

      <div className="gauntlet-capsule__layout">
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--left">
          <header className="gauntlet-capsule__header">
            <div className="gauntlet-capsule__brand-block">
              <span className="gauntlet-capsule__mark" aria-hidden>
                <span className="gauntlet-capsule__mark-dot" />
              </span>
              <div className="gauntlet-capsule__brand-text">
                <span className="gauntlet-capsule__brand">GAUNTLET</span>
                <span className="gauntlet-capsule__tagline">desktop · capsule</span>
              </div>
            </div>
            <div className="gauntlet-capsule__header-actions">
              <button
                type="button"
                className="gauntlet-capsule__close"
                onClick={onDismiss}
                aria-label="Dismiss capsule (Esc)"
              >
                <span aria-hidden>esc</span>
              </button>
            </div>
          </header>

          <section className="gauntlet-capsule__context">
            <div className="gauntlet-capsule__context-meta">
              <span className="gauntlet-capsule__source">desktop</span>
              <span
                className="gauntlet-capsule__url"
                title={snapshot?.windowTitle || ""}
              >
                {snapshot?.windowTitle || "no window title"}
              </span>
              <button
                type="button"
                className="gauntlet-capsule__refresh"
                onClick={refreshContext}
                title="Re-read clipboard"
              >
                re-read
              </button>
            </div>
            {snapshot?.clipboard ? (
              <pre className="gauntlet-capsule__selection">
                {truncate(snapshot.clipboard, 600)}
              </pre>
            ) : (
              <p className="gauntlet-capsule__selection gauntlet-capsule__selection--empty">
                clipboard empty — input alone will be sent as context
              </p>
            )}
          </section>
        </div>

        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--right">
          <form
            className="gauntlet-capsule__form"
            onSubmit={(ev) => {
              ev.preventDefault();
              void submit();
            }}
          >
            <textarea
              ref={inputRef}
              className="gauntlet-capsule__input"
              placeholder="O que queres? — Enter para enviar, Shift+Enter nova linha"
              value={userInput}
              onChange={(ev) => setUserInput(ev.target.value)}
              onKeyDown={onTextareaKey}
              rows={2}
              disabled={phase === "planning"}
            />
            <div className="gauntlet-capsule__actions">
              <span className="gauntlet-capsule__hint" aria-hidden>
                <span className="gauntlet-capsule__kbd">↵</span>
              </span>
              <button
                type="submit"
                className="gauntlet-capsule__compose"
                disabled={phase === "planning" || !userInput.trim()}
              >
                {phase === "planning" ? (
                  <>
                    <span className="gauntlet-capsule__compose-spinner" aria-hidden />
                    <span>a pensar</span>
                  </>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </form>

          {plan?.compose && phase === "ready" && (
            <section className="gauntlet-capsule__compose-result">
              <header className="gauntlet-capsule__compose-meta">
                <span className="gauntlet-capsule__compose-tag">resposta</span>
                <span className="gauntlet-capsule__compose-meta-text">
                  {plan.model_used}
                  {" · "}
                  {plan.latency_ms} ms
                </span>
              </header>
              <div className="gauntlet-capsule__compose-text">{plan.compose}</div>
              <div className="gauntlet-capsule__compose-actions">
                <button
                  type="button"
                  className="gauntlet-capsule__copy"
                  onClick={() => void copy()}
                >
                  {copied ? "copiado ✓" : "Copy"}
                </button>
              </div>
            </section>
          )}

          {plan && !plan.compose && phase === "ready" && (
            <section className="gauntlet-capsule__plan">
              <p className="gauntlet-capsule__plan-empty">
                {plan.reason ?? "Modelo não devolveu resposta de texto."}
              </p>
            </section>
          )}

          {phase === "error" && error && (
            <div className="gauntlet-capsule__error" role="alert">
              <span className="gauntlet-capsule__error-icon" aria-hidden>!</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}
