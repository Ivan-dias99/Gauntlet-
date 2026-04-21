import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRuberra, RouteEvent } from "../hooks/useRuberra";
import { Note } from "../spine/types";

interface TriadResult {
  answer?: string | null;
  refused?: boolean;
  refusal_message?: string | null;
  confidence?: string;
  judge_reasoning?: string;
  triad_agreement?: string;
  matched_prior_failure?: boolean;
}
interface AgentResult {
  answer?: string;
  tool_calls?: Array<{ name: string; ok: boolean }>;
  iterations?: number;
  terminated_early?: boolean;
  termination_reason?: string | null;
}

function extractAnswer(
  routePath: "agent" | "triad" | null,
  result: Record<string, unknown>,
): string {
  if (routePath === "triad") {
    const r = result as TriadResult;
    if (r.refused) return r.refusal_message ?? "(refusal sem mensagem)";
    return r.answer ?? "(sem resposta)";
  }
  return (result as AgentResult).answer ?? "(sem resposta)";
}

interface VerdictState {
  routePath: "agent" | "triad";
  confidence: string | null;
  refused: boolean;
  reasoning: string;
  divergenceCount: number;
  priorFailure: boolean;
  agentIter: number;
  agentToolCount: number;
}

interface LiveState {
  routePath: "agent" | "triad" | null;
  triadCompleted: number;
  triadTotal: number;
  judgeState: "pending" | "evaluating" | "done" | null;
  judgeConfidence: string | null;
  agentIter: number;
  agentToolCount: number;
  lastEventLabel: string;
}

const EMPTY_LIVE: LiveState = {
  routePath: null,
  triadCompleted: 0,
  triadTotal: 0,
  judgeState: null,
  judgeConfidence: null,
  agentIter: 0,
  agentToolCount: 0,
  lastEventLabel: "a rotear...",
};

