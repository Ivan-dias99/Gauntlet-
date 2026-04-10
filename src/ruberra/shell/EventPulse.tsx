// Ruberra — Event Pulse. Direct read of the event log. Ambient truth strip.

import { useEffect, useState } from "react";
import { all, subscribe } from "../spine/eventLog";
import { RuberraEvent } from "../spine/events";
import { useProjection } from "../spine/store";

// Maps consequence-significant event types to a CSS color variable.
// All other types fall back to the default `.rb-pulse .event b` style (--rb-ink).
function consequenceColor(type: string): string | undefined {
  switch (type) {
    case "execution.started":    return "var(--rb-warn)";
    case "execution.succeeded":  return "var(--rb-ok)";
    case "execution.failed":     return "var(--rb-bad)";
    case "artifact.generated":   return "var(--rb-gold)";
    case "artifact.reviewed":
    case "artifact.committed":   return "var(--rb-ok)";
    default:                     return undefined;
  }
}

export function EventPulse() {
  const p = useProjection();
  const [events, setEvents] = useState<RuberraEvent[]>(() => all().slice(-6));
  useEffect(() => {
    return subscribe(() => setEvents(all().slice(-6)));
  }, []);

  return (
    <footer className="rb-pulse">
      <div className="rb-pulse-signal">
        <span className="dot" />
        <span className="label">TRUTH SIGNAL</span>
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

      <div className="rb-pulse-authority">
        {p.activeRepo && (
          <span className="rb-pulse-repo">{p.activeRepo}</span>
        )}
        <span className="canon-ribbon">append-only · authoritative</span>
      </div>
    </footer>
  );
}
