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
  const { streamRoute, pending, error } = useRuberra();
  const [input, setInput] = useState("");
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [lastConfidence, setLastConfidence] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        setLive((prev) => reduceEvent(prev, ev));
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
          Lab
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Investigação · Evidência · Verdade
        </span>
        {pending && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "var(--cc-info)",
              fontFamily: "var(--mono)",
              letterSpacing: 2,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="breathe"
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
            />
            {live.routePath ? live.routePath.toUpperCase() : "ANALISANDO"}
          </span>
        )}
        {!pending && live.routePath && lastConfidence && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              color: "var(--text-ghost)",
              fontFamily: "var(--mono)",
              letterSpacing: 1,
            }}
          >
            {live.routePath.toUpperCase()} · {lastConfidence}
          </span>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px clamp(20px, 5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {notes.length === 0 && !pending && !error && (
          <div
            style={{
              alignSelf: "center",
              textAlign: "center",
              maxWidth: 520,
              marginTop: "12vh",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".4em",
                color: "var(--text-ghost)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              — Sem entrada
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontStyle: "italic",
                fontSize: 24,
                lineHeight: 1.35,
                color: "var(--text-muted)",
                letterSpacing: "-0.005em",
              }}
            >
              Sem evidências. Comece a investigar.
            </div>
          </div>
        )}

        {notes.map((n) => (
          <MessageBubble key={n.id} note={n} />
        ))}

        {pending && (
          <div
            className="toolRise"
            style={{
              alignSelf: "flex-start",
              maxWidth: 520,
              minWidth: 260,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: "var(--bg-input)",
              border: "1px dashed var(--border)",
              borderRadius: 12,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--cc-dim)",
              letterSpacing: ".04em",
            }}
          >
            <span
              className="breathe"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--cc-info)",
                boxShadow: "0 0 0 4px color-mix(in oklab, var(--cc-info) 22%, transparent)",
              }}
            />
            <span>{live.lastEventLabel}</span>
            <div
              className="scanbar"
              style={{
                flex: 1,
                height: 2,
                background: "var(--border-subtle)",
                borderRadius: 2,
              }}
            />
          </div>
        )}

        {error && !pending && (
          <div
            className="toolRise"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              borderLeft: "2px solid var(--cc-err)",
              borderRadius: 12,
              padding: "12px 16px",
              maxWidth: 680,
              alignSelf: "flex-start",
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        className="glass"
        style={{
          margin: "0 clamp(20px, 5vw, 64px) 18px",
          borderRadius: 16,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          className={pending ? "breathe" : ""}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: pending ? "var(--cc-info)" : "var(--cc-prompt)",
            boxShadow: `0 0 0 4px color-mix(in oklab, ${
              pending ? "var(--cc-info)" : "var(--cc-prompt)"
            } 22%, transparent)`,
            flexShrink: 0,
          }}
        />
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder={pending ? "Aguardando verdict..." : "Evidência, análise, hipótese..."}
          disabled={pending}
          style={{
            flex: 1,
            fontSize: 14,
            color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            opacity: pending ? 0.55 : 1,
            padding: "6px 0",
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          {input.length}
        </span>
        {input.trim() && !pending && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{
              background: "none",
              border: "1px solid var(--accent-dim)",
              color: "var(--accent)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "7px 14px",
              borderRadius: 999,
              fontFamily: "var(--mono)",
              transition: "all .2s var(--ease-swift)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Enter ↵
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
  const r = ev.result as Record<string, unknown>;
  return "tool_calls" in r || "iterations" in r ? "agent" : "triad";
}

function MessageBubble({ note }: { note: Note }) {
  const isAI = note.role === "ai";
  const len = (note.text || "").length;
  const maxW = len < 60 ? 360 : len < 200 ? 520 : 680;

  return (
    <div
      className="fadeUp"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAI ? "flex-start" : "flex-end",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          background: isAI ? "var(--bg-input)" : "var(--bg-elevated)",
          border: `1px solid ${isAI ? "var(--border-subtle)" : "var(--border)"}`,
          borderLeft: isAI ? "2px solid var(--accent-dim)" : undefined,
          borderRadius: 14,
          padding: "14px 18px",
          maxWidth: maxW,
          minWidth: 80,
          boxShadow: isAI ? "none" : "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: "var(--text-primary)",
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            fontFamily: "var(--sans)",
          }}
        >
          {note.text}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-ghost)",
            marginTop: 8,
            letterSpacing: 0.3,
            fontFamily: "var(--mono)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isAI && (
            <>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--ember)",
                  boxShadow: "0 0 0 2px color-mix(in oklab, var(--ember) 20%, transparent)",
                }}
              />
              <span>LAB · ruberra</span>
              <span style={{ color: "var(--text-muted)" }}>·</span>
            </>
          )}
          <span>
            {new Date(note.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
