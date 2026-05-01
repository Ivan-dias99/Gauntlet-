import { useEffect, useRef, useState } from "react";
import type { Copy, RunMode, Task } from "./helpers";

// Terminal command surface — Signal cockpit.
//
// Visual grammar inherited from WorkbenchStrip (the bar that lives
// directly above): glyph block, mono label, mission with caret-down,
// italic status, hairline pill, mono family. The composer is the
// workbench's louder sibling — same family, but with an input dominant
// and the cockpit's full action set.
//
// Identity row (top):  [glyph] LABEL · MISSION ▾ · italic status
// Input row (middle):  $ [input dominant] [send]
// State rail (bottom): [+ ⏱ ⚒]    ● live · § N · agent | crew
//
// Composer owns only the live affordances that drive the next
// execution: Context, Recent, Tools, Mode, Send. The territory lenses
// (Repo, Diff, Build Gates, Deploy, Run Queue) live on the
// WorkbenchStrip above — they narrate the execution state, not the
// next command. Connectors moved out entirely; the connector registry
// belongs in Core/Routing when it lands. No tool is owned by both
// surfaces.
//
// Doctrine: only enumerate state Terminal already has. No canned data,
// no fake features.

interface Props {
  copy: Copy;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  missionTitle?: string | null;
  mode: RunMode;
  onModeChange: (m: RunMode) => void;
  recentTasks: Task[];
  onPickTask: (title: string) => void;
  principlesCount: number;
  priorTurns: number;
  mockMode: boolean;
  // Workbench owns territorial telemetry (Repo, Diff, Gates, Deploy,
  // Queue) and the BackendUnreachableBanner above carries the critical
  // backend story when broken. The composer only forwards readiness
  // detail into ContextFlyout for diagnostic deep-dive — it no longer
  // renders inline chips for any of this.
  backendReadiness: "ready" | "degraded" | "unreachable";
  backendReasons: string[];
  backendUnreachableReason: string | null;
  backendUnreachableDetail: string | null;
  persistenceEphemeral: boolean;
  onAttachContext: (kind: "note" | "prior-run" | "artifact") => void;
  hasArtifacts: boolean;
}

type Flyout = null | "context" | "recent" | "tools";

// Tools the Terminal chamber actually carries server-side. Mirrors the
// allowlist exposed in Core/Permissions. Read-only — this is a window
// into the backend posture, not a toggle.
const TERMINAL_TOOLS: Array<{ name: string; kind: string; gated?: boolean }> = [
  { name: "read_file",      kind: "fs" },
  { name: "list_directory", kind: "fs" },
  { name: "run_command",    kind: "cmd", gated: true },
  { name: "execute_python", kind: "cmd", gated: true },
  { name: "git",            kind: "vcs" },
  { name: "web_fetch",      kind: "net" },
  { name: "web_search",     kind: "net" },
];

