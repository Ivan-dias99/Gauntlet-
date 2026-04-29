// Wave P-4 UI consumer — Handoff inbox.
//
// Wave D shipped HandoffRecord on Mission and SpineContext.enqueueHandoff
// / resolveHandoff but no chamber rendered the incoming queue. Operators
// had no surface to consume / reject / defer pending handoffs; they
// stayed dormant in the spine.
//
// This component renders the pending handoffs targeted at a specific
// chamber for the active mission. It sits as a thin banner near the top
// of the chamber body, collapses when there's nothing pending, and
// exposes the three resolution actions inline.

import { useSpine } from "../spine/SpineContext";
import { pendingHandoffsFor, type Chamber, type HandoffStatus } from "../spine/types";

interface Props {
  /** Which chamber's incoming queue to render. */
  chamber: Chamber;
}

const FROM_LABEL: Record<Chamber, string> = {
  insight: "Insight",
  surface: "Surface",
  terminal: "Terminal",
  archive: "Archive",
  core: "Core",
};

const ARTIFACT_LABEL: Record<string, string> = {
  project_contract: "project contract",
  truth_distillation: "truth distillation",
  build_specification: "build specification",
  delivery_ledger: "delivery ledger",
  note: "note",
};

export default function HandoffInbox({ chamber }: Props) {
  const { activeMission, resolveHandoff } = useSpine();
  const pending = pendingHandoffsFor(activeMission, chamber);

  if (!activeMission || pending.length === 0) return null;

  function resolve(id: string, status: HandoffStatus) {
    if (!activeMission) return;
    resolveHandoff(activeMission.id, id, status);
  }

  return (
    <section
      data-handoff-inbox={chamber}
      style={{
        margin: "0 auto var(--space-3)",
        maxWidth: 820,
        padding: "var(--space-3)",
        borderRadius: 8,
        border: "1px solid currentColor",
        opacity: 0.92,
        fontSize: "0.9em",
      }}
      aria-label={`handoffs pendentes para ${FROM_LABEL[chamber]}`}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 8,
          fontSize: "0.9em",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        ↪ {pending.length} handoff{pending.length === 1 ? "" : "s"} pendente
        {pending.length === 1 ? "" : "s"}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {pending.map((h) => (
          <li
            key={h.id}
            data-handoff-id={h.id}
            style={{
              padding: "var(--space-2)",
              borderRadius: 6,
              border: "1px solid currentColor",
              opacity: 0.85,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ fontSize: "0.8em", opacity: 0.7 }}>
              de <strong>{FROM_LABEL[h.fromChamber]}</strong> ·{" "}
              {ARTIFACT_LABEL[h.artifactType] ?? h.artifactType}
              {h.artifactRef ? ` (${h.artifactRef.slice(0, 12)})` : ""}
            </div>
            <div style={{ fontSize: "1em" }}>{h.summary}</div>
            <div style={{ fontSize: "0.85em", opacity: 0.85 }}>
              <strong>próxima acção:</strong> {h.nextAction}
            </div>
            {h.risks.length > 0 && (
              <div style={{ fontSize: "0.8em", opacity: 0.75 }}>
                <strong>riscos:</strong> {h.risks.join(" · ")}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <button
                type="button"
                data-handoff-action="consumed"
                onClick={() => resolve(h.id, "consumed")}
                style={actionButtonStyle}
              >
                consumir
              </button>
              <button
                type="button"
                data-handoff-action="deferred"
                onClick={() => resolve(h.id, "deferred")}
                style={actionButtonStyle}
              >
                adiar
              </button>
              <button
                type="button"
                data-handoff-action="rejected"
                onClick={() => resolve(h.id, "rejected")}
                style={actionButtonStyle}
              >
                rejeitar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const actionButtonStyle: React.CSSProperties = {
  fontSize: "0.85em",
  padding: "4px 10px",
  borderRadius: 4,
  border: "1px solid currentColor",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};
