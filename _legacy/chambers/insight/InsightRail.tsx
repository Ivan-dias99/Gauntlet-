import type { Mission, Principle } from "../../spine/types";
import type { VerdictState, LiveState } from "./helpers";
import { useCopy } from "../../i18n/copy";

// Insight context strip — a thin, single-line horizontal band that
// replaces the old side rail. It lives directly under the chamber
// head and carries the only operational narration Insight needs:
// mission title, turn count, doctrine count, and a live pulse (only
// while a call is in flight) that owns the abort affordance.
//
// The file is named InsightRail for compatibility with existing
// imports — the component export is ContextStrip now.

interface Props {
  mission: Mission | null;
  principles: Principle[];
  trail: VerdictState[];
  live: LiveState;
  pending: boolean;
  lastConfidence: string | null;
  lastVerdictRefused: boolean;
  onAbort: () => void;
}

export default function ContextStrip({
  mission, principles, live, pending,
  lastConfidence, lastVerdictRefused, onAbort,
}: Props) {
  const copy = useCopy();
  const noteCount = mission?.notes?.length ?? 0;
  const ago = mission ? relativeTime(mission.createdAt, copy) : null;

  const confLabel =
    pending ? null :
    lastVerdictRefused ? copy.labRailTrailRefused :
    lastConfidence ?? null;
  const confTone: "err" | "ok" | "warn" | "muted" =
    lastVerdictRefused ? "err" :
    lastConfidence === "high" ? "ok" :
    lastConfidence === "low" ? "warn" : "muted";

  const stage = (() => {
    if (!pending) return null;
    if (live.routePath === "agent") {
      return `iter ${live.agentIter} · ${live.agentToolCount} tools`;
    }
    if (live.triadTotal > 0 && live.triadCompleted < live.triadTotal) {
      return `${live.triadCompleted}/${live.triadTotal}`;
    }
    if (live.judgeState === "evaluating") return "judge";
    if (live.judgeState === "done") return "done";
    return null;
  })();

  const routeLabel =
    pending && live.routePath === "agent" ? copy.labRailStatusRouteAgent :
    pending && live.routePath === "triad" ? copy.labRailStatusRouteTriad :
    null;

  return (
    <div className="insight-strip" data-insight-strip>
      {mission ? (
        <span className="insight-strip-mission" title={mission.title}>
          {mission.title}
        </span>
      ) : (
        <span className="insight-strip-null">{copy.labRailNoMission}</span>
      )}

      {mission && ago && (
        <>
          <span className="insight-strip-sep">·</span>
          <span className="insight-strip-meta">
            <span className="insight-strip-meta-label">{copy.labRailMetaOpened}</span>
            <span className="insight-strip-meta-value">{ago}</span>
          </span>
        </>
      )}

      {mission && (
        <>
          <span className="insight-strip-sep">·</span>
          <span className="insight-strip-meta">
            <span className="insight-strip-meta-label">{copy.labRailMetaTurns}</span>
            <span className="insight-strip-meta-value">{noteCount}</span>
          </span>
        </>
      )}

      {principles.length > 0 && (
        <>
          <span className="insight-strip-sep">·</span>
          <span className="insight-strip-meta">
            <span className="insight-strip-meta-label">{copy.labRailMetaDoctrine}</span>
            <span
              className="insight-strip-meta-value"
              style={{ color: "var(--chamber-dna, var(--accent))" }}
            >
              {principles.length}
            </span>
          </span>
        </>
      )}

      {confLabel && (
        <>
          <span className="insight-strip-sep">·</span>
          <span
            className="state-pill"
            data-tone={confTone}
            style={{ paddingTop: 0, paddingBottom: 0, fontSize: "var(--t-micro)" }}
          >
            <span className="state-pill-dot" />
            {confLabel}
          </span>
        </>
      )}

      {pending && (
        <span className="insight-strip-live">
          <span className="status-dot" data-tone="info" data-pulse="true" aria-hidden />
          <span>{copy.labRailStatusRunning}</span>
          {routeLabel && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{routeLabel}</span>
            </>
          )}
          {stage && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{stage}</span>
            </>
          )}
          <span className="insight-strip-live-label" title={live.lastEventLabel}>
            {live.lastEventLabel}
          </span>
          <button
            onClick={onAbort}
            className="insight-strip-abort"
            title={copy.labRailStatusStop}
            data-insight-abort
          >
            {copy.labRailStatusStop}
          </button>
        </span>
      )}
    </div>
  );
}

// ——— helpers ———

function relativeTime(ts: number, copy: ReturnType<typeof useCopy>): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return copy.labRailTimeNow;
  if (m < 60) return copy.labRailTimeMinutes(m);
  const h = Math.floor(m / 60);
  if (h < 24) return copy.labRailTimeHours(h);
  const d = Math.floor(h / 24);
  return copy.labRailTimeDays(d);
}
