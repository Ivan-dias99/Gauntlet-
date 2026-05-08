import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GAUNTLET_API_BASE,
  GAUNTLET_API_KEY_PRESENT,
  isBackendUnreachable,
  gauntletFetch,
} from "../lib/gauntletApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

const THEMES = ["dark", "light"] as const;
type Theme = typeof THEMES[number];

// ── Sprint 4 — Composer Settings (Governance Lock) ─────────────────────────
//
// Mirrors backend/models.py::ComposerSettings. Kept in this file rather
// than a shared library because the only consumers are this page and
// the cápsula (which has its own typed copy in composer-client.ts).

const ACTION_TYPES = ["click", "fill", "highlight", "scroll_to"] as const;
type ActionType = typeof ACTION_TYPES[number];

interface DomainPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

interface ActionPolicy {
  allowed: boolean;
  require_danger_ack: boolean;
}

interface ComposerSettings {
  domains: Record<string, DomainPolicy>;
  actions: Record<string, ActionPolicy>;
  default_domain_policy: DomainPolicy;
  default_action_policy: ActionPolicy;
  max_page_text_chars: number;
  max_dom_skeleton_chars: number;
  screenshot_default: boolean;
  execution_reporting_required: boolean;
  updated_at: string;
}

const DEFAULT_SETTINGS: ComposerSettings = {
  domains: {},
  actions: {},
  default_domain_policy: { allowed: true, require_danger_ack: false },
  default_action_policy: { allowed: true, require_danger_ack: false },
  max_page_text_chars: 6000,
  max_dom_skeleton_chars: 4000,
  screenshot_default: false,
  execution_reporting_required: false,
  updated_at: "",
};

