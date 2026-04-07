// Ruberra — Ritual entry. Entry must carry weight.

import { useState } from "react";
import { emit } from "../spine/store";

export function RitualEntry({ onEnter }: { onEnter: () => void }) {
  const [name, setName] = useState("");
  return (
    <div className="rb-ritual">
      <div className="inner">
        <h1>
          RUB<span>E</span>RRA
        </h1>
        <p>Sovereign Operational Shell</p>
        <div className="rb-col">
          <input
            className="rb-input"
            placeholder="bind repo identifier"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="rb-btn primary"
            disabled={!name.trim()}
            onClick={async () => {
              await emit.bindRepo(name.trim());
              await emit.enterChamber("creation");
              onEnter();
            }}
          >
            Enter Chamber
          </button>
        </div>
      </div>
    </div>
  );
}
