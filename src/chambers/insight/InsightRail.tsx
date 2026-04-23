import type { Mission, Principle } from "../../spine/types";
import type { VerdictState } from "./helpers";

// Insight rail — right-side context for the active conversation.
// Three sections: mission identity, principles binding this chamber,
// verdict trail for the current session. Calm density: each section is
// a held panel, named by a kicker, and disappears entirely when there
// is no content to show. The rail never becomes a placeholder gallery.

interface Props {
  mission: Mission | null;
  principles: Principle[];
  trail: VerdictState[];
}

export default function InsightRail({ mission, principles, trail }: Props) {
  return (
    <div
      data-insight-rail
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <MissionCard mission={mission} principlesCount={principles.length} />
      {principles.length > 0 && <PrinciplesPanel principles={principles} />}
      {trail.length > 0 && <VerdictTrailPanel trail={trail} />}
    </div>
  );
}

function MissionCard({
  mission, principlesCount,
}: {
  mission: Mission | null;
  principlesCount: number;
}) {
  if (!mission) {
    return (
      <Panel kicker="— missão">
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-body)",
            color: "var(--text-muted)",
            fontStyle: "italic",
            lineHeight: 1.45,
          }}
        >
          sem missão activa — a primeira pergunta abre uma.
        </div>
      </Panel>
    );
  }

  const noteCount = mission.notes?.length ?? 0;
  const ago = relativeTime(mission.createdAt);

  return (
    <Panel kicker="— missão">
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
        <MetaLabel>aberta</MetaLabel>
        <MetaValue>{ago}</MetaValue>
        <MetaLabel>turnos</MetaLabel>
        <MetaValue>{noteCount}</MetaValue>
        {principlesCount > 0 && (
          <>
            <MetaLabel>doutrina</MetaLabel>
            <MetaValue color="var(--chamber-dna, var(--accent))">
              {principlesCount} {principlesCount === 1 ? "princípio" : "princípios"}
            </MetaValue>
          </>
        )}
      </MetaGrid>
    </Panel>
  );
}

function PrinciplesPanel({ principles }: { principles: Principle[] }) {
  return (
    <Panel kicker="— em vigor">
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
            + {principles.length - 8} mais
          </div>
        )}
      </div>
    </Panel>
  );
}

function VerdictTrailPanel({ trail }: { trail: VerdictState[] }) {
  return (
    <Panel kicker="— trilha">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {trail.slice().reverse().slice(0, 6).map((v, i) => {
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
                borderBottom: i === Math.min(trail.length, 6) - 1 ? "none" : "1px dashed var(--border-soft)",
              }}
            >
              <span style={{ color: routeColor }}>
                {refused ? "✗ " : ""}{v.routePath}
              </span>
              <span style={{ color: confColor }}>
                {refused ? "recusado" : v.confidence ?? "—"}
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

function Panel({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
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

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}