export default function Lab() {
  const { activeMission, addNote, addNoteToMission, principles } = useSpine();
  const { streamRoute, pending, error } = useRuberra();
  const [input, setInput] = useState("");
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [lastConfidence, setLastConfidence] = useState<string | null>(null);
  const [lastVerdict, setLastVerdict] = useState<VerdictState | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Refs capture streaming metadata without stale closure issues
  const capturedJudge = useRef<{
    confidence: string; shouldRefuse: boolean; reasoning: string; divergenceCount: number;
  } | null>(null);
  const capturedTriad = useRef<{ priorFailure: boolean }>({ priorFailure: false });
  const capturedAgent = useRef<{ iter: number; toolCount: number }>({ iter: 0, toolCount: 0 });

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, pending, live.lastEventLabel]);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;
    const targetMissionId = activeMission?.id;
    if (!targetMissionId) return;

    addNote(v, "user");
    setInput("");
    setLive({ ...EMPTY_LIVE });
    setLastConfidence(null);
    setLastVerdict(null);
    capturedJudge.current = null;
    capturedTriad.current = { priorFailure: false };
    capturedAgent.current = { iter: 0, toolCount: 0 };

    const priorNotes = (activeMission?.notes ?? [])
      .slice(0, 8)
      .map((n) => `${n.role === "ai" ? "AI" : "User"}: ${n.text}`)
      .reverse()
      .join("\n");

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    let capturedPath: "agent" | "triad" | null = null;

    await streamRoute(
      {
        question: v,
        context: priorNotes || undefined,
        mission_id: targetMissionId,
        principles: principles.length ? principles.map((p) => p.text) : undefined,
      },
      (ev: RouteEvent) => {
        if (ev.type === "route") capturedPath = ev.path;

        if (ev.type === "triad_start") {
          capturedTriad.current = { priorFailure: ev.has_prior_failure };
        }
        if (ev.type === "judge_done") {
          capturedJudge.current = {
            confidence: ev.confidence,
            shouldRefuse: ev.should_refuse,
            reasoning: ev.reasoning,
            divergenceCount: ev.divergence_count,
          };
        }
        if (ev.type === "iteration") {
          capturedAgent.current.iter = ev.n;
        }
        if (ev.type === "tool_use") {
          capturedAgent.current.toolCount++;
        }

        setLive((prev) => reduceEvent(prev, ev));

        if (ev.type === "done") {
          const path = capturedPath ?? inferPath(ev);
          const answer = extractAnswer(path, ev.result);
          if (answer) addNoteToMission(targetMissionId, answer.trim(), "ai");

          const r = ev.result as TriadResult;
          const refused = !!r.refused;
          const priorFail = !!r.matched_prior_failure;
          const conf = r.confidence;
          if (conf) setLastConfidence(conf);

          setLastVerdict({
            routePath: path,
            confidence: capturedJudge.current?.confidence ?? conf ?? null,
            refused,
            reasoning: capturedJudge.current?.reasoning ?? r.judge_reasoning ?? "",
            divergenceCount: capturedJudge.current?.divergenceCount ?? 0,
            priorFailure: capturedTriad.current.priorFailure || priorFail,
            agentIter: capturedAgent.current.iter,
            agentToolCount: capturedAgent.current.toolCount,
          });
        }
      },
      ac.signal,
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ padding: "20px 40px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
          Lab
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Investigação · Evidência · Pressão
        </span>
        {pending && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--cc-info)", fontFamily: "var(--mono)", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="breathe" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }} />
            {live.routePath ? live.routePath.toUpperCase() : "ANALISANDO"}
          </span>
        )}
        {!pending && live.routePath && lastConfidence && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
            {live.routePath.toUpperCase()} · {lastConfidence}
          </span>
        )}
      </div>

      {/* Message thread */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px clamp(20px, 5vw, 64px)", display: "flex", flexDirection: "column", gap: 14 }}>

        {notes.length === 0 && !pending && !error && (
          <div style={{ alignSelf: "center", textAlign: "center", maxWidth: 560, marginTop: "12vh" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".4em", color: activeMission ? "var(--text-ghost)" : "var(--cc-warn)", textTransform: "uppercase", marginBottom: 18 }}>
              {activeMission ? "— PRESSÃO EM REPOUSO" : "— Sem missão activa"}
            </div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontStyle: "italic", fontSize: 24, lineHeight: 1.35, color: "var(--text-muted)", letterSpacing: "-0.005em" }}>
              {activeMission
                ? "A verdade não se entrega sem atrito. Abre a pressão."
                : "Activa uma missão para abrir pressão."}
            </div>
          </div>
        )}

        {notes.map((n) => (
          <LabTurnRow key={n.id} note={n} />
        ))}

        {pending && (
          <div className="toolRise" style={{ alignSelf: "flex-start", maxWidth: 520, minWidth: 260, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-input)", border: "1px dashed var(--border)", borderRadius: 12, fontFamily: "var(--mono)", fontSize: 11, color: "var(--cc-dim)", letterSpacing: ".04em" }}>
            <span className="breathe" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cc-info)", boxShadow: "0 0 0 4px color-mix(in oklab, var(--cc-info) 22%, transparent)" }} />
            <span>{live.lastEventLabel}</span>
            <div className="scanbar" style={{ flex: 1, height: 2, background: "var(--border-subtle)", borderRadius: 2 }} />
          </div>
        )}

        {error && !pending && (
          <div className="toolRise" style={{ background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderLeft: "2px solid var(--cc-err)", borderRadius: 12, padding: "12px 16px", maxWidth: 680, alignSelf: "flex-start", fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Verdict panel — appears after each query, clears on next submit */}
      {lastVerdict && !pending && (
        <VerdictPanel verdict={lastVerdict} />
      )}

      {/* Input */}
      <div className="glass" style={{ margin: "0 clamp(20px, 5vw, 64px) 18px", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, opacity: activeMission ? 1 : 0.7 }}>
        <span
          className={pending ? "breathe" : ""}
          style={{ width: 8, height: 8, borderRadius: "50%", background: pending ? "var(--cc-info)" : activeMission ? "var(--cc-prompt)" : "var(--border)", boxShadow: `0 0 0 4px color-mix(in oklab, ${pending ? "var(--cc-info)" : activeMission ? "var(--cc-prompt)" : "var(--border)"} 22%, transparent)`, flexShrink: 0 }}
        />
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder={
            !activeMission ? "Activa uma missão para pressionar…" :
            pending ? "a pressionar…" :
            lastVerdict?.refused ? "Reformula. Fractura. Pressiona mais." :
            "interroga, fractura, pressiona…"
          }
          disabled={pending || !activeMission}
          style={{ flex: 1, fontSize: 14, color: "var(--text-primary)", fontFamily: "var(--sans)", opacity: pending || !activeMission ? 0.55 : 1, padding: "6px 0", cursor: !activeMission ? "not-allowed" : undefined }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-ghost)", letterSpacing: ".2em", textTransform: "uppercase" }}>
          {input.length > 0 ? `${input.length}` : ""}
        </span>
        {input.trim() && !pending && activeMission && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{ background: "none", border: "1px solid var(--accent-dim)", color: "var(--accent)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "7px 14px", borderRadius: 999, fontFamily: "var(--mono)", transition: "all .2s var(--ease-swift)", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Enter ↵
          </button>
        )}
      </div>
    </div>
  );
}

function VerdictPanel({ verdict }: { verdict: VerdictState }) {
  const isAgent = verdict.routePath === "agent";
  const isHigh = verdict.confidence === "high";
  const isRefused = verdict.refused;

  const routeColor = isAgent ? "var(--cc-warn)" : "var(--accent)";
  const leftAccent = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "var(--accent-dim)";
  const confidenceColor = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "var(--cc-warn)";

  return (
    <div
      className="fadeUp"
      style={{
        margin: "0 clamp(20px, 5vw, 64px) 8px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `2px solid ${leftAccent}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontFamily: "var(--mono)",
      }}
    >
      {/* First row: route · confidence · divergence · prior failure */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: routeColor }}>
          {verdict.routePath}
        </span>
        {!isAgent && verdict.confidence && (
          <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: confidenceColor }}>
            {verdict.confidence}
          </span>
        )}
        {isAgent && (
          <span style={{ fontSize: 10, color: "var(--text-ghost)" }}>
            {verdict.agentIter} iter · {verdict.agentToolCount} tools
          </span>
        )}
        {verdict.divergenceCount > 0 && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)", letterSpacing: 1 }}>
            ⊘ {verdict.divergenceCount} divergência{verdict.divergenceCount !== 1 ? "s" : ""}
          </span>
        )}
        {verdict.priorFailure && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)" }}>⚠ falha prévia</span>
        )}
        {isRefused && (
          <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--cc-err)", textTransform: "uppercase", marginLeft: "auto" }}>
            recusado
          </span>
        )}
      </div>

      {/* Judge reasoning */}
      {verdict.reasoning && (
        <div style={{ marginTop: 5, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "var(--sans)" }}>
          {verdict.reasoning.length > 200 ? verdict.reasoning.slice(0, 200) + "…" : verdict.reasoning}
        </div>
      )}

      {/* Pressure hint — shown when refused or divergence found */}
      {(isRefused || verdict.divergenceCount > 0) && (
        <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-ghost)", letterSpacing: 0.5 }}>
          {isRefused
            ? "→ reformula · fractura a questão · adiciona contexto específico"
            : "→ pressiona onde divergiu · pede clarificação · verifica a premissa"}
        </div>
      )}
    </div>
  );
}

