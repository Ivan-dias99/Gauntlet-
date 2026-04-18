import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRubeira } from "../hooks/useRubeira";
import { Note } from "../spine/types";

// Response shapes from /api/rubeira/route
interface TriadResult {
  answer?: string | null;
  refused?: boolean;
  refusal_message?: string | null;
  confidence?: string;
  confidence_explanation?: string;
  triad_agreement?: string;
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
interface RouteEnvelope {
  route: "agent" | "triad";
  result: TriadResult | AgentResult;
}

function extractAnswer(env: RouteEnvelope): string {
  if (env.route === "triad") {
    const r = env.result as TriadResult;
    if (r.refused) return r.refusal_message ?? "(refusal sem mensagem)";
    return r.answer ?? "(sem resposta)";
  }
  const a = (env.result as AgentResult).answer;
  return a ?? "(sem resposta)";
}

export default function Lab() {
  const { activeMission, addNote, addNoteToMission } = useSpine();
  const { call, pending, error } = useRubeira();
  const [input, setInput] = useState("");
  const [lastMeta, setLastMeta] = useState<RouteEnvelope | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, pending]);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    const targetMissionId = activeMission?.id;
    if (!targetMissionId) return;

    addNote(v, "user");
    setInput("");
    setLastMeta(null);

    // Flatten recent notes into a context string. /route takes a single
    // question + optional context; the backend doesn't take a message array.
    const priorNotes = (activeMission?.notes ?? [])
      .slice(0, 8) // newest-first in state; cap to avoid bloat
      .map(n => `${n.role === "ai" ? "AI" : "User"}: ${n.text}`)
      .reverse()
      .join("\n");

    try {
      const env = (await call("route", {
        question: v,
        context: priorNotes || undefined,
        mission_id: targetMissionId,
      })) as RouteEnvelope;
      setLastMeta(env);
      const answer = extractAnswer(env);
      if (answer) addNoteToMission(targetMissionId, answer.trim(), "ai");
    } catch {
      // error is already surfaced via the hook
    }
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
            ANALISANDO
          </span>
        )}
        {lastMeta && !pending && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-ghost)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
            {lastMeta.route.toUpperCase()}
            {lastMeta.route === "triad" &&
              ` · ${(lastMeta.result as TriadResult).confidence ?? "?"}`}
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
            a rotear · triad ou agent · isto demora
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
