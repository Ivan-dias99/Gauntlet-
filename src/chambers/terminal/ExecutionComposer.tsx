import { useEffect, useRef, useState } from "react";
import type { Copy, RunMode, Task } from "./helpers";
import { useDiagnostics, type SignalToolDescriptor } from "../../hooks/useDiagnostics";
import type { BackendReadiness } from "../../hooks/useBackendStatus";
import {
  validateMissionTitle,
  explainMissionRejection,
  type MissionRejectionReason,
} from "../../spine/validation";

// Terminal Mission Composer.
//
// The dominant entry point of the chamber. The mission strip on top
// communicates whether the next submit declares a new task in an
// active mission or whether a mission must be opened first. The
// validator gates garbage tokens before they reach the backend, so
// "jhjhjj," cannot become a task.
//
// Chrome bar carries the path + phase + four flyouts (context, recent,
// tools, mode); body row carries the prompt + input + send; workspace
// bar at the bottom shows the chamber/mission/backend chips. All
// flyouts are honest enumerations of state Terminal already has.

interface Props {
  copy: Copy;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  pending: boolean;
  missionTitle?: string | null;
  hasActiveMission: boolean;
  mode: RunMode;
  onModeChange: (m: RunMode) => void;
  recentTasks: Task[];
  onPickTask: (title: string) => void;
  principlesCount: number;
  priorTurns: number;
  readiness: BackendReadiness;
  onOpenMissionInInsight?: () => void;
}

type Flyout = null | "context" | "recent" | "tools";

