// Ruberra — Sovereign Shell. Persistent chamber glyph, repo binding,
// thread strip, canon ribbon, event pulse. Chambers are gravity regimes.
// Narrow-width: rails become overlay drawers with toggle buttons in topbar.

import "../harvest.css";
import { useState, useEffect } from "react";
import { useProjection, emit } from "../spine/store";
import { nextMove } from "../spine/projections";
import { ThreadStrip } from "./ThreadStrip";
import { WorkNavRail } from "./WorkNavRail";
import { CanonRibbon } from "./CanonRibbon";
import { EventPulse } from "./EventPulse";
import { CreationChamber } from "../chambers/Creation";
import { LabChamber } from "../chambers/Lab";
import { SchoolChamber } from "../chambers/School";
import { MemoryChamber } from "../chambers/Memory";
import { ErrorBoundary } from "../trust/ErrorBoundary";

type ThemeMode = "dark" | "light";

const EXEC_BACKEND = (import.meta as any).env?.VITE_RUBERRA_EXEC_URL as
  | string
  | undefined;

const CHAMBERS: Array<{ id: "lab" | "school" | "creation" | "memory"; label: string; gravity: string }> = [
  { id: "school", label: "School", gravity: "truth" },
  { id: "creation", label: "Creation", gravity: "forge" },
  { id: "lab", label: "Lab", gravity: "validation" },
  { id: "memory", label: "Memory", gravity: "substrate" },
];

