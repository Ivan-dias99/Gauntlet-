// Ruberra — Sovereign Shell. Persistent chamber glyph, repo binding,
// thread strip, canon ribbon, event pulse. Chambers are gravity regimes.
// Narrow-width: rails become overlay drawers with toggle buttons in topbar.

import { useState, useEffect } from "react";
import { useProjection, emit } from "../spine/store";
import { nextMove } from "../spine/projections";
import { ThreadStrip } from "./ThreadStrip";
import { CanonRibbon } from "./CanonRibbon";
import { EventPulse } from "./EventPulse";
import { CreationChamber } from "../chambers/Creation";
import { LabChamber } from "../chambers/Lab";
import { SchoolChamber } from "../chambers/School";
import { ErrorBoundary } from "../trust/ErrorBoundary";

const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

const CHAMBERS: Array<{ id: "lab" | "school" | "creation"; label: string }> = [
  { id: "lab", label: "Lab" },
  { id: "school", label: "School" },
  { id: "creation", label: "Creation" },
];

export function Shell() {
  const p = useProjection();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [gitStatus, setGitStatus] = useState<string | null>(null);

  // Close rails on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLeftOpen(false);
        setRightOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fetch git status when backend + repo are available
  useEffect(() => {
    if (!EXEC_BACKEND || !p.activeRepo) { setGitStatus(null); return; }
    const base = EXEC_BACKEND.replace(/\/exec$/, "");
    fetch(`${base}/git/status?path=${encodeURIComponent(p.activeRepo)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setGitStatus(d?.output ?? null))
      .catch(() => setGitStatus(null));
  }, [p.activeRepo, p.lastEventId]);

  const backdropActive = leftOpen || rightOpen;

  function closeRails() {
    setLeftOpen(false);
    setRightOpen(false);
  }

  return (
    <div className="rb-root">
      {/* Backdrop for overlay rails on narrow screens */}
      <div
        className={`rb-rail-backdrop${backdropActive ? " active" : ""}`}
        onClick={closeRails}
        aria-hidden="true"
      />

      <header className="rb-topbar">
        {/* Narrow-screen toggle: threads (left rail) */}
        <button
          className="rb-rail-toggle"
          aria-label="Toggle threads panel"
          onClick={() => { setLeftOpen((v) => !v); setRightOpen(false); }}
        >
          ≡ Threads
        </button>

        <div className="rb-brand">
          RUB<span>E</span>RRA
        </div>
        <div className="rb-repo">
          repo · {p.activeRepo ?? "unbound"}
          {p.activeRepo && gitStatus !== null && (
            <span
              style={{
                marginLeft: 8,
                color: gitStatus.trim() ? "var(--rb-warn)" : "var(--rb-ok)",
                fontSize: 10,
              }}
              title={gitStatus || "clean"}
            >
              {gitStatus.trim() ? "· dirty" : "· clean"}
            </span>
          )}
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

        {/* Narrow-screen toggle: canon (right rail) */}
        <button
          className="rb-rail-toggle"
          aria-label="Toggle canon panel"
          onClick={() => { setRightOpen((v) => !v); setLeftOpen(false); }}
        >
          Canon ≡
        </button>
      </header>

      <main className="rb-main">
        <ErrorBoundary label="Thread strip">
          <ThreadStrip open={leftOpen} onClose={closeRails} />
        </ErrorBoundary>

        <ErrorBoundary label={`Chamber · ${p.chamber}`}>
          {p.chamber === "creation" && <CreationChamber />}
          {p.chamber === "lab" && <LabChamber />}
          {p.chamber === "school" && <SchoolChamber />}
        </ErrorBoundary>

        <ErrorBoundary label="Canon ribbon">
          <CanonRibbon open={rightOpen} onClose={closeRails} />
        </ErrorBoundary>
      </main>

      <ErrorBoundary label="Event pulse">
        <EventPulse />
      </ErrorBoundary>
    </div>
  );
}
