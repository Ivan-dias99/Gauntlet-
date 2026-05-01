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
//
// Wave P-36 — optimistic consume + opt-in empty state.
//   * `showEmpty` lets callers render the canonical EmptyState when the
//     inbox is empty (default `false` keeps the historical "invisible
//     when empty" behaviour everywhere else).
//   * Clicking "consumir" hides the row immediately via local state and
//     only then commits to the spine. If the commit throws, the row is
//     re-shown — the optimistic UI rolls back on error.

import { useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { pendingHandoffsFor, type Chamber, type HandoffStatus } from "../spine/types";
import { EmptyState } from "./states";

interface Props {
  /** Which chamber's incoming queue to render. */
  chamber: Chamber;
  /** Render an EmptyState when nothing is pending (default false). */
  showEmpty?: boolean;
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

export default function HandoffInbox({ chamber, showEmpty = false }: Props) {
  const { activeMission, resolveHandoff } = useSpine();
  const pending = pendingHandoffsFor(activeMission, chamber);

  // Optimistic-resolution book-keeping. A handoff id lands here the
  // moment the user clicks "consumir"; it is hidden from the rendered
  // list until the commit completes. On commit failure the id is
  // dropped so the row reappears with its original state.
  const [optimisticHidden, setOptimisticHidden] = useState<Set<string>>(
    () => new Set(),
  );

  const visible = pending.filter((h) => !optimisticHidden.has(h.id));

  if (!activeMission) return null;
  if (visible.length === 0) {
    if (!showEmpty) return null;
    return (
      <EmptyState
        glyph="↪"
        message="sem handoffs pendentes para esta câmara"
        style={{ margin: "0 auto var(--space-3)", maxWidth: 820 }}
      />
    );
  }

  function resolve(id: string, status: HandoffStatus) {
    if (!activeMission) return;
    if (status === "consumed") {
      // Optimistic: hide first, commit second. Rollback on throw.
      setOptimisticHidden((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      try {
        resolveHandoff(activeMission.id, id, status);
      } catch (err) {
        setOptimisticHidden((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // eslint-disable-next-line no-console
        console.error("[handoff] consume rollback", err);
      }
      return;
    }
    resolveHandoff(activeMission.id, id, status);
  }

  return (
    <section
      data-handoff-inbox={chamber}
      // Wave P-34 — slide-in-from-top with subtle spring
      // (motion-slide-in-top → 200ms transform/opacity, spring
      // easing). Reduced-motion users get an instant mount via
      // the global @media kill switch in tokens.css.
      className="motion-slide-in-top"
      style={{
        margin: "0 auto var(--space-3)",
        maxWidth: 820,
        padding: "var(--space-3)",
        borderRadius: "var(--radius-lg)",
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
        ↪ {visible.length} handoff{visible.length === 1 ? "" : "s"} pendente
        {visible.length === 1 ? "" : "s"}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map((h) => (
          <li
            key={h.id}
            data-handoff-id={h.id}
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius-md)",
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
  borderRadius: "var(--radius-sm)",
  border: "1px solid currentColor",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};
