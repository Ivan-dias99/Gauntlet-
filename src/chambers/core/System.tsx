import { useState } from "react";
import {
  useTweaks, ACCENT_SWATCHES,
  type Theme, type Density, type Lang, type AccentKey,
} from "../../tweaks/TweaksContext";
import { useSpine } from "../../spine/SpineContext";
import { useDiagnostics } from "../../hooks/useDiagnostics";
import { useBackendStatus, type BackendReadiness } from "../../hooks/useBackendStatus";

// Core · System.
//
// Single home for system controls grouped into seven explicit sections:
//
//   1. Backend       — readiness, mode, uptime              (read-only)
//   2. Model         — model id, triad/judge temperature    (read-only)
//   3. Tools         — registered tools + gate state        (read-only)
//   4. Permissions   — code-exec gate truth                 (read-only)
//   5. Theme         — appearance / density / accent / lang (writable)
//   6. Persistence   — SQLite data dir + load errors        (read-only)
//   7. Deploy        — host / port / origins                (read-only)
//
// Read-only sections render with a "registry" sub-label so the operator
// always knows which sections accept input. Destructive controls (spine
// reset) sit at the bottom under a confirmation gate.

const READINESS_LABEL: Record<BackendReadiness, string> = {
  ready_real: "live",
  mock: "mock",
  degraded: "degraded",
  unreachable: "unreachable",
};

const READINESS_TONE: Record<BackendReadiness, "ok" | "warn"> = {
  ready_real: "ok",
  mock: "warn",
  degraded: "warn",
  unreachable: "warn",
};

