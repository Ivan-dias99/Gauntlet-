import type { Note } from "../../spine/types";
import { useCopy } from "../../i18n/copy";

// Insight thread — one conversation paper, many turn rows. The paper
// carries its own elevation + header so the main region finally reads
// as a document, not a loose stream. Each row lives inside the paper
// with a 72px gutter (role glyph + time) + body (label + text) +
// optional action column. Answers shift to the serif register for
// gravity; asks stay sans for speed.

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
  const copy = useCopy();
  if (notes.length === 0) return null;

  const turnCount = notes.length;

  return (
    <div className="conversation" data-insight-thread>
      <div className="conversation-head">
        <span className="kicker" data-tone="ghost">
          sessão
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            color: "var(--text-muted)",
            letterSpacing: "var(--track-meta)",
            marginLeft: "auto",
          }}
        >
          {turnCount} {turnCount === 1 ? "turno" : "turnos"}
        </span>
      </div>
      <div className="conversation-body">
        {notes.map((n) => (
          <TurnRow
            key={n.id}
            note={n}
            copy={copy}
            promoting={promoteId === n.id}
            onPromoteRequest={() => onPromoteRequest(n.id)}
            onPromoteConfirm={() => onPromoteConfirm(n)}
            onPromoteCancel={onPromoteCancel}
          />
        ))}
      </div>
    </div>
  );
}

interface TurnProps {
  note: Note;
  copy: ReturnType<typeof useCopy>;
  promoting: boolean;
  onPromoteRequest: () => void;
  onPromoteConfirm: () => void;
  onPromoteCancel: () => void;
}

type TurnKind = "ask" | "answer" | "warn" | "refuse";

function TurnRow({
  note, copy, promoting, onPromoteRequest, onPromoteConfirm, onPromoteCancel,
}: TurnProps) {
  const isAI = note.role === "ai";
  const isRefusal = isAI && (
    note.text.startsWith("Não sei responder") ||
    note.text.startsWith("⚠️ **Signal")
  );
  const isWarning = isAI && note.text.startsWith("⚠ Esta pergunta");
  const canPromote = isAI && !isRefusal && !isWarning;

  const kind: TurnKind =
    !isAI ? "ask" : isRefusal ? "refuse" : isWarning ? "warn" : "answer";
  const label =
    kind === "ask"    ? copy.labTurnAsk :
    kind === "refuse" ? copy.labTurnRefuse :
    kind === "warn"   ? copy.labTurnWarn :
                        copy.labTurnAnswer;
  const glyph =
    kind === "ask"    ? "?" :
    kind === "refuse" ? "✗" :
    kind === "warn"   ? "⚠" :
                        "§";

  return (
    <div className="fadeUp turn-row" data-insight-turn={kind} data-turn={kind}>
      <div className="turn-row-gutter">
        <span className="turn-row-glyph" aria-hidden>{glyph}</span>
        <span className="turn-row-time">
          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="turn-row-main">
        <span className="turn-row-label">{label}</span>
        <div className="turn-row-text">{note.text}</div>
        {canPromote && promoting && (
          <div
            data-insight-promote-confirm
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              flexWrap: "wrap",
              paddingTop: 6,
              borderTop: "1px dashed var(--border-color-soft)",
              marginTop: 2,
            }}
          >
            <span className="kicker">— transferir para terminal</span>
            <button
              onClick={onPromoteConfirm}
              className="btn-chip"
              data-variant="ok"
              style={{ marginLeft: "auto" }}
            >
              confirmar ↵
            </button>
            <button onClick={onPromoteCancel} className="btn-chip">
              cancelar esc
            </button>
          </div>
        )}
      </div>

      <div
        className="turn-row-actions"
        data-empty={canPromote && !promoting ? undefined : "true"}
      >
        {canPromote && !promoting && (
          <button
            onClick={onPromoteRequest}
            data-insight-promote
            className="turn-row-promote"
            title="passar esta resposta para uma tarefa no Terminal"
          >
            → terminal
          </button>
        )}
      </div>
    </div>
  );
}
