import { useEffect, useState } from "react";
import type { SurfacePlanPayload } from "../../hooks/useSignal";
import DesignSystemsTab from "./DesignSystemsTab";

// Wave-3 right-side exploration rail — the library / canvas half of
// the chamber. Six tabs:
//   · Examples      — canned gallery of reference surfaces
//   · Templates     — canned reusable starting points
//   · Recent        — session history projection (empty in W3)
//   · Search        — local catalogue search (local first; federated later)
//   · Library       — editorial doorway into the chamber's own assets
//   · Design Systems— management surface for DS definition and binding
//
// Plan preview sits above the tab bar when a mock plan arrived. That
// preserves existing Surface behaviour exactly — the parity pass adds
// material finish and editorial empty-states around it, it never
// replaces the wiring.

type Tab = "examples" | "templates" | "recent" | "search" | "library" | "systems";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "examples",  label: "Examples" },
  { key: "templates", label: "Templates" },
  { key: "recent",    label: "Recent" },
  { key: "search",    label: "Search" },
  { key: "library",   label: "Library" },
  { key: "systems",   label: "Design Systems" },
];

type CardKind = "hi-fi" | "wireframe";

interface ExampleCard {
  title: string;
  kind: CardKind;
  tag: string;
  lead: string;
}

const EXAMPLES: ExampleCard[] = [
  { title: "Operational dashboard",    kind: "hi-fi",    tag: "analytics",  lead: "grelha densa · KPI acima da dobra · estado em banda lateral" },
  { title: "Onboarding — 3 passos",    kind: "wireframe",tag: "activation", lead: "progressão visível · erro suave · fim claro" },
  { title: "Governance settings pane", kind: "hi-fi",    tag: "core",       lead: "políticas em lista editorial · versão à direita" },
  { title: "Archive search & lineage", kind: "wireframe",tag: "archive",    lead: "resultados com proveniência · rasto de decisão" },
];

const TEMPLATES: ExampleCard[] = [
  { title: "Command centre",      kind: "hi-fi",    tag: "ops",       lead: "mesa ampla · composer flutuante · telemetria fina" },
  { title: "Studio split",        kind: "wireframe",tag: "creation",  lead: "intake à esquerda · canvas à direita · geração central" },
  { title: "Archive ledger",      kind: "hi-fi",    tag: "retrieval", lead: "runs em linha · detalhe em painel · filtros finos" },
  { title: "Governance stack",    kind: "hi-fi",    tag: "policy",    lead: "princípios · permissões · rotas · severidade" },
  { title: "Slide deck · thesis", kind: "hi-fi",    tag: "narrative", lead: "abertura editorial · corpo argumentado · encerramento claro" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  jumpNonce?: number;
  jumpTo?: Tab;
}

export default function ExplorationRail({ plan, mock, jumpNonce, jumpTo }: Props) {
  const [tab, setTab] = useState<Tab>("examples");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (jumpNonce && jumpTo) setTab(jumpTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpNonce]);

  return (
    <div
      data-surface-library
      style={{
        display: "flex",
        flexDirection: "column",
        border: "var(--border-mid)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        // Apple-precision frame — border + inner top highlight +
        // shadow-panel only. No coloured outer ring; sage lives inside
        // on active states, not on the hull of the workstation.
        boxShadow: [
          "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
          "var(--shadow-panel)",
        ].join(", "),
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {plan && <PlanPreview plan={plan} mock={mock} />}

      {/* Tab bar — active tab earns a DNA underline + soft elevation */}
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 4,
          padding: "var(--space-2) var(--space-3)",
          borderBottom: "var(--border-soft)",
          background: "var(--bg-surface)",
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              style={{
                position: "relative",
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                padding: "9px 14px 11px",
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                border: "1px solid transparent",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition:
                  "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift)",
              }}
            >
              {t.label}
              {active && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 2,
                    height: 2,
                    borderRadius: 2,
                    background: "color-mix(in oklab, var(--cc-ok) 72%, transparent)",
                    boxShadow: "0 0 10px color-mix(in oklab, var(--cc-ok) 38%, transparent)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab body */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-4)" }}>
        {tab === "examples"  && <CardGrid items={EXAMPLES} />}
        {tab === "templates" && <CardGrid items={TEMPLATES} />}
        {tab === "recent" && (
          <EditorialEmpty
            kicker="— histórico desta sessão"
            title="Sem runs ainda."
            body="Os planos aceites nesta missão aparecem aqui em ordem inversa. Para ver runs de Surface de outras missões, visita o Archive."
          />
        )}
        {tab === "search" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SearchField value={query} onChange={setQuery} />
            <EditorialEmpty
              kicker="— pesquisa"
              title="Local agora, federada em breve."
              body="A pesquisa nos decks (examples, templates, library) é o primeiro passo. A pesquisa federada sobre conectores do Archive chega na próxima vaga."
            />
          </div>
        )}
        {tab === "library" && (
          <EditorialEmpty
            kicker="— library da chamber"
            title="O que vive aqui."
            body="Skills, wireframes reutilizáveis, packs de tweaks e decks selados projectam-se aqui. Enquanto o conector do Archive não abre, a library fica editorial — explica o terreno em vez de encher com placeholder."
          />
        )}
        {tab === "systems" && <DesignSystemsTab />}
      </div>
    </div>
  );
}

