import { useEffect, useRef, useState } from "react";
import type { Stats } from "./helpers";
import { formatTokens } from "./helpers";
import { useCopy } from "../../i18n/copy";

// Archive Workbench — horizontal pill above the split.
//
// Sibling family of Terminal / Surface / Insight / Core workbenches.
// Same .term-workbench-strip recipe, Archive DNA tone (--ch-archive
// = accent-dim). Replaces the old StatsBar grid (5 cells with the
// same metrics) with the workbench-grammar lens cluster.
//
// Lenses (all wired, computed from the runs/stats endpoint or the
// local fallback):
//   · Runs    — total run count (stats.total)
//   · Refused — refusal rate as % (stats.refusalRate)
//   · Latency — avg ms per run (stats.avgLatencyMs)
//   · Tokens  — total in+out tokens (formatTokens)
//   · Tools   — agent tool call count (stats.toolCalls)
//
// Status text narrates ledger posture:
//   · "loading mission ledger…"           (runs === null + has mission)
//   · "empty ledger · no runs..."         (runs === [])
//   · "N runs sealed · provenance avail." (runs > 0)

type Lens = null | "runs" | "refused" | "latency" | "tokens" | "tools";

interface Props {
  stats: Stats;
  loading: boolean;
  hasMission: boolean;
}

export default function ArchiveWorkbench({ stats, loading, hasMission }: Props) {
  const copy = useCopy();
  const [lens, setLens] = useState<Lens>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lens) return;
    function onDoc(e: MouseEvent) {
      const el = stripRef.current;
      if (el && !el.contains(e.target as Node)) setLens(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [lens]);

  // Status posture — narrates the ledger state in italic sans.
  const statusText = !hasMission
    ? copy.archiveWbStatusEmpty
    : loading
      ? copy.archiveWbStatusLoading
      : stats.total === 0
        ? copy.archiveWbStatusEmpty
        : copy.archiveWbStatusReady(stats.total);

  // Lens values — all real; idle dash when no runs yet.
  const hasData = stats.total > 0;
  const refusedValue = hasData
    ? `${(stats.refusalRate * 100).toFixed(0)}%`
    : copy.archiveWbValueIdle;
  const latencyValue = hasData
    ? `${stats.avgLatencyMs}ms`
    : copy.archiveWbValueIdle;
  const tokensValue = hasData
    ? formatTokens(stats.totalInput + stats.totalOutput)
    : copy.archiveWbValueIdle;
  const toolsValue = hasData
    ? `${stats.toolCalls}`
    : copy.archiveWbValueIdle;

  return (
    <div ref={stripRef} className="term-workbench-strip" data-archive-workbench>
      <span className="term-workbench-icon" aria-hidden>
        <IconArchive />
      </span>
      <span className="term-workbench-label">{copy.archiveWbLabel}</span>

      <span className="term-workbench-sep" aria-hidden />
      <span className="term-workbench-status" title={statusText}>
        {statusText}
      </span>

      <div className="term-workbench-lenses">
        <LensButton
          icon={<IconRuns />}
          label={copy.archiveWbRunsLabel}
          value={`${stats.total}`}
          active={lens === "runs"}
          wired={hasData}
          onClick={() => setLens(lens === "runs" ? null : "runs")}
        />
        <LensButton
          icon={<IconRefused />}
          label={copy.archiveWbRefusedLabel}
          value={refusedValue}
          active={lens === "refused"}
          wired={hasData}
          tone={hasData && stats.refusalRate >= 0.5 ? "warn" : undefined}
          onClick={() => setLens(lens === "refused" ? null : "refused")}
        />
        <LensButton
          icon={<IconLatency />}
          label={copy.archiveWbLatencyLabel}
          value={latencyValue}
          active={lens === "latency"}
          wired={hasData}
          onClick={() => setLens(lens === "latency" ? null : "latency")}
        />
        <LensButton
          icon={<IconTokens />}
          label={copy.archiveWbTokensLabel}
          value={tokensValue}
          active={lens === "tokens"}
          wired={hasData}
          onClick={() => setLens(lens === "tokens" ? null : "tokens")}
        />
        <LensButton
          icon={<IconAgentTools />}
          label={copy.archiveWbToolsLabel}
          value={toolsValue}
          active={lens === "tools"}
          wired={hasData}
          onClick={() => setLens(lens === "tools" ? null : "tools")}
        />
      </div>

      {lens && (
        <div className="term-workbench-flyout-anchor">
          {lens === "runs"    && <LensFlyout title={copy.archiveWbRunsLabel}    body={copy.archiveWbRunsBody}    wired={hasData} />}
          {lens === "refused" && <LensFlyout title={copy.archiveWbRefusedLabel} body={copy.archiveWbRefusedBody} wired={hasData} />}
          {lens === "latency" && <LensFlyout title={copy.archiveWbLatencyLabel} body={copy.archiveWbLatencyBody} wired={hasData} />}
          {lens === "tokens"  && <LensFlyout title={copy.archiveWbTokensLabel}  body={copy.archiveWbTokensBody}  wired={hasData} />}
          {lens === "tools"   && <LensFlyout title={copy.archiveWbToolsLabel}   body={copy.archiveWbToolsBody}   wired={hasData} />}
        </div>
      )}
    </div>
  );
}

// ——— Primitives ———

function LensButton({
  icon, label, value, active, wired, tone, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
  wired: boolean;
  tone?: "warn";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="term-wb-lens"
      data-active={active ? "true" : undefined}
      data-wired={wired ? "true" : "false"}
      data-tone={tone}
      onClick={onClick}
      title={label}
    >
      <span className="term-wb-lens-icon" aria-hidden>{icon}</span>
      <span className="term-wb-lens-label">{label}</span>
      <span className="term-wb-lens-value">{value}</span>
    </button>
  );
}

function LensFlyout({
  title, body, wired,
}: {
  title: string;
  body: string;
  wired: boolean;
}) {
  return (
    <div className="term-flyout" data-tone={wired ? undefined : "not-wired"} role="menu">
      <div className="term-flyout-head">
        <span>{title}{wired ? " · live" : " · idle"}</span>
      </div>
      <div className="term-flyout-body">
        <p className="term-flyout-prose">{body}</p>
      </div>
    </div>
  );
}

// ——— Icons ———

const SVG = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Archive glyph — diamond ◇ honoring --ch-archive-glyph.
function IconArchive() {
  return (
    <svg {...SVG} strokeWidth={2}>
      <path d="M12 3l9 9-9 9-9-9z" />
    </svg>
  );
}
function IconRuns() {
  return (
    <svg {...SVG}>
      <path d="M5 4h14v4H5z" />
      <path d="M5 10h14v4H5z" />
      <path d="M5 16h14v4H5z" />
    </svg>
  );
}
function IconRefused() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  );
}
function IconLatency() {
  return (
    <svg {...SVG}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconTokens() {
  return (
    <svg {...SVG}>
      <circle cx="8" cy="8" r="4" />
      <circle cx="16" cy="16" r="4" />
      <path d="M11 11l2 2" />
    </svg>
  );
}
function IconAgentTools() {
  return (
    <svg {...SVG}>
      <path d="M14.7 6.3a4 4 0 1 0 5.3 5.3L22 10a8 8 0 0 1-10.5 10.5l-8-8A8 8 0 0 1 14 2l-1.7 1.7a4 4 0 0 0 2.4 2.6" />
    </svg>
  );
}
