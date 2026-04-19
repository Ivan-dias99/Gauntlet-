import { useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRuberra } from "../hooks/useRuberra";
import { Task } from "../spine/types";

interface ToolCall {
  name: string;
  input?: unknown;
  ok: boolean;
  content_preview?: string;
}

interface AgentResult {
  mode?: string;
  answer?: string;
  tool_calls?: ToolCall[];
  iterations?: number;
  stop_reason?: string;
  terminated_early?: boolean;
  termination_reason?: string | null;
  processing_time_ms?: number;
}

export default function Creation() {
  const { activeMission, addTask, completeTask, principles } = useSpine();
  const { call, pending } = useRuberra();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);
  const [lastTask, setLastTask] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    addTask(v);
    setInput("");
    setLastTask(v);
    setResult(null);
    setErr(null);

    try {
      const r = (await call("dev", {
        question: `Task declared: ${v}`,
        context: activeMission?.title,
        mission_id: activeMission?.id,
        principles: principles.length ? principles.map(p => p.text) : undefined,
      })) as AgentResult;
      setResult(r);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
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

        {tasks.length === 0 && !result && !pending && !err && (
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

        {pending && (
          <div style={{
            marginTop: 20, maxWidth: 720,
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--terminal-warn)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            fontFamily: "var(--mono)",
          }}>
            <div style={{ fontSize: 10, color: "var(--terminal-warn)", letterSpacing: 1.5 }}>
              AGENT › {lastTask.slice(0, 48)}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-ghost)", marginTop: 8 }}>
              a pensar, ler repo, correr tools…
            </div>
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

        {result && !pending && (
          <div style={{
            marginTop: 20, maxWidth: 720,
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--terminal-ok)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            fontFamily: "var(--mono)",
          }}>
            <div style={{
              fontSize: 10, color: "var(--terminal-ok)", marginBottom: 8,
              letterSpacing: 1.5, display: "flex", gap: 12,
            }}>
              <span>EXEC › {lastTask.slice(0, 48)}</span>
              {result.iterations != null && (
                <span style={{ color: "var(--text-ghost)" }}>
                  {result.iterations} iter · {result.tool_calls?.length ?? 0} tools
                </span>
              )}
            </div>

            {result.tool_calls && result.tool_calls.length > 0 && (
              <div style={{
                fontSize: 11, color: "var(--text-ghost)",
                marginBottom: 10, borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: 8,
              }}>
                {result.tool_calls.map((tc, i) => (
                  <div key={i} style={{ marginBottom: 2 }}>
                    <span style={{ color: tc.ok ? "var(--terminal-ok)" : "#c44" }}>
                      {tc.ok ? "✓" : "✗"}
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

            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {result.answer || "(sem resposta)"}
            </div>

            {result.terminated_early && (
              <div style={{ fontSize: 10, color: "var(--terminal-warn)", marginTop: 8 }}>
                terminado cedo: {result.termination_reason}
              </div>
            )}
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
