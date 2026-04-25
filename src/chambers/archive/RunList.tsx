import { useMemo, useState } from "react";
import type { RunRecord } from "./helpers";
import { ROUTE_COLOR, originFor, isLinked } from "./helpers";
import { useCopy } from "../../i18n/copy";

// prettyTitle — fallback when the run question is empty or reads as
// gibberish. The cut wave forbade demo-residue strings from reaching
// the ledger UI; if a real title isn't there, say so.
function prettyTitle(raw: string | null | undefined): string {
  const v = (raw ?? "").trim();
  if (!v) return "—";
  // Treat noise (≤ 2 chars, all-punctuation, or low-info) as untitled.
  if (v.length <= 2) return "—";
  const letters = v.replace(/[^a-zA-ZÀ-ÿ]/g, "");
  if (letters.length === 0) return "—";
  return v;
}

// Search + route-filter chips + scrollable run list. Clicking a row
// promotes that run into the detail pane on the right. Keeps the
// outcome chip inline so the list reads as ledger, not as chat log.

const ROUTES: Array<{ key: string | null; label: string }> = [
  { key: null,      label: "todas" },
  { key: "agent",   label: "agent" },
  { key: "triad",   label: "triad" },
  { key: "crew",    label: "crew" },
  { key: "surface", label: "surface" },
];

interface Props {
  runs: RunRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeTokens: Set<string>;
}

export default function RunList({ runs, selectedId, onSelect, activeTokens }: Props) {
  const copy = useCopy();
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return runs.filter((r) => {
      if (route && r.route !== route) return false;
      if (!q) return true;
      return r.question.toLowerCase().includes(q)
        || (r.answer ?? "").toLowerCase().includes(q)
        || r.route.toLowerCase().includes(q);
    });
  }, [runs, query, route]);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        background: "var(--bg-surface)",
        overflow: "hidden",
      }}
    >
      {/* Search */}
      <div style={{ padding: "var(--space-2) var(--space-3)", borderBottom: "var(--border-soft)" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar por pergunta, resposta, rota…"
          style={{
            width: "100%",
            fontFamily: "var(--sans)",
            fontSize: "var(--t-body-sec)",
            padding: "8px 10px",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            border: "var(--border-mid)",
            borderRadius: "var(--radius-control)",
          }}
        />
      </div>

      {/* Route filter chips */}
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 4,
          padding: "6px var(--space-3)",
          borderBottom: "var(--border-soft)",
          overflowX: "auto",
        }}
      >
        {ROUTES.map((r) => {
          const active = r.key === route;
          return (
            <button
              key={r.label}
              role="tab"
              aria-selected={active}
              onClick={() => setRoute(r.key)}
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                padding: "4px 10px",
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                border: active ? "var(--border-soft)" : "1px solid transparent",
                borderRadius: 999,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {filtered.length === 0 && (
          <div
            style={{
              padding: "var(--space-4)",
              color: "var(--text-muted)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              textAlign: "center",
            }}
          >
            {copy.archiveListEmpty}
          </div>
        )}
        {filtered.map((r) => {
          const active = selectedId === r.id;
          const origin = originFor(r.route);
          const routeColor = r.refused ? "var(--cc-err)" : ROUTE_COLOR[r.route] ?? "var(--text-muted)";
          const linked = isLinked(r.question, activeTokens);
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              data-run-row
              data-active={active ? "true" : undefined}
              data-chamber={origin ?? undefined}
              style={{
                width: "100%",
                textAlign: "left",
                display: "grid",
                gridTemplateColumns: "64px 1fr auto",
                gap: "0 10px",
                alignItems: "baseline",
                padding: "10px 14px",
                background: active ? "var(--bg-elevated)" : "transparent",
                borderLeft: r.refused
                  ? "2px solid var(--cc-err)"
                  : active
                  ? "2px solid color-mix(in oklab, var(--chamber-dna, var(--accent)) 80%, transparent)"
                  : "2px solid transparent",
                borderBottom: "1px solid var(--border-soft)",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  color: routeColor,
                }}
              >
                {r.refused ? "✗ " : ""}{r.route}
              </span>
              <span
                style={{
                  fontSize: "var(--t-body-sec)",
                  color: r.refused ? "var(--terminal-warn)" : "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {prettyTitle(r.question)}
              </span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  color: "var(--text-ghost)",
                  letterSpacing: "var(--track-meta)",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 6,
                }}
              >
                {renderOutcomeChip(r)}
                {linked && (
                  <span style={{ color: "var(--accent)" }} title="Ligado à missão activa">
                    →
                  </span>
                )}
                <span>
                  {new Date(r.timestamp).toLocaleTimeString([], {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {runs.length >= 100 && (
        <div
          style={{
            padding: "6px var(--space-3)",
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            borderTop: "var(--border-soft)",
            textAlign: "center",
          }}
        >
          — mostrando as 100 mais recentes —
        </div>
      )}
    </div>
  );
}

function renderOutcomeChip(r: RunRecord) {
  if (r.refused) return <Chip tone="err">recusado</Chip>;
  if (r.terminated_early) return <Chip tone="warn">parcial</Chip>;
  if (r.confidence === "high") return <Chip tone="ok">high</Chip>;
  if (r.confidence === "low")  return <Chip tone="warn">low</Chip>;
  return null;
}

function Chip({ tone, children }: { tone: "ok" | "warn" | "err"; children: React.ReactNode }) {
  return <span className="kicker" data-tone={tone}>{children}</span>;
}