function LabTurnRow({ note }: { note: Note }) {
  const isAI = note.role === "ai";
  const isRefusal = isAI && (
    note.text.startsWith("Não sei responder") ||
    note.text.startsWith("⚠️ **Ruberra")
  );
  const isWarning = isAI && note.text.startsWith("⚠ Esta pergunta");

  let label: string;
  let borderColor: string;
  let labelColor: string;
  let dotColor: string;
  if (!isAI) {
    label = "PRESSÃO";
    borderColor = "var(--cc-prompt)";
    labelColor = "var(--text-muted)";
    dotColor = "var(--cc-prompt)";
  } else if (isRefusal) {
    label = "RECUSADO";
    borderColor = "var(--cc-err)";
    labelColor = "var(--cc-err)";
    dotColor = "var(--cc-err)";
  } else if (isWarning) {
    label = "AVISO";
    borderColor = "var(--cc-warn)";
    labelColor = "var(--cc-warn)";
    dotColor = "var(--cc-warn)";
  } else {
    label = "ANÁLISE";
    borderColor = "var(--accent-dim)";
    labelColor = "var(--text-ghost)";
    dotColor = "var(--ember)";
  }

  return (
    <div
      className="fadeUp"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 16px 12px",
        background: isAI ? "var(--bg-input)" : "transparent",
        borderLeft: `2px solid ${borderColor}`,
        borderRadius: "0 10px 10px 0",
        opacity: isRefusal ? 0.92 : 1,
        maxWidth: 780,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase" }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor }} />
        <span style={{ color: labelColor }}>{label}</span>
        <span style={{ color: "var(--text-ghost)", marginLeft: "auto", letterSpacing: 0.5 }}>
          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.65, whiteSpace: "pre-wrap", fontFamily: "var(--sans)" }}>
        {note.text}
      </div>
    </div>
  );
}

