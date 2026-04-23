import type { Mission, Principle } from "../../spine/types";
import type { VerdictState, LiveState } from "./helpers";
import { useCopy } from "../../i18n/copy";

// Insight rail — right-side operational context for the active
// conversation. Four panels, always mounted so the rail holds weight
// parity with Surface's exploration rail and Archive's run detail:
//
//   1. Mission identity         · who we are talking to, how long, how deep
//   2. Chamber status           · live routing / confidence / iter / tools,
//                                 with stop-inflight affordance while running
//   3. Principles in force      · doctrine this chamber carries, clipped
//   4. Verdict trail            · last few outcomes in this session
//
// Built on the shared .panel, .meta-grid, .status-dot and .state-pill
// primitives so geometry and semantic color match every other chamber.

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
  return (
    <div
      data-insight-rail
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <MissionCard
        mission={mission}
        principlesCount={principles.length}
        copy={copy}
      />
      <ChamberStatusCard
        live={live}
        pending={pending}
        lastConfidence={lastConfidence}
        lastVerdictRefused={lastVerdictRefused}
        onAbort={onAbort}
        copy={copy}
      />
      <PrinciplesPanel principles={principles} copy={copy} />
      <VerdictTrailPanel trail={trail} copy={copy} />
    </div>
  );
}

// ——— Mission card ———

function MissionCard({
  mission, principlesCount, copy,
}: {
  mission: Mission | null;
  principlesCount: number;
  copy: ReturnType<typeof useCopy>;
}) {
  if (!mission) {
    return (
      <RailPanel kicker={copy.labRailMissionKicker}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-body-sec)",
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {copy.labRailNoMission}
        </div>
      </RailPanel>
    );
  }

  const noteCount = mission.notes?.length ?? 0;
  const ago = relativeTime(mission.createdAt, copy);

  return (
    <RailPanel kicker={copy.labRailMissionKicker}>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-section)",
          color: "var(--text-primary)",
          lineHeight: 1.3,
          letterSpacing: "-0.005em",
        }}
      >
        {mission.title}
      </div>
      <div className="meta-grid">
        <span className="meta-label">{copy.labRailMetaOpened}</span>
        <span className="meta-value">{ago}</span>
        <span className="meta-label">{copy.labRailMetaTurns}</span>
        <span className="meta-value">{noteCount}</span>
        {principlesCount > 0 && (
          <>
            <span className="meta-label">{copy.labRailMetaDoctrine}</span>
            <span className="meta-value" data-tone="accent">
              {principlesCount}{" "}
              {principlesCount === 1 ? copy.labRailPrincipleSingular : copy.labRailPrinciplePlural}
            </span>
          </>
        )}
      </div>
    </RailPanel>
  );
}

// ——— Chamber status card (live operational context) ———

function ChamberStatusCard({
  live, pending, lastConfidence, lastVerdictRefused, onAbort, copy,
}: {
  live: LiveState;
  pending: boolean;
  lastConfidence: string | null;
  lastVerdictRefused: boolean;
  onAbort: () => void;
  copy: ReturnType<typeof useCopy>;
}) {
  type Tone = "info" | "err" | "ok" | "warn" | "accent" | "muted" | "ghost";

  const panelTone: Tone = pending
    ? "info"
    : lastVerdictRefused
    ? "err"
    : lastConfidence === "high"
    ? "ok"
    : lastConfidence === "low"
    ? "warn"
    : "accent";

  const routeLabel = live.routePath === "triad"
    ? copy.labRailStatusRouteTriad
    : live.routePath === "agent"
    ? copy.labRailStatusRouteAgent
    : copy.labRailStatusNone;

  const confidenceLabel = pending
    ? live.judgeConfidence ?? copy.labRailStatusNone
    : lastVerdictRefused
    ? copy.labRailTrailRefused
    : lastConfidence ?? copy.labRailStatusNone;

  const confidenceTone: Tone = pending
    ? (live.judgeConfidence === "high" ? "ok"
       : live.judgeConfidence === "low" ? "warn"
       : "muted")
    : lastVerdictRefused
    ? "err"
    : lastConfidence === "high"
    ? "ok"
    : lastConfidence === "low"
    ? "warn"
    : "muted";

  const routeTone: Tone =
    live.routePath === "agent" ? "warn" :
    live.routePath === "triad" ? "accent" : "muted";

  const stage = (() => {
    if (!pending) return null;
    if (live.routePath === "agent") return null;
    if (live.triadTotal > 0 && live.triadCompleted < live.triadTotal) {
      return `${live.triadCompleted}/${live.triadTotal}`;
    }
    if (live.judgeState === "evaluating") return "judge";
    if (live.judgeState === "done") return "done";
    return null;
  })();

  const lastLine = pending
    ? live.lastEventLabel
    : live.lastEventLabel && live.lastEventLabel !== "a rotear..."
    ? live.lastEventLabel
    : copy.labRailStatusAwaiting;

  return (
    <RailPanel kicker={copy.labRailStatusKicker}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          className="status-dot"
          data-tone={panelTone}
          data-pulse={pending ? "true" : undefined}
        />
        <span className="kicker" data-tone={pending ? panelTone : "ghost"}>
          {pending ? copy.labRailStatusRunning : copy.labRailStatusIdle}
        </span>
      </div>

      <div className="meta-grid">
        <span className="meta-label">{copy.labRailStatusRoute}</span>
        <span className="meta-value" data-tone={routeTone}>{routeLabel}</span>

        {stage && (
          <>
            <span className="meta-label">{copy.labRailStatusStage}</span>
            <span className="meta-value">{stage}</span>
          </>
        )}

        {(live.routePath === "agent" && pending) && (
          <>
            <span className="meta-label">{copy.labRailStatusIter}</span>
            <span className="meta-value">{live.agentIter}</span>
            <span className="meta-label">{copy.labRailStatusTools}</span>
            <span className="meta-value">{live.agentToolCount}</span>
          </>
        )}

        <span className="meta-label">{copy.labRailStatusConfidence}</span>
        <span className="meta-value" data-tone={confidenceTone}>{confidenceLabel}</span>
      </div>

      {pending && (
        <>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-meta)",
              color: "var(--text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={lastLine}
          >
            {lastLine}
          </div>
          <div className="thinking-strip" aria-hidden />
          <button
            onClick={onAbort}
            data-insight-abort
            title={copy.labRailStatusStop}
            className="btn-chip"
            style={{
              alignSelf: "flex-end",
              color: "var(--cc-err)",
              borderColor: "color-mix(in oklab, var(--cc-err) 38%, transparent)",
            }}
          >
            {copy.labRailStatusStop}
          </button>
        </>
      )}
    </RailPanel>
  );
}

