import "../sovereign-dock.css";
import { useEffect, useMemo, useState } from "react";
import { all, subscribe } from "../spine/eventLog";
import type { RuberraEvent } from "../spine/events";
import { emit, useProjection } from "../spine/store";
import { activePioneers, pioneerLoad } from "../spine/projections";

type PioneerId = "claude" | "cursor" | "codex" | "grok" | "framer";

const PIONEERS: Array<{
  id: PioneerId;
  label: string;
  descriptor: string;
  accent: string;
}> = [
  { id: "claude", label: "Claude", descriptor: "truth architect", accent: "gold" },
  { id: "cursor", label: "Cursor", descriptor: "window blade", accent: "blue" },
  { id: "codex", label: "Codex", descriptor: "clean executor", accent: "graphite" },
  { id: "grok", label: "Grok", descriptor: "live pulse", accent: "green" },
  { id: "framer", label: "Framer", descriptor: "motion grammar", accent: "violet" },
];

function summarizeEvent(event: RuberraEvent): string {
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  const text = typeof payload.text === "string" ? payload.text : null;
  const title = typeof payload.title === "string" ? payload.title : null;
  const label = typeof payload.label === "string" ? payload.label : null;
  const reason = typeof payload.reason === "string" ? payload.reason : null;
  const action = typeof payload.action === "string" ? payload.action : null;

  if (text) return text.length > 68 ? `${text.slice(0, 68)}…` : text;
  if (title) return title.length > 68 ? `${title.slice(0, 68)}…` : title;
  if (label) return label.length > 68 ? `${label.slice(0, 68)}…` : label;
  if (reason) return reason.length > 68 ? `${reason.slice(0, 68)}…` : reason;
  if (action) return action;
  return "projection updated";
}

