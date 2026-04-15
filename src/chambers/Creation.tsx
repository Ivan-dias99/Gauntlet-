import { useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { Task } from "../spine/types";

export default function Creation() {
  const { activeMission, addTask, completeTask } = useSpine();
  const [input, setInput] = useState("");

  function submit() {
    const v = input.trim();
    if (!v) return;
    addTask(v);
    setInput("");
  }

  const tasks = activeMission?.tasks ?? [];
  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div style={{ padding: "40px 56px", maxWidth: 720, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#3a3530", marginBottom: 32 }}>
        Creation · Construção
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 40, alignItems: "center" }}>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Nova tarefa de execução..."
          style={{
            flex: 1, background: "none", border: "none",
            borderBottom: "1px solid #222", outline: "none",
            fontSize: 14, color: "#e8e4df", padding: "6px 0",
            fontFamily: "system-ui, sans-serif",
          }}
        />
        <button onClick={submit} style={btn}>+</button>
      </div>

      {!tasks.length && (
        <p style={{ fontSize: 13, color: "#3a3530" }}>Nenhuma tarefa criada.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {pending.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
        {done.length > 0 && pending.length > 0 && (
          <div style={{ borderTop: "1px solid #141414", margin: "8px 0" }} />
        )}
        {done.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "10px 0", cursor: "pointer",
        borderBottom: "1px solid #141414",
      }}
    >
      <div style={{
        width: 14, height: 14, borderRadius: 2, flexShrink: 0,
        border: `1px solid ${task.done ? "#c4b89a" : "#3a3530"}`,
        background: task.done ? "#c4b89a18" : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {task.done && <span style={{ fontSize: 9, color: "#c4b89a" }}>✓</span>}
      </div>
      <span style={{
        fontSize: 14,
        color: task.done ? "#3a3530" : "#a09880",
        textDecoration: task.done ? "line-through" : "none",
      }}>
        {task.title}
      </span>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "none", border: "1px solid #2a2520",
  color: "#c4b89a", width: 32, height: 32, flexShrink: 0,
  cursor: "pointer", fontSize: 18, borderRadius: 2,
};
