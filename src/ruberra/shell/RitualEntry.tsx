// Ruberra — Ritual Entry. The first surface. Must carry weight.
// Two modes:
//   1. First encounter — initiation. Bind repo. Sparse, sovereign.
//   2. Return — recognition. System acknowledges continuity before re-entry.
// No explanation-first. No setup-wizard energy. The system is already running.
// Principal-architect identity: entry leads to Creation, not discovery.

import { useMemo, useState } from "react";
import { emit, useProjection } from "../spine/store";
import { nextMove } from "../spine/projections";
import { AccessSeal } from "../surfaces/AccessSeal";

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
    signal: "forge",
    body: "directive composition, blueprint pressure, artifact review",
  },
  {
    id: "school",
    title: "School",
    signal: "truth",
    body: "mission canon, doctrine pressure, hardened law",
  },
  {
    id: "lab",
    title: "Lab",
    signal: "validation",
    body: "execution trace, contradiction field, evidence capture",
  },
  {
    id: "memory",
    title: "Memory",
    signal: "substrate",
    body: "resonance, retained consequence, organism recall",
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
            <div className="rb-entry-kicker">return gate</div>
            <button className="rb-theme-toggle" onClick={onToggleTheme} type="button">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>

          <h1>
            RUB<span>E</span>RRA
          </h1>
          <div className="rb-ritual-subtitle">Architect Station</div>
          <div className="rb-entry-intro">
            continuity recognized. the organism can reopen at the exact chamber where pressure matters most.
          </div>
          <div className="rb-return-repo">{p.activeRepo}</div>

          <div className="rb-entry-stats rb-entry-stats--return">
            <div className="rb-entry-stat"><span className="label">canon</span><span className="value">{canonCount}</span></div>
            <div className="rb-entry-stat"><span className="label">memory</span><span className="value">{memoryCount}</span></div>
            <div className="rb-entry-stat"><span className="label">threads</span><span className="value">{openThreads}</span></div>
            <div className="rb-entry-stat"><span className="label">review</span><span className="value">{pendingReviews}</span></div>
          </div>

          <AccessSeal
            mode="return"
            repo={p.activeRepo}
            state={move}
            openThreads={openThreads}
            canonCount={canonCount}
            memoryCount={memoryCount}
            unresolvedCount={unresolvedCount}
            pendingReviews={pendingReviews}
          />

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
            {hasForgeWork ? "Enter Forge · Review" : `Resume · ${ENTRY_CHAMBERS.find((c) => c.id === selectedChamber)?.title ?? "Chamber"}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rb-ritual rb-ritual--flagship">
      <div className="inner rb-entry-shell">
        <div className="rb-entry-toolbar">
          <div className="rb-entry-kicker">foundry gate</div>
          <button className="rb-theme-toggle" onClick={onToggleTheme} type="button">
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <h1>
          RUB<span>E</span>RRA
        </h1>
        <div className="rb-ritual-subtitle">Architect Creation System</div>
        <div className="rb-ritual-identity">
          concept · directive · consequence · canon
        </div>
        <div className="rb-entry-intro">
          one sovereign mission organism for building, validating, retaining, and hardening what matters.
        </div>

        <div className="rb-entry-stats">
          <div className="rb-entry-stat"><span className="label">shell</span><span className="value">active</span></div>
          <div className="rb-entry-stat"><span className="label">chambers</span><span className="value">4</span></div>
          <div className="rb-entry-stat"><span className="label">mode</span><span className="value">{theme}</span></div>
          <div className="rb-entry-stat"><span className="label">bind</span><span className="value">repo</span></div>
        </div>

        <AccessSeal mode="bind" />

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
            placeholder="bind repo to begin"
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
            Bind · Enter {ENTRY_CHAMBERS.find((c) => c.id === selectedChamber)?.title ?? "Forge"}
          </button>
        </div>
      </div>
    </div>
  );
}
