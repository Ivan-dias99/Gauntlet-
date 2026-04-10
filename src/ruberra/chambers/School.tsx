// Ruberra — School: Canon Formation + Mastery Chamber.
// Two-step promotion: propose -> harden. First-run: mission framing.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";
import { canonDependents } from "../spine/projections";
import { RuledPrompt } from "../trust/RuledPrompt";

export function SchoolChamber() {
  const p = useProjection();
  const [text, setText] = useState("");
  const [mission, setMission] = useState("");
  const canon = p.canon.filter((c) => c.state === "hardened");
  const revoked = p.canon.filter((c) => c.state === "revoked");
  const openProposals = p.canonProposals.filter((q) => !q.hardened);
  const promotableMemory = p.memory.filter((m) => !m.promoted);
  const activeThread = p.threads.find((t) => t.id === p.activeThread);

  return (
    <section className="rb-chamber rb-chamber--school">
      <header className="rb-chamber-header rb-chamber-header--truth">
        <div className="rb-truth-sigil" aria-hidden="true" />
        <h1 className="rb-chamber-title">School</h1>
        <div className="rb-chamber-gravity-bar">
          <span className="rb-chamber-gravity-text rb-gravity--primary">Canon Formation</span>
          <span className="rb-gravity-sep">·</span>
          <span className="rb-chamber-gravity-text">Harden truth into law</span>
          {canon.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--gold">{canon.length} hardened</span>
            </>
          )}
          {openProposals.length > 0 && (
            <>
              <span className="rb-gravity-sep">·</span>
              <span className="rb-chamber-gravity-text rb-gravity--warn">{openProposals.length} pending</span>
            </>
          )}
        </div>
        <div className="rb-chamber-accent-line" />
      </header>

      {activeThread && (
        <div className="rb-thread-context-bar">
          <span className="rb-thread-context-bar-label">thread</span>
          <span className="rb-thread-context-bar-intent">
            {activeThread.intent.length > 72
              ? activeThread.intent.slice(0, 72) + "…"
              : activeThread.intent}
          </span>
          <span className="rb-thread-context-bar-state">{activeThread.state}</span>
        </div>
      )}

      {!p.missionFramed && (
        <div className="rb-panel rb-school-mission">
          <h2>Mission Canon</h2>
          <div className="rb-col">
            <div className="rb-school-preamble">
              First doctrine. Governs every directive and every truth in this repo.
            </div>
            <textarea
              className="rb-textarea"
              placeholder="state the mission of this repo..."
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            />
            <button
              className="rb-btn primary"
              disabled={!mission.trim()}
              onClick={async () => {
                await emit.frameMission(mission.trim());
                setMission("");
              }}
            >
              Harden Mission Canon
            </button>
          </div>
        </div>
      )}

      <div className="rb-panel rb-school-ledger">
        <h2>Hardened Doctrine</h2>
        {canon.length === 0 ? (
          <div className="rb-unavail">
            <strong>no doctrine</strong>
            <span className="rb-school-empty-hint">
              The organism has no hardened truth. Propose and harden to establish law.
            </span>
          </div>
        ) : (
          <ul className="rb-list rb-school-doctrine-list">
            {canon
              .slice()
              .reverse()
              .map((c) => (
                <li key={c.id} className="rb-school-doctrine-entry">
                  <div className="rb-school-doctrine-body">
                    <span className="rb-badge gold">law</span>
                    <span className="rb-school-doctrine-text">{c.text}</span>
                    <div className="rb-school-doctrine-ts">
                      {new Date(c.hardenedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="rb-btn"
                    onClick={async () => {
                      const reason = await RuledPrompt.ask("Revocation reason (required):", { label: "reason" });
                      if (reason && reason.trim()) emit.revokeCanon(c.id, reason.trim());
                    }}
                  >
                    Revoke
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {revoked.length > 0 && (
        <div className="rb-panel rb-school-revoked">
          <h2>Revoked Doctrine</h2>
          <ul className="rb-list">
            {revoked
              .slice()
              .reverse()
              .map((c) => {
                const deps = canonDependents(p, c.id);
                return (
                  <li key={c.id} className="rb-school-revoked-entry">
                    <span className="rb-badge bad">revoked</span>
                    <s>{c.text}</s>
                    <div className="rb-school-doctrine-ts">
                      ↳ {c.revokeReason}
                      {c.revokedAt && (
                        <span className="rb-school-revoked-time">
                          {" · "}
                          {new Date(c.revokedAt).toLocaleDateString()} {new Date(c.revokedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                    {deps.length > 0 && (
                      <div className="rb-school-revoked-deps">
                        {deps.length} directive{deps.length > 1 ? "s" : ""} may have depended on this
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      <div className="rb-panel rb-school-proposals">
        <h2>Doctrine Under Pressure</h2>
        <div className="rb-col" style={{ marginBottom: 12 }}>
          <textarea
            className="rb-textarea"
            placeholder="propose a canonical truth..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="rb-btn"
            disabled={!text.trim()}
            onClick={async () => {
              await emit.proposeCanon(text.trim());
              setText("");
            }}
          >
            Propose
          </button>
        </div>
        {openProposals.length === 0 ? (
          <div className="rb-unavail">
            <strong>no proposals under pressure</strong>
          </div>
        ) : (
          <ul className="rb-list">
            {openProposals
              .slice()
              .reverse()
              .map((q) => (
                <li key={q.id} className="rb-row" style={{ justifyContent: "space-between" }}>
                  <span>
                    <span className="rb-badge warn">proposed</span>
                    {q.text}
                  </span>
                  <button
                    className="rb-btn primary"
                    onClick={() =>
                      emit.hardenCanon(q.text, {
                        memoryId: q.memoryId,
                        proposalId: q.id,
                      })
                    }
                  >
                    Harden
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="rb-panel rb-school-promotion">
        <h2>Truth Promotion</h2>
        {promotableMemory.length === 0 ? (
          <div className="rb-unavail">
            <strong>no retained observations to promote</strong>
          </div>
        ) : (
          <ul className="rb-list">
            {promotableMemory
              .slice()
              .reverse()
              .map((m) => (
                <li key={m.id} className="rb-row" style={{ justifyContent: "space-between" }}>
                  <span>{m.text}</span>
                  <button
                    className="rb-btn"
                    onClick={async () => {
                      await emit.promoteMemory(m.id);
                      await emit.proposeCanon(m.text, m.id);
                    }}
                  >
                    Promote → Propose
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}
