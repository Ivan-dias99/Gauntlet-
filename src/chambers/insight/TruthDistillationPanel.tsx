import { useCallback, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useSignal, type DistillEvent, type DistillTruthPayload } from "../../hooks/useSignal";
import { activeTruthDistillation, type TruthDistillation } from "../../spine/types";
import { fireTelemetry } from "../../lib/telemetry";

// Wave 6a — Truth Distillation panel.
//
// Lives between the conversation thread and the composer in Insight.
// Three operating states:
//   1. No distillation yet → show "Distill Truth" CTA
//   2. Distillation generating → show pending pulse
//   3. Distillation present → show summary, seeds preview, accept/refine/stale
//
// Versioning is server-side bookkeeping; the panel only knows about
// the active version (last `approved`, else last `draft`). When the
// user accepts a draft, the spine flips status; when they "refine",
// they go back to typing in the composer (which on next submit
// produces a new triad run, after which they can re-distill).

export default function TruthDistillationPanel() {
  const {
    activeMission,
    principles,
    addTruthDistillation,
    updateTruthDistillationStatus,
    setMissionProjectContract,
  } = useSpine();
  const { streamDistill, pending: signalPending, unreachable } = useSignal();
  const [distilling, setDistilling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const distillation: TruthDistillation | null = activeTruthDistillation(activeMission);

  const startDistill = useCallback(async () => {
    if (!activeMission) return;
    setError(null);
    setDistilling(true);
    try {
      // Send notes + principles inline so the backend doesn't read
      // stale spine state (debounced 500ms push race). Backend falls
      // back to the snapshot if either field is omitted.
      const inlineNotes = activeMission.notes.map((n) => ({
        text: n.text,
        role: n.role,
        createdAt: n.createdAt,
      }));
      const inlinePrinciples = principles.map((p) => p.text);
      await streamDistill(
        {
          mission_id: activeMission.id,
          notes: inlineNotes,
          principles: inlinePrinciples,
        },
        (ev: DistillEvent) => {
          if (ev.type === "error") {
            setError(ev.message);
            return;
          }
          if (ev.type === "project_contract") {
            setMissionProjectContract(activeMission.id, {
              version: ev.contract.version,
              concept: ev.contract.concept,
              mission: ev.contract.mission,
              targetUser: ev.contract.targetUser,
              problem: ev.contract.problem,
              scope: ev.contract.scope,
              nonGoals: ev.contract.nonGoals ?? [],
              principles: ev.contract.principles ?? [],
              knownRisks: ev.contract.knownRisks ?? [],
              qualityGates: ev.contract.qualityGates ?? [],
              definitionOfDone: ev.contract.definitionOfDone,
              riskPolicy: ev.contract.riskPolicy,
              derivedFromSpine: ev.contract.derivedFromSpine,
              createdAt: ev.contract.createdAt,
              updatedAt: ev.contract.updatedAt,
            });
          }
          if (ev.type === "done") {
            const d = ev.distillation;
            addTruthDistillation(activeMission.id, payloadToDistillation(d));
          }
        },
      );
    } finally {
      setDistilling(false);
    }
  }, [activeMission, streamDistill, addTruthDistillation, setMissionProjectContract]);

  if (!activeMission) {
    return null;
  }

  // Empty state — Distill button only.
  if (!distillation) {
    return (
      <div data-insight-distill="empty" style={emptyStyle}>
        <div style={emptyHeadStyle}>truth distillation</div>
        <p style={emptyBodyStyle}>
          A missão ainda não tem destilação. Quando o material for suficiente,
          gera uma para alimentar Surface e Terminal.
        </p>
        <button
          type="button"
          onClick={startDistill}
          disabled={distilling || signalPending || unreachable}
          style={primaryBtn}
        >
          {distilling ? "a destilar…" : "↳ destilar verdade"}
        </button>
        {error && <p style={errorStyle}>{error}</p>}
        {unreachable && (
          <p style={errorStyle}>backend dormente — distillation indisponível</p>
        )}
      </div>
    );
  }

  // Active distillation — show summary, seeds, actions.
  const isApproved = distillation.status === "approved";
  const isStale = distillation.status === "stale" || distillation.status === "superseded";

  return (
    <div
      data-insight-distill="active"
      data-status={distillation.status}
      style={activeStyle(distillation.status)}
    >
      <div style={activeHeaderStyle}>
        <div style={statusPillStyle(distillation.status)}>
          truth · v{distillation.version} · {distillation.status}
        </div>
        <div style={confidenceStyle(distillation.confidence)}>
          confidence {distillation.confidence}
        </div>
      </div>

      <p style={summaryStyle}>{distillation.summary}</p>

      <div style={sectionStyle}>
        <span style={sectionLabel}>direcção apurada</span>
        <p style={sectionBody}>{distillation.validatedDirection}</p>
      </div>

      {distillation.surfaceSeed && (
        <div style={seedRowStyle}>
          <span style={seedTagStyle("surface")}>↳ surface seed</span>
          <span style={seedQuestion}>{distillation.surfaceSeed.question}</span>
        </div>
      )}
      {distillation.terminalSeed && (
        <div style={seedRowStyle}>
          <span style={seedTagStyle("terminal")}>↳ terminal seed</span>
          <span style={seedQuestion}>{distillation.terminalSeed.task}</span>
        </div>
      )}

      {distillation.unknowns.length > 0 && (
        <details style={detailsStyle}>
          <summary style={summaryToggle}>incógnitas ({distillation.unknowns.length})</summary>
          <ul style={listStyle}>
            {distillation.unknowns.map((u, i) => (
              <li key={i} style={listItem}>{u}</li>
            ))}
          </ul>
        </details>
      )}

      <div style={actionsRowStyle}>
        {!isApproved && (
          <button
            type="button"
            onClick={() => {
              updateTruthDistillationStatus(activeMission.id, distillation.id, "approved");
              // Wave 6a telemetry — fire-and-forget, never fails the UI.
              fireTelemetry("truth_distillation_accepted", activeMission.id, {
                version: distillation.version,
                confidence: distillation.confidence,
              });
            }}
            style={primaryBtn}
            disabled={isStale}
          >
            aceitar
          </button>
        )}
        <button
          type="button"
          onClick={startDistill}
          disabled={distilling || signalPending}
          style={secondaryBtn}
        >
          {distilling ? "a destilar…" : "refinar (nova versão)"}
        </button>
        {isApproved && (
          <button
            type="button"
            onClick={() => updateTruthDistillationStatus(activeMission.id, distillation.id, "stale", { staleReason: "manual" })}
            style={ghostBtn}
          >
            marcar stale
          </button>
        )}
      </div>

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function payloadToDistillation(d: DistillTruthPayload): TruthDistillation {
  return {
    id: d.id,
    version: d.version,
    status: (d.status as TruthDistillation["status"]) ?? "draft",
    sourceMissionId: d.sourceMissionId,
    summary: d.summary,
    validatedDirection: d.validatedDirection,
    coreDecisions: d.coreDecisions ?? [],
    unknowns: d.unknowns ?? [],
    risks: d.risks ?? [],
    surfaceSeed: d.surfaceSeed
      ? {
          question: d.surfaceSeed.question,
          designSystemSuggestion: d.surfaceSeed.designSystemSuggestion ?? undefined,
          screenCountEstimate: d.surfaceSeed.screenCountEstimate ?? undefined,
          fidelityHint: d.surfaceSeed.fidelityHint ?? undefined,
        }
      : null,
    terminalSeed: d.terminalSeed
      ? {
          task: d.terminalSeed.task,
          fileTargets: d.terminalSeed.fileTargets ?? [],
          riskLevel: d.terminalSeed.riskLevel ?? undefined,
          requiresGate: d.terminalSeed.requiresGate ?? [],
        }
      : null,
    confidence: d.confidence,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    supersedesVersion: d.supersedesVersion ?? undefined,
    staleSince: d.staleSince ?? undefined,
    staleReason: d.staleReason ?? undefined,
    failureState: (d.failureState as TruthDistillation["failureState"]) ?? undefined,
  };
}

// ── Styles (inline so we don't add another stylesheet for one panel) ───────

const emptyStyle: React.CSSProperties = {
  margin: "var(--space-3) auto",
  padding: "var(--space-3) var(--space-4)",
  border: "1px dashed var(--border)",
  borderRadius: "var(--radius-2)",
  maxWidth: 780,
  fontFamily: "var(--mono)",
  fontSize: 12,
  color: "var(--text-secondary)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const emptyHeadStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-ghost)",
};

const emptyBodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--text)",
};

function activeStyle(status: string): React.CSSProperties {
  const tone =
    status === "approved" ? "var(--cc-ok, #2e9c5e)" :
    status === "stale" || status === "superseded" ? "var(--cc-warn, #c08040)" :
    "var(--accent)";
  return {
    margin: "var(--space-3) auto",
    padding: "var(--space-3) var(--space-4)",
    border: `1px solid color-mix(in oklab, ${tone} 36%, transparent)`,
    borderRadius: "var(--radius-2)",
    background: `color-mix(in oklab, ${tone} 5%, transparent)`,
    maxWidth: 780,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };
}

const activeHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  justifyContent: "space-between",
};

