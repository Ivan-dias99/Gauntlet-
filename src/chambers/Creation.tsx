import { useRef, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRubeira, AgentEvent } from "../hooks/useRubeira";
import { Task } from "../spine/types";

interface LiveTool {
  id: string;
  name: string;
  input?: unknown;
  iteration: number;
  ok?: boolean;
  preview?: string;
}

interface DoneSummary {
  answer: string;
  iterations: number;
  tool_count: number;
  processing_time_ms: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

export default function Creation() {
  const { activeMission, addTask, completeTask, principles } = useSpine();
  const { streamDev, pending } = useRubeira();
  const [input, setInput] = useState("");
  const [lastTask, setLastTask] = useState("");
  const [err, setErr] = useState<string | null>(null);

  // Live state during streaming
  const [iteration, setIteration] = useState(0);
  const [liveTools, setLiveTools] = useState<LiveTool[]>([]);
  const [liveText, setLiveText] = useState("");
  const [done, setDone] = useState<DoneSummary | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    addTask(v);
    setInput("");
    setLastTask(v);
    setErr(null);
    setIteration(0);
    setLiveTools([]);
    setLiveText("");
    setDone(null);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    await streamDev(
      {
        question: `Task declared: ${v}`,
        context: activeMission?.title,
        mission_id: activeMission?.id,
        principles: principles.length ? principles.map(p => p.text) : undefined,
      },
      (ev: AgentEvent) => {
        switch (ev.type) {
          case "iteration":
            setIteration(ev.n);
            break;
          case "assistant_text":
            setLiveText(prev => (prev ? prev + "\n\n" : "") + ev.text);
            break;
          case "tool_use":
            setLiveTools(prev => [
              ...prev,
              { id: ev.id, name: ev.name, input: ev.input, iteration: ev.iteration },
            ]);
            break;
          case "tool_result":
            setLiveTools(prev =>
              prev.map(t => (t.id === ev.id ? { ...t, ok: ev.ok, preview: ev.preview } : t)),
            );
            break;
          case "done":
            setDone({
              answer: ev.answer,
              iterations: ev.iterations,
              tool_count: ev.tool_calls.length,
              processing_time_ms: ev.processing_time_ms,
              terminated_early: ev.terminated_early,
              termination_reason: ev.termination_reason,
            });
            break;
          case "error":
            setErr(ev.message);
            break;
        }
      },
      ac.signal,
    );
  }

  const tasks = activeMission?.tasks ?? [];
  const doneTasks = tasks.filter(t => t.done);
  const pendingTasks = tasks.filter(t => !t.done);

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
            {doneTasks.length}/{tasks.length}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: 0 }}>

        {tasks.length === 0 && !done && !pending && !err && (
          <div style={{ fontSize: 12, color: "var(--text-ghost)", fontFamily: "var(--mono)", marginTop: 8 }}>
            $ _
          </div>
        )}

        <div style={{ maxWidth: 720 }}>
          {pendingTasks.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
          {doneTasks.length > 0 && pendingTasks.length > 0 && (
            <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "10px 0" }} />
          )}
          {doneTasks.map(t => <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />)}
        </div>

        {(pending || liveTools.length > 0 || liveText) && (
          <div style={{
            marginTop: 20, maxWidth: 720,
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: `2px solid ${done ? "var(--terminal-ok)" : "var(--terminal-warn)"}`,
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            fontFamily: "var(--mono)",
          }}>
            <div style={{
              fontSize: 10, color: done ? "var(--terminal-ok)" : "var(--terminal-warn)",
              letterSpacing: 1.5, display: "flex", gap: 12, alignItems: "baseline",
            }}>
              <span>{done ? "EXEC" : "AGENT"} › {lastTask.slice(0, 48)}</span>
              <span style={{ color: "var(--text-ghost)", marginLeft: "auto" }}>
                {done
                  ? `${done.iterations} iter · ${done.tool_count} tools · ${done.processing_time_ms}ms`
                  : `iter ${iteration} · ${liveTools.length} tools`}
              </span>
            </div>

            {liveTools.length > 0 && (
              <div style={{
                fontSize: 11, color: "var(--text-ghost)",
                marginTop: 10, paddingTop: 8,
                borderTop: "1px solid var(--border-subtle)",
              }}>
                {liveTools.map(tc => (
                  <div key={tc.id} style={{ marginBottom: 2 }}>
                    <span style={{
                      color: tc.ok === undefined
                        ? "var(--terminal-warn)"
                        : tc.ok ? "var(--terminal-ok)" : "#c44",
                    }}>
                      {tc.ok === undefined ? "⋯" : tc.ok ? "✓" : "✗"}
                    </span>
                    {" "}
                    <span style={{ color: "var(--text-muted)" }}>{tc.name}</span>
                    {tc.input ? (
                      <span style={{ color: "var(--text-ghost)" }}>
                        {" "}{JSON.stringify(tc.input).slice(0, 80)}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {(liveText || done) && (
              <div style={{
                marginTop: 10, paddingTop: 8,
                borderTop: "1px solid var(--border-subtle)",
                fontSize: 12, color: "var(--text-secondary)",
                lineHeight: 1.8, whiteSpace: "pre-wrap",
              }}>
                {done ? done.answer : liveText}
              </div>
            )}

            {done?.terminated_early && (
              <div style={{ fontSize: 10, color: "var(--terminal-warn)", marginTop: 8 }}>
                terminado cedo: {done.termination_reason}
              </div>
            )}
          </div>
        )}

        {err && (
          <div style={{
            marginTop: 20, maxWidth: 720,
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid #c44",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            fontFamily: "var(--mono)",
          }}>
            <div style={{ fontSize: 10, color: "#c44", letterSpacing: 1.5 }}>ERRO</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, whiteSpace: "pre-wrap" }}>
              {err}
            </div>
          </div>
        )}
      </div>

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
          placeholder={pending ? "executando agente..." : "nova tarefa..."}
          disabled={pending}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 13, color: "var(--text-primary)",
            fontFamily: "var(--mono)",
            opacity: pending ? 0.5 : 1,
          }}
        />
        {pending && (
          <span style={{ fontSize: 10, color: "var(--terminal-warn)", letterSpacing: 1 }}>▊</span>
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
