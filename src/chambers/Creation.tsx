import { useRef, useState, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRubeira, AgentEvent } from "../hooks/useRubeira";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
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
  const { values } = useTweaks();
  const copy = useCopy();
  const layout = values.creationLayout;
  const [input, setInput] = useState("");
  const [lastTask, setLastTask] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [iteration, setIteration] = useState(0);
  const [liveTools, setLiveTools] = useState<LiveTool[]>([]);
  const [liveText, setLiveText] = useState("");
  const [done, setDone] = useState<DoneSummary | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pending) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, [pending]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [liveText, liveTools.length, done]);

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
    setElapsed(0);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    await streamDev(
      {
        question: `Task declared: ${v}`,
        context: activeMission?.title,
        mission_id: activeMission?.id,
        principles: principles.length ? principles.map((p) => p.text) : undefined,
      },
      (ev: AgentEvent) => {
        switch (ev.type) {
          case "iteration":
            setIteration(ev.n);
            break;
          case "assistant_text":
            setLiveText((prev) => (prev ? prev + "\n\n" : "") + ev.text);
            break;
          case "tool_use":
            setLiveTools((prev) => [
              ...prev,
              { id: ev.id, name: ev.name, input: ev.input, iteration: ev.iteration },
            ]);
            break;
          case "tool_result":
            setLiveTools((prev) =>
              prev.map((t) => (t.id === ev.id ? { ...t, ok: ev.ok, preview: ev.preview } : t)),
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
  const doneTasks = tasks.filter((t) => t.done);
  const pendingTasks = tasks.filter((t) => !t.done);
  const exitCode = done ? 0 : err ? 1 : null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <div
        style={{
          padding: "20px 40px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          Creation
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Construção · Execução · Consequência
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {pending && (
            <span style={{ color: "var(--cc-info)", display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="breathe"
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
              />
              {elapsed.toFixed(1)}s
            </span>
          )}
          {exitCode !== null && !pending && (
            <span style={{ color: exitCode === 0 ? "var(--cc-ok)" : "var(--cc-err)" }}>
              exit {exitCode}
            </span>
          )}
          {tasks.length > 0 && (
            <span style={{ color: "var(--text-muted)" }}>
              {doneTasks.length}/{tasks.length}
            </span>
          )}
        </div>
      </div>

      <div
        ref={outRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px clamp(20px, 5vw, 64px)",
        }}
      >
        {tasks.length === 0 && liveTools.length === 0 && !liveText && !pending && !err && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 13,
              color: "var(--cc-dim)",
              marginTop: 16,
            }}
          >
            <span style={{ color: "var(--cc-ok)" }}>ruberra@local</span>
            <span style={{ color: "var(--cc-dim)" }}>:</span>
            <span style={{ color: "var(--cc-path)" }}>~/mission</span>
            <span style={{ color: "var(--cc-dim)" }}>$</span>
            <span className="cc-cursor" />
            <div
              style={{
                marginTop: 18,
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--text-muted)",
              }}
            >
              {values.lang === "en"
                ? "Declare a task. It becomes a command. The command has consequence."
                : "Declare uma tarefa. Ela vira comando. O comando tem consequência."}
            </div>
          </div>
        )}

        {tasks.length > 0 && layout === "kanban" && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24,
          }}>
            <div>
              <div style={{
                fontSize: 9, letterSpacing: 2.5, color: "var(--text-ghost)",
                fontFamily: "var(--mono)", marginBottom: 12, textTransform: "uppercase",
              }}>▲ {values.lang === "en" ? "pending" : "pendente"} · {pendingTasks.length}</div>
              {pendingTasks.map((t) => (
                <KanbanCard key={t.id} task={t} onToggle={() => completeTask(t.id)} />
              ))}
            </div>
            <div>
              <div style={{
                fontSize: 9, letterSpacing: 2.5, color: "var(--cc-ok)",
                fontFamily: "var(--mono)", marginBottom: 12, textTransform: "uppercase",
              }}>✓ {values.lang === "en" ? "done" : "concluída"} · {doneTasks.length}</div>
              {doneTasks.map((t) => (
                <KanbanCard key={t.id} task={t} onToggle={() => completeTask(t.id)} />
              ))}
            </div>
          </div>
        )}

        {tasks.length > 0 && layout === "terminal" && (
          <div style={{ maxWidth: 740, marginBottom: 24 }}>
            {pendingTasks.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />
            ))}
            {doneTasks.length > 0 && pendingTasks.length > 0 && (
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  margin: "14px 0",
                  opacity: 0.4,
                }}
              />
            )}
            {doneTasks.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={() => completeTask(t.id)} />
            ))}
          </div>
        )}

        {(pending || liveTools.length > 0 || liveText || done) && (
          <div
            className="toolRise"
            style={{
              maxWidth: 820,
              marginTop: 8,
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderBottom: "1px solid var(--border-subtle)",
                background: "color-mix(in oklab, var(--bg-surface) 60%, transparent)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--cc-err)", opacity: 0.75 }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--cc-warn)", opacity: 0.75 }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--cc-ok)", opacity: 0.75 }} />
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  ruberra · exec › {lastTask.slice(0, 48)}{lastTask.length > 48 ? "…" : ""}
                </span>
              </div>
              {pending && (
                <span style={{ color: "var(--cc-info)" }}>● running · iter {iteration} · {elapsed.toFixed(1)}s</span>
              )}
              {!pending && done && (
                <span style={{ color: "var(--cc-ok)" }}>
                  ● exit 0 · {done.iterations} iter · {done.tool_count} tools · {done.processing_time_ms}ms
                </span>
              )}
            </div>

            <div style={{ padding: "14px 16px" }}>
              {liveTools.length > 0 && (
                <div style={{ marginBottom: liveText || done ? 14 : 0 }}>
                  {liveTools.map((tc) => (
                    <ToolLine
                      key={tc.id}
                      name={tc.name}
                      input={tc.input}
                      phase={tc.ok === undefined ? "running" : tc.ok ? "ok" : "err"}
                    />
                  ))}
                </div>
              )}
              {(liveText || done) && (
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12.5,
                    color: "var(--cc-fg)",
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                    borderTop: liveTools.length ? "1px dashed var(--border-subtle)" : "none",
                    paddingTop: liveTools.length ? 12 : 0,
                  }}
                >
                  <span style={{ color: "var(--cc-prompt)" }}>⏺ </span>
                  {done ? done.answer : liveText}
                  {pending && <span className="cc-cursor working" />}
                </div>
              )}
              {done?.terminated_early && (
                <div style={{ fontSize: 10, color: "var(--cc-warn)", marginTop: 10, fontFamily: "var(--mono)" }}>
                  terminado cedo: {done.termination_reason}
                </div>
              )}
            </div>
          </div>
        )}

        {err && (
          <div
            className="toolRise"
            style={{
              marginTop: 20,
              maxWidth: 820,
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "2px solid var(--cc-err)",
              borderRadius: 14,
              padding: "14px 18px",
              fontFamily: "var(--mono)",
            }}
          >
            <div style={{ fontSize: 10, color: "var(--cc-err)", letterSpacing: 1.5 }}>ERRO</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, whiteSpace: "pre-wrap" }}>
              {err}
            </div>
          </div>
        )}
      </div>

      <div
        className="glass"
        style={{
          margin: "0 clamp(20px, 5vw, 64px) 18px",
          borderRadius: 14,
          padding: "12px 16px",
          fontFamily: "var(--mono)",
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto auto",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--cc-ok)", fontSize: 12 }}>ruberra</span>
        <span style={{ color: "var(--cc-dim)", fontSize: 12 }}>
          @{pending ? "exec" : "ready"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--cc-prompt)", fontSize: 13 }}>$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={pending ? copy.creationRunning : copy.creationPlaceholder}
            disabled={pending}
            style={{
              flex: 1,
              fontSize: 13,
              color: "var(--cc-fg)",
              fontFamily: "var(--mono)",
              opacity: pending ? 0.55 : 1,
              padding: "6px 0",
            }}
          />
          {!pending && <span className="cc-cursor" style={{ opacity: input ? 0 : 1 }} />}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          {input.length ? `${input.length}c` : ""}
        </span>
        {input.trim() && !pending && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid var(--cc-ok)",
              color: "var(--cc-ok)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: 999,
              fontFamily: "var(--mono)",
              transition: "all .2s var(--ease-swift)",
              cursor: "pointer",
            }}
          >
            ↵ run
          </button>
        )}
      </div>
    </div>
  );
}