export function Shell({
  theme = "dark",
  onToggleTheme = () => {},
}: {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
} = {}) {
  const p = useProjection();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [gitStatus, setGitStatus] = useState<string | null>(null);

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

  useEffect(() => {
    if (!EXEC_BACKEND || !p.activeRepo) {
      setGitStatus(null);
      return;
    }
    const base = EXEC_BACKEND.replace(/\/exec$/, "");
    let cancelled = false;
    fetch(`${base}/git/status?path=${encodeURIComponent(p.activeRepo)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setGitStatus(d?.ok ? (d.output ?? null) : null);
      })
      .catch(() => {
        if (!cancelled) setGitStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, [p.activeRepo, p.lastEventId]);

  const backdropActive = leftOpen || rightOpen;

  function closeRails() {
    setLeftOpen(false);
    setRightOpen(false);
  }

  const move = nextMove(p);

  const activeExecution =
    move === "executing"
      ? p.executions.find((x) => x.status === "running")
      : undefined;
  const pendingCount =
    move === "review"
      ? p.artifacts.filter(
          (a) => a.review === "pending" && (!p.activeThread || a.thread === p.activeThread),
        ).length
      : 0;

  const stateColor =
    move === "executing" || move === "review"
      ? "var(--rb-warn)"
      : "var(--rb-gold)";

  const canonCount = p.canon.filter(
    (c) => c.state === "hardened" && c.repo === p.activeRepo,
  ).length;
  const memoryCount = p.memory.filter((m) => m.repo === p.activeRepo).length;
  const openThreadCount = p.threads.filter(
    (t) => t.repo === p.activeRepo && t.status === "open",
  ).length;
  const contradictionCount = p.contradictions.filter(
    (c) => !c.resolved && (!c.repo || c.repo === p.activeRepo),
  ).length;
  const pendingArtifactCount = p.artifacts.filter(
    (a) =>
      a.review === "pending" &&
      (!p.activeThread || a.thread === p.activeThread) &&
      p.threads.some((t) => t.id === a.thread && t.status === "open"),
  ).length;

  return (
    <div className="rb-root">
      <div
        className={`rb-rail-backdrop${backdropActive ? " active" : ""}`}
        onClick={closeRails}
        aria-hidden="true"
      />

      <header className="rb-topbar">
        <button
          className="rb-rail-toggle"
          aria-label="Toggle threads panel"
          onClick={() => {
            setLeftOpen((v) => !v);
            setRightOpen(false);
          }}
        >
          ≡ Threads
        </button>

        <div className="rb-brand-block">
          <div className="rb-brand">
            RUB<span>E</span>RRA
          </div>
          <div className="rb-brand-tagline">Architect Creation System</div>
        </div>

        <div className="rb-authority">
          <div className="rb-repo">
            {p.activeRepo ?? "unbound"}
            {p.activeRepo && gitStatus !== null && (
              <span
                className={`rb-repo-git ${gitStatus.trim() ? "dirty" : "clean"}`}
                title={gitStatus || "clean"}
              >
                {gitStatus.trim() ? "dirty" : "clean"}
              </span>
            )}
          </div>

          <div className="rb-spine-indicators">
            <div className="rb-spine-cell" title="Operational state">
              <span className="rb-spine-label">state</span>
              <span className="rb-spine-value" style={{ color: stateColor }}>
                {move}
              </span>
            </div>
            {canonCount > 0 && (
              <div className="rb-spine-cell rb-spine-cell--canon" title={`${canonCount} hardened canon — truth law`}>
                <span className="rb-spine-label">canon</span>
                <span className="rb-spine-value rb-spine-value--gold">{canonCount}</span>
              </div>
            )}
            {memoryCount > 0 && (
              <div className="rb-spine-cell" title={`${memoryCount} retained consequences`}>
                <span className="rb-spine-label">memory</span>
                <span className="rb-spine-value">{memoryCount}</span>
              </div>
            )}
            {openThreadCount > 0 && (
              <div className="rb-spine-cell" title={`${openThreadCount} open threads`}>
                <span className="rb-spine-label">threads</span>
                <span className="rb-spine-value">{openThreadCount}</span>
              </div>
            )}
            {contradictionCount > 0 && (
              <div
                className="rb-spine-cell rb-spine-cell--warn"
                title={`${contradictionCount} unresolved contradictions`}
              >
                <span className="rb-spine-label">tension</span>
                <span className="rb-spine-value">{contradictionCount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rb-shell-actions">
          <div className="rb-shell-state-chip">
            {move}
            {activeExecution && <span className="rb-shell-state-chip-sub"> · {activeExecution.label.slice(0, 18)}</span>}
            {!activeExecution && pendingCount > 0 && <span className="rb-shell-state-chip-sub"> · {pendingCount} review</span>}
          </div>
          <button className="rb-theme-toggle" onClick={onToggleTheme} type="button">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <div className="rb-chambers" aria-label="Chamber regimes">
          {CHAMBERS.map((c) => (
            <button
              key={c.id}
              data-id={c.id}
              data-gravity={c.gravity}
              className={`rb-chamber-glyph ${p.chamber === c.id ? "active" : ""}`}
              onClick={() => emit.enterChamber(c.id)}
            >
              {c.label}
              {c.id === "school" && canonCount > 0 && (
                <span className="rb-glyph-indicator rb-glyph-indicator--truth">{canonCount}</span>
              )}
              {c.id === "creation" && pendingArtifactCount > 0 && (
                <span className="rb-glyph-indicator rb-glyph-indicator--forge">{pendingArtifactCount}</span>
              )}
            </button>
          ))}
        </div>

        <button
          className="rb-rail-toggle"
          aria-label="Toggle canon panel"
          onClick={() => {
            setRightOpen((v) => !v);
            setLeftOpen(false);
          }}
        >
          Canon ≡
        </button>
      </header>

      <main className="rb-main">
        <div className="rb-main-col rb-main-col--work-nav">
          <ErrorBoundary label="Work navigation">
            <WorkNavRail
              onOpenThreads={() => {
                setLeftOpen(true);
                setRightOpen(false);
              }}
            />
          </ErrorBoundary>
        </div>

        <div className="rb-main-col rb-main-col--threads">
          <ErrorBoundary label="Thread strip">
            <ThreadStrip open={leftOpen} onClose={closeRails} />
          </ErrorBoundary>
        </div>

        <div className="rb-main-col rb-main-col--stage">
          <div className="rb-workstage">
            <ErrorBoundary label={`Chamber · ${p.chamber}`}>
              {p.chamber === "creation" && <CreationChamber />}
              {p.chamber === "lab" && <LabChamber />}
              {p.chamber === "school" && <SchoolChamber />}
              {p.chamber === "memory" && <MemoryChamber />}
            </ErrorBoundary>
          </div>
        </div>

        <div className="rb-main-col rb-main-col--canon">
          <ErrorBoundary label="Canon ribbon">
            <CanonRibbon open={rightOpen} onClose={closeRails} />
          </ErrorBoundary>
        </div>
      </main>

      <ErrorBoundary label="Event pulse">
        <EventPulse />
      </ErrorBoundary>
    </div>
  );
}
