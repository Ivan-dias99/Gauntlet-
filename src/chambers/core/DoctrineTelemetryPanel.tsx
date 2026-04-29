// Wave P-17 — Doctrine application telemetry panel.
//
// The spine has emitted `doctrine_applied` LogEvents since the doctrine
// pillar landed (see `logDoctrineApplied` in src/spine/store.ts) — they
// fire whenever Insight or Terminal submits a request that carries the
// active principles in the payload. Until now those events were silent:
// the operator saw a "doutrina inscrita" toast on inscription and
// nothing afterwards, so it was impossible to tell at a glance whether
// the doctrine was actually governing N requests in the active mission
// or merely sitting on the constitutional register.
//
// This panel closes that loop. It reads the active mission's events,
// filters to `doctrine_applied`, and renders a small timeline:
//   * total applications in this mission;
//   * timestamp of the last firing;
//   * last 7 firings with timestamp + label, where the label encodes
//     how many principles were governing that invocation
//     (label format from store.ts: "Doutrina aplicada: N princípio[s]").
//
// Mounted in Core · Policies because doctrine is a policy concern; the
// existing aggregate metrics in that page (totalApplications,
// missionsGoverned, lastApplied) describe the constitution as a whole,
// while this panel narrates the per-mission timeline so the operator
// can audit when the doctrine actually reached the brain for the
// mission they are working in.
//
// Pure read-only consumer of useSpine; no fetches, no side effects.
// Empty state explicit so an active mission with zero firings reads as
// "doutrina não governou ainda" rather than as a missing panel.
//
// Visual grammar matches Policies.tsx (.panel + .panel-head + serif
// headline + .kicker meta) so this section reads as a continuation of
// the Policies tab, not a foreign island.

import { useSpine } from "../../spine/SpineContext";
import type { LogEvent } from "../../spine/types";

const LAST_N = 7;

// Label format produced by `logDoctrineApplied` in store.ts:
//   "Doutrina aplicada: N princípio" / "Doutrina aplicada: N princípios"
// Parse the leading integer back so the row can show how many
// principles were governing at that firing. If the label was edited or
// is otherwise unrecognizable the pill falls back to "?".
const COUNT_FROM_LABEL = /^Doutrina aplicada:\s*(\d+)/;

function parsePrincipleCount(label: string): number | null {
  const match = COUNT_FROM_LABEL.exec(label);
  if (!match) return null;
  const n = Number.parseInt(match[1] ?? "", 10);
  return Number.isFinite(n) ? n : null;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const date = d.toLocaleDateString([], { month: "2-digit", day: "2-digit" });
  return `${date} ${formatTime(ts)}`;
}

export default function DoctrineTelemetryPanel() {
  const { activeMission } = useSpine();

  // No mission active — surface nothing rather than a misleading empty
  // state. The Policies tab already handles the no-mission case at the
  // page level via DormantPanel / core-empty.
  if (!activeMission) return null;

  const applications: LogEvent[] = activeMission.events.filter(
    (e) => e.type === "doctrine_applied",
  );

  // Mission events are stored newest-first (see store.ts log(...)),
  // so the head of the array is the most recent firing.
  const lastFired = applications[0] ?? null;
  const recent = applications.slice(0, LAST_N);

  return (
    <section
      className="panel"
      data-rank="primary"
      data-doctrine-telemetry
      style={{ maxWidth: 860, marginInline: "auto", width: "100%" }}
      aria-label="telemetria da doutrina nesta missão"
    >
      <div className="panel-head">
        <span className="panel-title">telemetria da doutrina</span>
        <span className="panel-sub">
          {applications.length === 0
            ? "esta missão"
            : applications.length === 1
              ? "1 invocação registada"
              : `${applications.length} invocações registadas`}
        </span>
      </div>

      {applications.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 14.5,
            lineHeight: 1.55,
            color: "var(--text-muted)",
            letterSpacing: "-0.005em",
          }}
        >
          Doutrina ainda não governou nenhum pedido nesta missão.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            <Metric
              value={applications.length}
              label={
                applications.length === 1 ? "invocação total" : "invocações totais"
              }
              tone="accent"
            />
            <Metric
              value={lastFired ? formatTime(lastFired.at) : "—"}
              label="última invocação"
            />
            <Metric
              value={Math.min(applications.length, LAST_N)}
              label={`últimas (até ${LAST_N})`}
              tone="muted"
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "var(--space-2)",
              borderTop: "1px solid var(--border-color-soft)",
            }}
          >
            {recent.map((ev) => {
              const count = parsePrincipleCount(ev.label);
              return (
                <div
                  key={ev.id}
                  data-doctrine-telemetry-row
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 10,
                    alignItems: "baseline",
                    padding: "6px 0",
                    borderTop: "1px solid var(--border-color-soft)",
                  }}
                >
                  <span
                    className="kicker"
                    data-tone="ghost"
                    style={{
                      fontFamily: "var(--mono)",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "var(--track-meta)",
                    }}
                  >
                    {formatDateTime(ev.at)}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 14,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {ev.label}
                  </span>
                  <span
                    className="state-pill"
                    data-tone={count != null && count > 0 ? "ok" : "warn"}
                    title={
                      count != null
                        ? `${count} princípio${count === 1 ? "" : "s"} governavam`
                        : "contagem indisponível"
                    }
                  >
                    <span className="state-pill-dot" />
                    {count != null
                      ? `${count} princ.`
                      : "?"}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

// Small metric tile — same grammar as the Metric helper in Policies.tsx
// (serif numeral, ghost kicker label) so the two sections compose
// without visual seam.
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
          fontSize: 22,
          lineHeight: 1,
          color: valueColor,
          letterSpacing: "-0.01em",
          fontWeight: 400,
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