function PlanPreview({ plan, mock }: { plan: SurfacePlanPayload; mock: boolean }) {
  return (
    <div
      data-surface-plan-preview
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-3) var(--space-4)",
        borderBottom: "var(--border-soft)",
        background: "var(--bg-elevated)",
        boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          — plano gerado
        </span>
        {mock && (
          <span
            data-mock-badge
            style={{
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--cc-warn)",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: 999,
            }}
          >
            mock
          </span>
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: "var(--track-label)",
          }}
        >
          {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "sem DS"}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {plan.screens.map((s) => (
          <div
            key={s.name}
            style={{
              padding: 12,
              border: "var(--border-soft)",
              borderRadius: "var(--radius-control)",
              background: "var(--bg-surface)",
              boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 4%, transparent)",
            }}
          >
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
              {s.name}
            </div>
            <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", marginTop: 4 }}>
              {s.purpose}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-ghost)",
                marginTop: 6,
                letterSpacing: "var(--track-label)",
              }}
            >
              {plan.components.filter((c) => c.screen === s.name).length} componentes
            </div>
          </div>
        ))}
      </div>
      {plan.notes.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 16,
            color: "var(--text-muted)",
            fontSize: "var(--t-body-sec)",
          }}
        >
          {plan.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );
}

function CardGrid({ items }: { items: ExampleCard[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 14,
      }}
    >
      {items.map((it) => (
        <Card key={it.title} item={it} />
      ))}
    </div>
  );
}

function Card({ item }: { item: ExampleCard }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      data-surface-card
      data-kind={item.kind}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 14,
        border: hover
          ? "1px solid color-mix(in oklab, var(--cc-ok) 28%, var(--border-color-soft))"
          : "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        background: hover ? "var(--bg-elevated)" : "var(--bg-surface)",
        // Card hover: precise sage border shift + quiet inner highlight.
        // No coloured drop shadow — Apple precision prefers restraint
        // over bloom; hover reads as a deliberate select signal, not
        // a spotlight.
        boxShadow: hover
          ? "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)"
          : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
        transition:
          "border-color var(--dur-fast) var(--ease-swift), background var(--dur-fast) var(--ease-swift), box-shadow var(--dur-med) var(--ease-swift)",
      }}
    >
      {/* Left accent rail — appears on hover, semantic kind tone */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          bottom: 12,
          left: 4,
          width: 2,
          borderRadius: 2,
          background: hover
            ? "color-mix(in oklab, var(--cc-ok) 62%, transparent)"
            : "transparent",
          transition: "background var(--dur-fast) var(--ease-swift)",
        }}
      />
      <CardThumb kind={item.kind} />
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: 17,
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1.25,
          letterSpacing: "-0.005em",
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body-sec)",
          color: "var(--text-muted)",
          lineHeight: 1.45,
        }}
      >
        {item.lead}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          paddingTop: 4,
          borderTop: "var(--border-soft)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: 999,
              background: item.kind === "hi-fi"
                ? "color-mix(in oklab, var(--cc-ok) 72%, transparent)"
                : "color-mix(in oklab, var(--text-ghost) 60%, transparent)",
            }}
          />
          {item.kind === "hi-fi" ? "hi-fi" : "wireframe"}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          {item.tag}
        </span>
      </div>
    </article>
  );
}

