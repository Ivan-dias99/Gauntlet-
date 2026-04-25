import { useState } from "react";
import type { SurfacePlanPayload } from "../../hooks/useSignal";
import { useCopy } from "../../i18n/copy";

// Surface exploration rail — five tabs: Examples, Templates, Recent,
// Search, Library. Visual elevation: cockpit-grammar tabs (mono
// uppercase, underline-active in chamber-DNA), cards with hover lift
// and kind chip.
//
// Doctrine: examples / templates are canned in the current wave —
// the tabs themselves carry the honesty (Recent reads from real
// archive when wired; Search and Library state the contract). No
// fake search results, no fake library catalogue.

type Tab = "examples" | "templates" | "recent" | "search" | "library";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "examples",  label: "Examples" },
  { key: "templates", label: "Templates" },
  { key: "recent",    label: "Recent" },
  { key: "search",    label: "Search" },
  { key: "library",   label: "Library" },
];

const EXAMPLES = [
  { title: "Operational dashboard",     kind: "hi-fi",     tag: "analytics" },
  { title: "Onboarding flow — 3 steps", kind: "prototype", tag: "activation" },
  { title: "Governance settings pane",  kind: "hi-fi",     tag: "core" },
  { title: "Archive search & lineage",  kind: "prototype", tag: "archive" },
];

const TEMPLATES = [
  { title: "Command centre",      kind: "hi-fi",     tag: "ops" },
  { title: "Studio split",        kind: "wireframe", tag: "creation" },
  { title: "Archive ledger",      kind: "hi-fi",     tag: "retrieval" },
  { title: "Governance stack",    kind: "hi-fi",     tag: "policy" },
  { title: "Slide deck — thesis", kind: "hi-fi",     tag: "narrative" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
}

export default function ExplorationRail({ plan, mock }: Props) {
  const copy = useCopy();
  const [tab, setTab] = useState<Tab>("examples");
  const [query, setQuery] = useState("");

  return (
    <div className="surface-rail-shell">
      {/* Hero empty state — when no plan is yet generated, the right
          rail leads with this prose centred above the tab strip. The
          old (pre-cockpit) Surface used the entire right column for
          this hero; the cockpit-grammar version preserves it as a
          banner and keeps the gallery tabs available below. When the
          generator ships a plan, this hero is replaced by the plan
          preview block. */}
      {!plan && (
        <div className="surface-rail-hero">
          <span className="surface-rail-hero-kicker">{copy.surfaceRailEmptyKicker}</span>
          <p className="surface-rail-hero-body">{copy.surfaceRailEmptyBody}</p>
        </div>
      )}

      {/* Plan preview — replaces the hero when a plan has arrived. */}
      {plan && (
        <div
          data-surface-plan-preview
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid color-mix(in oklab, var(--text-primary) 6%, transparent)",
            background: "color-mix(in oklab, var(--chamber-dna, var(--accent)) 3%, var(--bg-elevated))",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "var(--t-micro)",
                letterSpacing: "var(--track-label)",
                textTransform: "uppercase",
                color: "var(--chamber-dna, var(--accent))",
                fontWeight: 500,
              }}
            >
              — Plano gerado
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
                letterSpacing: "var(--track-meta)",
              }}
            >
              {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "no DS"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {plan.screens.map((s) => {
              const componentCount = plan.components.filter((c) => c.screen === s.name).length;
              return (
                <div
                  key={s.name}
                  className="surface-rail-card"
                  style={{ cursor: "default" }}
                >
                  <div className="surface-rail-card-title">{s.name}</div>
                  <div
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: "var(--t-body-sec)",
                      color: "var(--text-muted)",
                      lineHeight: 1.45,
                    }}
                  >
                    {s.purpose}
                  </div>
                  <div className="surface-rail-card-meta">
                    <span className="surface-rail-card-kind">{componentCount} components</span>
                  </div>
                </div>
              );
            })}
          </div>
          {plan.notes.length > 0 && (
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                color: "var(--text-muted)",
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                lineHeight: 1.5,
              }}
            >
              {plan.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab bar — mono uppercase, underline-active in chamber-DNA. */}
      <div className="surface-rail-tabs" role="tablist">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              data-active={active ? "true" : undefined}
              onClick={() => setTab(t.key)}
              className="surface-rail-tab"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab body */}
      <div className="surface-rail-body">
        {tab === "examples" && <Grid items={EXAMPLES} />}
        {tab === "templates" && <Grid items={TEMPLATES} />}
        {tab === "recent" && (
          <EmptyBlock
            title="Sem histórico ainda"
            body="Os planos aceites nesta missão vão aparecer aqui. Para ver runs de Surface de todas as missões, vai ao Archive."
          />
        )}
        {tab === "search" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar examples, templates, library…"
              style={{
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body)",
                padding: "10px 12px",
                background: "var(--bg-input)",
                color: "var(--text-primary)",
                border: "1px solid color-mix(in oklab, var(--text-primary) 9%, transparent)",
                borderRadius: 8,
                outline: 0,
              }}
            />
            <EmptyBlock
              title="Pesquisa federada por ligar"
              body="A pesquisa local nos decks (examples, templates, library) chega primeiro. A federada sobre conectores liga quando o Archive expor o registry."
            />
          </div>
        )}
        {tab === "library" && (
          <EmptyBlock
            title="Library de design systems"
            body="Core → Routing lista os design systems disponíveis para cada chamber. Quando a edição estiver aberta, os DSes passam a ser visíveis aqui também."
          />
        )}
      </div>
    </div>
  );
}

function Grid({ items }: { items: Array<{ title: string; kind: string; tag: string }> }) {
  return (
    <div className="surface-rail-grid">
      {items.map((it) => (
        <button
          key={it.title}
          className="surface-rail-card"
          type="button"
          // Cards are visual placeholders today — wiring lands when the
          // archive connector layer ships. No fake selection state.
          aria-label={`${it.title} · ${it.kind}`}
        >
          <div className="surface-rail-card-title">{it.title}</div>
          <div className="surface-rail-card-meta">
            <span className="surface-rail-card-kind" data-kind={it.kind}>{it.kind}</span>
            <span className="surface-rail-card-tag">· {it.tag}</span>
          </div>
        </button>
      ))}
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
        padding: "var(--space-4)",
        textAlign: "center",
        color: "var(--text-muted)",
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
          color: "var(--text-secondary)",
          letterSpacing: "-0.005em",
        }}
      >
        {body}
      </div>
    </div>
  );
}