type ToolPhase = "running" | "ok" | "err";

function ToolLine({ name, input, phase }: { name: string; input?: unknown; phase: ToolPhase }) {
  const color =
    phase === "running" ? "var(--cc-info)" : phase === "ok" ? "var(--cc-ok)" : "var(--cc-err)";
  const dot = phase === "running" ? "◐" : phase === "ok" ? "●" : "✕";
  const inputStr = input ? JSON.stringify(input).slice(0, 80) : "";
  return (
    <div
      className="toolRise"
      style={{
        display: "grid",
        gridTemplateColumns: "16px 90px 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: "6px 0",
        fontFamily: "var(--mono)",
        fontSize: 12,
      }}
    >
      <span style={{ color, transition: "color .2s" }}>{dot}</span>
      <span style={{ color: "var(--cc-tool)", letterSpacing: ".04em" }}>{name}</span>
      <span
        style={{
          color: "var(--cc-path)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {inputStr}
      </span>
      <span
        style={{
          color,
          fontSize: 10,
          letterSpacing: ".2em",
          textTransform: "uppercase",
        }}
      >
        {phase === "running" ? "…" : phase === "ok" ? "ok" : "err"}
      </span>
    </div>
  );
}

function KanbanCard({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="fadeUp"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: "pointer",
        transition: "transform .25s var(--ease-emph), border-color .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--accent-dim)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontFamily: "var(--sans)",
          color: task.done ? "var(--text-muted)" : "var(--text-primary)",
          textDecoration: task.done ? "line-through" : "none",
          lineHeight: 1.5,
        }}
      >
        {task.title}
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 1.5,
          color: task.done ? "var(--cc-ok)" : "var(--text-ghost)",
          fontFamily: "var(--mono)",
          marginTop: 8,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        <span>{task.done ? "exit 0" : "pending"}</span>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      className="fadeUp"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "11px 0",
        borderBottom: "1px solid var(--border-subtle)",
        cursor: "pointer",
        fontFamily: "var(--mono)",
        transition: "padding-left .28s var(--ease-emph)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.paddingLeft = "8px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.paddingLeft = "0";
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: task.done ? "var(--cc-ok)" : "var(--cc-prompt)",
          width: 14,
          marginTop: 1,
        }}
      >
        {task.done ? "✓" : "›"}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: task.done ? "var(--cc-dim)" : "var(--cc-fg)",
          textDecoration: task.done ? "line-through" : "none",
          lineHeight: 1.55,
        }}
      >
        {task.title}
      </span>
      <span
        style={{
          fontSize: 9,
          letterSpacing: 1.5,
          color: "var(--text-ghost)",
          textTransform: "uppercase",
          marginTop: 3,
        }}
      >
        {task.done ? "exit 0" : "queue"}
      </span>
    </div>
  );
}