function CardThumb({ kind }: { kind: CardKind }) {
  // Mini-sketch SVG — same visual grammar as the fidelity tiles so the
  // catalogue reads as the same organism. Hi-fi fills blocks with an
  // accent stripe at the base; wireframe traces the same geometry in
  // dashed strokes. Either way, the kind is legible at first glance.
  return (
    <div
      aria-hidden
      style={{
        height: 84,
        borderRadius: "calc(var(--radius-control) - 4px)",
        background: kind === "hi-fi"
          ? "linear-gradient(180deg, var(--bg-input), color-mix(in oklab, var(--chamber-dna, var(--accent)) 4%, var(--bg-input)))"
          : "var(--bg-input)",
        border: "var(--border-soft)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
      }}
    >
      {kind === "hi-fi" ? <CardHiFiSketch /> : <CardWireframeSketch />}
    </div>
  );
}

function CardHiFiSketch() {
  const fillSoft = "color-mix(in oklab, var(--text-primary) 14%, transparent)";
  const fillMid  = "color-mix(in oklab, var(--text-primary) 24%, transparent)";
  const accent   = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 72%, transparent)";
  return (
    <svg width="86%" height="68" viewBox="0 0 200 68" preserveAspectRatio="none" aria-hidden>
      <rect x="4"   y="6"  width="192" height="8"  rx="2" fill={fillSoft} />
      <rect x="4"   y="20" width="70"  height="4"  rx="2" fill={fillMid} />
      <rect x="4"   y="30" width="70"  height="32" rx="2" fill={fillSoft} />
      <rect x="82"  y="30" width="114" height="18" rx="2" fill={fillMid} />
      <rect x="82"  y="52" width="62"  height="10" rx="2" fill={accent} />
      <rect x="150" y="52" width="46"  height="10" rx="2" fill={fillSoft} />
    </svg>
  );
}

function CardWireframeSketch() {
  const line = "color-mix(in oklab, var(--text-muted) 55%, transparent)";
  return (
    <svg width="86%" height="68" viewBox="0 0 200 68" preserveAspectRatio="none" aria-hidden>
      <rect x="4"   y="6"  width="68" height="8"  rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"   y="20" width="120" height="4" rx="1" stroke={line} strokeWidth="1" />
      <rect x="4"   y="30" width="86" height="32" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
      <rect x="98"  y="30" width="98" height="32" rx="1" stroke={line} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        background: "var(--bg-input)",
        border: focus
          ? "1px solid color-mix(in oklab, var(--cc-ok) 42%, var(--border-color-mid))"
          : "var(--border-mid)",
        borderRadius: "var(--radius-control)",
        boxShadow: focus
          ? "0 0 0 2px color-mix(in oklab, var(--cc-ok) 12%, transparent)"
          : "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 3%, transparent)",
        transition:
          "border-color var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: 999,
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: focus ? "var(--cc-ok)" : "var(--text-ghost)",
          background: focus
            ? "color-mix(in oklab, var(--cc-ok) 14%, transparent)"
            : "transparent",
        }}
      >
        ⌕
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Procurar examples · templates · library · design systems…"
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body)",
          padding: 0,
          background: "transparent",
          color: "var(--text-primary)",
          border: "none",
          outline: "none",
        }}
      />
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        local
      </span>
    </div>
  );
}

function EditorialEmpty({
  kicker, title, body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "var(--space-6) var(--space-4)",
        maxWidth: 620,
        margin: "0 auto",
        textAlign: "left",
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
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--serif)",
          fontSize: 26,
          lineHeight: 1.15,
          color: "var(--text-primary)",
          letterSpacing: "-0.01em",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body)",
          lineHeight: 1.55,
          color: "var(--text-muted)",
          maxWidth: 520,
        }}
      >
        {body}
      </p>
    </div>
  );
}
