// Ruberra — Event Pulse. Direct read of the event log. Ambient truth strip.

import { useEffect, useState } from "react";
import { all, subscribe } from "../spine/eventLog";
import { RuberraEvent } from "../spine/events";

export function EventPulse() {
  const [events, setEvents] = useState<RuberraEvent[]>(() => all().slice(-6));
  useEffect(() => {
    return subscribe(() => setEvents(all().slice(-6)));
  }, []);
  return (
    <footer className="rb-pulse">
      <span className="dot" />
      <span className="event" style={{ color: "var(--rb-ink)" }}>
        event pulse
      </span>
      {events.length === 0 ? (
        <span className="event">— log empty —</span>
      ) : (
        events
          .slice()
          .reverse()
          .map((e) => (
            <span key={e.id} className="event">
              <b>{e.type}</b>{" "}
              {new Date(e.ts).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          ))
      )}
      <span className="canon-ribbon">append-only · authoritative</span>
    </footer>
  );
}