function timeStamp(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function SovereignDock() {
  const p = useProjection();
  const [pioneer, setPioneer] = useState<PioneerId>("claude");
  const [command, setCommand] = useState("");
  const [events, setEvents] = useState<RuberraEvent[]>(() => all().slice(-10));
  const [error, setError] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => subscribe(() => setEvents(all().slice(-10))), []);

  const activeThread = p.threads.find((t) => t.id === p.activeThread);
  const running = p.executions.filter((x) => x.status === "running").length;
  const pendingReview = p.artifacts.filter((a) => a.review === "pending").length;
  const openTension = p.contradictions.filter((c) => !c.resolved && (!c.repo || c.repo === p.activeRepo)).length;
  const canonCount = p.canon.filter((c) => c.repo === p.activeRepo && c.state === "hardened").length;
  const memoryCount = p.memory.filter((m) => m.repo === p.activeRepo).length;

  const currentPioneer = PIONEERS.find((item) => item.id === pioneer) ?? PIONEERS[0];

  const advisory = useMemo(() => {
    const chamberLabel = p.chamber.charAt(0).toUpperCase() + p.chamber.slice(1);
    const repoSignal = p.activeRepo ? `repo bound · ${p.activeRepo}` : "repo unbound · no sovereign work can begin";
    const threadSignal = activeThread ? `thread active · ${activeThread.intent}` : "thread missing · the forge still has no scope";

    const byPioneer: Record<PioneerId, string[]> = {
      claude: [
        repoSignal,
        threadSignal,
        p.chamber === "school"
          ? `truth pressure sits at ${canonCount} law and ${openTension} tension. harden only what survives consequence.`
          : `the active chamber is ${chamberLabel}. preserve consequence chains before adding more surfaces.`,
      ],
      cursor: [
        `window hierarchy is the product now, not decoration. the dock must carry command gravity first.`,
        activeThread
          ? `keep the active thread in the operator's field. no blind composition without live context.`
          : `open a thread from the command deck and route directly into the forge.`,
        `tabs, frames, edge lines, and docking behaviour must feel intentional — not dashboard tiles.`,
      ],
      codex: [
        running > 0
          ? `${running} execution path${running > 1 ? "s are" : " is"} live. terminal output must stay authoritative.`
          : `execution substrate is idle. route a command to create real consequence.`,
        pendingReview > 0
          ? `${pendingReview} artifact${pendingReview > 1 ? "s" : ""} await review. keep review visible in the operator surface.`
          : `no review backlog detected right now.`,
        `clean beats theatrical. every interaction should map to a real mutation or a real read.`,
      ],
      grok: [
        openTension > 0
          ? `${openTension} unresolved tension${openTension > 1 ? "s" : ""} are still open. the pulse should make this impossible to ignore.`
          : `the pulse is calm, but calm is not depth by itself.`,
        `recent substrate activity: ${events.length} event${events.length === 1 ? "" : "s"} in the live log.`,
        `surface energy needs more liveness, not louder ornament. pulse, drift, reaction, continuity.`,
      ],
      framer: [
        `motion grammar is still underpowered. depth should come from layered response, parallax discipline, and softness at the edges.`,
        `apple-grade polish is mostly restraint: blur, light diffusion, state interpolation, and exact timing.`,
        `the dock gives you the frame. next wave should make transitions feel inevitable.`,
      ],
    };

    return byPioneer[pioneer];
  }, [activeThread, canonCount, events.length, openTension, p.activeRepo, p.chamber, pendingReview, pioneer, running]);

  const routeHint = !p.activeRepo
    ? "bind repo"
    : !activeThread
      ? "open thread"
      : p.chamber === "school"
        ? "propose canon"
        : p.chamber === "creation"
          ? "state concept"
          : p.chamber === "lab"
            ? "capture evidence or /tension"
            : "capture memory";

  async function routeCommand() {
    const value = command.trim();
    if (!value) return;
    setError(null);
    setIsRouting(true);
    try {
      if (!p.activeRepo) {
        await emit.bindRepo(value);
        await emit.seedCanon();
        await emit.enterChamber("creation");
      } else if (!activeThread) {
        await emit.openThread(value);
        await emit.enterChamber("creation");
      } else if (p.chamber === "school") {
        await emit.proposeCanon(value);
      } else if (p.chamber === "creation") {
        await emit.stateConcept(activeThread.id, `${currentPioneer.label} command`, value);
      } else if (p.chamber === "lab") {
        if (value.startsWith("/tension ")) {
          await emit.detectContradiction(value.replace(/^\/tension\s+/, "").trim());
        } else {
          await emit.captureMemory(value, activeThread.id);
        }
      } else {
        await emit.captureMemory(value, activeThread.id);
      }
      setCommand("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsRouting(false);
    }
  }

  return (
    <section className="rb-sovereign-dock" data-pioneer={pioneer}>
      <div className="rb-sovereign-dock-glow" aria-hidden="true" />

      <header className="rb-sovereign-dock-head">
        <div className="rb-sovereign-window-chrome" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="rb-sovereign-dock-titleblock">
          <div className="rb-sovereign-dock-kicker">sovereign operator surface</div>
          <div className="rb-sovereign-dock-title">Pioneer Dock</div>
        </div>

        <div className="rb-sovereign-pulsebar">
          <span className="rb-sovereign-pulsebar-dot" />
          <span>{running > 0 ? `${running} live execution` : "substrate monitoring"}</span>
          {openTension > 0 && <span className="rb-sovereign-pulsebar-alert">{openTension} tension</span>}
        </div>
      </header>

      <div className="rb-sovereign-tabs" role="tablist" aria-label="Pioneer tabs">
        {PIONEERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={pioneer === item.id}
            className={`rb-sovereign-tab${pioneer === item.id ? " active" : ""}`}
            onClick={() => setPioneer(item.id)}
          >
            <span className="rb-sovereign-tab-title">{item.label}</span>
            <span className="rb-sovereign-tab-sub">{item.descriptor}</span>
          </button>
        ))}
      </div>

      <div className="rb-sovereign-panels">
        <section className="rb-sovereign-chat">
          <div className="rb-sovereign-panel-head">
            <span className="rb-sovereign-panel-title">conversation field</span>
            <span className="rb-sovereign-panel-meta">{currentPioneer.label} focus</span>
          </div>

          <div className="rb-sovereign-messages">
            <div className="rb-sovereign-message rb-sovereign-message--system">
              <div className="rb-sovereign-message-role">system</div>
              <div className="rb-sovereign-message-text">
                chamber · {p.chamber} · repo {p.activeRepo ?? "unbound"} · thread {activeThread ? "active" : "missing"}
              </div>
            </div>

            {advisory.map((line, index) => (
              <div key={`${pioneer}-${index}`} className="rb-sovereign-message rb-sovereign-message--assistant">
                <div className="rb-sovereign-message-role">{currentPioneer.label}</div>
                <div className="rb-sovereign-message-text">{line}</div>
              </div>
            ))}
          </div>

          <div className="rb-sovereign-composer">
            <div className="rb-sovereign-composer-label">command route · {routeHint}</div>
            <div className="rb-sovereign-composer-row">
              <input
                className="rb-sovereign-composer-input"
                placeholder={!p.activeRepo ? "bind repo…" : !activeThread ? "open thread intent…" : `route via ${currentPioneer.label.toLowerCase()}…`}
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void routeCommand();
                  }
                }}
              />
              <button className="rb-sovereign-compose-btn" type="button" onClick={() => void routeCommand()} disabled={!command.trim() || isRouting}>
                {isRouting ? "routing" : "route"}
              </button>
            </div>
            {error && <div className="rb-sovereign-error">{error}</div>}
          </div>
        </section>

        <section className="rb-sovereign-terminal">
          <div className="rb-sovereign-panel-head">
            <span className="rb-sovereign-panel-title">terminal</span>
            <span className="rb-sovereign-panel-meta">append-only substrate</span>
          </div>

          <div className="rb-sovereign-terminal-strip">
            <span>law {canonCount}</span>
            <span>memory {memoryCount}</span>
            <span>review {pendingReview}</span>
            <span>pulse {events.length}</span>
          </div>

          {(() => {
            const load = pioneerLoad(p);
            const threadAssignments = activeThread
              ? activePioneers(p, { threadId: activeThread.id })
              : [];
            if (load.size === 0 && threadAssignments.length === 0) return null;
            return (
              <div className="rb-sovereign-pioneer-roster">
                <div className="rb-sovereign-pioneer-roster-label">pioneer roster</div>
                <div className="rb-sovereign-pioneer-roster-grid">
                  {PIONEERS.map((item) => {
                    const count = load.get(item.id as any) ?? 0;
                    const isActive = threadAssignments.some((a) => a.pioneer === item.id);
                    return (
                      <div key={item.id} className={`rb-sovereign-pioneer-cell${isActive ? " active" : ""}${count === 0 ? " idle" : ""}`}>
                        <span className="rb-sovereign-pioneer-cell-name">{item.label}</span>
                        <span className="rb-sovereign-pioneer-cell-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          <div className="rb-sovereign-terminal-log">
            {events.length === 0 ? (
              <div className="rb-sovereign-terminal-line">
                <span className="time">--:--:--</span>
                <span className="type">boot</span>
                <span className="text">event substrate idle</span>
              </div>
            ) : (
              events
                .slice()
                .reverse()
                .map((event) => (
                  <div key={event.id} className="rb-sovereign-terminal-line">
                    <span className="time">{timeStamp(event.ts)}</span>
                    <span className="type">{event.type}</span>
                    <span className="text">{summarizeEvent(event)}</span>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
