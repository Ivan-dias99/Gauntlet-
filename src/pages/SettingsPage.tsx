// Wave P-43 — settings page (real).
//
// /settings/:section ─→ preferences | api-keys | connectors | language
//
// preferences  — theme · density · accent · sans/mono families · reset
// api-keys     — provider token entry (localStorage only, never sent
//                until the operator explicitly tests; backend handles
//                token resolution server-side via env vars in prod)
// connectors   — summary of locally stored connector tokens + link to
//                the full /connectors setup
// language     — pt · en (TweaksContext.lang)
//
// All wiring is honest: TweaksContext owns theme/density/accent/font/
// language, localStorage backs api-key + connector tokens. Doctrine: we
// never POST a stored key on render — user must click an explicit
// action (deferred until backend exposes a /probe endpoint).

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ACCENT_SWATCHES,
  DENSITY_CYCLE,
  DENSITY_LABEL,
  useTweaks,
  type AccentKey,
  type Density,
  type Lang,
  type Mono,
  type Sans,
  type Theme,
} from "../tweaks/TweaksContext";

const SECTIONS = [
  { key: "preferences", label: "preferências" },
  { key: "api-keys",    label: "api keys" },
  { key: "connectors",  label: "conectores" },
  { key: "language",    label: "idioma" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

const API_KEYS_STORAGE = "signal:settings:api-keys:v1";
const CONNECTOR_TOKENS_STORAGE = "signal:settings:connectors:v1";

const PROVIDERS: ReadonlyArray<{ id: string; label: string; help: string }> = [
  { id: "anthropic", label: "Anthropic",    help: "Claude · sonnet · opus · haiku" },
  { id: "openai",    label: "OpenAI",       help: "GPT · embeddings" },
  { id: "google",    label: "Google AI",    help: "Gemini" },
  { id: "groq",      label: "Groq",         help: "low-latency inference" },
];

const CONNECTORS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "github",          label: "GitHub" },
  { id: "vercel",          label: "Vercel" },
  { id: "railway",         label: "Railway" },
  { id: "postgres",        label: "Postgres" },
  { id: "figma",           label: "Figma" },
  { id: "issue-tracker",   label: "Issue Tracker" },
];

export default function SettingsPage() {
  const { section = "preferences" } = useParams<{ section?: string }>();
  const active: SectionKey = (SECTIONS.find((s) => s.key === section)?.key ?? "preferences") as SectionKey;

  return (
    <section
      data-page="settings"
      style={{
        padding: "var(--space-6)",
        maxWidth: 1080,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "var(--space-6)",
      }}
    >
      <aside data-settings-nav>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
          }}
        >
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <Link
                to={`/settings/${s.key}`}
                className="btn"
                data-active={active === s.key ? "true" : undefined}
                style={{ display: "block", padding: "var(--space-2)" }}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article data-settings-section={active}>
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "var(--t-title)",
            margin: "0 0 var(--space-4)",
          }}
        >
          {SECTIONS.find((s) => s.key === active)?.label ?? "secção"}
        </h2>
        {active === "preferences" && <PreferencesPanel />}
        {active === "api-keys"    && <ApiKeysPanel />}
        {active === "connectors"  && <ConnectorsPanel />}
        {active === "language"    && <LanguagePanel />}
      </article>
    </section>
  );
}

// ─── Preferences ─────────────────────────────────────────────────────

