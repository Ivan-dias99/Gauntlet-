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

// ArtifactLedger — the mission's sealed archive. Built on the shared
// .panel + .ledger-row grammar: kicker at the top, ledger rows below,
// optional expand chip. Left-hairline on each row encodes clickability
// via --tone (ok for clickable, ghost for non-clickable).
export default function ArtifactLedger({ artifacts, copy, lang, onSelectArtifact }: Props) {
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
    <section
      className="panel"
      style={{ marginTop: "var(--space-4)", maxWidth: 860 }}
    >
      <div className="panel-head">
        <span className="status-dot" data-tone="ok" />
        <span className="kicker">{copy.recentArtifacts}</span>
        {artifacts.length > 0 && (
          <span className="kicker" data-tone="ghost">· {artifacts.length}</span>
        )}
        {termEarly > 0 && (
          <span
            className="kicker"
            data-tone="warn"
            title={lang === "en"
              ? `${termEarly} terminated early`
              : `${termEarly} terminação${termEarly === 1 ? "" : "ões"} antecipada${termEarly === 1 ? "" : "s"}`}
          >
            · ⚠ {termEarly}
          </span>
        )}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-chip"
            style={{ marginLeft: "auto" }}
          >
            {expanded
              ? (lang === "en" ? "↑ collapse" : "↑ recolher")
              : (lang === "en" ? `↓ show all (${total})` : `↓ ver todos (${total})`)}
          </button>
        )}
      </div>

      {total === 0 ? (
        <div
          className="kicker"
          data-tone="ghost"
          style={{
            fontStyle: "italic",
            fontFamily: "var(--sans)",
            textTransform: "none",
            letterSpacing: 0,
            fontSize: "var(--t-body-sec)",
          }}
        >
          {copy.artifactEmpty}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {visible.map((a) => {
            const preview = a.answer
              ? (a.answer.length > 140 ? a.answer.slice(0, 140) + "…" : a.answer)
              : "—";
            const clickable = Boolean(a.taskId);

            return (
              <div
                key={a.id}
                onClick={clickable ? () => onSelectArtifact(a) : undefined}
                className="fadeIn ledger-row"
                data-tone={a.terminatedEarly ? "warn" : "ok"}
                style={{
                  fontFamily: "var(--mono)",
                  cursor: clickable ? "pointer" : "default",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: 4,
                  }}
                >
                  <span className="status-dot" data-tone={a.terminatedEarly ? "warn" : "ok"} />
                  <span className="kicker" data-tone={a.terminatedEarly ? "warn" : "ok"}>
                    {a.terminatedEarly ? interruptedLabel : "selado"}
                  </span>
                  <span className="kicker" data-tone="ghost">
                    · {fmtRel(a.acceptedAt)}
                  </span>
                  {clickable && (
                    <span
                      className="kicker"
                      data-tone="ghost"
                      style={{ marginLeft: "auto" }}
                    >
                      {replayLabel}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "var(--t-body)",
                    fontFamily: "var(--sans)",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    marginBottom: 4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {a.taskTitle}
                </div>
                <div
                  style={{
                    fontSize: "var(--t-body-sec)",
                    color: a.terminatedEarly && !a.answer
                      ? "var(--cc-warn)"
                      : "var(--text-muted)",
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
    </section>
  );
}
