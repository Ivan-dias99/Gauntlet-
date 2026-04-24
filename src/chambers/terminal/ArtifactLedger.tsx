import { useState } from "react";
import type { Artifact } from "../../spine/types";
import type { Copy } from "./helpers";

interface Props {
  artifacts: Artifact[];
  copy: Copy;
  onSelectArtifact: (a: Artifact) => void;
}

const COLLAPSED_LIMIT = 4;

// Mission archive — demoted from a panel to a quiet chamber foot.
// Hairline above, ghost rows, expand-on-click to see all. Never
// competes with the command surface or the exec canvas above.
export default function ArtifactLedger({ artifacts, copy, onSelectArtifact }: Props) {
  const [expanded, setExpanded] = useState(false);
  const total = artifacts.length;
  const hasMore = total > COLLAPSED_LIMIT;
  const visible = expanded ? artifacts : artifacts.slice(0, COLLAPSED_LIMIT);
  const termEarly = artifacts.filter((a) => a.terminatedEarly).length;

  const fmtRel = (then: number) => {
    const diff = Date.now() - then;
    if (diff < 60_000) return "agora";
    if (diff < 3_600_000) {
      const m = Math.max(1, Math.round(diff / 60_000));
      return `há ${m}m`;
    }
    if (diff < 86_400_000) {
      const h = Math.round(diff / 3_600_000);
      return `há ${h}h`;
    }
    const d = Math.round(diff / 86_400_000);
    return `há ${d}d`;
  };

  return (
    <section className="term-ledger-foot">
      <div className="term-ledger-foot-head">
        <span className="kicker" data-tone="ghost">{copy.recentArtifacts}</span>
        {total > 0 && (
          <span className="kicker" data-tone="muted">· {total}</span>
        )}
        {termEarly > 0 && (
          <span className="kicker" data-tone="warn">· ⚠ {termEarly}</span>
        )}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="btn-chip"
            style={{ marginLeft: "auto", padding: "2px 8px" }}
          >
            {expanded ? "recolher" : `ver todos (${total})`}
          </button>
        )}
      </div>

      {total === 0 ? (
        <span
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
        </span>
      ) : (
        <div>
          {visible.map((a) => {
            const clickable = Boolean(a.taskId);
            return (
              <div
                key={a.id}
                className="term-ledger-foot-row fadeIn"
                data-clickable={clickable ? "true" : "false"}
                onClick={clickable ? () => onSelectArtifact(a) : undefined}
              >
                <span
                  style={{
                    color: a.terminatedEarly ? "var(--cc-warn)" : "var(--cc-ok)",
                    fontSize: 11,
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  ◆
                </span>
                <span className="term-ledger-foot-title" title={a.taskTitle}>
                  {a.taskTitle}
                </span>
                <span className="term-ledger-foot-meta">
                  {fmtRel(a.acceptedAt)}
                  {a.terminatedEarly && (
                    <span style={{ color: "var(--cc-warn)" }}> · parcial</span>
                  )}
                  {clickable && (
                    <span style={{ opacity: 0.55 }}> · ↺</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