function PreferencesPanel() {
  const { values, set, reset } = useTweaks();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <Field label="tema">
        <Segmented
          options={[
            { value: "dark",  label: "escuro" },
            { value: "light", label: "claro" },
            { value: "sepia", label: "sépia" },
          ]}
          value={values.theme}
          onChange={(v) => set("theme", v as Theme)}
        />
      </Field>

      <Field label="densidade">
        <Segmented
          options={DENSITY_CYCLE.map((d) => ({ value: d, label: DENSITY_LABEL[d] }))}
          value={values.density}
          onChange={(v) => set("density", v as Density)}
        />
      </Field>

      <Field label="acento">
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          {ACCENT_SWATCHES.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => set("accent", a.key as AccentKey)}
              aria-label={`acento ${a.key}`}
              aria-pressed={values.accent === a.key}
              title={a.key}
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-full)",
                border: values.accent === a.key
                  ? "2px solid var(--text-primary)"
                  : "1px solid var(--border-soft)",
                background: a.color,
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </Field>

      <Field label="serif sans">
        <Segmented
          options={[
            { value: "inter",  label: "Inter" },
            { value: "plex",   label: "IBM Plex Sans" },
            { value: "system", label: "system" },
          ]}
          value={values.sans}
          onChange={(v) => set("sans", v as Sans)}
        />
      </Field>

      <Field label="mono">
        <Segmented
          options={[
            { value: "jetbrains", label: "JetBrains Mono" },
            { value: "ibm",       label: "IBM Plex Mono" },
          ]}
          value={values.mono}
          onChange={(v) => set("mono", v as Mono)}
        />
      </Field>

      <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "var(--space-3)" }}>
        <button
          type="button"
          onClick={() => {
            if (confirm("repor todas as preferências aos valores padrão?")) reset();
          }}
          className="btn"
          data-tone="danger"
          style={{ padding: "var(--space-2) var(--space-3)" }}
        >
          repor preferências
        </button>
      </div>
    </div>
  );
}

// ─── API Keys ────────────────────────────────────────────────────────

interface ApiKeyRecord {
  provider: string;
  key: string;
  updatedAt: number;
}

