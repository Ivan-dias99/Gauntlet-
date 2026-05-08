import { useCallback, useEffect, useMemo, useState } from "react";
import {
  isBackendUnreachable,
  gauntletFetch,
} from "../lib/gauntletApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

// Sprint 5 — Tool / Plugin Runtime ------------------------------------------
//
// Replaces the Wave-V0 read-only matrix with a live binding against
// /tools/manifests and /composer/settings.tool_policies. Operator can
// flip allowed / require_approval per tool; both are honoured by the
// agent loop's dispatcher — allowed=false strips the tool from the
// model schema and the dispatch path, require_approval=true gates the
// dispatch with an [approval_required] envelope until the call carries
// approved=true (or GAUNTLET_AUTO_APPROVE=1 is set on a trusted deploy).

interface ToolManifest {
  name: string;
  description: string;
  mode: "read" | "draft" | "preview" | "execute_with_approval" | string;
  risk: "low" | "medium" | "high" | string;
  version: string;
  scopes: string[];
  rollback_policy: string;
  timeout_s: number;
}

interface ManifestsResponse {
  tools: ToolManifest[];
}

interface ToolPolicy {
  allowed: boolean;
  require_approval: boolean;
}

interface ComposerSettings {
  domains: Record<string, unknown>;
  actions: Record<string, unknown>;
  default_domain_policy: unknown;
  default_action_policy: unknown;
  tool_policies: Record<string, ToolPolicy>;
  max_page_text_chars: number;
  max_dom_skeleton_chars: number;
  screenshot_default: boolean;
  execution_reporting_required: boolean;
  updated_at: string;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; manifests: ToolManifest[]; settings: ComposerSettings }
  | { kind: "error"; message: string };

const MODE_TONE: Record<string, "ok" | "warn" | "neutral" | "ghost"> = {
  read: "ok",
  preview: "ok",
  draft: "neutral",
  execute_with_approval: "warn",
};

const RISK_TONE: Record<string, "ok" | "warn" | "neutral"> = {
  low: "ok",
  medium: "neutral",
  high: "warn",
};

