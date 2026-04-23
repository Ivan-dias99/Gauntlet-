import type { Note } from "../../spine/types";
import { useCopy } from "../../i18n/copy";

// Insight thread — conversation column. Every turn passes through the
// canonical .turn primitive (tokens.css) so ask/answer/warn/refuse
// always render with the same geometry and semantic color across the
// product. Role, tone and action grammar is declared in data attributes;
// no local style decisions here.

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
  return (
    <div
      data-insight-thread
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
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
  const dotTone =
    kind === "ask"    ? "prompt" :
    kind === "refuse" ? "err" :
    kind === "warn"   ? "warn" :
                        "accent";

  return (
    <div
      className="fadeUp turn"
      data-insight-turn={kind}
      data-turn={kind}
    >
      <div className="turn-head">
        <span className="status-dot" data-tone={dotTone} />
        <span className="kicker">{label}</span>
        <span className="turn-time">
          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="turn-body">{note.text}</div>

      {canPromote && !promoting && (
        <div className="turn-actions" data-empty="true" style={{ justifyContent: "flex-end" }}>
          <button
            onClick={onPromoteRequest}
            data-insight-promote
            className="btn-chip"
            data-variant="sans"
          >
            → terminal
          </button>
        </div>
      )}

      {canPromote && promoting && (
        <div className="turn-actions" data-insight-promote-confirm>
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
  );
}
