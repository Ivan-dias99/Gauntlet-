// Desktop Capsule (Sprint 6, refining: identity unified with extension).
//
// Mirrors apps/browser-extension/components/Capsule.tsx in identity,
// glass aesthetic, markdown rendering, semantic phase colors, voice
// input, and command palette. The differences are scoped to:
//   * context source = "desktop" (clipboard + active window title)
//   * no Executar button — there is no DOM to actuate against
//   * no dismiss-domain — that pref is browser-extension specific
//
// Backend wire contract identical: /composer/{context,dom_plan,
// settings}. The cápsula is text-only on this surface; tool calls
// happen through the agent's existing /dev path which the desktop
// surface doesn't drive yet.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type ContextCaptureRequest,
  type DomPlanResult,
  DesktopComposerClient,
} from "./composer-client";
import {
  captureContextSnapshot,
  captureScreenRegion,
  type DesktopContextSnapshot,
} from "./adapters/tauri";
import { Markdown } from "./markdown";
import { isVoiceSupported, startVoice, type VoiceSession } from "./voice";

type Phase = "idle" | "planning" | "ready" | "error";

export function Capsule({ onDismiss }: { onDismiss: () => void }) {
  const clientRef = useRef(new DesktopComposerClient());
  const [snapshot, setSnapshot] = useState<DesktopContextSnapshot | null>(null);
  const [userInput, setUserInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [plan, setPlan] = useState<DomPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voiceRef = useRef<VoiceSession | null>(null);

  // Phase-aware className — drives the ambient glow color.
  const phaseClass = `gauntlet-capsule--phase-${phase === "ready" ? "plan_ready" : phase}`;

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

  const flashSaved = useCallback((label: string) => {
    setSavedFlash(label);
    window.setTimeout(() => setSavedFlash(null), 1400);
  }, []);

  const saveToMemory = useCallback(async () => {
    const body = plan?.compose || snapshot?.clipboard || userInput.trim();
    if (!body) {
      setError("Nada para guardar.");
      return;
    }
    const topic = (userInput.trim() || snapshot?.windowTitle || "desktop note").slice(
      0,
      200,
    );
    try {
      const res = await fetch(`${clientRef.current.backendUrl}/memory/records`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic, body, kind: "note", scope: "user" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      flashSaved("saved");
    } catch (err) {
      setError(err instanceof Error ? `memória: ${err.message}` : "memória: falhou");
    }
  }, [plan, snapshot, userInput, flashSaved]);

  // Voice input — same press-and-hold pattern as the extension.
  const startVoiceCapture = useCallback(() => {
    if (voiceRef.current) return;
    setError(null);
    const baseline = userInput;
    const session = startVoice({
      onPartial: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
      },
      onCommit: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
        setVoiceActive(false);
        voiceRef.current = null;
        inputRef.current?.focus();
      },
      onError: (msg) => {
        setError(msg);
        setVoiceActive(false);
        voiceRef.current = null;
      },
    });
    if (session) {
      voiceRef.current = session;
      setVoiceActive(true);
    }
  }, [userInput]);

  const stopVoiceCapture = useCallback(() => {
    voiceRef.current?.stop();
  }, []);

  const cancelVoiceCapture = useCallback(() => {
    voiceRef.current?.abort();
    voiceRef.current = null;
    setVoiceActive(false);
  }, []);

  useEffect(() => {
    return () => {
      voiceRef.current?.abort();
    };
  }, []);

  // Esc — layered escape; Cmd+K opens command palette.
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        if (paletteOpen) {
          setPaletteOpen(false);
          return;
        }
        if (voiceRef.current) {
          cancelVoiceCapture();
          return;
        }
        onDismiss();
        return;
      }
      if ((ev.metaKey || ev.ctrlKey) && (ev.key === "k" || ev.key === "K")) {
        ev.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onDismiss, paletteOpen, cancelVoiceCapture]);

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
    <div
      className={`gauntlet-capsule ${phaseClass}`}
      role="dialog"
      aria-label="Gauntlet"
    >
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
              <span className="gauntlet-capsule__source">
                {snapshot?.appName || "desktop"}
              </span>
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
                title="Re-read clipboard + active window"
              >
                re-read
              </button>
              <button
                type="button"
                className="gauntlet-capsule__refresh"
                onClick={async () => {
                  const path = await captureScreenRegion();
                  if (path) {
                    flashSaved(`shot → ${path.split("/").pop()}`);
                  } else {
                    setError(
                      "screenshot unavailable — install gnome-screenshot " +
                        "(Linux), grant accessibility (macOS), or use " +
                        "Win+Shift+S (Windows)",
                    );
                  }
                }}
                title="Interactive region screenshot"
              >
                shot
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
                <span className="gauntlet-capsule__kbd-sep">·</span>
                <span className="gauntlet-capsule__kbd">⌘K</span>
              </span>
              {isVoiceSupported() && (
                <button
                  type="button"
                  className={`gauntlet-capsule__voice${
                    voiceActive ? " gauntlet-capsule__voice--active" : ""
                  }`}
                  onPointerDown={(ev) => {
                    ev.preventDefault();
                    startVoiceCapture();
                  }}
                  onPointerUp={() => stopVoiceCapture()}
                  onPointerLeave={() => {
                    if (voiceActive) stopVoiceCapture();
                  }}
                  aria-label={voiceActive ? "A ouvir — solta para enviar" : "Premer e falar"}
                  title="Premir e falar"
                  disabled={phase === "planning"}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                    <path
                      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
                      fill="currentColor"
                    />
                    <path
                      d="M19 11a7 7 0 0 1-14 0M12 18v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="gauntlet-capsule__voice-label">
                    {voiceActive ? "a ouvir" : "voz"}
                  </span>
                </button>
              )}
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
              <div className="gauntlet-capsule__compose-text">
                <Markdown
                  source={plan.compose}
                  onCopyBlock={() => flashSaved("code copied")}
                />
              </div>
              <div className="gauntlet-capsule__compose-actions">
                <button
                  type="button"
                  className="gauntlet-capsule__copy"
                  onClick={() => void copy()}
                >
                  {copied ? "copiado ✓" : "Copy"}
                </button>
                <button
                  type="button"
                  className="gauntlet-capsule__copy gauntlet-capsule__copy--ghost"
                  onClick={() => void saveToMemory()}
                >
                  {savedFlash === "saved" ? "guardado ✓" : "Save"}
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

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          actions={[
            {
              id: "focus",
              label: "Focar input",
              shortcut: "↵",
              run: () => {
                setPaletteOpen(false);
                window.setTimeout(() => inputRef.current?.focus(), 0);
              },
            },
            {
              id: "copy",
              label: "Copiar resposta",
              shortcut: "⌘C",
              disabled: !plan?.compose,
              run: () => {
                setPaletteOpen(false);
                void copy();
              },
            },
            {
              id: "save",
              label: "Guardar em memória",
              shortcut: "S",
              disabled: !plan?.compose && !snapshot?.clipboard && !userInput.trim(),
              run: () => {
                setPaletteOpen(false);
                void saveToMemory();
              },
            },
            {
              id: "reread",
              label: "Re-ler clipboard",
              shortcut: "R",
              run: () => {
                setPaletteOpen(false);
                refreshContext();
              },
            },
            {
              id: "clear",
              label: "Limpar input",
              shortcut: "X",
              disabled: !userInput,
              run: () => {
                setPaletteOpen(false);
                setUserInput("");
                inputRef.current?.focus();
              },
            },
            {
              id: "dismiss",
              label: "Fechar cápsula",
              shortcut: "Esc",
              run: () => {
                setPaletteOpen(false);
                onDismiss();
              },
            },
          ]}
        />
      )}

      {savedFlash && (
        <div className="gauntlet-capsule__flash" role="status" aria-live="polite">
          {savedFlash}
        </div>
      )}
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "…";
}