export default function PermissionsPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [draftPolicies, setDraftPolicies] = useState<
    Record<string, ToolPolicy>
  >({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const [manifestsRes, settingsRes] = await Promise.all([
        gauntletFetch("/tools/manifests"),
        gauntletFetch("/composer/settings"),
      ]);
      if (!manifestsRes.ok) throw new Error(`manifests HTTP ${manifestsRes.status}`);
      if (!settingsRes.ok) throw new Error(`settings HTTP ${settingsRes.status}`);
      const manifests = ((await manifestsRes.json()) as ManifestsResponse).tools;
      const settings = (await settingsRes.json()) as ComposerSettings;
      setState({ kind: "ready", manifests, settings });
      setDraftPolicies({ ...settings.tool_policies });
    } catch (err) {
      setState({
        kind: "error",
        message: isBackendUnreachable(err) ? err.message : String(err),
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(() => {
    if (state.kind !== "ready") return false;
    return (
      JSON.stringify(draftPolicies) !==
      JSON.stringify(state.settings.tool_policies)
    );
  }, [state, draftPolicies]);

  const setPolicy = (name: string, policy: ToolPolicy) => {
    setDraftPolicies((prev) => ({ ...prev, [name]: policy }));
  };

  const clearPolicy = (name: string) => {
    setDraftPolicies((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const save = async () => {
    if (state.kind !== "ready") return;
    setSaving(true);
    try {
      const next: ComposerSettings = {
        ...state.settings,
        tool_policies: draftPolicies,
      };
      const res = await gauntletFetch("/composer/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = (await res.json()) as ComposerSettings;
      setState({ ...state, settings: saved });
      setDraftPolicies({ ...saved.tool_policies });
      setSavedAt(Date.now());
    } catch (err) {
      setState({
        kind: "error",
        message: isBackendUnreachable(err) ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SurfaceHeader
        eyebrow="Permissions"
        title="Tool · plugin · scope matrix"
        subtitle="Live binding to /tools/manifests + /composer/settings.tool_policies. Operator opts out per-tool; the agent loop honours allow=false on the next call."
        actions={
          <button
            type="button"
            onClick={() => void load()}
            style={refreshButtonStyle}
          >
            ↻ reload
          </button>
        }
      />

      {state.kind === "loading" && (
        <Panel>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              fontFamily: "var(--mono)",
              margin: 0,
            }}
          >
            loading manifests…
          </p>
        </Panel>
      )}

      {state.kind === "error" && (
        <Panel>
          <div style={errorBoxStyle}>{state.message}</div>
          <button
            type="button"
            onClick={() => void load()}
            style={{ ...refreshButtonStyle, marginTop: 12 }}
          >
            retry
          </button>
        </Panel>
      )}

      {state.kind === "ready" && (
        <ToolMatrix
          manifests={state.manifests}
          policies={draftPolicies}
          dirty={dirty}
          saving={saving}
          savedAt={savedAt}
          onPolicy={setPolicy}
          onClear={clearPolicy}
          onSave={() => void save()}
          onRevert={() => setDraftPolicies({ ...state.settings.tool_policies })}
        />
      )}
    </>
  );
}

function ToolMatrix({
  manifests,
  policies,
  dirty,
  saving,
  savedAt,
  onPolicy,
  onClear,
  onSave,
  onRevert,
}: {
  manifests: ToolManifest[];
  policies: Record<string, ToolPolicy>;
  dirty: boolean;
  saving: boolean;
  savedAt: number | null;
  onPolicy: (name: string, p: ToolPolicy) => void;
  onClear: (name: string) => void;
  onSave: () => void;
  onRevert: () => void;
}) {
  const allowed = manifests.filter((m) => {
    const policy = policies[m.name];
    return policy?.allowed !== false;
  }).length;
  const declined = manifests.length - allowed;

  return (
    <>
      <section
        className="gx-card"
        data-tone="hero"
        style={{
          marginBottom: 18,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 240 }}>
          <span className="gx-eyebrow">surface · tool runtime</span>
          <h2
            style={{
              margin: "8px 0 6px",
              fontFamily: "var(--serif)",
              fontWeight: 400,
              fontSize: 22,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
            }}
          >
            {allowed} of {manifests.length} tools live
          </h2>
          <p
            style={{
              margin: 0,
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.55,
              maxWidth: 560,
            }}
          >
            Each row is a registered tool with its declared mode + risk. Flip{" "}
            <code style={inlineCode}>allowed</code> to remove it from the
            agent's schema on the next call. <code style={inlineCode}>require_approval</code>{" "}
            is recorded but only enforced from Sprint 7 onward.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
          <SummaryStat label="tools" value={String(manifests.length)} />
          <SummaryStat label="live" value={String(allowed)} tone="ok" />
          <SummaryStat label="declined" value={String(declined)} tone="warn" />
        </div>
      </section>

      <Panel title="Tool matrix" hint="from /tools/manifests · binding /composer/settings.tool_policies">
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "var(--border-soft)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {manifests.map((m, i) => {
            const policy = policies[m.name];
            const effectiveAllowed = policy?.allowed ?? true;
            const effectiveApproval = policy?.require_approval ?? false;
            const overridden = policy !== undefined;
            return (
              <li
                key={m.name}
                style={{
                  borderTop: i === 0 ? "none" : "var(--border-soft)",
                  background: effectiveAllowed
                    ? "var(--bg-elevated)"
                    : "color-mix(in oklab, var(--cc-warn) 6%, var(--bg-elevated))",
                  padding: "14px 16px",
                }}
              >
                <header
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      letterSpacing: "var(--track-meta)",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.name}
                  </span>
                  <Pill tone={MODE_TONE[m.mode] ?? "ghost"}>{m.mode}</Pill>
                  <Pill tone={RISK_TONE[m.risk] ?? "ghost"}>risk · {m.risk}</Pill>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    v{m.version}
                  </span>
                  {overridden && <Pill tone="ghost">overridden</Pill>}
                  <span style={{ flex: 1 }} />
                  <ToggleChip
                    label="allowed"
                    value={effectiveAllowed}
                    onChange={(v) =>
                      onPolicy(m.name, {
                        allowed: v,
                        require_approval: effectiveApproval,
                      })
                    }
                  />
                  <ToggleChip
                    label="require_approval"
                    value={effectiveApproval}
                    onChange={(v) =>
                      onPolicy(m.name, {
                        allowed: effectiveAllowed,
                        require_approval: v,
                      })
                    }
                    title="when on, the agent must call with approved=true; GAUNTLET_AUTO_APPROVE=1 bypasses on trusted deploys"
                  />
                  {overridden && (
                    <button
                      type="button"
                      onClick={() => onClear(m.name)}
                      style={mutedButtonStyle}
                    >
                      clear
                    </button>
                  )}
                </header>
                <p
                  style={{
                    margin: "8px 0 6px",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.55,
                  }}
                >
                  {m.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    fontSize: 11,
                    fontFamily: "var(--mono)",
                    color: "var(--text-muted)",
                  }}
                >
                  {m.scopes.length === 0 ? (
                    <span>scopes: —</span>
                  ) : (
                    <span>scopes: {m.scopes.join(" · ")}</span>
                  )}
                  <span>·</span>
                  <span>timeout: {m.timeout_s}s</span>
                  <span>·</span>
                  <span title="rollback policy">rollback: {m.rollback_policy}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 14,
            paddingTop: 12,
            borderTop: "var(--border-soft)",
          }}
        >
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={onSave}
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
            onClick={onRevert}
            style={mutedButtonStyle}
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
      </Panel>
    </>
  );
}

function ToggleChip({
  label,
  value,
  onChange,
  disabled,
  title,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <label
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        border: value
          ? "1px solid color-mix(in oklab, var(--cc-ok) 35%, var(--border-color-soft))"
          : "var(--border-soft)",
        background: value
          ? "color-mix(in oklab, var(--cc-ok) 8%, transparent)"
          : "var(--bg-surface)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-meta)",
        textTransform: "uppercase",
        color: disabled ? "var(--text-muted)" : "var(--text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(ev) => onChange(ev.target.checked)}
        style={{ accentColor: "var(--ember)" }}
      />
      <span>{label}</span>
    </label>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn";
}) {
  const accent =
    tone === "ok"
      ? "var(--cc-ok)"
      : tone === "warn"
      ? "var(--cc-warn)"
      : "var(--text-primary)";
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        textAlign: "center",
        minWidth: 86,
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: 22,
          color: accent,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const refreshButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "var(--border-soft)",
  background: "var(--bg-elevated)",
  color: "var(--text-primary)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
};

const mutedButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "var(--border-soft)",
  background: "transparent",
  color: "var(--text-muted)",
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "var(--track-meta)",
  textTransform: "uppercase",
  cursor: "pointer",
};

const errorBoxStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 6,
  background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
  border: "1px solid color-mix(in oklab, var(--cc-err) 28%, transparent)",
  color: "color-mix(in oklab, var(--cc-err) 86%, var(--text-primary))",
  fontFamily: "var(--mono)",
  fontSize: 12,
};

const inlineCode: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  background: "var(--bg-elevated)",
  border: "var(--border-soft)",
  padding: "1px 6px",
  borderRadius: 4,
};
