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
// preserves existing Surface behaviour exactly — the remaster adds
// around it, it never replaces it.

type Tab = "examples" | "templates" | "recent" | "search" | "library" | "systems";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "examples",  label: "Examples" },
  { key: "templates", label: "Templates" },
  { key: "recent",    label: "Recent" },
  { key: "search",    label: "Search" },
  { key: "library",   label: "Library" },
  { key: "systems",   label: "Design Systems" },
];

interface ExampleCard {
  title: string;
  kind: string;
  tag: string;
  lead: string;
}

const EXAMPLES: ExampleCard[] = [
  { title: "Operational dashboard",    kind: "Hi-fi",    tag: "analytics",  lead: "grelha densa · KPI acima da dobra · estado em banda lateral" },
  { title: "Onboarding — 3 passos",    kind: "Prototype",tag: "activation", lead: "progressão visível · erro suave · fim claro" },
  { title: "Governance settings pane", kind: "Hi-fi",    tag: "core",       lead: "políticas em lista editorial · versão à direita" },
  { title: "Archive search & lineage", kind: "Prototype",tag: "archive",    lead: "resultados com proveniência · rasto de decisão" },
];

const TEMPLATES: ExampleCard[] = [
  { title: "Command centre",      kind: "Hi-fi",    tag: "ops",        lead: "mesa ampla · composer flutuante · telemetria fina" },
  { title: "Studio split",        kind: "Wireframe",tag: "creation",   lead: "intake à esquerda · canvas à direita · geração central" },
  { title: "Archive ledger",      kind: "Hi-fi",    tag: "retrieval",  lead: "runs em linha · detalhe em painel · filtros finos" },
  { title: "Governance stack",    kind: "Hi-fi",    tag: "policy",     lead: "princípios · permissões · rotas · severidade" },
  { title: "Slide deck · thesis", kind: "Hi-fi",    tag: "narrative",  lead: "abertura editorial · corpo argumentado · encerramento claro" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
  // External "jump-to-tab" signal. The parent increments jumpNonce every
  // time it wants the rail to pivot to jumpTo. After that, the user is
  // free to navigate away — the rail doesn't re-pivot until the nonce
  // bumps again. Keeps the creation-panel "ver todos" shortcut decoupled
  // from the rail's own tab state.
  jumpNonce?: number;
  jumpTo?: Tab;
}

export default function ExplorationRail({ plan, mock, jumpNonce, jumpTo }: Props) {
  const [tab, setTab] = useState<Tab>("examples");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (jumpNonce && jumpTo) setTab(jumpTo);
    // Fire when the nonce bumps; target is read inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpNonce]);

  const pick = (t: Tab) => setTab(t);

  return (
    <div
      data-surface-library
      style={{
        display: "flex",
        flexDirection: "column",
        border: "var(--border-mid)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-panel)",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Plan preview — sits above the rail when a plan has arrived. */}
      {plan && (
        <div
          data-surface-plan-preview
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "var(--space-3)",
            borderBottom: "var(--border-soft)",
            background: "var(--bg-elevated)",
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
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
                }}
              >
                <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
                  {s.name}
                </div>
                <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", marginTop: 4 }}>
                  {s.purpose}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-ghost)", marginTop: 6 }}>
                  {plan.components.filter((c) => c.screen === s.name).length} componentes
                </div>
              </div>
            ))}
          </div>
          {plan.notes.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 16, color: "var(--text-muted)", fontSize: "var(--t-body-sec)" }}>
              {plan.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab bar */}
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 2,
          padding: "var(--space-2)",
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
              onClick={() => pick(t.key)}
              style={{
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                padding: "7px 12px",
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                border: active
                  ? "1px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 26%, var(--border-color-soft))"
                  : "1px solid transparent",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition:
                  "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab body */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-4)" }}>
        {tab === "examples"  && <CardGrid items={EXAMPLES} />}
        {tab === "templates" && <CardGrid items={TEMPLATES} />}
        {tab === "recent" && (
          <EmptyBlock
            title="Sem histórico ainda"
            body="Os planos aceites nesta missão vão aparecer aqui. Para ver runs de Surface de todas as missões, vai ao Arquivo."
          />
        )}
        {tab === "search" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "var(--bg-input)",
                border: "var(--border-mid)",
                borderRadius: "var(--radius-control)",
              }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 14,
                  color: "var(--text-ghost)",
                }}
              >
                ⌕
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
            </div>
            <EmptyBlock
              title="Pesquisa federada em breve"
              body="A pesquisa local nos decks (examples, templates, library) chega primeiro. A pesquisa federada sobre conectores chega quando o Archive expuser os conectores."
            />
          </div>
        )}
        {tab === "library" && (
          <EmptyBlock
            title="Library da chamber"
            body="Os artefactos reusáveis da Surface — skills, wireframes, tweaks packs, decks aceites — vão projectar-se aqui. Enquanto o connector ao Archive não abre, a library fica editorial: explica o que vai viver cá."
          />
        )}
        {tab === "systems" && <DesignSystemsTab />}
      </div>
    </div>
  );
}

