import { useRef, useState, useEffect, useMemo } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRuberra, AgentEvent, CrewEvent, CrewRole, CrewPlanStep } from "../hooks/useRuberra";
import { useTweaks } from "../tweaks/TweaksContext";
import { useCopy } from "../i18n/copy";
import { Task } from "../spine/types";

type RunMode = "agent" | "crew";

interface LiveTool {
  id: string;
  name: string;
  input?: unknown;
  iteration: number;
  ok?: boolean;
  preview?: string;
  role?: CrewRole;
}

interface DoneSummary {
  answer: string;
  iterations: number;
  tool_count: number;
  processing_time_ms: number;
  terminated_early: boolean;
  termination_reason: string | null;
}

interface CrewState {
  analysis: string;
  steps: CrewPlanStep[];
  currentRole: CrewRole | null;
  rolesRun: CrewRole[];
  verdict: { accept: boolean; issues: string[]; summary: string; refinement: number } | null;
  refinements: number;
}

const EMPTY_CREW: CrewState = {
  analysis: "",
  steps: [],
  currentRole: null,
  rolesRun: [],
  verdict: null,
  refinements: 0,
};

export default function Creation() {
  const { activeMission, addTask, completeTask, addNoteToMission, acceptArtifact, principles } = useSpine();
  const { streamDev, streamCrew, pending } = useRuberra();
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
  const [mode, setMode] = useState<RunMode>("agent");
  const [crew, setCrew] = useState<CrewState>(EMPTY_CREW);
  const [accepted, setAccepted] = useState(false);
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

  function handleAgentEvent(ev: AgentEvent, role?: CrewRole) {
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
          { id: ev.id, name: ev.name, input: ev.input, iteration: ev.iteration, role },
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
  }

  function handleCrewEvent(ev: CrewEvent) {
    switch (ev.type) {
      case "crew_start":
        setCrew({ ...EMPTY_CREW });
        break;
      case "plan":
        setCrew((prev) => ({ ...prev, analysis: ev.analysis, steps: ev.steps }));
        break;
      case "role_start":
        setCrew((prev) => ({ ...prev, currentRole: ev.role }));
        break;
      case "role_event":
        // Inner agent event from a specialist — reuse the agent renderer
        handleAgentEvent(ev.event, ev.role);
        break;
      case "role_done":
        setCrew((prev) => ({
          ...prev,
          rolesRun: prev.rolesRun.includes(ev.role)
            ? prev.rolesRun
            : [...prev.rolesRun, ev.role],
          currentRole: null,
        }));
        break;
      case "critic_verdict":
        setCrew((prev) => ({
          ...prev,
          verdict: {
            accept: ev.accept,
            issues: ev.issues,
            summary: ev.summary,
            refinement: ev.refinement,
          },
          refinements: ev.refinement,
        }));
        break;
      case "done":
        setDone({
          answer: ev.answer,
          iterations: ev.refinements,
          tool_count: ev.roles_run.length,
          processing_time_ms: ev.processing_time_ms,
          terminated_early: !ev.accepted,
          termination_reason: ev.accepted ? null : "critic rejected after refinement",
        });
        setCrew((prev) => ({ ...prev, rolesRun: ev.roles_run, refinements: ev.refinements }));
        break;
      case "error":
        setErr(ev.message);
        break;
    }
  }

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
    setAccepted(false);
    setCrew({ ...EMPTY_CREW });

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const body = {
      question: mode === "crew" ? v : `Task declared: ${v}`,
      context: activeMission?.title,
      mission_id: activeMission?.id,
      principles: principles.length ? principles.map((p) => p.text) : undefined,
    };

    if (mode === "crew") {
      await streamCrew(body, handleCrewEvent, ac.signal);
    } else {
      await streamDev(body, (ev: AgentEvent) => handleAgentEvent(ev), ac.signal);
    }
  }

  function accept() {
    if (!done || !activeMission || accepted) return;
    const task = activeMission.tasks.find((t) => !t.done && t.title === lastTask);
    if (task) completeTask(task.id);
    const answerText = done.answer.trim();
    if (answerText) {
      addNoteToMission(activeMission.id, answerText, "ai");
    }
    acceptArtifact(activeMission.id, {
      taskTitle: lastTask || task?.title || "(sem tarefa)",
      answer: answerText,
      terminatedEarly: done.terminated_early,
      acceptedAt: Date.now(),
    });
    setAccepted(true);
  }

  const tasks = activeMission?.tasks ?? [];
  const doneTasks = tasks.filter((t) => t.done);
  const pendingTasks = tasks.filter((t) => !t.done);
  const exitCode = done ? 0 : err ? 1 : null;

  const currentObjective = useMemo(() => {
    if (lastTask) return lastTask;
    if (!activeMission) return "";
    // Most recently declared pending task (tasks appended in order)
    const pending = [...activeMission.tasks].reverse().find((t) => !t.done);
    return pending?.title ?? "";
  }, [lastTask, activeMission]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <div
        style={{
          padding: "20px 40px 16px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Row 1: chamber label + mode toggle + status */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
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
          role="tablist"
          aria-label="Execution mode"
          style={{
            display: "flex",
            border: "1px solid var(--border-subtle)",
            borderRadius: 999,
            overflow: "hidden",
            marginLeft: 12,
          }}
        >
          {(["agent", "crew"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              disabled={pending}
              onClick={() => setMode(m)}
              style={{
                background: mode === m ? "var(--accent-glow)" : "transparent",
                border: "none",
                color: mode === m ? "var(--accent)" : "var(--text-ghost)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "5px 12px",
                cursor: pending ? "not-allowed" : "pointer",
                transition: "all .15s var(--ease-swift)",
                opacity: pending && mode !== m ? 0.4 : 1,
              }}
            >
              {m}
            </button>
          ))}
        </div>
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
        {/* Row 2: active mission + current objective */}
        {activeMission && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 11 }}>
            <span style={{ fontSize: 9, letterSpacing: 2, color: "var(--text-ghost)", textTransform: "uppercase" }}>missão</span>
            <span style={{ color: "var(--text-secondary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeMission.title}
            </span>
            {currentObjective && (
              <>
                <span style={{ color: "var(--border-subtle)", fontSize: 13 }}>›</span>
                <span style={{ color: "var(--accent)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentObjective}
                </span>
                {activeMission.lastArtifact?.taskTitle === currentObjective && (
                  <span style={{ fontSize: 9, letterSpacing: 1.5, color: "var(--cc-ok)", textTransform: "uppercase" }}>✓ aceite</span>
                )}
              </>
            )}
            {!currentObjective && pendingTasks.length === 0 && doneTasks.length > 0 && (
              <>
                <span style={{ color: "var(--border-subtle)", fontSize: 13 }}>›</span>
                <span style={{ color: "var(--cc-ok)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>
                  tudo concluído
                </span>
              </>
            )}
          </div>
        )}
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

        {activeMission?.lastArtifact && (
          <div
            className="fadeIn"
            style={{
              maxWidth: 820,
              marginBottom: 14,
              background: "color-mix(in oklab, var(--cc-ok) 8%, var(--bg-elevated))",
              border: "1px solid var(--border-subtle)",
              borderLeft: "2px solid var(--cc-ok)",
              borderRadius: 12,
              padding: "10px 14px",
              fontFamily: "var(--mono)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--cc-ok)", marginBottom: 6 }}>
              <span>✓ último artefacto aceite</span>
              <span style={{ color: "var(--text-ghost)", letterSpacing: 1 }}>
                {new Date(activeMission.lastArtifact.acceptedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span style={{ marginLeft: "auto", color: "var(--text-ghost)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                › {activeMission.lastArtifact.taskTitle}
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: activeMission.lastArtifact.terminatedEarly && !activeMission.lastArtifact.answer
                  ? "var(--cc-warn)"
                  : "var(--text-muted)",
                fontFamily: "var(--sans)",
                lineHeight: 1.55,
                whiteSpace: "pre-wrap",
                maxHeight: 72,
                overflow: "hidden",
              }}
            >
              {activeMission.lastArtifact.answer
                ? (activeMission.lastArtifact.answer.length > 260
                    ? activeMission.lastArtifact.answer.slice(0, 260) + "…"
                    : activeMission.lastArtifact.answer)
                : "terminação antecipada — sem saída textual"}
            </div>
          </div>
        )}

        {mode === "crew" && (crew.steps.length > 0 || crew.verdict || pending) && (
          <CrewCard crew={crew} pending={pending} />
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
              {done && activeMission && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--border-subtle)", display: "flex", alignItems: "center", gap: 12 }}>
                  {!accepted ? (
                    <>
                      <button
                        onClick={accept}
                        style={{ background: "none", border: "1px solid var(--cc-ok)", color: "var(--cc-ok)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "6px 14px", borderRadius: 999, fontFamily: "var(--mono)", cursor: "pointer", transition: "all .2s var(--ease-swift)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in oklab, var(--cc-ok) 12%, transparent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                      >
                        ✓ aceitar artefacto
                      </button>
                      <span style={{ fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
                        → marca tarefa concluída · regista na missão
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, color: "var(--cc-ok)", fontFamily: "var(--mono)", letterSpacing: 1.5 }}>
                      ✓ artefacto aceite · missão actualizada
                    </span>
                  )}
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

const ROLE_COLOR: Record<CrewRole, string> = {
  planner: "var(--accent)",
  researcher: "var(--cc-info)",
  coder: "var(--cc-prompt)",
  critic: "var(--cc-warn)",
};

function CrewCard({ crew, pending }: { crew: CrewState; pending: boolean }) {
  return (
    <div
      className="toolRise"
      style={{
        maxWidth: 820,
        marginBottom: 14,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderLeft: "2px solid var(--accent-dim)",
        borderRadius: 14,
        padding: "14px 18px",
        fontFamily: "var(--mono)",
      }}
    >
      <div style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "var(--text-ghost)",
        marginBottom: 10,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ color: "var(--accent)" }}>crew</span>
        {crew.refinements > 0 && (
          <span style={{ color: "var(--cc-warn)" }}>refine ×{crew.refinements}</span>
        )}
        {crew.currentRole && pending && (
          <span style={{ color: ROLE_COLOR[crew.currentRole] }}>
            ▶ {crew.currentRole}
          </span>
        )}
      </div>

      {crew.analysis && (
        <div style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 12,
          lineHeight: 1.5,
          fontFamily: "var(--sans)",
          fontStyle: "italic",
        }}>
          {crew.analysis}
        </div>
      )}

      {crew.steps.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {crew.steps.map((s, i) => {
            const ran = crew.rolesRun.includes(s.role);
            const active = crew.currentRole === s.role;
            const color = ROLE_COLOR[s.role];
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "14px 90px 1fr",
                gap: 10,
                alignItems: "baseline",
                fontSize: 11,
                opacity: ran || active ? 1 : 0.55,
              }}>
                <span style={{ color }}>{active ? "◐" : ran ? "●" : "○"}</span>
                <span style={{ color, letterSpacing: ".04em" }}>{s.role}</span>
                <span style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {s.goal}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {crew.verdict && (
        <div style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px dashed var(--border-subtle)",
          fontSize: 11,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            color: crew.verdict.accept ? "var(--cc-ok)" : "var(--cc-err)",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontSize: 10,
            marginBottom: 6,
          }}>
            <span>{crew.verdict.accept ? "✓ critic accepted" : "✗ critic rejected"}</span>
          </div>
          <div style={{
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
            lineHeight: 1.5,
          }}>
            {crew.verdict.summary}
          </div>
          {crew.verdict.issues.length > 0 && (
            <ul style={{
              margin: "8px 0 0 0",
              padding: "0 0 0 16px",
              color: "var(--cc-warn)",
              fontSize: 10,
              lineHeight: 1.6,
            }}>
              {crew.verdict.issues.map((iss, i) => (
                <li key={i}>{iss}</li>
              ))}
            </ul>
          )}
        </div>
      )}
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
