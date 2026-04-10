// Ruberra — Ritual Entry. The first surface. Must carry weight.
// Two modes:
//   1. First encounter — initiation. Bind repo. Sparse, sovereign.
//   2. Return — recognition. System acknowledges continuity before re-entry.
// No explanation-first. No setup-wizard energy. The system is already running.

import { useState } from "react";
import { emit, useProjection } from "../spine/store";

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
      (c) => !c.resolved,
    ).length;
    const lastEvent = p.lastEventId ? "active" : "dormant";

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
              <span className="rb-return-label">memory</span>
              <span className="rb-return-value">{memoryCount}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">threads</span>
              <span className="rb-return-value">{openThreads}</span>
            </div>
            {unresolvedCount > 0 && (
              <div className="rb-return-row rb-return-row--warn">
                <span className="rb-return-label">contradictions</span>
                <span className="rb-return-value">{unresolvedCount}</span>
              </div>
            )}
            <div className="rb-return-row">
              <span className="rb-return-label">spine</span>
              <span className="rb-return-value">{lastEvent}</span>
            </div>
          </div>

          <button
            className="rb-btn primary rb-return-enter"
            onClick={() => {
              emit.enterChamber(p.chamber);
              onEnter();
            }}
          >
            Resume · Continue Building
          </button>
        </div>
      </div>
    );
  }

  // First encounter — initiation. Sparse, sovereign.
  return (
    <div className="rb-ritual">
      <div className="inner">
        <h1>
          RUB<span>E</span>RRA
        </h1>
        <div className="rb-ritual-subtitle">Architect Creation System</div>
        <div className="rb-ritual-role">You are the architect. This is your forge.</div>
        <div className="rb-ritual-bind">
          <label className="rb-field-label">repo identifier</label>
          <input
            className="rb-input"
            placeholder="bind to begin"
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
            Bind · Begin Forging
          </button>
        </div>
      </div>
    </div>
  );
}
