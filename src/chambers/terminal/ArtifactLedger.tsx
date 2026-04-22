import { useState } from "react";
import type { Artifact } from "../../spine/types";
import type { Copy } from "./helpers";

interface Props {
  artifacts: Artifact[];
  copy: Copy;
  lang: string;
  onSelectArtifact: (a: Artifact) => void;
}

const COLLAPSED_LIMIT = 5;

export default function ArtifactLedger({ artifacts, copy, lang, onSelectArtifact }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const total = artifacts.length;
  const hasMore = total > COLLAPSED_LIMIT;
  const visible = expanded ? artifacts : artifacts.slice(0, COLLAPSED_LIMIT);
  const termEarly = artifacts.filter((a) => a.terminatedEarly).length;

  const fmtRel = (then: number) => {
    const diff = Date.now() - then;
    const en = lang === "en";
    if (diff < 60_000) return en ? "now" : "agora";
    if (diff < 3_600_000) {
      const m = Math.max(1, Math.round(diff / 60_000));
      return en ? `${m}m ago` : `há ${m}m`;
    }
    if (diff < 86_400_000) {
      const h = Math.round(diff / 3_600_000);
      return en ? `${h}h ago` : `há ${h}h`;
    }
    const d = Math.round(diff / 86_400_000);
    return en ? `${d}d ago` : `há ${d}d`;
  };

  const replayLabel = lang === "en" ? "↺ replay" : "↺ retomar";
  const interruptedLabel = lang === "en" ? "cut short" : "terminação antecipada";

  return (
    <div
      style={{
        marginTop: 28,
        paddingTop: 18,
        borderTop: "1px dashed var(--border-soft)",
        maxWidth: 820,
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2.5,
          color: "var(--text-muted)",
          fontFamily: "var(--mono)",
          textTransform: "uppercase",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "var(--cc-ok)", opacity: 0.7 }}>◆</span>
        <span>{copy.recentArtifacts}</span>
        {artifacts.length > 0 && (
          <span style={{ color: "var(--text-ghost)", letterSpacing: 1 }}>· {artifacts.length}</span>
        )}
        {termEarly > 0 && (
          <span
            title={lang === "en"
              ? `${termEarly} terminated early`
              : `${termEarly} terminação${termEarly === 1 ? "" : "ões"} antecipada${termEarly === 1 ? "" : "s"}`}
            style={{ color: "var(--cc-warn)", letterSpacing: 1 }}
          >
            · ⚠ {termEarly}
          </span>
        )}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "1px solid var(--border-soft)",
              color: "var(--text-ghost)",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--mono)",
              cursor: "pointer",
              transition: "color .15s, border-color .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.borderColor = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-ghost)";
              e.currentTarget.style.borderColor = "var(--border-soft)";
            }}
          >
            {expanded
              ? (lang === "en" ? "↑ collapse" : "↑ recolher")
              : (lang === "en" ? `↓ show all (${total})` : `↓ ver todos (${total})`)}
          </button>
        )}
      </div>

      {total === 0 ? (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-ghost)",
            fontStyle: "italic",
            fontFamily: "var(--sans)",
          }}
        >
          {copy.artifactEmpty}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map((a, i) => {
            const preview = a.answer
              ? (a.answer.length > 120 ? a.answer.slice(0, 120) + "…" : a.answer)
              : "—";
            const clickable = Boolean(a.taskId);
            const hovered = hoverId === a.id;
            const tier = Math.min(i, 2);
            const baseBg = [
              "color-mix(in oklab, var(--cc-ok) 10%, var(--bg-elevated))",
              "color-mix(in oklab, var(--cc-ok) 5%, var(--bg-elevated))",
              "var(--bg-elevated)",
            ][tier];
            const baseBorderLeft = [
              "3px solid var(--cc-ok)",
              "2px solid var(--cc-ok)",
              "2px solid color-mix(in oklab, var(--cc-ok) 45%, transparent)",
            ][tier];
            const bg = clickable && hovered
              ? "color-mix(in oklab, var(--cc-ok) 16%, var(--bg-elevated))"
              : baseBg;
            const borderLeft = clickable && hovered ? "3px solid var(--cc-ok)" : baseBorderLeft;

            return (
              <div
                key={a.id}
                onClick={clickable ? () => onSelectArtifact(a) : undefined}
                onMouseEnter={clickable ? () => setHoverId(a.id) : undefined}
                onMouseLeave={clickable ? () => setHoverId(null) : undefined}
                className="fadeIn"
                style={{
                  background: bg,
                  border: "1px solid var(--border-soft)",
                  borderLeft,
                  borderRadius: "var(--radius-panel)",
                  padding: "10px 14px",
                  fontFamily: "var(--mono)",
                  cursor: clickable ? "pointer" : "default",
                  transition: "background .18s var(--ease-swift), border-color .18s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "var(--cc-ok)",
                    marginBottom: 6,
                  }}
                >
                  <span>◆</span>
                  <span style={{ color: "var(--text-ghost)", letterSpacing: 1 }}>
                    {fmtRel(a.acceptedAt)}
                  </span>
                  {a.terminatedEarly && (
                    <span style={{ color: "var(--cc-warn)" }}>· {interruptedLabel}</span>
                  )}
                  {clickable && (
                    <span
                      style={{
                        marginLeft: "auto",
                        color: hovered ? "var(--cc-ok)" : "var(--text-ghost)",
                        letterSpacing: "var(--track-meta)",
                        transition: "color .18s var(--ease-swift)",
                      }}
                    >
                      {replayLabel}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontFamily: "var(--sans)",
                    color: ["var(--text-primary)", "var(--text-secondary)", "var(--text-muted)"][tier],
                    fontWeight: tier === 0 ? 500 : 400,
                    lineHeight: 1.4,
                    marginBottom: 4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {a.taskTitle}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: a.terminatedEarly && !a.answer
                      ? "var(--cc-warn)"
                      : ["var(--text-muted)", "var(--text-muted)", "var(--text-ghost)"][tier],
                    fontFamily: "var(--mono)",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {preview}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
