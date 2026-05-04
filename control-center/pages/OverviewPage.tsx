import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

interface BootSummary {
  start_iso?: string;
  uptime_seconds?: number;
  mode?: string;
  anthropic_api_key_present?: boolean;
  groq_api_key_present?: boolean;
  gemini_api_key_present?: boolean;
  groq_model?: string | null;
  gemini_model?: string | null;
  active_provider?: "anthropic" | "groq" | "gemini" | "mock" | "none" | string;
  data_dir?: string;
  persistence_ephemeral?: boolean;
  host?: string;
  port?: number;
}

interface FailureSummary {
  total_records?: number;
  total_failures?: number;
}

interface Diagnostics {
  system?: string;
  model?: string;
  engine_status?: string;
  boot?: BootSummary;
  failure_memory?: FailureSummary;
  security?: { auth_required?: boolean; rate_limit_enabled?: boolean };
}

export default function OverviewPage() {
  const status = useBackendStatus();
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await signalFetch("/diagnostics");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Diagnostics;
        if (!cancelled) setDiag(data);
      } catch (err) {
        if (cancelled) return;
        setError(isBackendUnreachable(err) ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const tone = !status.reachable
    ? "err"
    : status.readiness === "degraded"
    ? "warn"
    : "ok";
  const headline = !status.reachable
    ? "Backend unreachable."
    : status.readiness === "degraded"
    ? "Backend degraded."
    : "Backend ready.";

  return (
    <>
      <SurfaceHeader
        eyebrow="Overview"
        title="System cockpit"
        subtitle="Quick read on the brain's health. Switch to Ledger or Memory for the full story."
      />

      {/* Hero status */}
      <section
        className="gx-card"
        data-tone="hero"
        style={{
          marginBottom: 18,
          padding: "26px 28px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <span className="gx-eyebrow">brain · live</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <span className="gx-dot" data-tone={tone} aria-hidden style={{ width: 12, height: 12 }} />
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--serif)",
                fontWeight: 400,
                fontSize: 30,
                letterSpacing: "-0.015em",
                lineHeight: 1.05,
                color: "var(--text-primary)",
              }}
            >
              {headline}
            </h2>
          </div>
          <p
            style={{
              margin: "10px 0 0 24px",
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.55,
              maxWidth: 540,
            }}
          >
            {status.reachable
              ? `mode: ${status.mode ?? "—"} · engine: ${status.engine ?? "—"} · readiness: ${status.readiness}`
              : status.unreachableReason ?? "edge proxy could not reach the backend."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <MetricTile
            label="reachable"
            value={status.reachable ? "TRUE" : "FALSE"}
            tone={status.reachable ? "ok" : "err"}
          />
          <MetricTile
            label="persistence"
            value={
              status.persistenceEphemeral
                ? "EPHEMERAL"
                : status.persistenceDegraded
                ? "DEGRADED"
                : "DURABLE"
            }
            tone={status.persistenceEphemeral || status.persistenceDegraded ? "warn" : "ok"}
          />
          <MetricTile label="mode" value={(status.mode ?? "?").toUpperCase()} />
          <MetricTile label="engine" value={(status.engine ?? "?").toUpperCase()} />
        </div>
      </section>

      {/* Process diagnostics */}
      <Panel title="Process" hint="from /diagnostics — full boot snapshot">
        {error ? (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 8,
              background: "color-mix(in oklab, var(--cc-err) 8%, transparent)",
              border: "1px solid color-mix(in oklab, var(--cc-err) 30%, transparent)",
              color: "color-mix(in oklab, var(--cc-err) 86%, var(--text-primary))",
              fontSize: 12,
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: "var(--mono)",
                fontWeight: 700,
                background: "color-mix(in oklab, var(--cc-err) 18%, transparent)",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 10,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
              }}
            >
              error
            </span>
            <span style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.5 }}>
              {error}
            </span>
          </div>
        ) : diag ? (
          <DiagGrid diag={diag} />
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: 12, fontFamily: "var(--mono)" }}>
            loading…
          </p>
        )}
      </Panel>

      {/* Composer surface — how the operator reaches the brain */}
      <Panel title="Composer surface" hint="how the operator reaches the brain">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <SurfaceTile
            kicker="capsule"
            label="apps/browser-extension"
            sub="WXT · Manifest V3"
          />
          <SurfaceTile
            kicker="hotkey"
            label="Alt + Space"
            sub="any page · global"
          />
          <SurfaceTile
            kicker="routes"
            label="/composer/{4}"
            sub="context · intent · preview · apply"
          />
        </div>
      </Panel>
    </>
  );
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "err";
}) {
  const accent =
    tone === "ok"
      ? "var(--cc-ok)"
      : tone === "warn"
      ? "var(--cc-warn)"
      : tone === "err"
      ? "var(--cc-err)"
      : "var(--text-primary)";
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 10,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: 0.02,
          color: accent,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SurfaceTile({
  kicker,
  label,
  sub,
}: {
  kicker: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="gx-tile">
      <span className="gx-eyebrow">{kicker}</span>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 14,
          color: "var(--text-primary)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function DiagGrid({ diag }: { diag: Diagnostics }) {
  // Provider activo: o backend já calcula em /diagnostics (server.py
  // active_provider field). Caímos para inferência local — pela mesma
  // ordem de prioridade do engine (Anthropic > Groq > Gemini > mock) —
  // só quando o deploy ainda é antigo e o campo não existe.
  const provider =
    diag.boot?.active_provider ??
    (diag.boot?.anthropic_api_key_present
      ? "anthropic"
      : diag.boot?.groq_api_key_present
      ? "groq"
      : diag.boot?.gemini_api_key_present
      ? "gemini"
      : "mock");
  // For non-Anthropic providers the gateway echoes back its requested
  // model id (claude-sonnet-4-6) on the response, so we prefer the
  // provider-specific model id from /diagnostics when available.
  const realModel =
    provider === "groq"
      ? diag.boot?.groq_model ?? "groq"
      : provider === "gemini"
      ? diag.boot?.gemini_model ?? "gemini"
      : diag.model ?? "—";
  // Catch-all renders "mock only" only when no provider is active. An
  // unknown provider name (a forward-compat case for newer backends)
  // is shown as live with its raw label rather than falsely warning.
  const providerPill =
    provider === "anthropic" ? (
      <Pill tone="ok">anthropic · live</Pill>
    ) : provider === "groq" ? (
      <Pill tone="ok">groq · live</Pill>
    ) : provider === "gemini" ? (
      <Pill tone="ok">gemini · live</Pill>
    ) : provider === "mock" || provider === "none" ? (
      <Pill tone="warn">mock only</Pill>
    ) : (
      <Pill tone="ok">{`${provider} · live`}</Pill>
    );

  const rows: Array<[string, React.ReactNode]> = [
    ["system", diag.system ?? "—"],
    ["provider", providerPill],
    ["active model", <code style={{ fontFamily: "var(--mono)" }}>{realModel}</code>],
    ["engine_status", diag.engine_status ?? "—"],
    ["uptime_s", String(diag.boot?.uptime_seconds ?? "—")],
    ["started", diag.boot?.start_iso ?? "—"],
    ["mode", diag.boot?.mode ?? "—"],
    [
      "ephemeral disk",
      diag.boot?.persistence_ephemeral ? (
        <Pill tone="warn">true</Pill>
      ) : (
        <Pill tone="ok">false</Pill>
      ),
    ],
    [
      "auth required",
      diag.security?.auth_required ? (
        <Pill tone="ok">yes</Pill>
      ) : (
        <Pill tone="ghost">no · open</Pill>
      ),
    ],
    [
      "rate limit",
      diag.security?.rate_limit_enabled ? (
        <Pill tone="ok">enabled</Pill>
      ) : (
        <Pill tone="ghost">disabled</Pill>
      ),
    ],
  ];
  return (
    <dl
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        rowGap: 10,
        columnGap: 16,
        fontSize: 13,
      }}
    >
      {rows.map(([k, v]) => (
        <RowPair key={k} k={k} v={v} />
      ))}
    </dl>
  );
}

function RowPair({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <dt
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
        }}
      >
        {k}
      </dt>
      <dd style={{ margin: 0, color: "var(--text-primary)" }}>{v}</dd>
    </>
  );
}
