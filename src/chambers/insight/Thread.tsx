import type { Note } from "../../spine/types";

// Insight thread — reversed notes list + turn primitive with handoff
// action. Conversation-first; no forced split. Chamber-DNA cascades
// from the parent chamber-shell via [data-chamber].

interface Props {
  notes: Note[];
  promoteId: string | null;
  onPromoteRequest: (noteId: string) => void;
  onPromoteConfirm: (note: Note) => void;
  onPromoteCancel: () => void;
}

export default function Thread({
  notes, promoteId, onPromoteRequest, onPromoteConfirm, onPromoteCancel,
}: Props) {
  return (
    <div
      data-insight-thread
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {notes.map((n) => (
        <TurnRow
          key={n.id}
          note={n}
          promoting={promoteId === n.id}
          onPromoteRequest={() => onPromoteRequest(n.id)}
          onPromoteConfirm={() => onPromoteConfirm(n)}
          onPromoteCancel={onPromoteCancel}
        />
      ))}
    </div>
  );
}

interface TurnProps {
  note: Note;
  promoting: boolean;
  onPromoteRequest: () => void;
  onPromoteConfirm: () => void;
  onPromoteCancel: () => void;
}

function TurnRow({
  note, promoting, onPromoteRequest, onPromoteConfirm, onPromoteCancel,
}: TurnProps) {
  const isAI = note.role === "ai";
  // Heuristic refusal detection — the Rubera refusal format starts with
  // a specific sentence so a non-blocking ✗ label can render.
  const isRefusal = isAI && (
    note.text.startsWith("Não sei responder") ||
    note.text.startsWith("⚠️ **Ruberra")
  );
  const isWarning = isAI && note.text.startsWith("⚠ Esta pergunta");
  const canPromote = isAI && !isRefusal && !isWarning;

  const { label, borderColor, labelColor, dotColor } = (() => {
    if (!isAI) return {
      label: "PRESSÃO",
      borderColor: "var(--cc-prompt)",
      labelColor: "var(--text-muted)",
      dotColor: "var(--cc-prompt)",
    };
    if (isRefusal) return {
      label: "RECUSADO",
      borderColor: "var(--cc-err)",
      labelColor: "var(--cc-err)",
      dotColor: "var(--cc-err)",
    };
    if (isWarning) return {
      label: "AVISO",
      borderColor: "var(--cc-warn)",
      labelColor: "var(--cc-warn)",
      dotColor: "var(--cc-warn)",
    };
    return {
      label: "ANÁLISE",
      borderColor: "color-mix(in oklab, var(--chamber-dna, var(--accent-dim)) 70%, transparent)",
      labelColor: "var(--text-ghost)",
      dotColor: "var(--chamber-dna, var(--ember))",
    };
  })();

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
        borderRadius: "0 var(--radius-control) var(--radius-control) 0",
        opacity: isRefusal ? 0.92 : 1,
        maxWidth: 780,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor }} />
        <span style={{ color: labelColor }}>{label}</span>
        <span
          style={{
            color: "var(--text-ghost)",
            marginLeft: "auto",
            letterSpacing: 0.5,
          }}
        >
          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body)",
          color: "var(--text-primary)",
          lineHeight: "var(--lh-body)",
          whiteSpace: "pre-wrap",
        }}
      >
        {note.text}
      </div>

      {canPromote && !promoting && (
        <button
          onClick={onPromoteRequest}
          data-insight-promote
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            padding: 0,
            marginTop: 2,
            cursor: "pointer",
            transition: "color .16s var(--ease-swift)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-ghost)"; }}
        >
          → terminal
        </button>
      )}
      {canPromote && promoting && (
        <div
          style={{
            marginTop: 6,
            paddingTop: 8,
            borderTop: "1px dashed var(--border-soft)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>— transferir para terminal</span>
          <button
            onClick={onPromoteConfirm}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "var(--cc-ok)",
              font: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              padding: 0,
              cursor: "pointer",
            }}
          >
            ↵ confirmar
          </button>
          <button
            onClick={onPromoteCancel}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-ghost)",
              font: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              padding: 0,
              cursor: "pointer",
            }}
          >
            esc cancelar
          </button>
        </div>
      )}
    </div>
  );
}
