import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useAI, AIMessage } from "../hooks/useAI";
import { Note } from "../spine/types";

const SYSTEM = `You are the Lab intelligence of Ruberra — a sovereign operating system for architects who build with consequence.

Your function: analyze evidence submitted by the operator. Be forensic. Be surgical. Do not praise — dissect.
- Identify what is known, what is assumed, what is missing
- Challenge weak logic. Surface hidden implications
- Speak in the operator's language. Concise. Max 4 sentences unless probed deeper.
- You are not an assistant. You are an analytical extension of the operator's mind.`;

export default function Lab() {
  const { activeMission, addNote, addNoteToMission } = useSpine();
  const { send, streaming } = useAI();
  const [input, setInput] = useState("");
  const [liveText, setLiveText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, liveText]);

  function submit() {
    const v = input.trim();
    if (!v || streaming) return;

    // Pin the mission ID now — user may switch missions while streaming
    const targetMissionId = activeMission?.id;
    if (!targetMissionId) return;

    addNote(v, "user");
    setInput("");

    // Build history for AI context
    const history: AIMessage[] = notes.map(n => ({
      role: n.role === "ai" ? "assistant" : "user",
      content: n.text,
    }));
    history.push({ role: "user", content: v });

    let accumulated = "";
    setLiveText("▊");

    send(
      SYSTEM,
      history,
      (chunk) => {
        accumulated += chunk;
        setLiveText(accumulated + "▊");
      },
      () => {
        if (accumulated.trim()) addNoteToMission(targetMissionId, accumulated.trim(), "ai");
        setLiveText("");
      },
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
        {streaming && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--accent)", fontFamily: "var(--mono)", letterSpacing: 1 }}>
            ANALISANDO
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        {notes.length === 0 && !liveText && (
          <div style={{ fontSize: 13, color: "var(--text-ghost)", fontStyle: "italic", marginTop: 8 }}>
            Sem evidências. Comece a investigar.
          </div>
        )}

        {notes.map(n => (
          <MessageBubble key={n.id} note={n} />
        ))}

        {/* Live streaming bubble */}
        {liveText && (
          <div style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "2px solid var(--accent-dim)",
            borderRadius: "var(--radius)",
            padding: "12px 16px",
            maxWidth: 680,
            alignSelf: "flex-start",
          }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {liveText}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
          placeholder={streaming ? "Aguardando resposta..." : "Evidência, análise, hipótese..."}
          disabled={streaming}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: 14, color: "var(--text-primary)",
            fontFamily: "var(--sans)",
            opacity: streaming ? 0.5 : 1,
          }}
        />
        {input.trim() && !streaming && (
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
