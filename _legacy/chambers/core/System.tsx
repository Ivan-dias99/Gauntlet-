import { useEffect, useState } from "react";
import { useTweaks, ACCENT_SWATCHES, type Theme, type Density, type Lang, type AccentKey } from "../../tweaks/TweaksContext";
import { useSpine } from "../../spine/SpineContext";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";
import { Stagger } from "../../lib/motion";
import ConnectorStatusPanel from "./ConnectorStatusPanel";
import ObservabilityPanel from "./ObservabilityPanel";
import SpineSnapshotPanel from "./SpineSnapshotPanel";

// System tab — theme/density/lang/accent + backend diagnostics snapshot
// + destructive actions. Built on the shared .panel + .diagnostic-row
// primitives so every tab in Core reads with the same maturity level.

interface Diagnostics {
  system: string;
  model: string;
  triad_temperature: number;
  judge_temperature: number;
  triad_count: number;
  engine_status: string;
  boot: {
    mode: "mock" | "real";
    uptime_seconds: number;
    anthropic_api_key_present: boolean;
    allowed_origins: string[];
  };
  persistence: Record<string, string | null>;
  doctrine: string;
}

export default function System() {
  const { values, set, reset } = useTweaks();
  const { resetAll } = useSpine();
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [diagErr, setDiagErr] = useState<string | null>(null);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoadingDiag(true);
    signalFetch("/diagnostics")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`diag ${r.status}`)))
      .then((body) => {
        if (!alive) return;
        setDiag(body as Diagnostics);
        setDiagErr(null);
      })
      .catch((e) => {
        if (!alive) return;
        if (isBackendUnreachable(e)) {
          setDiagErr("backend inacessível");
        } else {
          setDiagErr(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => alive && setLoadingDiag(false));
    return () => { alive = false; };
  }, []);

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">System</span>
        <span className="core-page-intro-sub">
          Aparência, idioma, diagnósticos em tempo real e acções destrutivas.
          Tudo o que controla como Signal se apresenta e como comunica.
        </span>
      </div>
      {/* Wave P-34 — staggered panel mount entry.
          The three diagnostic panels each carry .motion-fade-up via
          the Stagger wrapper (40ms step). The panels themselves
          rely on their existing .panel chrome; we only inject the
          animation-delay so they cascade in sequence rather than
          all popping at once. */}
      <Stagger step={40}>
        <div className="motion-fade-up"><ConnectorStatusPanel /></div>
        <div className="motion-fade-up"><ObservabilityPanel /></div>
        <div className="motion-fade-up"><SpineSnapshotPanel /></div>
      </Stagger>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
      {/* Appearance */}
      <Section title="Appearance">
        <Label>Theme</Label>
        <Segmented<Theme>
          value={values.theme}
          options={[["dark","Dark"],["light","Light"],["sepia","Sepia"]]}
          onChange={(v) => set("theme", v)}
        />
        <Label>Density</Label>
        <Segmented<Density>
          value={values.density}
          options={[["cosy","Cosy"],["comfortable","Comfortable"],["compact","Compact"]]}
          onChange={(v) => set("density", v)}
        />
        <Label>Accent</Label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ACCENT_SWATCHES.map((s) => {
            const active = s.key === values.accent;
            return (
              <button
                key={s.key}
                onClick={() => set("accent", s.key as AccentKey)}
                aria-pressed={active}
                title={s.key}
                style={{
                  width: 28, height: 28, borderRadius: "var(--radius-pill)",
                  background: s.color,
                  border: active ? "2px solid var(--text-primary)" : "1px solid var(--border-color-mid)",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      </Section>

      {/* Language */}
      <Section title="Language">
        <Segmented<Lang>
          value={values.lang}
          options={[["pt","Português"],["en","English"]]}
          onChange={(v) => set("lang", v)}
        />
      </Section>

      {/* Diagnostics */}
      <Section title="Diagnostics" sub="/diagnostics snapshot">
        {loadingDiag && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="status-dot" data-tone="info" data-pulse="true" />
            <span className="kicker" data-tone="ghost">a ler…</span>
          </div>
        )}
        {diagErr && (
          <span className="state-pill" data-tone="err">
            <span className="state-pill-dot" />
            {diagErr}
          </span>
        )}
        {diag && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <DiagRow k="mode" v={diag.boot.mode} tone={diag.boot.mode === "mock" ? "warn" : "ok"} />
            <DiagRow k="engine" v={diag.engine_status} tone={diag.engine_status === "ready" ? "ok" : "warn"} />
            <DiagRow k="model" v={diag.model} />
            <DiagRow k="triad" v={`${diag.triad_count} × ${diag.triad_temperature}`} />
            <DiagRow k="judge T°" v={String(diag.judge_temperature)} />
            <DiagRow
              k="API key"
              v={diag.boot.anthropic_api_key_present ? "present" : "missing"}
              tone={diag.boot.anthropic_api_key_present ? "ok" : "warn"}
            />
            <DiagRow k="uptime" v={`${diag.boot.uptime_seconds}s`} />
          </div>
        )}
      </Section>

      {/* Destructive */}
      <Section title="Reset" sub="destrutivo">
        <button onClick={() => reset()} style={buttonStyle("var(--text-muted)")}>
          Repor aparência
        </button>
        <div style={{ height: 6 }} />
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={buttonStyle("var(--cc-err)")}
          >
            Repor spine…
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="kicker" data-tone="err">
              apaga missões, princípios, tarefas
            </span>
            <button
              onClick={() => { resetAll(); setConfirmReset(false); }}
              style={buttonStyle("var(--cc-err)", true)}
            >
              confirmar
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              style={buttonStyle("var(--text-muted)")}
            >
              cancelar
            </button>
          </div>
        )}
      </Section>
      </div>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="panel" data-rank="primary">
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        {sub && <span className="panel-sub">{sub}</span>}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="kicker">{children}</span>;
}

function DiagRow({ k, v, tone }: { k: string; v: string; tone?: "ok" | "warn" }) {
  return (
    <div className="diagnostic-row">
      <span className="diagnostic-row-key">{k}</span>
      <span className="diagnostic-row-value" data-tone={tone}>{v}</span>
    </div>
  );
}

interface SegmentedProps<V extends string> {
  value: V;
  options: Array<[V, string]>;
  onChange: (v: V) => void;
}

function Segmented<V extends string>({ value, options, onChange }: SegmentedProps<V>) {
  return (
    <div
      role="tablist"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, 1fr)`,
        border: "var(--border-mid)",
        borderRadius: "var(--radius-control)",
        padding: 2,
        background: "var(--bg-input)",
      }}
    >
      {options.map(([v, label]) => {
        const active = v === value;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v)}
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              padding: "6px 8px",
              background: active ? "var(--bg-elevated)" : "transparent",
              color: active ? "var(--text-primary)" : "var(--text-muted)",
              border: active ? "var(--border-soft)" : "1px solid transparent",
              borderRadius: "calc(var(--radius-control) - 2px)",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function buttonStyle(color: string, filled = false): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: "var(--t-meta)",
    letterSpacing: "var(--track-meta)",
    textTransform: "uppercase",
    padding: "8px 14px",
    background: filled ? color : "transparent",
    color: filled ? "var(--bg)" : color,
    border: `1px solid ${color}`,
    borderRadius: "var(--radius-control)",
    cursor: "pointer",
  };
}