function reduceEvent(prev: LiveState, ev: RouteEvent): LiveState {
  switch (ev.type) {
    case "route":
      return { ...prev, routePath: ev.path, lastEventLabel: ev.path === "agent" ? "agent · a pensar" : "triad · 3 análises em paralelo" };
    case "triad_start":
      return { ...prev, triadTotal: ev.count, triadCompleted: 0, lastEventLabel: `triad · 0/${ev.count}${ev.has_prior_failure ? " · ⚠ falha prévia" : ""}` };
    case "triad_done":
      return { ...prev, triadCompleted: ev.completed, triadTotal: ev.total, lastEventLabel: `triad · ${ev.completed}/${ev.total} · análise ${ev.index} pronta` };
    case "judge_start":
      return { ...prev, judgeState: "evaluating", lastEventLabel: "judge · a avaliar consistência" };
    case "judge_done":
      return { ...prev, judgeState: "done", judgeConfidence: ev.confidence, lastEventLabel: `judge · ${ev.confidence}${ev.should_refuse ? " · recusar" : ""}${ev.divergence_count > 0 ? ` · ${ev.divergence_count} diverg.` : ""}` };
    case "iteration":
      return { ...prev, agentIter: ev.n, lastEventLabel: `agent · iter ${ev.n}` };
    case "tool_use":
      return { ...prev, agentToolCount: prev.agentToolCount + 1, lastEventLabel: `agent · ${ev.name}` };
    case "tool_result":
      return { ...prev, lastEventLabel: `agent · ${ev.ok ? "✓" : "✗"} ${ev.id.slice(0, 8)}` };
    case "assistant_text":
      return { ...prev, lastEventLabel: "agent · a escrever" };
    case "done":
      return { ...prev, lastEventLabel: "concluído" };
    case "error":
      return { ...prev, lastEventLabel: `erro: ${ev.message.slice(0, 60)}` };
    default:
      return prev;
  }
}

function inferPath(ev: Extract<RouteEvent, { type: "done" }>): "agent" | "triad" {
  const r = ev.result as Record<string, unknown>;
  return "tool_calls" in r || "iterations" in r ? "agent" : "triad";
}
