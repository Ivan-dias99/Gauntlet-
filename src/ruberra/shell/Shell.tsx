// Ruberra — Sovereign Shell. Persistent chamber glyph, repo binding,
// thread strip, canon ribbon, event pulse. Chambers are gravity regimes.

import { useProjection, emit } from "../spine/store";
import { nextMove } from "../spine/projections";
import { ThreadStrip } from "./ThreadStrip";
import { CanonRibbon } from "./CanonRibbon";
import { EventPulse } from "./EventPulse";
import { CreationChamber } from "../chambers/Creation";
import { LabChamber } from "../chambers/Lab";
import { SchoolChamber } from "../chambers/School";
import { ErrorBoundary } from "../trust/ErrorBoundary";

const CHAMBERS: Array<{ id: "lab" | "school" | "creation"; label: string }> = [
  { id: "lab", label: "Lab" },
  { id: "school", label: "School" },
  { id: "creation", label: "Creation" },
];

export function Shell() {
  const p = useProjection();

  return (
    <div className="rb-root">
      <header className="rb-topbar">
        <div className="rb-brand">
          RUB<span>E</span>RRA
        </div>
        <div className="rb-repo">
          repo · {p.activeRepo ?? "unbound"}
        </div>
        <div
          style={{
            fontFamily: "var(--rb-mono)",
            fontSize: 11,
            color: "var(--rb-gold)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginLeft: 6,
          }}
        >
          next · {nextMove(p)}
        </div>
        <div className="rb-chambers">
          {CHAMBERS.map((c) => (
            <button
              key={c.id}
              className={`rb-chamber-glyph ${p.chamber === c.id ? "active" : ""}`}
              onClick={() => emit.enterChamber(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <main className="rb-main">
        <ErrorBoundary label="Thread strip">
          <ThreadStrip />
        </ErrorBoundary>

        <ErrorBoundary label={`Chamber · ${p.chamber}`}>
          {p.chamber === "creation" && <CreationChamber />}
          {p.chamber === "lab" && <LabChamber />}
          {p.chamber === "school" && <SchoolChamber />}
        </ErrorBoundary>

        <ErrorBoundary label="Canon ribbon">
          <CanonRibbon />
        </ErrorBoundary>
      </main>

      <ErrorBoundary label="Event pulse">
        <EventPulse />
      </ErrorBoundary>
    </div>
  );
}