export default function ExecutionComposer({
  copy, value, onChange, onSubmit, pending, missionTitle, hasActiveMission,
  mode, onModeChange, recentTasks, onPickTask,
  principlesCount, priorTurns, readiness, onOpenMissionInInsight,
}: Props) {
  const diagnostics = useDiagnostics();
  // Local rejection surface for the task-quality gate. Same validator as
  // mission creation — empty / nonsense / repeat-mash inputs never reach
  // the backend. Cleared as soon as the user edits the input.
  const [rejection, setRejection] = useState<MissionRejectionReason | null>(null);
  const terminalTools: SignalToolDescriptor[] | null =
    diagnostics.status === "ok"
      ? diagnostics.data.tools.filter((t) => t.chambers.includes("terminal"))
      : null;
  const readinessLabel: Record<BackendReadiness, string> = {
    ready_real: "live",
    mock: "mock",
    degraded: "degraded",
    unreachable: "unreachable",
  };
  const readinessTone: Record<BackendReadiness, "ok" | "warn"> = {
    ready_real: "ok",
    mock: "warn",
    degraded: "warn",
    unreachable: "warn",
  };
  const readinessTitle: Record<BackendReadiness, string> = {
    ready_real: "backend ligado · execução real",
    mock: "backend em modo simulado · respostas canned",
    degraded: "backend degradado · provenance comprometida",
    unreachable: "backend inacessível · operação local apenas",
  };
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

  const canSubmit = value.trim().length > 0 && !pending && hasActiveMission;
  const pathLabel = missionTitle
    ? missionTitle.length > 36 ? missionTitle.slice(0, 33).trimEnd() + "…" : missionTitle
    : "~/mission";

  // Mission Composer gate: validates the task title before it ever
  // reaches the backend. Nonsense like "jhjhjj," is rejected with a
  // typed reason instead of becoming a real run. The active-mission
  // requirement is also enforced here so Terminal cannot fire tasks
  // into the void.
  function handleSubmit() {
    if (!canSubmit) return;
    if (!hasActiveMission) {
      setRejection("too_short");
      return;
    }
    const verdict = validateMissionTitle(value.trim());
    if (!verdict.ok) {
      setRejection(verdict.reason);
      return;
    }
    setRejection(null);
    onSubmit();
  }

  function handleChange(v: string) {
    if (rejection !== null) setRejection(null);
    onChange(v);
  }

  return (
    <div
      data-architect-input="comando"
      data-architect-input-state={focused ? "focused" : "idle"}
      style={{ margin: "0 clamp(20px, 5vw, 64px) var(--space-3)" }}
    >
      <MissionStrip
        hasActiveMission={hasActiveMission}
        missionTitle={missionTitle ?? null}
        onOpenInsight={onOpenMissionInInsight}
        rejection={rejection}
      />
      <div
        ref={shellRef}
        className="term-command"
        data-focused={focused ? "true" : undefined}
        data-state={pending ? "pending" : undefined}
      >
      <div className="term-command-deck">
        <div className="term-command-chrome">
          <span className="term-command-dots" aria-hidden>
            <span /><span /><span />
          </span>
          <span className="term-command-path">
            <strong>signal</strong>
            <span style={{ color: "var(--text-muted)" }}> · </span>
            <span style={{ color: "var(--cc-path)" }}>{pathLabel}</span>
          </span>
          <div className="term-command-tools">
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "context" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "context" ? null : "context")}
              title="contexto · sinais que viajam com cada tarefa"
              aria-label="contexto"
            >
              <IconPlus />
            </button>
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "recent" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "recent" ? null : "recent")}
              disabled={recentTasks.length === 0}
              title="recentes · últimas tarefas desta missão"
              aria-label="recentes"
            >
              <IconClock />
            </button>
            <button
              type="button"
              className="term-tool"
              data-active={flyout === "tools" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "tools" ? null : "tools")}
              title="tools · allowlist desta câmara"
              aria-label="tools"
            >
              <IconTools />
            </button>
          </div>
          <span className="term-command-phase" aria-live="polite">
            {pending ? "exec" : "pronto"}
          </span>
        </div>

        <div className="term-command-body">
          <span className="term-command-prompt" aria-hidden>
            <span className="term-command-prompt-user">signal@local</span>
            <span className="term-command-prompt-sep">:</span>
            <span className="term-command-prompt-path">~/mission</span>
            <span className="term-command-prompt-sep">$</span>
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSubmit();
              if (e.key === "Escape") setFlyout(null);
            }}
            placeholder={
              pending
                ? copy.creationRunning
                : !hasActiveMission
                  ? "missão exigida · abre uma em Insight para declarar tarefas"
                  : copy.creationPlaceholder
            }
            disabled={pending || !hasActiveMission}
            className="term-command-input"
            spellCheck={false}
            autoComplete="off"
            aria-label={copy.creationInputVoice}
          />
          <button
            type="button"
            className="term-command-send"
            data-state={pending ? "pending" : undefined}
            onClick={handleSubmit}
            disabled={!canSubmit}
            title={
              pending
                ? "a executar"
                : !hasActiveMission
                  ? "abre uma missão em Insight"
                  : "declarar tarefa"
            }
            aria-label={
              pending
                ? "a executar"
                : !hasActiveMission
                  ? "abre uma missão em Insight"
                  : "declarar tarefa"
            }
          >
            {pending ? (
              <span style={{ fontSize: 14, lineHeight: 1 }}>…</span>
            ) : (
              <IconSend />
            )}
          </button>
        </div>

        {/* Workspace bar — three deliberate groups:
            · identity  (câmara · missão)
            · state     (backend · doutrina)
            · mode      (agent / crew toggle)
            Separated by hairline dividers so the chips read as one
            coherent family, not a random cluster. */}
        <div className="term-command-workspace">
          <div className="term-ws-group" aria-label="identidade">
            <span
              className="term-ws-chip"
              title="câmara ativa"
            >
              <span className="term-ws-chip-glyph" aria-hidden>›_</span>
              <span className="term-ws-chip-label">câmara</span>
              <span className="term-ws-chip-value">terminal</span>
            </span>
            <span
              className="term-ws-chip"
              data-role="primary"
              title="missão atual"
            >
              <span className="term-ws-chip-glyph" aria-hidden>◆</span>
              <span className="term-ws-chip-label">missão</span>
              <span className="term-ws-chip-value">
                {missionTitle
                  ? missionTitle.length > 32 ? missionTitle.slice(0, 29).trimEnd() + "…" : missionTitle
                  : "sem missão"}
              </span>
            </span>
          </div>

          <span className="term-ws-divider" aria-hidden />

          <div className="term-ws-group" aria-label="estado">
            <span
              className="term-ws-chip"
              data-tone={readinessTone[readiness]}
              title={readinessTitle[readiness]}
            >
              <span className="term-ws-chip-glyph" aria-hidden>●</span>
              <span className="term-ws-chip-label">backend</span>
              <span className="term-ws-chip-value">
                {readinessLabel[readiness]}
              </span>
            </span>
            {principlesCount > 0 && (
              <span
                className="term-ws-chip"
                title="princípios em vigor que viajam com cada tarefa"
              >
                <span className="term-ws-chip-glyph" aria-hidden>§</span>
                <span className="term-ws-chip-label">doutrina</span>
                <span className="term-ws-chip-value">
                  {principlesCount} {principlesCount === 1 ? "princípio" : "princípios"}
                </span>
              </span>
            )}
          </div>

          <span className="term-ws-spacer" />

          <div
            className="term-ws-mode"
            role="tablist"
            aria-label="execution mode"
            title="agent: loop iterativo · crew: planner → coder → critic"
          >
            {(["agent", "crew"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                className="term-ws-mode-opt"
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
      </div>

        {flyout === "context" && (
          <ContextFlyout
            principlesCount={principlesCount}
            priorTurns={priorTurns}
            readiness={readiness}
            readinessLabel={readinessLabel[readiness]}
            mode={mode}
          />
        )}
        {flyout === "recent" && (
          <RecentFlyout
            tasks={recentTasks}
            onPick={(t) => { onPickTask(t); setFlyout(null); }}
          />
        )}
        {flyout === "tools" && (
          <ToolsFlyout
            tools={terminalTools}
            unreachable={diagnostics.status !== "ok"}
          />
        )}
      </div>
    </div>
  );
}

// ——— Flyouts ———

function ContextFlyout({
  principlesCount, priorTurns, readiness, readinessLabel, mode,
}: {
  principlesCount: number;
  priorTurns: number;
  readiness: BackendReadiness;
  readinessLabel: string;
  mode: RunMode;
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
        <span
          className="term-flyout-item-kicker"
          style={
            readiness === "ready_real"
              ? undefined
              : { color: "var(--cc-warn)" }
          }
        >
          {readinessLabel}
        </span>
      </button>
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">⚙</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">dispatch</span>
        </span>
        <span className="term-flyout-item-kicker">{mode}</span>
      </button>
      {/* Honest media slot — the affordance is visually present; the
          wire to the backend is not yet ready. No fake upload flow. */}
      <button
        className="term-flyout-item"
        disabled
        title="upload de ficheiros e capturas — ligação ao backend pendente"
      >
        <span className="term-flyout-item-glyph">◈</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">media · ficheiros · capturas</span>
          <span className="term-flyout-item-meta">em breve</span>
        </span>
        <span className="term-flyout-item-kicker">—</span>
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


function ToolsFlyout({
  tools, unreachable,
}: {
  tools: SignalToolDescriptor[] | null;
  unreachable: boolean;
}) {
  return (
    <div className="term-flyout" role="menu">
      <div className="term-flyout-head">
        <span>tools allowlist · terminal</span>
      </div>
      {unreachable || tools === null ? (
        <button className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">—</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">registry unavailable</span>
            <span className="term-flyout-item-meta">backend não respondeu</span>
          </span>
        </button>
      ) : tools.length === 0 ? (
        <button className="term-flyout-item" disabled>
          <span className="term-flyout-item-glyph">—</span>
          <span className="term-flyout-item-body">
            <span className="term-flyout-item-title">sem tools nesta câmara</span>
          </span>
        </button>
      ) : (
        tools.map((t) => (
          <button key={t.name} className="term-flyout-item" disabled>
            <span className="term-flyout-item-glyph">⚒</span>
            <span className="term-flyout-item-body">
              <span className="term-flyout-item-title" style={{ fontFamily: "var(--mono)" }}>
                {t.name}
              </span>
              <span className="term-flyout-item-meta">{t.kind}</span>
            </span>
            {t.gated && (
              <span className="term-flyout-item-kicker" style={{ color: "var(--cc-warn)" }}>
                gated
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
}

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
function IconDot() {
  return (
    <span
      aria-hidden
      style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "currentColor",
        display: "inline-block",
      }}
    />
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _iconsExport = { IconPlus, IconClock, IconTools, IconSend, IconDot };

// ── Mission Strip ───────────────────────────────────────────────────────────
//
// Sits above the command shell so the user always knows the next submit
// declares a task within an existing mission — not a free-floating chat.
// Two states: continue (active mission) and gate (no mission). The gate
// state offers a one-click jump to Insight where missions originate.

function MissionStrip({
  hasActiveMission, missionTitle, onOpenInsight, rejection,
}: {
  hasActiveMission: boolean;
  missionTitle: string | null;
  onOpenInsight: (() => void) | undefined;
  rejection: MissionRejectionReason | null;
}) {
  if (!hasActiveMission) {
    return (
      <div
        data-terminal-mission-strip
        data-state="gate"
        role="alert"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          marginBottom: 8,
          border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
          borderRadius: "var(--radius-control)",
          background: "color-mix(in oklab, var(--cc-warn) 6%, transparent)",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--cc-warn)",
        }}
      >
        <span aria-hidden>◆</span>
        <span>missão exigida</span>
        <span
          style={{
            color: "var(--text-muted)",
            textTransform: "none",
            letterSpacing: 0,
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
          }}
        >
          Terminal declara tarefas dentro de uma missão · abre uma em Insight para começar.
        </span>
        <span style={{ flex: 1 }} aria-hidden />
        {onOpenInsight && (
          <button
            type="button"
            onClick={onOpenInsight}
            className="btn-chip"
            data-variant="ghost"
            style={{ fontSize: 11 }}
          >
            abrir Insight →
          </button>
        )}
      </div>
    );
  }
  const trimmed =
    missionTitle && missionTitle.length > 60
      ? missionTitle.slice(0, 57).trimEnd() + "…"
      : missionTitle ?? "—";
  return (
    <div
      data-terminal-mission-strip
      data-state={rejection ? "rejected" : "continue"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 12px",
        marginBottom: 8,
        borderBottom: "1px solid var(--border-color-soft)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: rejection ? "var(--cc-warn)" : "var(--text-ghost)",
      }}
    >
      <span aria-hidden>◆</span>
      <span>missão activa</span>
      <span
        style={{
          color: "var(--text-secondary)",
          textTransform: "none",
          letterSpacing: 0,
          fontFamily: "var(--serif)",
          fontSize: "var(--t-body-sec)",
          maxWidth: "min(60ch, 60%)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {trimmed}
      </span>
      <span style={{ flex: 1 }} aria-hidden />
      <span style={{ opacity: 0.7 }}>
        {rejection
          ? `tarefa não ratificada · ${explainMissionRejection(rejection)}`
          : "envio declara tarefa"}
      </span>
    </div>
  );
}
