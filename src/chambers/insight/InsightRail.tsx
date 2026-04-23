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
// Each panel resolves its own empty-state inside — the rail never
// disappears, never becomes a placeholder gallery, never repeats the
// "no mission" voice that the composer already carries. Copy is read
// from the catalog (PT / EN) so the chamber speaks one voice.

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
      <Panel kicker={copy.labRailMissionKicker}>
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
      </Panel>
    );
  }

  const noteCount = mission.notes?.length ?? 0;
  const ago = relativeTime(mission.createdAt, copy);

  return (
    <Panel kicker={copy.labRailMissionKicker}>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-body)",
          color: "var(--text-primary)",
          lineHeight: 1.4,
        }}
      >
        {mission.title}
      </div>
      <MetaGrid>
        <MetaLabel>{copy.labRailMetaOpened}</MetaLabel>
        <MetaValue>{ago}</MetaValue>
        <MetaLabel>{copy.labRailMetaTurns}</MetaLabel>
        <MetaValue>{noteCount}</MetaValue>
        {principlesCount > 0 && (
          <>
            <MetaLabel>{copy.labRailMetaDoctrine}</MetaLabel>
            <MetaValue color="var(--chamber-dna, var(--accent))">
              {principlesCount}{" "}
              {principlesCount === 1 ? copy.labRailPrincipleSingular : copy.labRailPrinciplePlural}
            </MetaValue>
          </>
        )}
      </MetaGrid>
    </Panel>
  );
}

