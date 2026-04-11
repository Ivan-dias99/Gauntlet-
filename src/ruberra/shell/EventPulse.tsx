// Ruberra — Event Pulse. Direct read of the event log. Ambient truth strip.
// Includes System Health Model and Intelligence Analytics derived from the projection.

import { useEffect, useState } from "react";
import { all, subscribe } from "../spine/eventLog";
import { RuberraEvent } from "../spine/events";
import { useProjection } from "../spine/store";
import { systemHealth, activeAnomalies, executionAnalytics } from "../spine/projections";

function consequenceColor(type: string): string | undefined {
  switch (type) {
    case "execution.started": return "var(--rb-warn)";
    case "execution.succeeded": return "var(--rb-ok)";
    case "execution.failed": return "var(--rb-bad)";
    case "artifact.generated": return "var(--rb-gold)";
    case "artifact.reviewed":
    case "artifact.committed": return "var(--rb-ok)";
    case "anomaly.detected": return "var(--rb-bad)";
    case "anomaly.resolved": return "var(--rb-ok)";
    case "system.health.snapshot": return "var(--rb-info, #6ea8fe)";
    default: return undefined;
  }
}

function healthColor(score: number): string {
  if (score >= 80) return "var(--rb-ok)";
  if (score >= 50) return "var(--rb-warn)";
  return "var(--rb-bad)";
}

export function EventPulse() {
  const p = useProjection();
  const [events, setEvents] = useState<RuberraEvent[]>(() => all().slice(-6));

  useEffect(() => subscribe(() => setEvents(all().slice(-6))), []);

  const health = systemHealth(p);
  const anomalies = activeAnomalies(p);
  const execAnalytics = executionAnalytics(p);

  const runningExec = execAnalytics.running;
  const failedExec = execAnalytics.failed;
  const openTensions = p.contradictions.filter(
    (c) => !c.resolved && (!c.repo || c.repo === p.activeRepo),
  ).length;
  const pendingRevs = p.artifacts.filter((a) => a.review === "pending").length;
  const hasProblems = failedExec > 0 || openTensions > 0 || anomalies.length > 0;
  const isIdle = runningExec === 0 && !hasProblems && pendingRevs === 0;
  const hasAnyExec = execAnalytics.total > 0;

  return (
    <footer className="rb-pulse">
      <div className="rb-pulse-signal">
        <span className="dot" />
        <span className="label">TRUTH SIGNAL</span>
        {(hasAnyExec || anomalies.length > 0) && (
          <span
            className="rb-health-score"
            style={{ color: healthColor(health.healthScore), marginLeft: 8, fontWeight: 600, fontSize: "0.75rem" }}
          >
            HEALTH {health.healthScore}
          </span>
        )}
      </div>

      <div className="rb-pulse-log">
        <span className="rb-pulse-meta">SUBSTRATE</span>
        {events.length === 0 ? (
          <span className="event">— log empty —</span>
        ) : (
          events
            .slice()
            .reverse()
            .map((e) => {
              const color = consequenceColor(e.type);
              return (
                <span key={e.id} className="event">
                  <b style={color ? { color } : undefined}>{e.type}</b>{" "}
                  {new Date(e.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              );
            })
        )}
      </div>

      {(runningExec > 0 || hasProblems || pendingRevs > 0 || (isIdle && hasAnyExec)) && (
        <div className="rb-row" style={{ gap: 6, flexWrap: "wrap" }}>
          {runningExec > 0 && <span className="rb-badge warn">{runningExec} executing</span>}
          {failedExec > 0 && <span className="rb-badge bad">{failedExec} failed</span>}
          {openTensions > 0 && <span className="rb-badge warn">{openTensions} tension{openTensions > 1 ? "s" : ""}</span>}
          {anomalies.length > 0 && <span className="rb-badge bad">{anomalies.length} anomal{anomalies.length > 1 ? "ies" : "y"}</span>}
          {pendingRevs > 0 && <span className="rb-badge gold">{pendingRevs} review{pendingRevs > 1 ? "s" : ""}</span>}
          {isIdle && hasAnyExec && <span className="rb-badge ok">system clear</span>}
        </div>
      )}

      {anomalies.length > 0 && (
        <div className="rb-pulse-anomalies" style={{ fontSize: "0.7rem", opacity: 0.8, paddingTop: 2 }}>
          {anomalies.slice(0, 3).map((a) => (
            <div key={a.id} className="rb-anomaly-line">
              <span className="rb-badge bad" style={{ fontSize: "0.65rem" }}>{a.kind}</span>{" "}
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rb-pulse-authority">
        {p.activeRepo && <span className="rb-pulse-repo">{p.activeRepo}</span>}
        <span className="canon-ribbon">append-only · authoritative</span>
      </div>
    </footer>
  );
}