// ——— Principles panel ———

function PrinciplesPanel({
  principles, copy,
}: {
  principles: Principle[];
  copy: ReturnType<typeof useCopy>;
}) {
  if (principles.length === 0) {
    return (
      <RailPanel kicker={copy.labRailPrinciplesKicker}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-body-sec)",
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {copy.labRailPrinciplesEmpty}
        </div>
      </RailPanel>
    );
  }

  return (
    <RailPanel kicker={copy.labRailPrinciplesKicker}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {principles.slice(-8).map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "16px 1fr",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: "var(--serif)",
                fontSize: "var(--t-body-sec)",
                color: "var(--chamber-dna, var(--accent))",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              §
            </span>
            <span
              style={{
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {clamp(p.text, 90)}
            </span>
          </div>
        ))}
        {principles.length > 8 && (
          <div className="kicker" data-tone="ghost" style={{ paddingTop: "var(--space-1)" }}>
            {copy.labRailPrinciplesMore(principles.length - 8)}
          </div>
        )}
      </div>
    </RailPanel>
  );
}

// ——— Verdict trail panel ———

function VerdictTrailPanel({
  trail, copy,
}: {
  trail: VerdictState[];
  copy: ReturnType<typeof useCopy>;
}) {
  if (trail.length === 0) {
    return (
      <RailPanel kicker={copy.labRailTrailKicker}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-body-sec)",
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {copy.labRailTrailEmpty}
        </div>
      </RailPanel>
    );
  }

  const shown = trail.slice().reverse().slice(0, 6);

  return (
    <RailPanel kicker={copy.labRailTrailKicker}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {shown.map((v, i) => {
          const refused = v.refused;
          const confTone =
            refused ? "err" :
            v.confidence === "high" ? "ok" :
            v.confidence === "low" ? "warn" : "muted";
          const routeTone =
            refused ? "err" :
            v.routePath === "agent" ? "warn" : "accent";
          const routeLabel = v.routePath === "agent"
            ? copy.labRailStatusRouteAgent
            : copy.labRailStatusRouteTriad;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto 1fr",
                gap: 10,
                alignItems: "baseline",
                paddingBottom: "var(--space-1)",
                borderBottom: i === shown.length - 1 ? "none" : "1px dashed var(--border-color-soft)",
              }}
            >
              <span className="kicker" data-tone={routeTone}>
                {refused ? "✗ " : ""}{routeLabel}
              </span>
              <span className="kicker" data-tone={confTone}>
                {refused ? copy.labRailTrailRefused : (v.confidence ?? copy.labRailStatusNone)}
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.3,
                }}
                title={v.question}
              >
                {clamp(v.question, 48)}
              </span>
            </div>
          );
        })}
      </div>
    </RailPanel>
  );
}

// ——— Layout primitive ———

type RailTone = "ok" | "warn" | "err" | "info" | "accent" | "muted" | "ghost";

function RailPanel({
  kicker, tone, children,
}: {
  kicker: string;
  tone?: RailTone;
  children: React.ReactNode;
}) {
  return (
    <section className="panel" data-tone={tone}>
      <span className="kicker">{kicker}</span>
      {children}
    </section>
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
