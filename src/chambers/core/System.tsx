import { useEffect, useState } from "react";
import { useTweaks, ACCENT_SWATCHES, type Theme, type Density, type Lang, type AccentKey } from "../../tweaks/TweaksContext";
import { useSpine } from "../../spine/SpineContext";
import { signalFetch, isBackendUnreachable } from "../../lib/signalApi";

// Wave-4 System tab — absorbs the old TweaksPanel controls (theme,
// density, lang, accent) and adds a diagnostics snapshot fetched from
// the backend. Reset-spine stays a destructive action behind an
// explicit confirm. No other controls — Core must not become a drawer.

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
    <div
      style={{
        padding: "var(--space-4)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-3)",
        maxWidth: 1100,
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
          options={[["compact","Compact"],["comfortable","Comfortable"],["spacious","Spacious"]]}
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
        {loadingDiag && <Muted>a ler…</Muted>}
        {diagErr && <Muted tone="err">{diagErr}</Muted>}
        {diag && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "var(--t-body-sec)" }}>
            <Row k="mode" v={diag.boot.mode} tone={diag.boot.mode === "mock" ? "warn" : "ok"} />
            <Row k="engine" v={diag.engine_status} tone={diag.engine_status === "ready" ? "ok" : "warn"} />
            <Row k="model" v={diag.model} />
            <Row k="triad" v={`${diag.triad_count} × ${diag.triad_temperature}`} />
            <Row k="judge T°" v={String(diag.judge_temperature)} />
            <Row k="API key" v={diag.boot.anthropic_api_key_present ? "present" : "missing"}
                 tone={diag.boot.anthropic_api_key_present ? "ok" : "warn"} />
            <Row k="uptime" v={`${diag.boot.uptime_seconds}s`} />
          </div>
        )}
      </Section>

      {/* Destructive */}
      <Section title="Reset" sub="destrutivo">
        <button
          onClick={() => reset()}
          style={buttonStyle("var(--text-muted)")}
        >
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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "var(--t-meta)", color: "var(--cc-err)" }}>
              apaga missões, princípios, tarefas
            </span>
            <button
              onClick={() => { resetAll(); setConfirmReset(false); }}
              style={buttonStyle("var(--cc-err)", true)}
            >
              confirmar
            </button>
            <button onClick={() => setConfirmReset(false)} style={buttonStyle("var(--text-muted)")}>
              cancelar
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "var(--border-soft)",
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-3)",
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--text-primary)" }}>
          {title}
        </span>
        {sub && (
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
              color: "var(--text-ghost)",
              marginLeft: "auto",
            }}
          >
            {sub}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-micro)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
      }}
    >
      {children}
    </span>
  );
}

function Muted({ children, tone }: { children: React.ReactNode; tone?: "err" }) {
  return (
    <span
      style={{
        fontSize: "var(--t-body-sec)",
        color: tone === "err" ? "var(--cc-err)" : "var(--text-muted)",
        fontFamily: "var(--mono)",
      }}
    >
      {children}
    </span>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "ok" | "warn" }) {
  const color =
    tone === "ok" ? "var(--terminal-ok)" :
    tone === "warn" ? "var(--cc-warn)" :
    "var(--text-primary)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(70px, 90px) 1fr", gap: 10, alignItems: "baseline" }}>
      <code style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-muted)" }}>{k}</code>
      <span style={{ color }}>{v}</span>
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
