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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "20px 40px 16px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "baseline",
        gap: 12,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)" }}>
          Creation
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Construção · Execução · Consequência
        </span>
        {tasks.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
            {done.length}/{tasks.length}
          </span>
        )}
      </div>

      {/* Task list */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px" }}>
        {tasks.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontFamily: "var(--mono)", marginTop: 8 }}>
            $ _
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          {pending.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
          {done.length > 0 && pending.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "12px 0" }} />
          )}
          {done.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
        </div>
      </div>

      {/* Terminal input */}
      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "14px 40px",
        background: "var(--bg-surface)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--mono)",
      }}>
        <span style={{ color: "var(--terminal-ok)", fontSize: 13 }}>$</span>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="nova tarefa..."
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 13, color: "var(--text-primary)",
            fontFamily: "var(--mono)",
          }}
        />
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        fontFamily: "var(--mono)",
      }}
    >
      <span style={{
        fontSize: 13,
        color: task.done ? "var(--terminal-ok)" : "var(--text-muted)",
        marginTop: 1,
        flexShrink: 0,
        width: 14,
      }}>
        {task.done ? "✓" : "›"}
      </span>
      <span style={{
        fontSize: 13,
        color: task.done ? "var(--text-muted)" : "var(--text-primary)",
        textDecoration: task.done ? "line-through" : "none",
        lineHeight: 1.5,
      }}>
        {task.title}
      </span>
    </div>
  );
}