function readTheme(): Theme {
  const html = document.documentElement;
  const t = html.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export default function GovernancePage() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("gauntlet:theme", theme);
    } catch {
      // localStorage may be blocked; theme still applies for the session.
    }
  }, [theme]);

  return (
    <>
      <SurfaceHeader
        eyebrow="Settings"
        title="Composer governance · runtime · theme"
        subtitle="Operator-owned policy. The cápsula reads this on every summon."
      />

      <ComposerGovernancePanel />

      <Panel title="Backend client" hint="from control-center/lib/gauntletApi.ts (Vite-inlined env)">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <ConfigField
            label="base url"
            value={
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--ember)",
                  letterSpacing: 0.02,
                }}
              >
                {GAUNTLET_API_BASE}
              </code>
            }
            sub="dev: vite proxy · prod: /api/gauntlet"
          />
          <ConfigField
            label="api key"
            value={
              GAUNTLET_API_KEY_PRESENT ? (
                <Pill tone="ok">present</Pill>
              ) : (
                <Pill tone="ghost">none · open</Pill>
              )
            }
            sub="bearer · attached to every call when set"
          />
          <ConfigField
            label="set via"
            value={
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  background: "var(--bg-elevated)",
                  border: "var(--border-soft)",
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                VITE_GAUNTLET_API_BASE
              </code>
            }
            sub="default: /api/gauntlet (Vite proxy in dev, edge forwarder in prod)"
          />
        </div>
      </Panel>

      <Panel title="Theme" hint="local to this browser; persists in localStorage">
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: 4,
            background: "var(--bg-elevated)",
            borderRadius: 10,
            border: "var(--border-soft)",
            width: "fit-content",
          }}
        >
          {THEMES.map((t) => {
            const active = theme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 7,
                  border: "none",
                  background: active
                    ? "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg) 100%)"
                    : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active
                    ? "0 0 0 1px var(--border-color-mid), 0 4px 12px rgba(0,0,0,0.15)"
                    : "none",
                  transition: "all 200ms var(--motion-easing-out)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Composer hotkey" hint="lives in the browser extension manifest">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            border: "var(--border-soft)",
            borderRadius: 8,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <Kbd>Ctrl</Kbd>
            <span style={{ color: "var(--text-muted)" }}>+</span>
            <Kbd>Shift</Kbd>
            <span style={{ color: "var(--text-muted)" }}>+</span>
            <Kbd>Space</Kbd>
          </span>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            Change in{" "}
            <code style={inlineCode}>apps/browser-extension/wxt.config.ts</code> under{" "}
            <code style={inlineCode}>commands.summon-capsule.suggested_key</code>. Re-run{" "}
            <code style={inlineCode}>npm run build</code> after editing.
          </p>
        </div>
      </Panel>
    </>
  );
}

// ── Composer governance panel ──────────────────────────────────────────────

function ComposerGovernancePanel() {
  const [settings, setSettings] = useState<ComposerSettings>(DEFAULT_SETTINGS);
  const [original, setOriginal] = useState<ComposerSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gauntletFetch("/composer/settings");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as ComposerSettings;
      setSettings(body);
      setOriginal(body);
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await gauntletFetch("/composer/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as ComposerSettings;
      setSettings(body);
      setOriginal(body);
      setSavedAt(Date.now());
    } catch (err) {
      setError(isBackendUnreachable(err) ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(original),
    [settings, original],
  );

  return (
    <Panel
      title="Composer governance"
      hint={`backend · /composer/settings · saved ${
        original.updated_at
          ? new Date(original.updated_at).toLocaleString()
          : "never"
      }`}
    >
      {error && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
            border: "1px solid color-mix(in oklab, var(--cc-err) 28%, transparent)",
            color: "color-mix(in oklab, var(--cc-err) 86%, var(--text-primary))",
            fontFamily: "var(--mono)",
            fontSize: 12,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
          loading…
        </p>
      ) : (
        <>
          <SectionHeader text="defaults" hint="applied when no explicit per-domain or per-action override matches" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <PolicyCard
              label="default domain policy"
              policy={settings.default_domain_policy}
              onChange={(p) =>
                setSettings({ ...settings, default_domain_policy: p })
              }
            />
            <PolicyCard
              label="default action policy"
              policy={settings.default_action_policy}
              onChange={(p) =>
                setSettings({ ...settings, default_action_policy: p })
              }
            />
          </div>

          <SectionHeader
            text="domain matrix"
            hint="explicit per-host overrides; missing hosts inherit the default above"
          />
          <DomainMatrix
            domains={settings.domains}
            onChange={(d) => setSettings({ ...settings, domains: d })}
          />

          <SectionHeader
            text="action matrix"
            hint="overrides per DomAction.type — any action whose policy is allowed=false is dropped server-side"
          />
          <ActionMatrix
            actions={settings.actions}
            onChange={(a) => setSettings({ ...settings, actions: a })}
          />

          <SectionHeader text="caps" hint="hard limits applied at /composer/context intake" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <NumberField
              label="max_page_text_chars"
              value={settings.max_page_text_chars}
              min={500}
              max={50000}
              hint="page innerText cap (chars)"
              onChange={(v) =>
                setSettings({ ...settings, max_page_text_chars: v })
              }
            />
            <NumberField
              label="max_dom_skeleton_chars"
              value={settings.max_dom_skeleton_chars}
              min={500}
              max={20000}
              hint="dom_skeleton cap (chars)"
              onChange={(v) =>
                setSettings({ ...settings, max_dom_skeleton_chars: v })
              }
            />
          </div>

          <SectionHeader text="cápsula defaults" hint="boot-time toggles read by the cápsula on every summon" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <ToggleField
              label="screenshot_default"
              value={settings.screenshot_default}
              hint="cápsula attaches a viewport screenshot when no local override is set"
              onChange={(v) =>
                setSettings({ ...settings, screenshot_default: v })
              }
            />
            <ToggleField
              label="execution_reporting_required"
              value={settings.execution_reporting_required}
              hint="cápsula awaits /composer/execution; failure surfaces as inline error"
              onChange={(v) =>
                setSettings({ ...settings, execution_reporting_required: v })
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderTop: "var(--border-soft)",
              paddingTop: 14,
            }}
          >
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => void save()}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: dirty
                  ? "1px solid color-mix(in oklab, var(--ember) 50%, var(--border-color-mid))"
                  : "var(--border-soft)",
                background: dirty
                  ? "color-mix(in oklab, var(--ember) 10%, var(--bg-elevated))"
                  : "var(--bg-elevated)",
                color: dirty ? "var(--text-primary)" : "var(--text-muted)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                cursor: dirty && !saving ? "pointer" : "not-allowed",
                fontWeight: 600,
              }}
            >
              {saving ? "saving…" : dirty ? "save policy" : "saved"}
            </button>
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => setSettings(original)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "var(--border-soft)",
                background: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
                cursor: dirty && !saving ? "pointer" : "not-allowed",
              }}
            >
              revert
            </button>
            {savedAt && !dirty && !saving && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--cc-ok)",
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                }}
              >
                ✓ saved {new Date(savedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}

function SectionHeader({ text, hint }: { text: string; hint: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span className="gx-eyebrow">{text}</span>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.5,
        }}
      >
        {hint}
      </p>
    </div>
  );
}

function PolicyCard({
  label,
  policy,
  onChange,
}: {
  label: string;
  policy: DomainPolicy;
  onChange: (p: DomainPolicy) => void;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 10,
      }}
    >
      <span className="gx-eyebrow">{label}</span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 10,
        }}
      >
        <ToggleRow
          label="allowed"
          value={policy.allowed}
          onChange={(v) => onChange({ ...policy, allowed: v })}
        />
        <ToggleRow
          label="require_danger_ack"
          value={policy.require_danger_ack}
          onChange={(v) => onChange({ ...policy, require_danger_ack: v })}
        />
      </div>
    </div>
  );
}