function CardGrid({ items }: { items: ExampleCard[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      {items.map((it) => (
        <article
          key={it.title}
          data-surface-card
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 14,
            border: "var(--border-soft)",
            borderRadius: "var(--radius-control)",
            background: "var(--bg-surface)",
            transition:
              "border-color var(--dur-fast) var(--ease-swift), background var(--dur-fast) var(--ease-swift), box-shadow var(--dur-fast) var(--ease-swift)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--bg-elevated)";
            el.style.borderColor = "color-mix(in oklab, var(--chamber-dna, var(--accent)) 22%, var(--border-color-soft))";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "var(--bg-surface)";
            el.style.borderColor = "";
          }}
        >
          <ThumbStrip kind={it.kind} />
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 16,
              color: "var(--text-primary)",
              lineHeight: 1.25,
            }}
          >
            {it.title}
          </div>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}
          >
            {it.lead}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-label)",
              textTransform: "uppercase",
              color: "var(--text-ghost)",
              paddingTop: 2,
            }}
          >
            <span>{it.kind}</span>
            <span aria-hidden>·</span>
            <span>{it.tag}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function ThumbStrip({ kind }: { kind: string }) {
  // Quiet decoration — not a real preview. A single soft band with a
  // DNA-coloured accent stripe so each card has shape without visual
  // noise. Wave-5 replaces this with real artifact thumbnails.
  const hi = kind.toLowerCase().startsWith("hi");
  return (
    <div
      aria-hidden
      style={{
        height: 64,
        borderRadius: "calc(var(--radius-control) - 4px)",
        background: hi
          ? "linear-gradient(180deg, color-mix(in oklab, var(--bg-input) 92%, transparent), color-mix(in oklab, var(--chamber-dna, var(--accent)) 6%, var(--bg-input)))"
          : "repeating-linear-gradient(135deg, color-mix(in oklab, var(--text-ghost) 14%, var(--bg-input)) 0 2px, var(--bg-input) 2px 8px)",
        border: "var(--border-soft)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 10,
          right: 10,
          bottom: 8,
          height: 4,
          borderRadius: 2,
          background: hi
            ? "color-mix(in oklab, var(--chamber-dna, var(--accent)) 60%, transparent)"
            : "color-mix(in oklab, var(--text-muted) 40%, transparent)",
        }}
      />
    </div>
  );
}

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "var(--space-5)",
        textAlign: "center",
        color: "var(--text-muted)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-control)",
        background: "var(--bg-elevated)",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        — {title}
      </div>
      <div
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-body)",
          lineHeight: 1.5,
          color: "var(--text-primary)",
        }}
      >
        {body}
      </div>
    </div>
  );
}
