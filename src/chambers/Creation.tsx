import { useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useAI } from "../hooks/useAI";
import { Task } from "../spine/types";

const SYSTEM = `You are the Creation intelligence of Ruberra — a sovereign operating system for architects who execute with consequence.

Your function: when a task is declared, respond with the precise execution vector.
- Output format: terminal style. Direct. Numbered steps if needed.
- No motivation, no congratulations. Only what must be done and how.
- Max 4 lines. If the task is clear and atomic, confirm with a single line.
- You are not an assistant. You are an execution engine.`;

export default function Creation() {
  const { activeMission, addTask, completeTask } = useSpine();
  const { send, streaming } = useAI();
  const [input, setInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [lastTask, setLastTask] = useState("");

  function submit() {
    const v = input.trim();
    if (!v || streaming) return;

    addTask(v);
    setInput("");
    setLastTask(v);

    let accumulated = "";
    setAiOutput("▊");

    send(
      SYSTEM,
      [{ role: "user", content: `Task declared: ${v}` }],
      (chunk) => {
        accumulated += chunk;
        setAiOutput(accumulated + "▊");
      },
      (ok) => {
        setAiOutput(ok ? accumulated : "");
      },
    );
  }

  const tasks = activeMission?.tasks ?? [];
  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "18px 40px 14px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "baseline", gap: 12,
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
      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: 0 }}>

        {tasks.length === 0 && !aiOutput && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)", fontFamily: "var(--mono)", marginTop: 8 }}>
            $ _
          </div>
        )}

        <div style={{ maxWidth: 680 }}>
          {pending.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
          {done.length > 0 && pending.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "10px 0" }} />
          )}
          {done.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
        </div>

        {/* AI terminal output */}
        {aiOutput && (
          <div style={{
            marginTop: 20,
            maxWidth: 680,
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--terminal-ok)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            fontFamily: "var(--mono)",
          }}>
            <div style={{ fontSize: 10, color: "var(--terminal-ok)", marginBottom: 8, letterSpacing: 1.5 }}>
              EXEC › {lastTask.slice(0, 48)}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {aiOutput}
            </div>
          </div>
        )}
      </div>

      {/* Terminal input */}
      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "14px 40px",
        background: "var(--bg-surface)",
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: "var(--mono)",
      }}>
        <span style={{ color: "var(--terminal-ok)", fontSize: 13, flexShrink: 0 }}>$</span>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder={streaming ? "executando..." : "nova tarefa..."}
          disabled={streaming}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 13, color: "var(--text-primary)",
            fontFamily: "var(--mono)",
            opacity: streaming ? 0.5 : 1,
          }}
        />
        {streaming && (
          <span style={{ fontSize: 10, color: "var(--terminal-ok)", letterSpacing: 1 }}>▊</span>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "9px 0",
      borderBottom: "1px solid var(--border-subtle)",
      cursor: "pointer", fontFamily: "var(--mono)",
    }}>
      <span style={{
        fontSize: 13,
        color: task.done ? "var(--terminal-ok)" : "var(--text-muted)",
        flexShrink: 0, width: 14, marginTop: 1,
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