// ——— Chamber status card (live operational context) ———
//
// Two modes. While pending: live routing, stage, iter/tools, last event
// label, and an inline stop affordance (replaces the former
// thread-region live strip so the rail now owns pressure). At rest:
// last route / confidence / "em repouso" — tells the user the chamber
// is ready but not firing. In both modes the panel is mounted so the
// rail holds weight parity with Surface's exploration rail.

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
  const accent = pending
    ? "var(--cc-info)"
    : lastVerdictRefused
    ? "var(--cc-err)"
    : lastConfidence === "high"
    ? "var(--cc-ok)"
    : lastConfidence === "low"
    ? "var(--cc-warn)"
    : "color-mix(in oklab, var(--chamber-dna, var(--accent-dim)) 70%, transparent)";

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

  const confidenceColor = pending
    ? (live.judgeConfidence === "high" ? "var(--cc-ok)"
       : live.judgeConfidence === "low" ? "var(--cc-warn)"
       : "var(--text-muted)")
    : lastVerdictRefused
    ? "var(--cc-err)"
    : lastConfidence === "high"
    ? "var(--cc-ok)"
    : lastConfidence === "low"
    ? "var(--cc-warn)"
    : "var(--text-muted)";

  const stage = (() => {
    if (!pending) return null;
    if (live.routePath === "agent") return null; // use iter/tools instead
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
    <Panel kicker={copy.labRailStatusKicker} accent={accent}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 2,
        }}
      >
        <span
          className={pending ? "breathe" : undefined}
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
            boxShadow: pending
              ? `0 0 0 3px color-mix(in oklab, ${accent} 22%, transparent)`
              : "none",
          }}
        />
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: pending ? accent : "var(--text-muted)",
          }}
        >
          {pending ? copy.labRailStatusRunning : copy.labRailStatusIdle}
        </span>
      </div>

      <MetaGrid>
        <MetaLabel>{copy.labRailStatusRoute}</MetaLabel>
        <MetaValue
          color={
            live.routePath === "agent"
              ? "var(--cc-warn)"
              : live.routePath === "triad"
              ? "var(--chamber-dna, var(--accent))"
              : "var(--text-muted)"
          }
        >
          {routeLabel}
        </MetaValue>

        {stage && (
          <>
            <MetaLabel>{copy.labRailStatusStage}</MetaLabel>
            <MetaValue>{stage}</MetaValue>
          </>
        )}

        {(live.routePath === "agent" && pending) && (
          <>
            <MetaLabel>{copy.labRailStatusIter}</MetaLabel>
            <MetaValue>{live.agentIter}</MetaValue>
            <MetaLabel>{copy.labRailStatusTools}</MetaLabel>
            <MetaValue>{live.agentToolCount}</MetaValue>
          </>
        )}

        <MetaLabel>{copy.labRailStatusConfidence}</MetaLabel>
        <MetaValue color={confidenceColor}>{confidenceLabel}</MetaValue>

        <MetaLabel>{copy.labRailStatusLast}</MetaLabel>
        <MetaValue>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              maxWidth: "100%",
            }}
            title={lastLine}
          >
            {lastLine}
          </span>
        </MetaValue>
      </MetaGrid>

      {pending && (
        <button
          onClick={onAbort}
          data-insight-abort
          title={copy.labRailStatusStop}
          style={{
            alignSelf: "flex-end",
            marginTop: "var(--space-1)",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--cc-err)",
            background: "transparent",
            border: "1px solid color-mix(in oklab, var(--cc-err) 38%, transparent)",
            borderRadius: "var(--radius-pill)",
            padding: "3px 10px",
            cursor: "pointer",
            transition: "background .15s var(--ease-swift), border-color .15s var(--ease-swift)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "color-mix(in oklab, var(--cc-err) 10%, transparent)";
            e.currentTarget.style.borderColor = "color-mix(in oklab, var(--cc-err) 60%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "color-mix(in oklab, var(--cc-err) 38%, transparent)";
          }}
        >
          {copy.labRailStatusStop}
        </button>
      )}
    </Panel>
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
      <Panel kicker={copy.labRailPrinciplesKicker}>
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
      </Panel>
    );
  }

  return (
    <Panel kicker={copy.labRailPrinciplesKicker}>
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
                fontFamily: "'Fraunces', Georgia, serif",
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
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--text-ghost)",
              paddingTop: "var(--space-1)",
            }}
          >
            {copy.labRailPrinciplesMore(principles.length - 8)}
          </div>
        )}
      </div>
    </Panel>
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
      <Panel kicker={copy.labRailTrailKicker}>
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
      </Panel>
    );
  }

  const shown = trail.slice().reverse().slice(0, 6);

  return (
    <Panel kicker={copy.labRailTrailKicker}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {shown.map((v, i) => {
          const refused = v.refused;
          const confColor = refused
            ? "var(--cc-err)"
            : v.confidence === "high"
            ? "var(--cc-ok)"
            : v.confidence === "low"
            ? "var(--cc-warn)"
            : "var(--text-muted)";
          const routeColor = refused
            ? "var(--cc-err)"
            : v.routePath === "agent"
            ? "var(--cc-warn)"
            : "var(--chamber-dna, var(--accent))";
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
                fontFamily: "var(--mono)",
                fontSize: "var(--t-micro)",
                letterSpacing: "var(--track-label)",
                textTransform: "uppercase",
                paddingBottom: "var(--space-1)",
                borderBottom: i === shown.length - 1
                  ? "none"
                  : "1px dashed var(--border-soft)",
              }}
            >
              <span style={{ color: routeColor }}>
                {refused ? "✗ " : ""}{routeLabel}
              </span>
              <span style={{ color: confColor }}>
                {refused ? copy.labRailTrailRefused : (v.confidence ?? copy.labRailStatusNone)}
              </span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  textTransform: "none",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  letterSpacing: 0,
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
    </Panel>
  );
}

// ——— Layout primitives ———

function Panel({
  kicker, accent, children,
}: {
  kicker: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderLeft: accent ? `2px solid ${accent}` : undefined,
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {kicker}
      </span>
      {children}
    </section>
  );
}

function MetaGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 4,
        columnGap: 10,
        alignItems: "baseline",
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-micro)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}
    >
      {children}
    </span>
  );
}

function MetaValue({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-body-sec)",
        letterSpacing: "var(--track-meta)",
        color: color ?? "var(--text-secondary)",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {children}
    </span>
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
