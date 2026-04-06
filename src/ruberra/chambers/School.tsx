// Ruberra — School chamber. Harden knowledge into canon.

import { useState } from "react";
import { useProjection, emit } from "../spine/store";

export function SchoolChamber() {
  const p = useProjection();
  const [text, setText] = useState("");
  const canon = p.canon.filter((c) => !c.revoked);
  const promotable = p.memory.filter((m) => m.promoted);

  return (
    <section className="rb-chamber">
      <h1>School</h1>
      <div className="gravity">Gravity: Discipline · Harden canon</div>

      <div className="rb-panel">
        <h2>Canon Promotion</h2>
        <div className="rb-col" style={{ marginBottom: 12 }}>
          <textarea
            className="rb-textarea"
            placeholder="state the canonical truth..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="rb-btn primary"
            disabled={!text.trim()}
            onClick={async () => {
              await emit.hardenCanon(text.trim());
              setText("");
            }}
          >
            Harden to canon
          </button>
        </div>

        {promotable.length > 0 && (
          <>
            <h3 className="rb-section-title" style={{ marginTop: 14 }}>
              Promoted memory
            </h3>
            <ul className="rb-list">
              {promotable.map((m) => (
                <li
                  key={m.id}
                  className="rb-row"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>{m.text}</span>
                  <button
                    className="rb-btn"
                    onClick={() => emit.hardenCanon(m.text, m.id)}
                  >
                    Harden
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="rb-panel">
        <h2>Canon Ledger</h2>
        {canon.length === 0 ? (
          <div className="rb-unavail">
            <strong>no canon</strong>
            Canon forms from hardened memory. None exists yet.
          </div>
        ) : (
          <ul className="rb-list">
            {canon
              .slice()
              .reverse()
              .map((c) => (
                <li key={c.id}>
                  <span className="rb-badge gold">hardened</span>
                  {c.text}
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--rb-ink-mute)",
                      marginTop: 4,
                    }}
                  >
                    {new Date(c.hardenedAt).toLocaleString()}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="rb-panel">
        <h2>Progression</h2>
        <div className="rb-unavail">
          <strong>progression engine — not in first cut</strong>
          Mastery checks and curriculum derivation are post-ship. School ships
          honest: canon browser + promotion queue only.
        </div>
      </div>
    </section>
  );
}
