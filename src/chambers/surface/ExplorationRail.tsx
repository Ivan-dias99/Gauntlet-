import { useState } from "react";
import type { SurfacePlanPayload } from "../../hooks/useSignal";

// Wave-3 right-side exploration rail. Five tabs: Examples, Templates,
// Recent, Search, Library. Data is canned in W3 — real catalog comes
// from the archive connector layer in later waves. The point is that
// the shell behaves like a real design workstation and not a
// placeholder galllery.

type Tab = "examples" | "templates" | "recent" | "search" | "library";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "examples",  label: "Examples" },
  { key: "templates", label: "Templates" },
  { key: "recent",    label: "Recent" },
  { key: "search",    label: "Search" },
  { key: "library",   label: "Library" },
];

const EXAMPLES = [
  { title: "Operational dashboard",   kind: "Hi-fi",      tag: "analytics" },
  { title: "Onboarding flow — 3 steps",kind: "Prototype", tag: "activation" },
  { title: "Governance settings pane", kind: "Hi-fi",     tag: "core" },
  { title: "Archive search & lineage", kind: "Prototype", tag: "archive" },
];

const TEMPLATES = [
  { title: "Command centre",    kind: "hi-fi",    tag: "ops" },
  { title: "Studio split",      kind: "wireframe",tag: "creation" },
  { title: "Archive ledger",    kind: "hi-fi",    tag: "retrieval" },
  { title: "Governance stack",  kind: "hi-fi",    tag: "policy" },
  { title: "Slide deck — thesis", kind: "hi-fi",  tag: "narrative" },
];

interface Props {
  plan: SurfacePlanPayload | null;
  mock: boolean;
}

export default function ExplorationRail({ plan, mock }: Props) {
  const [tab, setTab] = useState<Tab>("examples");
  const [query, setQuery] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Plan preview — sits above the rail when a mock plan has arrived. */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: "var(--t-micro)",
                letterSpacing: "var(--track-label)",
                textTransform: "uppercase",
                color: "var(--text-ghost)",
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
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
              {plan.mode} · {plan.fidelity} · {plan.design_system_binding ?? "sem DS"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {plan.screens.map((s) => (
              <div
                key={s.name}
                style={{
                  padding: 10,
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
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                padding: "6px 10px",
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                border: active ? "var(--border-soft)" : "1px solid transparent",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab body */}
      <div style={{ flex: 1, overflow: "auto", padding: "var(--space-3)" }}>
        {tab === "examples" && <Grid items={EXAMPLES} />}
        {tab === "templates" && <Grid items={TEMPLATES} />}
        {tab === "recent" && (
          <EmptyBlock
            title="Sem histórico ainda"
            body="Os planos aceites nesta missão vão aparecer aqui. Para ver runs de Surface de todas as missões, vai ao Arquivo."
          />
        )}
        {tab === "search" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                border: "var(--border-mid)",
                borderRadius: "var(--radius-control)",
              }}
            />
            <EmptyBlock
              title="Pesquisa federada em breve"
              body="A pesquisa local nos decks (examples, templates, library) chega primeiro. A pesquisa federada sobre conectores chega quando o Arquivo expor os conectores."
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 10,
      }}
    >
      {items.map((it) => (
        <div
          key={it.title}
          style={{
            padding: 12,
            border: "var(--border-soft)",
            borderRadius: "var(--radius-control)",
            background: "var(--bg-surface)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
            {it.title}
          </div>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            {it.kind} · {it.tag}
          </div>
        </div>
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
        gap: 8,
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
      <div style={{ fontFamily: "var(--serif)", fontSize: "var(--t-body)", lineHeight: 1.45 }}>
        {body}
      </div>
    </div>
  );
}
