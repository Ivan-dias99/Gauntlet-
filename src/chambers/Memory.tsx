import { useSpine } from "../spine/SpineContext";
import { LogEvent } from "../spine/types";

const TYPE_LABEL: Record<LogEvent["type"], string> = {
  mission_created: "INIT",
  note_added:      "NOTE",
  task_added:      "TASK",
  task_done:       "DONE",
  ai_response:     "AI",
};

const TYPE_COLOR: Record<LogEvent["type"], string> = {
  mission_created: "var(--accent)",
  note_added:      "#6a8aaa",
  task_added:      "var(--text-muted)",
  task_done:       "var(--terminal-ok)",
  ai_response:     "var(--terminal-warn)",
};

export default function Memory() {
  const { activeMission } = useSpine();
  const events = activeMission?.events ?? [];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "20px 40px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "baseline",
        gap: 12,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)" }}>
          Memory
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Memória Viva · Retenção · Inteligência
        </span>
        {events.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
            {events.length} eventos
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 40px", fontFamily: "var(--mono)" }}>
        {events.length === 0 && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)" }}>
            — log vazio —
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 720 }}>
          {events.map(e => (
            <div key={e.id} style={{
              display: "grid",
              gridTemplateColumns: "52px 1fr auto",
              gap: "0 16px",
              alignItems: "baseline",
              padding: "6px 0",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <span style={{
                fontSize: 9,
                letterSpacing: 1.5,
                color: TYPE_COLOR[e.type],
                textTransform: "uppercase",
              }}>
                {TYPE_LABEL[e.type]}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {e.label}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-ghost)", whiteSpace: "nowrap" }}>
                {new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
