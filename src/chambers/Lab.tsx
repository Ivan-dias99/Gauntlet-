import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRubeira, RouteEvent } from "../hooks/useRubeira";
import { Note } from "../spine/types";

interface TriadResult {
  answer?: string | null;
  refused?: boolean;
  refusal_message?: string | null;
  confidence?: string;
  judge_reasoning?: string;
  matched_prior_failure?: boolean;
}
interface AgentResult {
  mode?: string;
  answer?: string;
  tool_calls?: Array<{ name: string; ok: boolean; input?: unknown }>;
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
  const a = (result as AgentResult).answer;
  return a ?? "(sem resposta)";
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
  const { streamRoute, pending, error } = useRubeira();
  const [input, setInput] = useState("");
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [lastConfidence, setLastConfidence] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, pending, live.lastEventLabel]);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    const targetMissionId = activeMission?.id;
    if (!targetMissionId) return;

    addNote(v, "user");
    setInput("");
    setLive({ ...EMPTY_LIVE });
    setLastConfidence(null);

    const priorNotes = (activeMission?.notes ?? [])
      .slice(0, 8)
      .map(n => `${n.role === "ai" ? "AI" : "User"}: ${n.text}`)
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
        principles: principles.length ? principles.map(p => p.text) : undefined,
      },
      (ev: RouteEvent) => {
        if (ev.type === "route") capturedPath = ev.path;
        setLive(prev => reduceEvent(prev, ev));
        if (ev.type === "done") {
          const path = capturedPath ?? inferPath(ev);
          const answer = extractAnswer(path, ev.result);
          if (answer) addNoteToMission(targetMissionId, answer.trim(), "ai");
          const conf = (ev.result as TriadResult).confidence;
          if (conf) setLastConfidence(conf);
        }
      },
      ac.signal,
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      <div style={{
        padding: "18px 40px 14px",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "baseline", gap: 12,
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)" }}>
          Lab
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Investigação · Evidência · Verdade
        </span>
        {pending && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
            {live.routePath ? live.routePath.toUpperCase() : "ANALISANDO"}
          </span>
        )}
        {!pending && live.routePath && lastConfidence && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
            {live.routePath.toUpperCase()} · {lastConfidence}
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        {notes.length === 0 && !pending && !error && (
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontStyle: "italic", marginTop: 8 }}>
            Sem evidências. Comece a investigar.
          </div>
        )}

        {notes.map(n => (
          <MessageBubble key={n.id} note={n} />
        ))}

        {pending && (
          <div style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--terminal-warn)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            maxWidth: 680,
            alignSelf: "flex-start",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-ghost)",
          }}>
            {live.lastEventLabel}
          </div>
        )}

        {error && !pending && (
          <div style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid #c44",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            maxWidth: 680,
            alignSelf: "flex-start",
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
          }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        borderTop: "1px solid var(--border-subtle)",
        padding: "14px 40px",
        background: "var(--bg-surface)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ color: "var(--accent-dim)", fontSize: 14, flexShrink: 0 }}>›</span>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder={pending ? "Aguardando verdict..." : "Evidência, análise, hipótese..."}
          disabled={pending}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 14, color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            opacity: pending ? 0.5 : 1,
          }}
        />
        {input.trim() && !pending && (
          <button onClick={submit} style={{
            background: "none", border: "1px solid var(--border)",
            color: "var(--accent)", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", padding: "5px 14px",
            cursor: "pointer", borderRadius: "var(--radius)",
          }}>
            Enter
          </button>
        )}
      </div>
    </div>
  );
}

function reduceEvent(prev: LiveState, ev: RouteEvent): LiveState {
  switch (ev.type) {
    case "route":
      return {
        ...prev,
        routePath: ev.path,
        lastEventLabel: ev.path === "agent" ? "agent · a pensar" : "triad · 3 análises em paralelo",
      };
    case "triad_start":
      return {
        ...prev,
        triadTotal: ev.count,
        triadCompleted: 0,
        lastEventLabel: `triad · 0/${ev.count}${ev.has_prior_failure ? " · falha prévia" : ""}`,
      };
    case "triad_done":
      return {
        ...prev,
        triadCompleted: ev.completed,
        triadTotal: ev.total,
        lastEventLabel: `triad · ${ev.completed}/${ev.total} · análise ${ev.index} pronta`,
      };
    case "judge_start":
      return { ...prev, judgeState: "evaluating", lastEventLabel: "judge · a avaliar consistência" };
    case "judge_done":
      return {
        ...prev,
        judgeState: "done",
        judgeConfidence: ev.confidence,
        lastEventLabel: `judge · ${ev.confidence}${ev.should_refuse ? " · recusar" : ""}`,
      };
    case "iteration":
      return { ...prev, agentIter: ev.n, lastEventLabel: `agent · iter ${ev.n}` };
    case "tool_use":
      return {
        ...prev,
        agentToolCount: prev.agentToolCount + 1,
        lastEventLabel: `agent · ${ev.name}`,
      };
    case "tool_result":
      return { ...prev, lastEventLabel: `agent · ${ev.ok ? "✓" : "✗"} tool ${ev.id}` };
    case "assistant_text":
      return { ...prev, lastEventLabel: "agent · a escrever" };
    case "done":
      return { ...prev, lastEventLabel: "concluído" };
    case "error":
      return { ...prev, lastEventLabel: `erro: ${ev.message.slice(0, 80)}` };
    default:
      return prev;
  }
}

function inferPath(ev: Extract<RouteEvent, { type: "done" }>): "agent" | "triad" {
  // Done event for triad path has confidence/triad_agreement fields;
  // agent path has tool_calls/iterations.
  const r = ev.result as Record<string, unknown>;
  return "tool_calls" in r || "iterations" in r ? "agent" : "triad";
}

function MessageBubble({ note }: { note: Note }) {
  const isAI = note.role === "ai";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isAI ? "flex-start" : "flex-end",
      maxWidth: "100%",
    }}>
      <div style={{
        background: isAI ? "var(--bg-input)" : "var(--bg-elevated)",
        border: `1px solid ${isAI ? "var(--border-subtle)" : "var(--border)"}`,
        borderLeft: isAI ? "2px solid var(--accent-dim)" : undefined,
        borderRadius: "var(--radius)",
        padding: "12px 16px",
        maxWidth: 640,
        boxShadow: isAI ? "none" : "var(--shadow-sm)",
      }}>
        <div style={{
          fontSize: 14,
          color: isAI ? "var(--text-secondary)" : "var(--text-primary)",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
        }}>
          {note.text}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-ghost)", marginTop: 8, letterSpacing: 0.3 }}>
          {isAI ? "IA · " : ""}{new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}
