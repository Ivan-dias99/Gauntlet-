// Startup screen. Two modes: first visit (bind a repo) and return (resume).

import { useMemo, useState } from "react";
import { emit, useProjection } from "../spine/store";
import { nextMove } from "../spine/projections";

type ChamberId = "school" | "creation" | "lab" | "memory";
type ThemeMode = "dark" | "light";

interface Props {
  onEnter: () => void;
  returning?: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const ENTRY_CHAMBERS: Array<{
  id: ChamberId;
  title: string;
  signal: string;
  body: string;
}> = [
  {
    id: "creation",
    title: "Creation",
    signal: "build",
    body: "compose directives and review artifacts",
  },
  {
    id: "school",
    title: "School",
    signal: "rules",
    body: "repo canon and policies",
  },
  {
    id: "lab",
    title: "Lab",
    signal: "run",
    body: "execute directives and capture evidence",
  },
  {
    id: "memory",
    title: "Memory",
    signal: "notes",
    body: "retained observations and outcomes",
  },
];

export function RitualEntry({ onEnter, returning, theme, onToggleTheme }: Props) {
  const p = useProjection();
  const [name, setName] = useState("");
  const [selectedChamber, setSelectedChamber] = useState<ChamberId>(
    (p.chamber as ChamberId) || "creation",
  );

  const entryStats = useMemo(() => {
    const canonCount = p.canon.filter((c) => c.state === "hardened" && c.repo === p.activeRepo).length;
    const memoryCount = p.memory.filter((m) => m.repo === p.activeRepo).length;
    const threadCount = p.threads.filter((t) => t.repo === p.activeRepo && t.status === "open").length;
    const executionCount = p.executions.filter((x) => x.status === "running").length;
    const artifactCount = p.artifacts.filter((a) => a.review === "pending").length;
    const tensionCount = p.contradictions.filter((c) => !c.resolved && (!c.repo || c.repo === p.activeRepo)).length;
    return { canonCount, memoryCount, threadCount, executionCount, artifactCount, tensionCount };
  }, [p]);

  const launch = async (repoName: string, chamber: ChamberId) => {
    await emit.bindRepo(repoName.trim());
    await emit.seedCanon();
    await emit.enterChamber(chamber);
    onEnter();
  };

  if (returning && p.activeRepo) {
    const openThreads = entryStats.threadCount;
    const canonCount = entryStats.canonCount;
    const memoryCount = entryStats.memoryCount;
    const unresolvedCount = entryStats.tensionCount;
    const activeThreadObj = p.threads.find((t) => t.id === p.activeThread);
    const pendingReviews =
      activeThreadObj && activeThreadObj.status === "open"
        ? p.artifacts.filter(
            (a) => a.review === "pending" && a.thread === activeThreadObj.id,
          ).length
        : 0;
    const openConcepts =
      activeThreadObj && activeThreadObj.status === "open"
        ? p.concepts.filter((c) => !c.promoted && c.thread === activeThreadObj.id).length
        : 0;
    const move = nextMove(p);
    const hasForgeWork = pendingReviews > 0;

    return (
      <div className="rb-ritual rb-ritual--return">
        <div className="inner rb-return-inner rb-entry-shell">
          <div className="rb-entry-toolbar">
            <div className="rb-entry-kicker">return</div>
            <button className="rb-theme-toggle" onClick={onToggleTheme} type="button">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          <h1>
            RUB<span>E</span>RRA
          </h1>
          <div className="rb-return-repo">{p.activeRepo}</div>

          <div className="rb-entry-stats rb-entry-stats--return">
            <div className="rb-entry-stat"><span className="label">canon</span><span className="value">{canonCount}</span></div>
            <div className="rb-entry-stat"><span className="label">memory</span><span className="value">{memoryCount}</span></div>
            <div className="rb-entry-stat"><span className="label">threads</span><span className="value">{openThreads}</span></div>
            <div className="rb-entry-stat"><span className="label">review</span><span className="value">{pendingReviews}</span></div>
          </div>

          <div className="rb-return-state">
            <div className="rb-return-row">
              <span className="rb-return-label">state</span>
              <span className="rb-return-value">{move}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">concepts</span>
              <span className="rb-return-value">{openConcepts}</span>
            </div>
            <div className="rb-return-row">
              <span className="rb-return-label">execution</span>
              <span className="rb-return-value">{entryStats.executionCount}</span>
            </div>
            <div className={`rb-return-row${unresolvedCount > 0 ? " rb-return-row--warn" : ""}`}>
              <span className="rb-return-label">tension</span>
              <span className="rb-return-value">{unresolvedCount}</span>
            </div>
          </div>

          <div className="rb-entry-chambers">
            {ENTRY_CHAMBERS.map((chamber) => (
              <button
                key={chamber.id}
                type="button"
                className={`rb-entry-chamber${selectedChamber === chamber.id ? " active" : ""}`}
                onClick={() => setSelectedChamber(chamber.id)}
              >
                <span className="rb-entry-chamber-kicker">{chamber.signal}</span>
                <span className="rb-entry-chamber-title">{chamber.title}</span>
                <span className="rb-entry-chamber-body">{chamber.body}</span>
              </button>
            ))}
          </div>

          <button
            className={`rb-btn primary rb-return-enter${hasForgeWork ? " rb-return-enter--forge" : ""}`}
            onClick={() => {
              emit.enterChamber(hasForgeWork ? "creation" : selectedChamber);
              onEnter();
            }}
          >
            {hasForgeWork
              ? `Review pending (${pendingReviews})`
              : `Open ${ENTRY_CHAMBERS.find((c) => c.id === selectedChamber)?.title ?? "Chamber"}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rb-ritual rb-ritual--flagship">
      <div className="inner rb-entry-shell">
        <div className="rb-entry-toolbar">
          <div className="rb-entry-kicker">start</div>
          <button className="rb-theme-toggle" onClick={onToggleTheme} type="button">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <h1>
          RUB<span>E</span>RRA
        </h1>

        <div className="rb-entry-stats">
          <div className="rb-entry-stat"><span className="label">shell</span><span className="value">active</span></div>
          <div className="rb-entry-stat"><span className="label">chambers</span><span className="value">4</span></div>
          <div className="rb-entry-stat"><span className="label">mode</span><span className="value">{theme}</span></div>
          <div className="rb-entry-stat"><span className="label">repo</span><span className="value">unbound</span></div>
        </div>

        <div className="rb-entry-chambers">
          {ENTRY_CHAMBERS.map((chamber) => (
            <button
              key={chamber.id}
              type="button"
              className={`rb-entry-chamber${selectedChamber === chamber.id ? " active" : ""}`}
              onClick={() => setSelectedChamber(chamber.id)}
            >
              <span className="rb-entry-chamber-kicker">{chamber.signal}</span>
              <span className="rb-entry-chamber-title">{chamber.title}</span>
              <span className="rb-entry-chamber-body">{chamber.body}</span>
            </button>
          ))}
        </div>

        <div className="rb-ritual-bind">
          <label className="rb-field-label">repo</label>
          <input
            className="rb-input"
            placeholder="repository name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                void launch(name, selectedChamber);
              }
            }}
          />
          <button
            className="rb-btn primary"
            disabled={!name.trim()}
            onClick={() => void launch(name, selectedChamber)}
          >
            Open {ENTRY_CHAMBERS.find((c) => c.id === selectedChamber)?.title ?? "Chamber"}
          </button>
        </div>
      </div>
    </div>
  );
}
