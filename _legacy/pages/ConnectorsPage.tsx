// Wave P-44 — connectors page (real).
//
// Grid view (`/connectors`)            — 10 cards, configured/empty
//                                        status, click to setup
// Detail view (`/connectors/:id`)      — token form, scope notes,
//                                        recent activity placeholder
//
// Token persistence reuses the namespace SettingsPage › ConnectorsPanel
// already writes to (signal:settings:connectors:v1) so the two surfaces
// stay in sync. Real backend wiring (probe, OAuth flow) lands in a
// later wave; the doctrine here is honest local persistence + a clear
// path to the real flow.

import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const CONNECTOR_TOKENS_STORAGE = "signal:settings:connectors:v1";

interface ConnectorRecord {
  connector: string;
  token: string;
  scope?: string;
  updatedAt: number;
}

interface ConnectorDef {
  id: string;
  label: string;
  blurb: string;
  scopes: ReadonlyArray<{ key: string; label: string; required?: boolean }>;
  docsHref?: string;
}

const CONNECTORS: ReadonlyArray<ConnectorDef> = [
  {
    id: "github",
    label: "GitHub",
    blurb: "code · repos · issues · pull requests · actions",
    scopes: [
      { key: "repo",       label: "repo · read+write code", required: true },
      { key: "issues",     label: "issues · comments" },
      { key: "actions",    label: "actions · workflows" },
    ],
  },
  {
    id: "vercel",
    label: "Vercel",
    blurb: "deploys · preview URLs · build logs",
    scopes: [
      { key: "deployments",  label: "deployments · read+trigger", required: true },
      { key: "logs",         label: "build + runtime logs" },
    ],
  },
  {
    id: "railway",
    label: "Railway",
    blurb: "infra · services · environment vars",
    scopes: [
      { key: "services", label: "services · read+restart", required: true },
      { key: "env",      label: "environment variables" },
    ],
  },
  {
    id: "postgres",
    label: "Postgres",
    blurb: "queries · migrations · row-level introspection",
    scopes: [
      { key: "ro", label: "read-only · default", required: true },
      { key: "rw", label: "read+write · gated by Core/Permissions" },
    ],
  },
  {
    id: "web",
    label: "Web · Research",
    blurb: "fetch · search · open-text research grounding",
    scopes: [
      { key: "fetch",  label: "fetch URL", required: true },
      { key: "search", label: "search engine" },
    ],
  },
  {
    id: "model-gateway",
    label: "Model Gateway",
    blurb: "router para Anthropic · OpenAI · Google · Groq",
    scopes: [
      { key: "route",    label: "route requests", required: true },
      { key: "fallback", label: "automatic fallback chain" },
    ],
  },
  {
    id: "browser-runtime",
    label: "Browser Runtime",
    blurb: "headless · screenshots · DOM extraction",
    scopes: [
      { key: "navigate", label: "navigate + DOM read", required: true },
      { key: "actions",  label: "click + type + form fill" },
    ],
  },
  {
    id: "figma",
    label: "Figma",
    blurb: "design files · components · layout extraction",
    scopes: [
      { key: "files", label: "read files", required: true },
      { key: "comments", label: "comments" },
    ],
  },
  {
    id: "issue-tracker",
    label: "Issue Tracker",
    blurb: "Linear / Jira / GitHub Issues abstraction",
    scopes: [
      { key: "read",   label: "read tickets", required: true },
      { key: "create", label: "create + update" },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    blurb: "logs · traces · metrics (Datadog / Honeycomb)",
    scopes: [
      { key: "logs",    label: "logs query", required: true },
      { key: "traces",  label: "trace search" },
      { key: "metrics", label: "metric series" },
    ],
  },
];

function loadRecords(): ConnectorRecord[] {
  try {
    const raw = localStorage.getItem(CONNECTOR_TOKENS_STORAGE);
    return raw ? (JSON.parse(raw) as ConnectorRecord[]) : [];
  } catch { return []; }
}

function saveRecords(records: ConnectorRecord[]) {
  try { localStorage.setItem(CONNECTOR_TOKENS_STORAGE, JSON.stringify(records)); } catch {}
}

export default function ConnectorsPage() {
  const { id } = useParams<{ id?: string }>();
  if (id) return <ConnectorDetail id={id} />;
  return <ConnectorGrid />;
}

// ─── Grid view ──────────────────────────────────────────────────────

function ConnectorGrid() {
  const [records, setRecords] = useState<ConnectorRecord[]>(loadRecords);

  // Keep state hydrated when SettingsPage writes to the same key in
  // another tab (storage event). Local writes go through saveRecords.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONNECTOR_TOKENS_STORAGE) setRecords(loadRecords());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const configured = records.length;

  return (
    <section
      data-page="connectors"
      style={{
        padding: "var(--space-6)",
        maxWidth: 1080,
        margin: "0 auto",
      }}
    >
      <header style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>
          conectores
        </h2>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
          }}
        >
          {configured}/{CONNECTORS.length} configurados
        </span>
      </header>
      <p style={{ color: "var(--text-secondary)", maxWidth: 640, lineHeight: 1.55, marginTop: 0 }}>
        cada câmara puxa da mesma matriz. tokens com âmbito por conector,
        allowlists declaradas em policy, telemetria selada.
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: "var(--space-4) 0 0",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {CONNECTORS.map((c) => {
          const stored = records.find((r) => r.connector === c.id);
          const isConfigured = !!stored;
          return (
            <li key={c.id}>
              <Link
                to={`/connectors/${c.id}`}
                data-connector-card={c.id}
                data-configured={isConfigured ? "true" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  padding: "var(--space-3)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface, transparent)",
                  height: "100%",
                  transition: "border-color 120ms",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "var(--t-body)" }}>{c.label}</span>
                  <span
                    className="kicker"
                    data-tone={isConfigured ? "ok" : "ghost"}
                    style={{ fontSize: "var(--t-meta)" }}
                  >
                    {isConfigured ? "● configurado" : "○ vazio"}
                  </span>
                </div>
                <span style={{ color: "var(--text-secondary)", fontSize: "var(--t-body-sec)" }}>
                  {c.blurb}
                </span>
                <span
                  style={{
                    marginTop: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-meta)",
                    color: "var(--text-muted)",
                  }}
                >
                  {isConfigured ? "abrir →" : "configurar →"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Detail view ────────────────────────────────────────────────────

function ConnectorDetail({ id }: { id: string }) {
  const def = CONNECTORS.find((c) => c.id === id);
  const navigate = useNavigate();

  const [records, setRecords] = useState<ConnectorRecord[]>(loadRecords);
  const stored = useMemo(() => records.find((r) => r.connector === id), [records, id]);

  const [token, setToken] = useState(stored?.token ?? "");
  const [reveal, setReveal] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(() => {
    if (!def) return new Set();
    // Codex review #288 (P2): hydration must always include required
    // scopes. Legacy/manually-edited storage may omit them; without this
    // merge the required checkbox renders disabled+unchecked and the
    // user cannot recover (the input is disabled, so toggling is
    // impossible). Force the union so required is always present.
    const required = def.scopes.filter((s) => s.required).map((s) => s.key);
    const seed = stored?.scope?.split(",").filter(Boolean) ?? [];
    return new Set([...seed, ...required]);
  });
  const [probeState, setProbeState] = useState<"idle" | "running" | "ok" | "err">("idle");
  const [probeMessage, setProbeMessage] = useState<string | null>(null);

  if (!def) {
    return (
      <section style={{ padding: "var(--space-6)", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)" }}>
          conector desconhecido
        </h2>
        <p>
          o id <code>{id}</code> não corresponde a nenhum conector da matriz.{" "}
          <Link to="/connectors">ver todos →</Link>
        </p>
      </section>
    );
  }

  const save = () => {
    if (!token.trim()) return;
    const next: ConnectorRecord = {
      connector: id,
      token: token.trim(),
      scope: Array.from(selectedScopes).join(","),
      updatedAt: Date.now(),
    };
    const updated = [...records.filter((r) => r.connector !== id), next];
    setRecords(updated);
    saveRecords(updated);
  };

  const remove = () => {
    const updated = records.filter((r) => r.connector !== id);
    setRecords(updated);
    saveRecords(updated);
    setToken("");
    setProbeState("idle");
    setProbeMessage(null);
  };

  const probe = () => {
    if (!token.trim()) return;
    setProbeState("running");
    setProbeMessage(null);
    // P-44 — probe is mocked client-side: validates token shape only.
    // Real /api/connectors/:id/probe lands when the backend exposes it.
    window.setTimeout(() => {
      const looksLikeToken = token.trim().length >= 10 && /[A-Za-z0-9_\-.]/.test(token.trim());
      if (looksLikeToken) {
        setProbeState("ok");
        setProbeMessage("token aceite localmente · validação real depende do backend");
      } else {
        setProbeState("err");
        setProbeMessage("formato improvável — token deve ter pelo menos 10 caracteres");
      }
    }, 350);
  };

  const toggleScope = (key: string) => {
    setSelectedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section
      data-page="connector-detail"
      data-connector={id}
      style={{
        padding: "var(--space-6)",
        maxWidth: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <nav style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)", color: "var(--text-muted)" }}>
        <Link to="/connectors" style={{ color: "inherit" }}>← conectores</Link>
      </nav>

      <header>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-title)", margin: 0 }}>{def.label}</h2>
        <p style={{ color: "var(--text-secondary)", margin: "var(--space-1) 0 0" }}>{def.blurb}</p>
      </header>

      <div
        style={{
          padding: "var(--space-3)",
          border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <label
            htmlFor={`token-${id}`}
            className="kicker"
            data-tone="ghost"
            style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)" }}
          >
            token
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <input
              id={`token-${id}`}
              type={reveal ? "text" : "password"}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="••••••••"
              spellCheck={false}
              autoComplete="off"
              style={{
                flex: 1,
                padding: "var(--space-2)",
                fontFamily: "var(--mono)",
                fontSize: "var(--t-body)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-surface, transparent)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="button"
              className="btn"
              onClick={() => setReveal((r) => !r)}
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              {reveal ? "ocultar" : "revelar"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <span
            className="kicker"
            data-tone="ghost"
            style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)" }}
          >
            âmbito
          </span>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {def.scopes.map((s) => {
              const checked = selectedScopes.has(s.key);
              return (
                <li key={s.key}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-body-sec)",
                      cursor: s.required ? "not-allowed" : "pointer",
                      opacity: s.required ? 0.85 : 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={s.required}
                      onChange={() => toggleScope(s.key)}
                    />
                    <span>{s.label}</span>
                    {s.required && (
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "var(--t-meta)",
                          color: "var(--text-muted)",
                        }}
                      >
                        obrigatório
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="btn"
            data-action="primary"
            onClick={save}
            disabled={!token.trim()}
            style={{ padding: "var(--space-2) var(--space-3)" }}
          >
            {stored ? "actualizar" : "guardar"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={probe}
            disabled={!token.trim() || probeState === "running"}
            style={{ padding: "var(--space-2) var(--space-3)" }}
          >
            {probeState === "running" ? "a testar…" : "testar"}
          </button>
          {stored && (
            <button
              type="button"
              className="btn"
              data-tone="danger"
              onClick={remove}
              style={{ padding: "var(--space-2) var(--space-3)" }}
            >
              remover
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/connectors")}
            style={{ padding: "var(--space-2) var(--space-3)", marginLeft: "auto" }}
          >
            voltar
          </button>
        </div>

        {probeMessage && (
          <div
            data-probe-state={probeState}
            style={{
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              border: "1px solid",
              borderColor:
                probeState === "ok" ? "color-mix(in oklab, var(--ok, #4a8c5d) 60%, transparent)" :
                probeState === "err" ? "color-mix(in oklab, var(--danger, #d04a4a) 60%, transparent)" :
                "var(--border-soft)",
              color:
                probeState === "ok" ? "color-mix(in oklab, var(--ok, #4a8c5d) 90%, var(--text-primary))" :
                probeState === "err" ? "color-mix(in oklab, var(--danger, #d04a4a) 90%, var(--text-primary))" :
                "var(--text-secondary)",
            }}
          >
            {probeMessage}
          </div>
        )}
      </div>

      <section>
        <h3
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            margin: "0 0 var(--space-2)",
          }}
        >
          — actividade recente
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-body-sec)",
            padding: "var(--space-3)",
            border: "1px dashed var(--border-soft)",
            borderRadius: "var(--radius-md)",
          }}
        >
          telemetria por conector aparece aqui assim que o backend selar o
          primeiro pedido. ainda sem chamadas registadas.
        </p>
      </section>
    </section>
  );
}