function statusPillStyle(status: string): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "3px 10px",
    border: "1px solid var(--border)",
    borderRadius: 999,
    color:
      status === "approved" ? "var(--cc-ok, #2e9c5e)" :
      status === "stale" ? "var(--cc-warn, #c08040)" :
      "var(--text-secondary)",
  };
}

function confidenceStyle(c: string): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color:
      c === "high" ? "var(--cc-ok, #2e9c5e)" :
      c === "low" ? "var(--cc-warn, #c08040)" :
      "var(--text-ghost)",
  };
}

const summaryStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--text)",
};

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 9,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-ghost)",
};

const sectionBody: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--sans)",
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--text)",
};

const seedRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: 10,
  alignItems: "baseline",
  paddingTop: 6,
  borderTop: "1px solid var(--border-soft, var(--border))",
  fontFamily: "var(--mono)",
  fontSize: 11,
};

function seedTagStyle(kind: "surface" | "terminal"): React.CSSProperties {
  return {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: kind === "surface" ? "var(--ch-surface, var(--accent))" : "var(--ch-terminal, var(--accent))",
  };
}

const seedQuestion: React.CSSProperties = {
  fontFamily: "var(--sans)",
  fontSize: 12.5,
  color: "var(--text)",
  letterSpacing: 0,
};

const detailsStyle: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--text-secondary)",
};

const summaryToggle: React.CSSProperties = {
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: 1.5,
  fontSize: 10,
  color: "var(--text-ghost)",
};

const listStyle: React.CSSProperties = {
  margin: "6px 0 0",
  paddingLeft: 18,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const listItem: React.CSSProperties = {
  fontFamily: "var(--sans)",
  fontSize: 12.5,
  lineHeight: 1.45,
  color: "var(--text)",
};

const actionsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 4,
};

const primaryBtn: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  padding: "6px 14px",
  border: "1px solid var(--accent)",
  borderRadius: 999,
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  color: "var(--accent)",
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text-secondary)",
};

const ghostBtn: React.CSSProperties = {
  ...secondaryBtn,
  color: "var(--text-ghost)",
};

const errorStyle: React.CSSProperties = {
  margin: 0,
  padding: "6px 10px",
  border: "1px solid color-mix(in oklab, var(--cc-err) 36%, transparent)",
  borderRadius: "var(--radius-control)",
  background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
  color: "var(--cc-err)",
  fontFamily: "var(--mono)",
  fontSize: 11,
};
