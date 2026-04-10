// Ruberra — Ritual Entry. The first surface. Must carry weight.
// Two modes:
//   1. First encounter — initiation. Bind repo. Sparse, sovereign.
//   2. Return — recognition. System acknowledges continuity before re-entry.
// No explanation-first. No setup-wizard energy. The system is already running.
// Principal-architect identity: entry leads to Creation, not discovery.

import { useState } from "react";
import { emit, useProjection } from "../spine/store";
import { nextMove } from "../spine/projections";

interface Props {
  onEnter: () => void;
  /** When true, hydration found an existing repo — system has memory. */
  returning?: boolean;
}

export function RitualEntry({ onEnter, returning }: Props) {
  const p = useProjection();
  const [name, setName] = useState("");

  // Returning user — the system recognizes you.
  if (returning && p.activeRepo) {
    const openThreads = p.threads.filter(
      (t) => t.repo === p.activeRepo && t.status === "open",
    ).length;
    const canonCount = p.canon.filter(
      (c) => c.state === "hardened" && c.repo === p.activeRepo,
    ).length;
    const memoryCount = p.memory.filter(
      (m) => m.repo === p.activeRepo,
    ).length;
    const unresolvedCount = p.contradictions.filter(
      (c) => !c.resolved && (!c.repo || c.repo === p.activeRepo),
    ).length;
    // Forge-specific return signals — scoped to the active thread so that
    // "Enter Forge · Review" routes the architect to work that is actually visible
    // in Creation (which renders the active thread's artifacts, not all repo artifacts).
    const activeThreadObj = p.threads.find((t) => t.id === p.activeThread);
    const pendingReviews =
      activeThreadObj && activeThreadObj.status === "open"
        ? p.artifacts.filter(
            (a) => a.review === "pending" && a.thread === activeThreadObj.id,
          ).length
        : 0;
    // Scoped to activeThread only — Creation renders concepts for that thread,
    // so reporting concepts from other threads produces a stuck signal.
    const openConcepts =
      activeThreadObj && activeThreadObj.status === "open"
        ? p.concepts.filter((c) => !c.promoted && c.thread === activeThreadObj.id).length
        : 0;
    const move = nextMove(p);
    const hasForgeWork = pendingReviews > 0;

    return (
      <div className="rb-ritual rb-ritual--return">
        <div className="inner rb-return-inner">
          <h1>
            RUB<span>E</span>RRA
          </h1>
          <div className="rb-ritual-subtitle">Architect Station</div>
          <div className="rb-return-repo">
            {p.activeRepo}
          </div>

          {/* System state — what the architect left behind */}
          <div className="rb-return-state">
            <div className="rb-return-row">
              <span className="rb-return-label">canon</span>
              <span className="rb-return-value" style={canonCount > 0 ? { color: 'var(--rb-gold)' } : undefined}>{canonCount}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">threads</span>
              <span className="rb-return-value">{openThreads}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">memory</span>
              <span className="rb-return-value">{memoryCount}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">state</span>
              <span className="rb-return-value">{move}</span>
            </div>
            {pendingReviews > 0 && (
              <div className="rb-return-row rb-return-row--forge">
                <span className="rb-return-label">review</span>
                <span className="rb-return-value rb-return-value--forge">{pendingReviews} pending</span>
              </div>
            )}
            {openConcepts > 0 && (
              <div className="rb-return-row">
                <span className="rb-return-label">concepts</span>
                <span className="rb-return-value">{openConcepts} open</span>
              </div>
            )}
            {unresolvedCount > 0 && (
              <div className="rb-return-row rb-return-row--warn">
                <span className="rb-return-label">tension</span>
                <span className="rb-return-value">{unresolvedCount}</span>
              </div>
            )}
          </div>

          <button
            className={`rb-btn primary rb-return-enter${hasForgeWork ? " rb-return-enter--forge" : ""}`}
            onClick={() => {
              emit.enterChamber(hasForgeWork ? "creation" : p.chamber);
              onEnter();
            }}
          >
            {hasForgeWork ? "Enter Forge · Review" : "Resume"}
          </button>
        </div>
      </div>
    );
  }

  // First encounter — initiation. Sparse, sovereign. Architect-first.
  return (
    <div className="rb-ritual">
      <div className="inner">
        <h1>
          RUB<span>E</span>RRA
        </h1>
        <div className="rb-ritual-subtitle">Architect Creation System</div>
        <div className="rb-ritual-identity">
          concept · directive · consequence · canon
        </div>
        <div className="rb-ritual-bind">
          <label className="rb-field-label">repo</label>
          <input
            className="rb-input"
            placeholder="bind repo to begin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                emit.bindRepo(name.trim()).then(() => {
                  emit.enterChamber("creation");
                  onEnter();
                });
              }
            }}
          />
          <button
            className="rb-btn primary"
            disabled={!name.trim()}
            onClick={async () => {
              await emit.bindRepo(name.trim());
              await emit.seedCanon();
              await emit.enterChamber("creation");
              onEnter();
            }}
          >
            Bind · Enter Forge
          </button>
        </div>
      </div>
    </div>
  );
}
