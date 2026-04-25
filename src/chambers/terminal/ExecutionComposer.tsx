import { useEffect, useRef, useState } from "react";
import type { Copy, RunMode, Task } from "./helpers";

// Terminal command surface — Signal cockpit, two rows.
//
// Row 1 (command bar):  path · input · [context recent tools repo* connectors*] · send
// Row 2 (state rail):   backend · doutrina · agent/crew toggle
//   * repo + connectors are honest affordances. The flyouts state the
//     backend contract that has to land before they wire up. They never
//     show fake branches, fake repos or fake "GitHub connected" badges.
//
// Doctrine carried by every flyout: only enumerate state Terminal
// already has. No canned data. No fake features.
//
// Idle target height ≈ 72px (bar 44 + rail 28). Focused/pending only
// shifts the border tone and lights the thinking strip; no layout reflow.

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
}

type Flyout = null | "context" | "recent" | "tools" | "repo" | "connectors";

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
  const pathLabel = missionTitle
    ? missionTitle.length > 28 ? missionTitle.slice(0, 25).trimEnd() + "…" : missionTitle
    : "~/mission";

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
        {/* Row 1 — command bar. Single row, dense. */}
        <div className="term-command-bar">
          <span className="term-command-path" aria-hidden>
            <strong>signal</strong>
            <span className="term-command-path-sep"> · </span>
            <span className="term-command-path-tail">{pathLabel}</span>
          </span>

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
            {/* Honest "not wired" affordances — the flyout body documents
                the backend contract Signal is waiting on. No fake branch,
                no fake connector list. */}
            <button
              type="button"
              className="term-tool"
              data-wired="false"
              data-active={flyout === "repo" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "repo" ? null : "repo")}
              title={copy.termAffordRepo}
              aria-label="repo"
            >
              <IconRepo />
            </button>
            <button
              type="button"
              className="term-tool"
              data-wired="false"
              data-active={flyout === "connectors" ? "true" : undefined}
              onClick={() => setFlyout(flyout === "connectors" ? null : "connectors")}
              title={copy.termAffordConnectors}
              aria-label="connectors"
            >
              <IconConnectors />
            </button>

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
                <span style={{ fontSize: 13, lineHeight: 1 }}>…</span>
              ) : (
                <IconSend />
              )}
            </button>
          </div>
        </div>

        {/* Row 2 — state rail. Compact, single line. Backend mode +
            doctrine count + execution mode (agent/crew). Repo/connector
            state stays out of the rail until backend wires up — empty
            slot is honest, fake "live · main" is a lie. */}
        <div className="term-command-rail">
          <span
            className="term-rail-chip"
            data-tone={mockMode ? "warn" : "ok"}
            title={mockMode
              ? "backend em modo simulado — respostas canned"
              : "backend ligado — execução real"}
          >
            <span className="term-rail-dot" aria-hidden />
            <span className="term-rail-value">{mockMode ? "mock" : "live"}</span>
          </span>
          {principlesCount > 0 && (
            <span
              className="term-rail-chip"
              title="princípios em vigor que viajam com cada tarefa"
            >
              <span className="term-rail-glyph" aria-hidden>§</span>
              <span className="term-rail-value">
                {principlesCount} {principlesCount === 1 ? "princípio" : "princípios"}
              </span>
            </span>
          )}

          <span className="term-rail-spacer" />

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
          />
        )}
        {flyout === "recent" && (
          <RecentFlyout
            tasks={recentTasks}
            onPick={(t) => { onPickTask(t); setFlyout(null); }}
          />
        )}
        {flyout === "tools" && <ToolsFlyout />}
        {flyout === "repo" && (
          <NotWiredFlyout
            title={copy.termRepoNotWiredTitle}
            body={copy.termRepoNotWiredBody}
            contract={copy.termRepoNotWiredContract}
          />
        )}
        {flyout === "connectors" && (
          <NotWiredFlyout
            title={copy.termConnectorsNotWiredTitle}
            body={copy.termConnectorsNotWiredBody}
            contract={copy.termConnectorsNotWiredContract}
          />
        )}
      </div>
    </div>
  );
}

// ——— Flyouts ———

function ContextFlyout({
  principlesCount, priorTurns, mockMode, mode,
}: {
  principlesCount: number;
  priorTurns: number;
  mockMode: boolean;
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
        <span className="term-flyout-item-kicker">{mockMode ? "mock" : "live"}</span>
      </button>
      <button className="term-flyout-item" disabled>
        <span className="term-flyout-item-glyph">⚙</span>
        <span className="term-flyout-item-body">
          <span className="term-flyout-item-title">dispatch</span>
        </span>
        <span className="term-flyout-item-kicker">{mode}</span>
      </button>
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

// Honest "not wired" flyout — body says exactly what is missing and the
// contract waits for. No canned list, no fake call-to-action.
function NotWiredFlyout({
  title, body, contract,
}: {
  title: string;
  body: string;
  contract: string;
}) {
  return (
    <div className="term-flyout" role="menu" data-tone="not-wired">
      <div className="term-flyout-head">
        <span>{title}</span>
      </div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
        <p className="term-flyout-contract" aria-label="backend contract">
          <span className="term-flyout-contract-label">contract</span>
          <code>{contract}</code>
        </p>
      </div>
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
// Repo — git-style branch fork. Two nodes connected by a curved
// branch line. Reads as "version-controlled state".
function IconRepo() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M6 8.5v7" />
      <path d="M8.5 6h3a4 4 0 0 1 4 4v0" />
    </svg>
  );
}
// Connectors — two link nodes joined by a chain. Reads as "external
// integration", not a plug or a marketplace tile.
function IconConnectors() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M9 13a4 4 0 0 1 0-5.66l2-2a4 4 0 0 1 5.66 5.66l-1 1" />
      <path d="M15 11a4 4 0 0 1 0 5.66l-2 2a4 4 0 0 1-5.66-5.66l1-1" />
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