export default function ExecutionComposer({
  copy, value, onChange, onSubmit, pending, missionTitle,
  mode, onModeChange, recentTasks, onPickTask,
  principlesCount, priorTurns, mockMode,
  backendReadiness, backendReasons, backendUnreachableReason,
  backendUnreachableDetail, persistenceEphemeral,
  onAttachContext, hasArtifacts,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [flyout, setFlyout] = useState<Flyout>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  useEffect(() => {
    if (!flyout) return;
    function onDoc(e: MouseEvent) {
      const el = shellRef.current;
      if (el && !el.contains(e.target as Node)) setFlyout(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [flyout]);

  const canSubmit = value.trim().length > 0 && !pending;
  const missionLabel = missionTitle
    ? missionTitle.length > 24 ? missionTitle.slice(0, 21).trimEnd() + "…" : missionTitle
    : null;

  return (
    <div
      data-architect-input="comando"
      data-architect-input-state={focused ? "focused" : "idle"}
      style={{ margin: "0 clamp(20px, 5vw, 64px) var(--space-3)" }}
    >
      <div
        ref={shellRef}
        className="term-command"
        data-focused={focused ? "true" : undefined}
        data-state={pending ? "pending" : undefined}
      >
        {/* Identity row — workbench-strip grammar transposed onto the
            composer. Traffic-light dots dropped: Signal does not need
            macOS chrome to feel like a terminal. The glyph block + label
            carry the identity; the dots were duplicating the workbench
            bar's job. */}
        <div className="term-command-id">
          <span className="term-command-glyph" aria-hidden>
            <IconShell />
          </span>
          <span className="term-command-id-label">{copy.termComposerLabel}</span>
          {missionLabel ? (
            <>
              <span className="term-command-id-sep" aria-hidden />
              <span className="term-command-id-mission">
                <span className="term-command-id-mission-label">
                  mission
                </span>
                <span className="term-command-id-mission-value">{missionLabel}</span>
                <span className="term-command-id-mission-caret" aria-hidden>
                  <IconCaret />
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="term-command-id-sep" aria-hidden />
              <span className="term-command-id-mission-null">
                {copy.termComposerPathRoot}
              </span>
            </>
          )}
          <span className="term-command-id-sep" aria-hidden />
          <span className="term-command-id-status" title={pending ? copy.termComposerStatusPending : copy.termComposerStatusIdle}>
            {pending ? copy.termComposerStatusPending : copy.termComposerStatusIdle}
          </span>
        </div>

        {/* Input row — the single dominant zone. The `$` prompt glyph
            is preserved as a small mono token (not the full
            signal@local:~/mission$ cosplay) so the input still reads
            as a command, not a chat textarea. */}
        <div className="term-command-input-row">
          <span className="term-command-input-prompt" aria-hidden>$</span>
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) onSubmit();
              if (e.key === "Escape") setFlyout(null);
            }}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            className="term-command-input"
            spellCheck={false}
            autoComplete="off"
            aria-label={copy.creationInputVoice}
          />
          <button
            type="button"
            className="term-command-send"
            data-state={pending ? "pending" : undefined}
            onClick={onSubmit}
            disabled={!canSubmit}
            title={pending ? "a executar" : "executar"}
            aria-label={pending ? "a executar" : "executar"}
          >
            {pending ? (
              <span style={{ fontSize: "var(--t-body)", lineHeight: 1 }}>…</span>
            ) : (
              <IconSend />
            )}
          </button>
        </div>

        {/* State rail — affordances on the left, posture chips and
            execution-mode toggle on the right. Repo + connectors are
            honest "not wired" buttons; the warn dot in their corner
            tells the user before clicking. */}
        <div className="term-command-rail">
          <div className="term-command-actions" role="toolbar" aria-label="composer affordances">
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "context" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "context" ? null : "context")}
              title={copy.termAffordContext}
              aria-label="context"
            >
              <IconPlus />
            </button>
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "recent" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "recent" ? null : "recent")}
              disabled={recentTasks.length === 0}
              title={copy.termAffordRecent}
              aria-label="recent"
            >
              <IconClock />
            </button>
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "tools" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "tools" ? null : "tools")}
              title={copy.termAffordTools}
              aria-label="tools"
            >
              <IconTools />
            </button>
            {/* Repo + Connectors moved out: Repo lives on the
                WorkbenchStrip above (Repo Lens); Connectors moves to
                Core/Routing when the registry lands. The composer
                only carries the live affordances that drive the next
                command. */}
          </div>

          <span className="term-rail-spacer" />

          {/* Live/mock/down dot — tiny posture indicator. Detailed
              backend state has migrated to the BackendUnreachableBanner
              (above workbench) and the context flyout. Unreachable
              wins over mockMode so an outage isn't masked as "live". */}
          {(() => {
            const isUnreachable = backendReadiness === "unreachable";
            const tone = isUnreachable ? "danger" : mockMode ? "warn" : "ok";
            const label = isUnreachable ? "down" : mockMode ? "mock" : "live";
            const title = isUnreachable
              ? "backend inalcançável — execução indisponível"
              : mockMode
              ? "backend em modo simulado — respostas canned"
              : "backend ligado — execução real";
            return (
              <span className="term-rail-chip" data-tone={tone} title={title}>
                <span className="term-rail-dot" aria-hidden />
                <span className="term-rail-value">{label}</span>
              </span>
            );
          })()}
          {principlesCount > 0 && (
            <span
              className="term-rail-chip"
              title="princípios em vigor que viajam com cada tarefa"
            >
              <span className="term-rail-glyph" aria-hidden>§</span>
              <span className="term-rail-value">{principlesCount}</span>
            </span>
          )}

          <span className="term-ws-spacer" />

          {/* Repo / Diff / Gates / Branch / Review removed: workbench
              owns territorial telemetry (Repo, Diff, Gates, Deploy,
              Queue lenses). Composer only carries what drives the next
              command. Honors the original WorkbenchStrip rule:
              "Workbench narrates territory, Composer drives action.
              No tool is owned by both surfaces." */}

          <div
            className="term-rail-mode"
            role="tablist"
            aria-label="execution mode"
            title="agent: loop iterativo · crew: planner → coder → critic"
          >
            {(["agent", "crew"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                className="term-rail-mode-opt"
                data-active={mode === m ? "true" : undefined}
                disabled={pending}
                onClick={() => onModeChange(m)}
                aria-selected={mode === m}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {pending && <div className="thinking-strip" aria-hidden />}

        {flyout === "context" && (
          <ContextFlyout
            principlesCount={principlesCount}
            priorTurns={priorTurns}
            mockMode={mockMode}
            mode={mode}
            backendReadiness={backendReadiness}
            backendReasons={backendReasons}
            backendUnreachableReason={backendUnreachableReason}
            backendUnreachableDetail={backendUnreachableDetail}
            persistenceEphemeral={persistenceEphemeral}
            onAttach={onAttachContext}
            hasArtifacts={hasArtifacts}
          />
        )}
        {flyout === "recent" && (
          <RecentFlyout
            tasks={recentTasks}
            onPick={(t) => { onPickTask(t); setFlyout(null); }}
          />
        )}
        {flyout === "tools" && <ToolsFlyout />}
      </div>
    </div>
  );
}

// ——— Flyouts ———

function ContextFlyout({
  principlesCount, priorTurns, mockMode, mode, backendReadiness, backendReasons,
  backendUnreachableReason, backendUnreachableDetail, persistenceEphemeral,
  onAttach, hasArtifacts,
}: {
  principlesCount: number;
  priorTurns: number;
  mockMode: boolean;
  mode: RunMode;
  backendReadiness: "ready" | "degraded" | "unreachable";
  backendReasons: string[];
  backendUnreachableReason: string | null;
  backendUnreachableDetail: string | null;
  persistenceEphemeral: boolean;
  onAttach: (kind: "note" | "prior-run" | "artifact") => void;
  hasArtifacts: boolean;
}) {
  return (
    <div className="term-flyout" role="menu">
      <div className="term-flyout-head">
        <span>contexto da próxima invocação</span>
      </div>
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">§</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">doutrina viaja com a tarefa</span>
        </span>
        <span className="term-flyout-item-kicker">{principlesCount}</span>
      </button>
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">⋯</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">turnos no contexto</span>
        </span>
        <span className="term-flyout-item-kicker">{Math.min(priorTurns, 8)}</span>
      </button>
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">●</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">backend</span>
        </span>
        <span className="term-flyout-item-kicker">{mockMode ? "mock" : backendReadiness}</span>
      </button>
      {backendUnreachableReason && (
        <button className="term-flyout-item" disabled title={backendUnreachableDetail ?? undefined}>
          <span className="term-flyout-item-glyph">⚠</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">
              {backendUnreachableReason === "backend_url_not_configured"
                ? "Vercel: defina SIGNAL_BACKEND_URL"
                : `unreachable: ${backendUnreachableReason}`}
            </span>
          </span>
          <span className="term-flyout-item-kicker">
            {backendUnreachableDetail
              ? backendUnreachableDetail.length > 32
                ? backendUnreachableDetail.slice(0, 29) + "…"
                : backendUnreachableDetail
              : "edge"}
          </span>
        </button>
      )}
      {backendReasons.length > 0 && (
        <button className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">!</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">readiness reasons</span>
          </span>
          <span className="term-flyout-item-kicker">{backendReasons.slice(0, 2).join(",")}</span>
        </button>
      )}
      {persistenceEphemeral && (
        <button className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">⚠</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">persistência ephemeral</span>
          </span>
          <span className="term-flyout-item-kicker">no volume</span>
        </button>
      )}
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">⚙</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">dispatch</span>
        </span>
        <span className="term-flyout-item-kicker">{mode}</span>
      </button>
      <button className="term-flyout-item" onClick={() => onAttach("note")}>
        <span className="term-flyout-item-glyph">＋</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">+ context note</span>
        </span>
        <span className="term-flyout-item-kicker">attach</span>
      </button>
      <button className="term-flyout-item" onClick={() => onAttach("prior-run")}>
        <span className="term-flyout-item-glyph">↺</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">+ prior run</span>
        </span>
        <span className="term-flyout-item-kicker">attach</span>
      </button>
      <button className="term-flyout-item" disabled={!hasArtifacts} onClick={() => onAttach("artifact")}>
        <span className="term-flyout-item-glyph">◆</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">+ artifact</span>
        </span>
        <span className="term-flyout-item-kicker">{hasArtifacts ? "attach" : "unavailable"}</span>
      </button>
    </div>
  );
}

function RecentFlyout({
  tasks, onPick,
}: {
  tasks: Task[];
  onPick: (title: string) => void;
}) {
  const shown = tasks.slice(0, 5);
  return (
    <div className="term-flyout" role="menu">
      <div className="term-flyout-head">
        <span>tarefas recentes</span>
        <span style={{ marginLeft: "auto", color: "var(--text-ghost)" }}>
          {tasks.length}
        </span>
      </div>
      {shown.length === 0 ? (
        <button className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">—</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">sem tarefas registadas</span>
          </span>
        </button>
      ) : (
        shown.map((t) => (
          <button
            key={t.id}
            className="term-flyout-item"
            onClick={() => onPick(t.title)}
            title={t.title}
          >
            <span className="term-flyout-item-glyph">›</span>
            <span className="term-flyout-item-body">
              <span className="term-flyout-item-title">{t.title}</span>
              <span className="term-flyout-item-meta">{t.state}</span>
            </span>
          </button>
        ))
      )}
    </div>
  );
}


function ToolsFlyout() {
  return (
    <div className="term-flyout" role="menu">
      <div className="term-flyout-head">
        <span>tools allowlist · terminal</span>
      </div>
      {TERMINAL_TOOLS.map((t) => (
        <button key={t.name} className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">⚒</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title" style={{ fontFamily: "var(--mono)" }}>
              {t.name}
            </span>
            <span className="term-flyout-item-meta">{t.kind}</span>
          </span>
          {t.gated && <span className="term-flyout-item-kicker" style={{ color: "var(--cc-warn)" }}>gated</span>}
        </button>
      ))}
    </div>
  );
}

// NotWiredFlyout (formerly used by Repo + Connectors composer
// affordances) is now owned by WorkbenchStrip's LensFlyout. The
// composer no longer carries any not-wired affordances — only live
// state (Context, Recent, Tools, Mode, Send).

// ——— Unified SVG icon set (composer) ———
// Same viewbox, same stroke width as the WorkbenchStrip icons so the
// Terminal chamber speaks one iconographic language.

const SVG_PROPS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Shell glyph — sibling to WorkbenchStrip's IconTerminal. Same stroke
// language, slightly bolder so the composer's identity reads from
// further away than the workbench bar above it.
function IconShell() {
  return (
    <svg {...SVG_PROPS} strokeWidth={2}>
      <path d="m4 9 3 3-3 3" />
      <path d="M10 15h10" />
    </svg>
  );
}
function IconCaret() {
  return (
    <svg {...SVG_PROPS} width={10} height={10}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconTools() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M14.7 6.3a4 4 0 1 0 5.3 5.3L22 10a8 8 0 0 1-10.5 10.5l-8-8A8 8 0 0 1 14 2l-1.7 1.7a4 4 0 0 0 2.4 2.6" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg
      width={13} height={13} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2.25}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}