interface PaletteAction {
  id: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
  run: () => void;
}

function CommandPalette({
  actions,
  onClose,
}: {
  actions: PaletteAction[];
  onClose: () => void;
}) {
  const [filter, setFilter] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visible = useMemo(
    () =>
      actions.filter((a) => a.label.toLowerCase().includes(filter.toLowerCase())),
    [actions, filter],
  );

  useEffect(() => {
    if (cursor >= visible.length) setCursor(0);
  }, [visible.length, cursor]);

  const onKey = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        setCursor((c) => Math.min(c + 1, visible.length - 1));
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        const action = visible[cursor];
        if (action && !action.disabled) action.run();
      }
    },
    [visible, cursor],
  );

  return (
    <div className="gauntlet-capsule__palette" role="dialog" aria-label="Command palette">
      <div className="gauntlet-capsule__palette-scrim" onClick={onClose} />
      <div className="gauntlet-capsule__palette-panel" onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="gauntlet-capsule__palette-input"
          type="text"
          placeholder="comandos…  (↑↓ para navegar, ↵ para correr, esc para fechar)"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
        />
        <ul className="gauntlet-capsule__palette-list" role="listbox">
          {visible.length === 0 ? (
            <li className="gauntlet-capsule__palette-empty">sem comandos</li>
          ) : (
            visible.map((a, i) => (
              <li
                key={a.id}
                role="option"
                aria-selected={i === cursor}
                aria-disabled={a.disabled}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  if (!a.disabled) a.run();
                }}
                className={`gauntlet-capsule__palette-item${
                  i === cursor ? " gauntlet-capsule__palette-item--active" : ""
                }${a.disabled ? " gauntlet-capsule__palette-item--disabled" : ""}`}
              >
                <span className="gauntlet-capsule__palette-label">{a.label}</span>
                <span className="gauntlet-capsule__palette-shortcut">{a.shortcut}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
