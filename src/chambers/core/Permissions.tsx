import { useDiagnostics, type SignalToolDescriptor } from "../../hooks/useDiagnostics";

// Core · Permissions — read-only registry of the active tool surface.
// Single source of truth: signal-backend /diagnostics. The previous
// hardcoded TS list drifted (web_fetch vs fetch_url, missing package_info)
// and is gone. If the backend is unreachable we say so honestly instead
// of inventing a fake fallback.

const KIND_TONE: Record<SignalToolDescriptor["kind"], "info" | "warn" | "accent" | "ok" | "muted"> = {
  filesystem: "info",
  process:    "warn",
  vcs:        "accent",
  network:    "ok",
  other:      "muted",
};

export default function Permissions() {
  const diag = useDiagnostics();

  return (
    <div className="core-page">
      <div className="core-page-intro">
        <span className="core-page-intro-title">Permissions · Registry Mode</span>
        <span className="core-page-intro-sub">
          Read-only registry of the active tool surface · derivado de{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
            signal-backend/tools.py
          </code>
          . Tools <em>gated</em> só rodam com{" "}
          <code style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>
            SIGNAL_ALLOW_CODE_EXEC=true
          </code>
          . O allowlist por chamber está em cada cartão. Edição governada
          (Ratification Mode) chega numa wave futura.
        </span>
      </div>

      {diag.status === "loading" && (
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--t-body-sec)",
            color: "var(--text-muted)",
          }}
        >
          carregando registry…
        </div>
      )}

      {diag.status === "unreachable" && (
        <div
          className="panel"
          data-rank="primary"
          style={{ borderColor: "var(--cc-warn)" }}
        >
          <div className="panel-head">
            <span style={{ fontFamily: "var(--mono)", color: "var(--cc-warn)" }}>
              registry unavailable
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-muted)",
            }}
          >
            backend inacessível — sem fonte canônica para tool list. Não há
            fallback hardcoded para evitar mostrar permissões fora de sincro.
          </div>
        </div>
      )}

      {diag.status === "error" && (
        <div className="panel" data-rank="primary">
          <div className="panel-head">
            <span style={{ fontFamily: "var(--mono)", color: "var(--cc-warn)" }}>
              registry error
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--sans)",
              fontSize: "var(--t-body-sec)",
              color: "var(--text-muted)",
            }}
          >
            {diag.error}
          </div>
        </div>
      )}

      {diag.status === "ok" && (
        <>
          {diag.data.boot.allow_code_exec === false && (
            <div
              className="panel"
              data-rank="muted"
              style={{ marginBottom: "var(--space-3)" }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-body-sec)",
                  color: "var(--text-muted)",
                }}
              >
                SIGNAL_ALLOW_CODE_EXEC=false · gated tools recusam invocação
              </div>
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-3)",
            }}
          >
            {diag.data.tools.map((t) => (
              <section key={t.name} className="panel" data-rank="primary">
                <div className="panel-head">
                  <code
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "var(--t-body)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t.name}
                  </code>
                  <span
                    className="kicker"
                    data-tone={KIND_TONE[t.kind]}
                    style={{ marginLeft: "auto" }}
                  >
                    {t.kind}
                  </span>
                  {t.gated && (
                    <span data-gated className="state-pill" data-tone="warn">
                      <span className="state-pill-dot" />
                      gated
                    </span>
                  )}
                </div>
                {t.description && (
                  <div
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: "var(--t-body-sec)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--lh-body-sec)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {t.description.length > 220
                      ? t.description.slice(0, 217) + "…"
                      : t.description}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  chambers: {t.chambers.length ? t.chambers.join(", ") : "—"}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
