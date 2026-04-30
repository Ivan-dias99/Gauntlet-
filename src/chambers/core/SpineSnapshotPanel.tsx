// Wave P-20 — Spine snapshot summary panel.
//
// Until now the spine snapshot was opaque from the UI: operators could
// inscribe doctrine, run missions, and accumulate notes/tasks/events
// without ever seeing the structural shape of what lived in memory or
// what had last been persisted. The closest surface — System ·
// Diagnostics — only reads `/diagnostics`, which is a backend boot
// snapshot, not the in-memory spine.
//
// This panel closes that gap. It mounts inside Core · System and
// renders a compact, read-only summary of the current SpineState:
//
//   * header with total JSON size in bytes (JSON.stringify(state).length),
//     `updatedAt` formatted, and snapshot age relative to now;
//   * principles count;
//   * per-mission breakdown table — title, counts of notes/tasks/events/
//     artifacts/handoffs/distillations, and the last note timestamp.
//
// No diff UI yet — that requires tracking two snapshots over time and
// is deferred to v2. This is the inspector half: see what's there, in
// one screen, before reasoning about deltas.
//
// Pure read-only consumer of useSpine.state; no fetches, no side
// effects. Visual grammar matches DoctrineTelemetryPanel in the same
// directory (.panel + panel-head + serif numerals + .kicker meta) so
// it composes cleanly inside the Core · System grid without a foreign
// island.
//
// Empty state explicit ("spine vazio — nenhuma missão") so a freshly
// reset spine reads as a deliberate state rather than a missing panel.

import { useMemo } from "react";
import { useSpine } from "../../spine/SpineContext";
import type { Mission } from "../../spine/types";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date} ${time}`;
}

function formatAge(ms: number): string {
  if (ms < 0) return "futuro";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s atrás`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m atrás`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h atrás`;
  const day = Math.floor(hr / 24);
  return `${day}d atrás`;
}

interface MissionBreakdown {
  id: string;
  title: string;
  notes: number;
  tasks: number;
  events: number;
  artifacts: number;
  handoffs: number;
  distillations: number;
  lastNoteAt: number | null;
}

function breakdownOf(m: Mission): MissionBreakdown {
  // Notes are stored newest-first by the spine store, so head is most
  // recent. Guard against an unexpected empty array.
  const head = m.notes[0];
  return {
    id: m.id,
    title: m.title,
    notes: m.notes.length,
    tasks: m.tasks.length,
    events: m.events.length,
    artifacts: m.artifacts.length,
    handoffs: m.handoffs?.length ?? 0,
    distillations: m.truthDistillations?.length ?? 0,
    lastNoteAt: head ? head.createdAt : null,
  };
}

export default function SpineSnapshotPanel() {
  const { state } = useSpine();

  // Memoize the JSON serialization so repaints triggered by unrelated
  // tweaks (theme, density) don't pay for it. The spine reference
  // changes on every mutation so this still recomputes when it must.
  const sizeBytes = useMemo(() => JSON.stringify(state).length, [state]);

  const missions = state.missions;
  const breakdowns = useMemo(() => missions.map(breakdownOf), [missions]);
  const ageMs = Date.now() - state.updatedAt;

  return (
    <section
      className="panel"
      data-rank="primary"
      data-spine-snapshot
      aria-label="resumo estrutural do spine"
    >
      <div className="panel-head">
        <span className="panel-title">snapshot do spine</span>
        <span className="panel-sub">
          {missions.length === 0
            ? "vazio"
            : missions.length === 1
              ? "1 missão"
              : `${missions.length} missões`}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-3)",
          paddingBottom: "var(--space-2)",
          borderBottom: "1px solid var(--border-color-soft)",
        }}
      >
        <Metric value={formatBytes(sizeBytes)} label="tamanho JSON" tone="accent" />
        <Metric value={formatDateTime(state.updatedAt)} label="updatedAt" />
        <Metric value={formatAge(ageMs)} label="idade" tone="muted" />
        <Metric
          value={state.principles.length}
          label={state.principles.length === 1 ? "princípio" : "princípios"}
          tone="muted"
        />
      </div>

      {breakdowns.length === 0 ? (
        <div
          style={{
            paddingTop: "var(--space-2)",
            fontFamily: "var(--serif)",
            fontSize: 14.5,
            lineHeight: 1.55,
            color: "var(--text-muted)",
            letterSpacing: "-0.005em",
          }}
        >
          spine vazio — nenhuma missão
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "var(--space-2)",
          }}
        >
          <div
            data-spine-snapshot-head
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr repeat(6, auto) 1fr",
              gap: 10,
              alignItems: "baseline",
              padding: "4px 0",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            <span>missão</span>
            <span title="notas">n</span>
            <span title="tarefas">t</span>
            <span title="eventos">e</span>
            <span title="artefactos">a</span>
            <span title="handoffs">h</span>
            <span title="distillations">d</span>
            <span style={{ textAlign: "right" }}>última nota</span>
          </div>
          {breakdowns.map((b) => (
            <div
              key={b.id}
              data-spine-snapshot-row
              data-mission-id={b.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr repeat(6, auto) 1fr",
                gap: 10,
                alignItems: "baseline",
                padding: "6px 0",
                borderTop: "1px solid var(--border-color-soft)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 14,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.005em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={b.title}
              >
                {b.title}
              </span>
              <Count v={b.notes} />
              <Count v={b.tasks} />
              <Count v={b.events} />
              <Count v={b.artifacts} />
              <Count v={b.handoffs} />
              <Count v={b.distillations} />
              <span
                className="kicker"
                data-tone="ghost"
                style={{
                  fontFamily: "var(--mono)",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "var(--track-meta)",
                  textAlign: "right",
                }}
              >
                {b.lastNoteAt ? formatDateTime(b.lastNoteAt) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Count({ v }: { v: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontVariantNumeric: "tabular-nums",
        fontSize: 13,
        color: v === 0 ? "var(--text-muted)" : "var(--text-primary)",
        textAlign: "right",
        minWidth: 18,
      }}
    >
      {v}
    </span>
  );
}

// Same Metric grammar as DoctrineTelemetryPanel so the two panels
// compose without visual seam when the operator scans the System tab.
function Metric({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone?: "accent" | "muted";
}) {
  const valueColor =
    tone === "accent"
      ? "var(--accent)"
      : tone === "muted"
        ? "var(--text-muted)"
        : "var(--text-primary)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 20,
          lineHeight: 1.1,
          color: valueColor,
          letterSpacing: "-0.01em",
          fontWeight: 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
      <span
        className="kicker"
        data-tone="ghost"
        style={{ letterSpacing: "var(--track-meta)" }}
      >
        {label}
      </span>
    </div>
  );
}