export default function System() {
  const { values, set, reset } = useTweaks();
  const { resetAll } = useSpine();
  const diag = useDiagnostics();
  const backend = useBackendStatus();
  const [confirmReset, setConfirmReset] = useState(false);

  const data = diag.status === "ok" ? diag.data : null;
  const persistenceErrors = data
    ? Object.entries(data.persistence).filter(([, v]) => v) as Array<[string, string]>
    : [];

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">System</span>
        <span className="core-page-intro-sub">
          Controlos do sistema agrupados em sete secções. As marcadas como
          <code style={{
            margin: "0 4px",
            fontFamily: "var(--mono)", color: "var(--accent)",
          }}>registry</code>
          são read-only e refletem o estado real do backend.
        </span>
      </div>

      {diag.status === "loading" && <Note>diagnostics a carregar…</Note>}
      {diag.status === "unreachable" && (
        <Note tone="warn">
          backend inacessível — secções derivadas de /diagnostics ficam vazias.
        </Note>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {/* 1. Backend */}
        <Section title="Backend" sub="registry">
          <DiagRow
            k="readiness"
            v={READINESS_LABEL[backend.readiness]}
            tone={READINESS_TONE[backend.readiness]}
          />
          {backend.reasons.length > 0 && (
            <DiagRow k="reasons" v={backend.reasons.join(", ")} tone="warn" />
          )}
          <DiagRow
            k="engine"
            v={data?.engine_status ?? backend.engine ?? "—"}
            tone={(data?.engine_status ?? backend.engine) === "ready" ? "ok" : "warn"}
          />
          <DiagRow
            k="mode"
            v={data?.boot.mode ?? backend.mode ?? "—"}
            tone={(data?.boot.mode ?? backend.mode) === "real" ? "ok" : "warn"}
          />
          <DiagRow k="uptime" v={data ? `${data.boot.uptime_seconds}s` : "—"} />
        </Section>

        {/* 2. Model */}
        <Section title="Model" sub="registry">
          <DiagRow k="model" v={data?.model ?? "—"} />
          <DiagRow
            k="triad"
            v={data ? `${data.triad_count} × ${data.triad_temperature}` : "—"}
          />
          <DiagRow k="judge T°" v={data ? String(data.judge_temperature) : "—"} />
          <DiagRow
            k="API key"
            v={
              data
                ? data.boot.anthropic_api_key_present
                  ? "present"
                  : "missing"
                : "—"
            }
            tone={data?.boot.anthropic_api_key_present ? "ok" : "warn"}
          />
        </Section>

        {/* 3. Tools */}
        <Section title="Tools" sub="registry">
          <DiagRow k="registered" v={data ? String(data.tools.length) : "—"} />
          <DiagRow
            k="gated"
            v={
              data
                ? String(data.tools.filter((t) => t.gated).length)
                : "—"
            }
          />
          <DiagRow
            k="network"
            v={
              data
                ? String(data.tools.filter((t) => t.kind === "network").length)
                : "—"
            }
          />
          {data && (
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--text-muted)",
                paddingTop: 6,
                borderTop: "1px solid var(--border-color-soft)",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {data.tools.map((t) => t.name).join(" · ")}
            </div>
          )}
        </Section>

        {/* 4. Permissions */}
        <Section title="Permissions" sub="registry">
          <DiagRow
            k="SIGNAL_ALLOW_CODE_EXEC"
            v={
              data
                ? data.boot.allow_code_exec
                  ? "true"
                  : "false"
                : "—"
            }
            tone={data?.boot.allow_code_exec ? "warn" : "ok"}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            Quando false, run_command (gated) e execute_python recusam invocação
            independentemente do allowlist da chamber.
          </p>
        </Section>

        {/* 5. Theme — the only writable section */}
        <Section title="Theme" sub="writable">
          <Label>Aparência</Label>
          <Segmented<Theme>
            value={values.theme}
            options={[["dark", "Dark"], ["light", "Light"], ["sepia", "Sepia"]]}
            onChange={(v) => set("theme", v)}
          />
          <Label>Densidade</Label>
          <Segmented<Density>
            value={values.density}
            options={[["compact", "Compact"], ["comfortable", "Comfortable"], ["spacious", "Spacious"]]}
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
                    width: 26, height: 26, borderRadius: "var(--radius-pill)",
                    background: s.color,
                    border: active
                      ? "2px solid var(--text-primary)"
                      : "1px solid var(--border-color-mid)",
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </div>
          <Label>Idioma</Label>
          <Segmented<Lang>
            value={values.lang}
            options={[["pt", "Português"], ["en", "English"]]}
            onChange={(v) => set("lang", v)}
          />
          <button
            onClick={() => reset()}
            style={ghostButton()}
          >
            Repor aparência
          </button>
        </Section>

        {/* 6. Persistence */}
        <Section title="Persistence" sub="registry">
          <DiagRow
            k="data dir"
            v={data?.boot.data_dir ?? "—"}
          />
          <DiagRow
            k="failure memory"
            v={data ? `${data.failure_memory.total_records} records` : "—"}
          />
          <DiagRow
            k="degraded"
            v={persistenceErrors.length > 0 ? "yes" : "no"}
            tone={persistenceErrors.length > 0 ? "warn" : "ok"}
          />
          {persistenceErrors.length > 0 && (
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--cc-warn)",
                paddingTop: 6,
                borderTop: "1px solid var(--border-color-soft)",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {persistenceErrors.map(([k, v]) => (
                <div key={k}>
                  {k}: {v}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* 7. Deploy */}
        <Section title="Deploy" sub="registry">
          <DiagRow k="host" v={data ? `${data.boot.host}:${data.boot.port}` : "—"} />
          <DiagRow
            k="origins"
            v={
              data
                ? data.boot.allowed_origins.length
                  ? data.boot.allowed_origins.join(", ")
                  : "—"
                : "—"
            }
          />
          <DiagRow
            k="started"
            v={data ? new Date(data.boot.start_iso).toLocaleString([], {
              day: "2-digit", month: "2-digit",
              hour: "2-digit", minute: "2-digit",
            }) : "—"}
          />
        </Section>
      </div>

      {/* Destructive — outside the grid, full width */}
      <section
        className="panel"
        data-rank="primary"
        style={{
          marginTop: "var(--space-3)",
          borderColor: "color-mix(in oklab, var(--cc-err) 20%, transparent)",
        }}
      >
        <div className="panel-head">
          <span className="panel-title">Reset spine</span>
          <span className="panel-sub" style={{ color: "var(--cc-err)" }}>
            destrutivo
          </span>
        </div>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            style={ghostButton("var(--cc-err)")}
          >
            Repor spine…
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--cc-err)",
              }}
            >
              apaga missões, princípios, tarefas
            </span>
            <button
              onClick={() => { resetAll(); setConfirmReset(false); }}
              style={filledButton("var(--cc-err)")}
            >
              confirmar
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              style={ghostButton()}
            >
              cancelar
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Primitives ──────────────────────────────────────────────────────────────

function Section({
  title, sub, children,
}: {
  title: string;
  sub?: "writable" | "registry";
  children: React.ReactNode;
}) {
  return (
    <section className="panel" data-rank="primary">
      <div className="panel-head">
        <span className="panel-title">{title}</span>
        {sub && (
          <span
            className="panel-sub"
            data-system-section-mode={sub}
            style={{
              color: sub === "writable" ? "var(--accent)" : "var(--text-ghost)",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              textTransform: "uppercase",
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
  return <span className="kicker">{children}</span>;
}

function DiagRow({ k, v, tone }: { k: string; v: string; tone?: "ok" | "warn" }) {
  return (
    <div className="diagnostic-row">
      <span className="diagnostic-row-key">{k}</span>
      <span className="diagnostic-row-value" data-tone={tone}>
        {v}
      </span>
    </div>
  );
}

function Note({
  children, tone,
}: {
  children: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <div
      style={{
        fontFamily: "var(--mono)",
        fontSize: "var(--t-body-sec)",
        color: tone === "warn" ? "var(--cc-warn)" : "var(--text-muted)",
        padding: "8px 10px",
        marginBottom: "var(--space-3)",
        border: tone === "warn"
          ? "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)"
          : "var(--border-soft)",
        borderRadius: "var(--radius-control)",
      }}
    >
      {children}
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

function ghostButton(color: string = "var(--text-muted)"): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: "var(--t-meta)",
    letterSpacing: "var(--track-meta)",
    textTransform: "uppercase",
    padding: "8px 14px",
    background: "transparent",
    color,
    border: `1px solid ${color}`,
    borderRadius: "var(--radius-control)",
    cursor: "pointer",
  };
}

function filledButton(color: string): React.CSSProperties {
  return {
    fontFamily: "var(--mono)",
    fontSize: "var(--t-meta)",
    letterSpacing: "var(--track-meta)",
    textTransform: "uppercase",
    padding: "8px 14px",
    background: color,
    color: "var(--bg)",
    border: `1px solid ${color}`,
    borderRadius: "var(--radius-control)",
    cursor: "pointer",
  };
}
