import { useEffect, useState } from "react";
import { signalFetch, isBackendUnreachable } from "../lib/signalApi";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { Kv, Panel, SurfaceHeader } from "../composer/shell/StudioPrimitives";
import Pill from "../components/atoms/Pill";

interface BootSummary {
  start_iso?: string;
  uptime_seconds?: number;
  mode?: string;
  anthropic_api_key_present?: boolean;
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

  return (
    <>
      <SurfaceHeader
        title="Overview"
        subtitle="Quick read on the brain's health. Switch to Ledger or Memory for the full story."
      />

      <Panel title="Backend" hint="from /health">
        <Kv
          rows={[
            ["reachable", <Pill tone={status.reachable ? "ok" : "danger"}>{String(status.reachable)}</Pill>],
            ["mode", status.mode ?? "unknown"],
            ["engine", status.engine ?? "unknown"],
            ["readiness", status.readiness],
            [
              "persistence",
              status.persistenceEphemeral
                ? <Pill tone="warn">ephemeral</Pill>
                : status.persistenceDegraded
                  ? <Pill tone="warn">degraded</Pill>
                  : <Pill tone="ok">durable</Pill>,
            ],
          ]}
        />
      </Panel>

      <Panel title="Process" hint="from /diagnostics">
        {error && <p style={{ color: "var(--danger, #d04a4a)", fontSize: 12 }}>{error}</p>}
        {diag ? (
          <Kv
            rows={[
              ["system", diag.system ?? "—"],
              ["primary model", diag.model ?? "—"],
              ["engine_status", diag.engine_status ?? "—"],
              ["uptime_s", String(diag.boot?.uptime_seconds ?? "—")],
              ["started", diag.boot?.start_iso ?? "—"],
              ["mode", diag.boot?.mode ?? "—"],
              [
                "anthropic key",
                diag.boot?.anthropic_api_key_present
                  ? <Pill tone="ok">present</Pill>
                  : <Pill tone="warn">absent (mock only)</Pill>,
              ],
              [
                "ephemeral disk",
                diag.boot?.persistence_ephemeral
                  ? <Pill tone="warn">true</Pill>
                  : <Pill tone="ok">false</Pill>,
              ],
              [
                "auth required",
                diag.security?.auth_required
                  ? <Pill tone="ok">yes</Pill>
                  : <Pill tone="ghost">no (open)</Pill>,
              ],
              [
                "rate limit",
                diag.security?.rate_limit_enabled
                  ? <Pill tone="ok">enabled</Pill>
                  : <Pill tone="ghost">disabled</Pill>,
              ],
            ]}
          />
        ) : (
          !error && <p style={{ color: "var(--text-muted)", fontSize: 12 }}>loading…</p>
        )}
      </Panel>

      <Panel title="Composer surface" hint="how the operator reaches the brain">
        <Kv
          rows={[
            ["browser-extension", <code style={{ fontFamily: "var(--mono)" }}>apps/browser-extension</code>],
            ["hotkey", <code style={{ fontFamily: "var(--mono)" }}>Alt+Space</code>],
            ["composer routes", <code style={{ fontFamily: "var(--mono)" }}>/composer/{`{context,intent,preview,apply}`}</code>],
          ]}
        />
      </Panel>
    </>
  );
}