function ApiKeysPanel() {
  const [records, setRecords] = useState<ApiKeyRecord[]>(() => {
    try {
      const raw = localStorage.getItem(API_KEYS_STORAGE);
      return raw ? (JSON.parse(raw) as ApiKeyRecord[]) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem(API_KEYS_STORAGE, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  const upsert = (provider: string, key: string) => {
    if (!key.trim()) return;
    setRecords((prev) => {
      const without = prev.filter((r) => r.provider !== provider);
      return [...without, { provider, key: key.trim(), updatedAt: Date.now() }];
    });
    setDraft((d) => ({ ...d, [provider]: "" }));
  };
  const remove = (provider: string) =>
    setRecords((prev) => prev.filter((r) => r.provider !== provider));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
        chaves guardadas localmente neste navegador. nunca enviadas até
        o operador testar explicitamente. produção lê via env do backend.
      </p>
      {PROVIDERS.map((p) => {
        const stored = records.find((r) => r.provider === p.id);
        const draftValue = draft[p.id] ?? "";
        const isRevealed = !!reveal[p.id];
        return (
          <div
            key={p.id}
            data-provider={p.id}
            style={{
              padding: "var(--space-3)",
              border: "1px solid var(--border-soft)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "var(--t-body)" }}>
                {p.label}
              </span>
              <span className="kicker" data-tone="ghost">{p.help}</span>
              {stored && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-meta)",
                    color: "var(--text-muted)",
                  }}
                >
                  {isRevealed ? stored.key : maskKey(stored.key)}
                </span>
              )}
            </div>
            {stored ? (
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setReveal((r) => ({ ...r, [p.id]: !isRevealed }))}
                  style={{ padding: "var(--space-1) var(--space-2)" }}
                >
                  {isRevealed ? "ocultar" : "revelar"}
                </button>
                <button
                  type="button"
                  className="btn"
                  data-tone="danger"
                  onClick={() => remove(p.id)}
                  style={{ padding: "var(--space-1) var(--space-2)" }}
                >
                  remover
                </button>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: "var(--t-meta)",
                    color: "var(--text-muted)",
                  }}
                >
                  guardada {fmtRel(stored.updatedAt)}
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <input
                  type="password"
                  value={draftValue}
                  onChange={(e) => setDraft((d) => ({ ...d, [p.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") upsert(p.id, draftValue);
                  }}
                  placeholder="sk-…"
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
                  onClick={() => upsert(p.id, draftValue)}
                  disabled={!draftValue.trim()}
                  style={{ padding: "var(--space-2) var(--space-3)" }}
                >
                  guardar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Connectors summary ──────────────────────────────────────────────

interface ConnectorRecord { connector: string; token: string; updatedAt: number }

function ConnectorsPanel() {
  const [records, setRecords] = useState<ConnectorRecord[]>(() => {
    try {
      const raw = localStorage.getItem(CONNECTOR_TOKENS_STORAGE);
      return raw ? (JSON.parse(raw) as ConnectorRecord[]) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(CONNECTOR_TOKENS_STORAGE, JSON.stringify(records)); } catch {}
  }, [records]);

  const remove = (connector: string) =>
    setRecords((prev) => prev.filter((r) => r.connector !== connector));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
        resumo dos tokens de conector guardados localmente. para configurar
        novos, abra a página de conectores.
      </p>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "var(--space-2)",
        }}
      >
        {CONNECTORS.map((c) => {
          const stored = records.find((r) => r.connector === c.id);
          return (
            <li
              key={c.id}
              style={{
                padding: "var(--space-3)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--mono)" }}>{c.label}</span>
                <span
                  className="kicker"
                  data-tone={stored ? "ok" : "ghost"}
                  style={{ fontSize: "var(--t-meta)" }}
                >
                  {stored ? "● configurado" : "○ vazio"}
                </span>
              </div>
              {stored ? (
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <span
                    style={{
                      flex: 1,
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-meta)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {maskKey(stored.token)} · {fmtRel(stored.updatedAt)}
                  </span>
                  <button
                    type="button"
                    className="btn"
                    data-tone="danger"
                    onClick={() => remove(c.id)}
                    style={{ padding: 2, fontSize: "var(--t-meta)" }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <Link
                  to={`/connectors/${c.id}`}
                  className="btn"
                  style={{ padding: "var(--space-1)", fontSize: "var(--t-meta)", textAlign: "center" }}
                >
                  configurar →
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Language ────────────────────────────────────────────────────────

function LanguagePanel() {
  const { values, set } = useTweaks();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
        afecta toda a copy da interface. os snapshots no spine guardam a
        língua do operador no momento do registo.
      </p>
      <Segmented
        options={[
          { value: "pt", label: "português" },
          { value: "en", label: "english" },
        ]}
        value={values.lang}
        onChange={(v) => set("lang", v as Lang)}
      />
    </div>
  );
}

// ─── Field + Segmented helpers ──────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <span
        className="kicker"
        data-tone="ghost"
        style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options, value, onChange,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" style={{ display: "inline-flex", gap: 0, flexWrap: "wrap" }}>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(o.value)}
            style={{
              padding: "var(--space-2) var(--space-3)",
              fontFamily: "var(--mono)",
              fontSize: "var(--t-body-sec)",
              color: selected ? "var(--text-primary)" : "var(--text-muted)",
              border: "1px solid var(--border-soft)",
              borderRight: i < options.length - 1 ? "none" : "1px solid var(--border-soft)",
              borderRadius:
                i === 0 ? "var(--radius-sm) 0 0 var(--radius-sm)" :
                i === options.length - 1 ? "0 var(--radius-sm) var(--radius-sm) 0" :
                0,
              background: selected
                ? "color-mix(in oklab, var(--text-primary) 8%, transparent)"
                : "transparent",
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function maskKey(key: string): string {
  if (key.length <= 8) return "•".repeat(key.length);
  return `${key.slice(0, 4)}${"•".repeat(8)}${key.slice(-4)}`;
}

function fmtRel(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "agora";
  const m = Math.round(diff / 60_000);
  if (m < 60) return `há ${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.round(h / 24);
  return `há ${d}d`;
}
