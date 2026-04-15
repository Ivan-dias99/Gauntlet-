import { useSpine } from "../spine/SpineContext";
import { LogEvent } from "../spine/types";

const DOT: Record<LogEvent["type"], string> = {
  mission_created: "#4a7a5a",
  note_added:      "#4a5a7a",
  task_added:      "#7a6a4a",
  task_done:       "#c4b89a",
};

export default function Memory() {
  const { activeMission } = useSpine();
  const events = activeMission?.events ?? [];

  return (
    <div style={{ padding: "40px 56px", maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#3a3530", marginBottom: 32 }}>
        Memory · Memória Viva
      </div>

      {!events.length && (
        <p style={{ fontSize: 13, color: "#3a3530" }}>Sem eventos registados.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {events.map((e, i) => (
          <div key={e.id} style={{
            display: "flex",
            gap: 20,
            paddingBottom: 20,
            marginLeft: 6,
            paddingLeft: 20,
            borderLeft: i < events.length - 1 ? "1px solid #1c1c1c" : "1px solid transparent",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              left: -4,
              top: 5,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: DOT[e.type] ?? "#3a3530",
            }} />
            <div>
              <div style={{ fontSize: 13, color: "#7a7060" }}>{e.label}</div>
              <div style={{ fontSize: 10, color: "#3a3530", marginTop: 4 }}>
                {new Date(e.at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
