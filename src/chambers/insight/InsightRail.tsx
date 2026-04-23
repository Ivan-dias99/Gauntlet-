import type { Mission, Principle } from "../../spine/types";
import type { VerdictState, LiveState } from "./helpers";
import { useCopy } from "../../i18n/copy";

// Insight rail — single continuous support column, not a stack of
// heavy cards. Three sections separated by dashed hairlines:
//
//   · mission        — title + compressed meta (opened · turns · doctrine)
//   · principles     — § list, clipped
//   · trail          — recent verdicts as flat rows
//
// A live band appears above the sections only while a call is in
// flight, carrying the abort affordance. Sections with no content hide
// themselves — the rail never inflates with empty boxes. The only
// shadow authority lives on the conversation column in the main
// region; the rail stays quiet.

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

export default function InsightRail({
  mission, principles, trail, live, pending,
  lastConfidence, lastVerdictRefused, onAbort,
}: Props) {
  const copy = useCopy();
  const hasPrinciples = principles.length > 0;
  const hasTrail = trail.length > 0;

  return (
    <div className="insight-rail" data-insight-rail>
      {pending && (
        <LiveBand live={live} onAbort={onAbort} copy={copy} />
      )}

      <MissionSection
        mission={mission}
        principlesCount={principles.length}
        pending={pending}
        lastConfidence={lastConfidence}
        lastVerdictRefused={lastVerdictRefused}
        copy={copy}
      />

      <section
        className="insight-rail-section"
        data-empty={hasPrinciples ? undefined : "true"}
        data-insight-section="principles"
      >
        <span className="insight-rail-kicker">
          {copy.labRailPrinciplesKicker.replace("— ", "")}
          <span className="sep" style={{ color: "var(--text-ghost)" }}>·</span>
          <span style={{ color: "var(--text-muted)" }}>{principles.length}</span>
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {principles.slice(-6).map((p) => (
            <div key={p.id} className="insight-rail-principle">
              <span className="insight-rail-principle-glyph" aria-hidden>§</span>
              <span>{clamp(p.text, 96)}</span>
            </div>
          ))}
          {principles.length > 6 && (
            <span
              className="insight-rail-kicker"
              style={{ color: "var(--text-ghost)", paddingTop: 2 }}
            >
              {copy.labRailPrinciplesMore(principles.length - 6)}
            </span>
          )}
        </div>
      </section>

      <section
        className="insight-rail-section"
        data-empty={hasTrail ? undefined : "true"}
        data-insight-section="trail"
      >
        <span className="insight-rail-kicker">
          {copy.labRailTrailKicker.replace("— ", "")}
          {hasTrail && (
            <>
              <span className="sep" style={{ color: "var(--text-ghost)" }}>·</span>
              <span style={{ color: "var(--text-muted)" }}>{trail.length}</span>
            </>
          )}
        </span>
        <div className="insight-rail-trail">
          {trail.slice().reverse().slice(0, 5).map((v, i) => {
            const routeTone =
              v.refused ? "err" :
              v.routePath === "agent" ? "warn" : "accent";
            const confTone =
              v.refused ? "err" :
              v.confidence === "high" ? "ok" :
              v.confidence === "low" ? "warn" : "muted";
            const routeLabel = v.routePath === "agent"
              ? copy.labRailStatusRouteAgent
              : copy.labRailStatusRouteTriad;
            return (
              <div key={i} className="insight-rail-trail-row">
                <span className="kicker" data-tone={routeTone}>
                  {v.refused ? "✗ " : ""}{routeLabel}
                </span>
                <span className="kicker" data-tone={confTone}>
                  {v.refused ? copy.labRailTrailRefused : (v.confidence ?? copy.labRailStatusNone)}
                </span>
                <span className="insight-rail-trail-q" title={v.question}>
                  {clamp(v.question, 54)}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ——— Mission section ———
//
// Mission title as the anchor; compressed one-line meta below (opened ·
// turns · doctrine · confidence). When there is no mission we collapse
// to a single calm line — the rail never shouts the absence.

function MissionSection({
  mission, principlesCount, pending, lastConfidence, lastVerdictRefused, copy,
}: {
  mission: Mission | null;
  principlesCount: number;
  pending: boolean;
  lastConfidence: string | null;
  lastVerdictRefused: boolean;
  copy: ReturnType<typeof useCopy>;
}) {
  if (!mission) {
    return (
      <section className="insight-rail-section" data-insight-section="mission">
        <span className="insight-rail-kicker">
          {copy.labRailMissionKicker.replace("— ", "")}
        </span>
        <span className="insight-rail-mission-null">
          {copy.labRailNoMission}
        </span>
      </section>
    );
  }

  const noteCount = mission.notes?.length ?? 0;
  const ago = relativeTime(mission.createdAt, copy);
  const confLabel =
    pending ? null :
    lastVerdictRefused ? copy.labRailTrailRefused :
    lastConfidence ?? null;
  const confTone: "err" | "ok" | "warn" | "muted" =
    lastVerdictRefused ? "err" :
    lastConfidence === "high" ? "ok" :
    lastConfidence === "low" ? "warn" : "muted";

  return (
    <section className="insight-rail-section" data-insight-section="mission">
      <div className="insight-rail-kicker">
        {copy.labRailMissionKicker.replace("— ", "")}
      </div>
      <div className="insight-rail-mission">{mission.title}</div>
      <div className="insight-rail-line">
        <span>
          <span style={{ color: "var(--text-ghost)" }}>
            {copy.labRailMetaOpened}
          </span>{" "}
          {ago}
        </span>
        <span className="sep">·</span>
        <span>
          <span style={{ color: "var(--text-ghost)" }}>
            {copy.labRailMetaTurns}
          </span>{" "}
          {noteCount}
        </span>
        {principlesCount > 0 && (
          <>
            <span className="sep">·</span>
            <span>
              <span style={{ color: "var(--text-ghost)" }}>
                {copy.labRailMetaDoctrine}
              </span>{" "}
              <span style={{ color: "var(--chamber-dna, var(--accent))" }}>
                {principlesCount}
              </span>
            </span>
          </>
        )}
        {confLabel && (
          <>
            <span className="sep">·</span>
            <span
              className="state-pill"
              data-tone={confTone}
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <span className="state-pill-dot" />
              {confLabel}
            </span>
          </>
        )}
      </div>
    </section>
  );
}

// ——— Live band ———
//
// Only renders while a call is in flight. Carries: pulsing dot, the
// current stage label, and an abort chip. Sits above every other
// rail section so the eye catches it first.

function LiveBand({
  live, onAbort, copy,
}: {
  live: LiveState;
  onAbort: () => void;
  copy: ReturnType<typeof useCopy>;
}) {
  const routeLabel = live.routePath === "agent"
    ? copy.labRailStatusRouteAgent
    : live.routePath === "triad"
    ? copy.labRailStatusRouteTriad
    : null;

  const stage = (() => {
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

  return (
    <div className="insight-rail-live">
      <span
        className="status-dot"
        data-tone="info"
        data-pulse="true"
        aria-hidden
      />
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
      <span
        className="insight-rail-live-label"
        title={live.lastEventLabel}
      >
        {live.lastEventLabel}
      </span>
      <button
        onClick={onAbort}
        className="insight-rail-abort"
        title={copy.labRailStatusStop}
        data-insight-abort
      >
        {copy.labRailStatusStop}
      </button>
    </div>
  );
}

// ——— helpers ———

function clamp(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

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