function DomainMatrix({
  domains,
  onChange,
}: {
  domains: Record<string, DomainPolicy>;
  onChange: (d: Record<string, DomainPolicy>) => void;
}) {
  const [newHost, setNewHost] = useState("");
  const entries = Object.entries(domains);

  const addHost = () => {
    const host = newHost.trim().toLowerCase();
    if (!host || domains[host]) return;
    onChange({
      ...domains,
      [host]: { allowed: true, require_danger_ack: false },
    });
    setNewHost("");
  };

  const updateHost = (host: string, policy: DomainPolicy) => {
    onChange({ ...domains, [host]: policy });
  };

  const removeHost = (host: string) => {
    const next = { ...domains };
    delete next[host];
    onChange(next);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      {entries.length === 0 ? (
        <p
          style={{
            margin: "0 0 10px",
            color: "var(--text-muted)",
            fontSize: 12,
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          no domain overrides — all hosts inherit the default
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 10px",
            border: "var(--border-soft)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {entries.map(([host, policy], i) => (
            <li
              key={host}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderTop: i === 0 ? "none" : "var(--border-soft)",
                background: "var(--bg-elevated)",
              }}
            >
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={host}
              >
                {host}
              </code>
              <ToggleRow
                label="allowed"
                value={policy.allowed}
                onChange={(v) => updateHost(host, { ...policy, allowed: v })}
                compact
              />
              <ToggleRow
                label="ack"
                value={policy.require_danger_ack}
                onChange={(v) =>
                  updateHost(host, { ...policy, require_danger_ack: v })
                }
                compact
              />
              <button
                type="button"
                onClick={() => removeHost(host)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "var(--border-soft)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="github.com"
          value={newHost}
          onChange={(ev) => setNewHost(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              addHost();
            }
          }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            background: "var(--bg-input)",
            border: "var(--border-soft)",
            color: "var(--text-primary)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={addHost}
          disabled={!newHost.trim()}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "var(--border-soft)",
            background: "var(--bg-elevated)",
            color: newHost.trim() ? "var(--text-primary)" : "var(--text-muted)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            cursor: newHost.trim() ? "pointer" : "not-allowed",
          }}
        >
          add domain
        </button>
      </div>
    </div>
  );
}

function ActionMatrix({
  actions,
  onChange,
}: {
  actions: Record<string, ActionPolicy>;
  onChange: (a: Record<string, ActionPolicy>) => void;
}) {
  const updateAction = (type: ActionType, policy: ActionPolicy) => {
    onChange({ ...actions, [type]: policy });
  };

  const removeAction = (type: ActionType) => {
    const next = { ...actions };
    delete next[type];
    onChange(next);
  };

  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: "0 0 18px",
        border: "var(--border-soft)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {ACTION_TYPES.map((type, i) => {
        const override = actions[type];
        const policy = override ?? { allowed: true, require_danger_ack: false };
        return (
          <li
            key={type}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderTop: i === 0 ? "none" : "var(--border-soft)",
              background: "var(--bg-elevated)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 13,
                color: "var(--text-primary)",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {type}
              {!override && (
                <span
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    letterSpacing: "var(--track-meta)",
                    textTransform: "uppercase",
                  }}
                >
                  · inherits default
                </span>
              )}
            </span>
            <ToggleRow
              label="allowed"
              value={policy.allowed}
              onChange={(v) => updateAction(type, { ...policy, allowed: v })}
              compact
            />
            <ToggleRow
              label="ack"
              value={policy.require_danger_ack}
              onChange={(v) =>
                updateAction(type, { ...policy, require_danger_ack: v })
              }
              compact
            />
            {override ? (
              <button
                type="button"
                onClick={() => removeAction(type)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "var(--border-soft)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                clear
              </button>
            ) : (
              <span style={{ width: 80 }} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  compact,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--mono)",
        fontSize: compact ? 10 : 12,
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        color: "var(--text-secondary)",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(ev) => onChange(ev.target.checked)}
        style={{ accentColor: "var(--ember)" }}
      />
      <span>{label}</span>
    </label>
  );
}

function ToggleField({
  label,
  value,
  hint,
  onChange,
}: {
  label: string;
  value: boolean;
  hint: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "12px 14px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 10,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--mono)",
          fontSize: 12,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-primary)",
        }}
      >
        <input
          type="checkbox"
          checked={value}
          onChange={(ev) => onChange(ev.target.checked)}
          style={{ accentColor: "var(--ember)" }}
        />
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.5,
        }}
      >
        {hint}
      </span>
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  hint: string;
  onChange: (v: number) => void;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(ev) => {
          const n = Number(ev.target.value);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        style={{
          width: "100%",
          padding: "6px 10px",
          borderRadius: 6,
          background: "var(--bg-input)",
          border: "var(--border-soft)",
          color: "var(--text-primary)",
          fontFamily: "var(--mono)",
          fontSize: 13,
          outline: "none",
        }}
      />
      <span
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          lineHeight: 1.4,
        }}
      >
        range {min.toLocaleString()}–{max.toLocaleString()} · {hint}
      </span>
    </div>
  );
}

function ConfigField({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <span className="gx-eyebrow">{label}</span>
      <div style={{ minHeight: 22, display: "flex", alignItems: "center" }}>{value}</div>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 28,
        height: 26,
        padding: "0 8px",
        fontFamily: "var(--mono)",
        fontSize: 12,
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: 6,
        color: "var(--text-primary)",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {children}
    </span>
  );
}

const inlineCode: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 12,
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  padding: "1px 6px",
  borderRadius: 4,
  color: "var(--text-primary)",
};
