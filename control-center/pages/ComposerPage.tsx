// Gauntlet — Composer landing (Control Center).
//
// The Composer is NOT a tab in this console. The actual Composer is the
// cursor capsule shipped as the browser extension. This page exists only
// to point the operator at the real surface and to keep the /composer
// route alive for legacy bookmarks.
//
// Doctrine: O Composer é o carro. O Control Center é a garagem. Nunca
// compete com o Composer como local de trabalho.

import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

const containerStyle: CSSProperties = {
  position: "relative",
  background: "var(--bg)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 32px",
  borderBottom: "var(--border-soft)",
  background:
    "linear-gradient(180deg, color-mix(in oklab, var(--bg-surface) 96%, transparent) 0%, color-mix(in oklab, var(--bg) 80%, transparent) 100%)",
  backdropFilter: "saturate(1.4) blur(20px)",
  WebkitBackdropFilter: "saturate(1.4) blur(20px)",
  zIndex: 2,
};

const mainStyle: CSSProperties = {
  position: "relative",
  flex: 1,
  display: "grid",
  placeItems: "center",
  padding: "56px 32px",
  zIndex: 1,
};

const heroGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr)",
  gap: 48,
  maxWidth: 1120,
  width: "100%",
  alignItems: "center",
};

const stepRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "32px 1fr",
  alignItems: "start",
  gap: 14,
  padding: "12px 0",
  borderBottom: "var(--border-soft)",
};

const stepIndexStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 8,
  border: "var(--border-soft)",
  background: "var(--bg-elevated)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "var(--track-meta)",
  color: "var(--text-secondary)",
};

const kbdStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 24,
  height: 24,
  padding: "0 7px",
  fontFamily: "var(--mono)",
  fontSize: 11,
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  borderRadius: 5,
  color: "var(--text-primary)",
  margin: "0 2px",
  boxShadow: "0 1px 0 rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const codeStyle: CSSProperties = {
  display: "inline-block",
  fontFamily: "var(--mono)",
  fontSize: 12,
  background: "var(--bg-elevated)",
  border: "var(--border-soft)",
  borderRadius: 5,
  padding: "2px 8px",
  color: "var(--text-primary)",
};

export default function ComposerPage() {
  return (
    <div style={containerStyle} data-composer-redirect>
      {/* Aurora — subtle in light, present in dark */}
      <div className="gx-aurora" aria-hidden style={{ zIndex: 0 }} />

      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="gx-mark" aria-hidden />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "var(--track-kicker)",
                color: "var(--text-primary)",
              }}
            >
              GAUNTLET · COMPOSER
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "var(--track-meta)",
                color: "var(--text-muted)",
                marginTop: 3,
                textTransform: "uppercase",
              }}
            >
              cursor capsule · this console is the garage
            </span>
          </div>
        </div>
        <Link
          to="/control"
          style={{
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            border: "var(--border-soft)",
            borderRadius: 6,
            padding: "8px 16px",
            background: "var(--bg-surface)",
            transition: "all 200ms var(--motion-easing-out)",
          }}
        >
          → Control
        </Link>
      </header>

      <main style={mainStyle}>
        <section style={heroGridStyle}>
          {/* LEFT — Hero copy + summon steps */}
          <div>
            <span className="gx-eyebrow">flagship surface</span>
            <h1
              style={{
                margin: "10px 0 0",
                fontFamily: "var(--serif)",
                fontWeight: 400,
                fontSize: "clamp(36px, 4.4vw, 56px)",
                lineHeight: 1.04,
                letterSpacing: "-0.022em",
                color: "var(--text-primary)",
              }}
            >
              O Composer vive
              <br />
              na <em style={{ color: "var(--ember)", fontStyle: "normal" }}>ponta do cursor</em>.
            </h1>
            <p
              style={{
                margin: "22px 0 0",
                color: "var(--text-secondary)",
                fontSize: 15,
                lineHeight: 1.6,
                maxWidth: 540,
              }}
            >
              A cápsula é a experiência principal do Gauntlet. Não há composer
              dentro deste console — o Control Center é a garagem, não o carro.
              Para invocar a cápsula, instala a extensão e carrega no atalho global.
            </p>

            <div
              style={{
                marginTop: 32,
                paddingTop: 16,
                borderTop: "var(--border-soft)",
              }}
            >
              <span className="gx-eyebrow">summon · 4 steps</span>
              <ol style={{ margin: "12px 0 0", padding: 0, listStyle: "none" }}>
                <li style={stepRowStyle}>
                  <span style={stepIndexStyle}>01</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Build da extensão:{" "}
                    <code style={codeStyle}>cd apps/browser-extension</code>{" "}
                    <code style={codeStyle}>npm run dev</code>
                  </span>
                </li>
                <li style={stepRowStyle}>
                  <span style={stepIndexStyle}>02</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Carregar a build em{" "}
                    <code style={codeStyle}>chrome://extensions</code> (Load unpacked)
                  </span>
                </li>
                <li style={stepRowStyle}>
                  <span style={stepIndexStyle}>03</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Em qualquer página: <kbd style={kbdStyle}>Ctrl</kbd>
                    <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>+</span>
                    <kbd style={kbdStyle}>Shift</kbd>
                    <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>+</span>
                    <kbd style={kbdStyle}>Space</kbd>
                  </span>
                </li>
                <li style={{ ...stepRowStyle, borderBottom: "none" }}>
                  <span style={stepIndexStyle}>04</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Escrever o pedido. <kbd style={kbdStyle}>Esc</kbd> dispensa a cápsula.
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* RIGHT — Capsule mockup */}
          <CapsuleMockup />
        </section>
      </main>

      <footer
        style={{
          position: "relative",
          padding: "20px 32px",
          borderTop: "var(--border-soft)",
          background: "var(--bg-surface)",
          zIndex: 2,
        }}
      >
        <div className="gx-trail">
          <span
            className="gx-eyebrow"
            style={{ color: "var(--text-muted)" }}
          >
            backend pipeline
          </span>
          <span className="gx-trail-step">/composer/context</span>
          <span style={{ color: "var(--text-ghost)" }}>→</span>
          <span className="gx-trail-step">/composer/intent</span>
          <span style={{ color: "var(--text-ghost)" }}>→</span>
          <span className="gx-trail-step">/composer/preview</span>
          <span style={{ color: "var(--text-ghost)" }}>→</span>
          <span className="gx-trail-step">/composer/apply</span>
        </div>
      </footer>
    </div>
  );
}

function CapsuleMockup() {
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        borderRadius: 16,
        background:
          "linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
        border: "1px solid color-mix(in oklab, var(--ember) 18%, var(--border-color-mid))",
        boxShadow:
          "0 0 0 1px color-mix(in oklab, var(--ember) 10%, transparent), 0 24px 60px color-mix(in oklab, var(--text-primary) 14%, transparent), inset 0 1px 0 color-mix(in oklab, white 8%, transparent)",
        padding: "20px 22px",
        backdropFilter: "saturate(1.2) blur(20px)",
        fontFamily: "var(--sans)",
      }}
    >
      {/* Capsule header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="gx-mark" />
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "var(--track-kicker)",
                color: "var(--text-primary)",
              }}
            >
              GAUNTLET
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "var(--track-meta)",
                color: "var(--text-muted)",
                marginTop: 2,
              }}
            >
              cursor · capsule
            </div>
          </div>
        </div>
        <span
          style={{
            border: "var(--border-soft)",
            borderRadius: 5,
            padding: "3px 8px",
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--text-muted)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            background: "var(--bg-surface)",
          }}
        >
          esc
        </span>
      </div>

      {/* Context strip */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: "var(--ember)",
            background: "color-mix(in oklab, var(--ember) 14%, transparent)",
            border: "1px solid color-mix(in oklab, var(--ember) 30%, transparent)",
            borderRadius: 999,
            padding: "2px 10px",
            letterSpacing: "var(--track-meta)",
            fontFamily: "var(--mono)",
            fontSize: 9,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          browser
        </span>
        <span
          style={{
            flex: 1,
            color: "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 11,
          }}
        >
          gauntlet.dev/pricing · selected block
        </span>
      </div>

      {/* Selection block */}
      <pre
        style={{
          margin: 0,
          padding: "10px 12px",
          background: "var(--bg-sunken)",
          border: "var(--border-soft)",
          borderRadius: 8,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-secondary)",
          maxHeight: 80,
          overflow: "hidden",
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}
      >
{`Sonnet 4.6 input $3 / MTok, output $15 / MTok.
Cache hits 1/10 of input. Batch −50%.`}
      </pre>

      {/* Input */}
      <div
        style={{
          marginTop: 12,
          background: "var(--bg-input)",
          color: "var(--text-primary)",
          border: "1px solid color-mix(in oklab, var(--ember) 30%, transparent)",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--ember) 18%, transparent), 0 0 24px color-mix(in oklab, var(--ember) 12%, transparent)",
          borderRadius: 10,
          padding: "12px 14px",
          fontFamily: "var(--sans)",
          fontSize: 13,
          lineHeight: 1.5,
          minHeight: 48,
        }}
      >
        Resume os preços do Sonnet em PT,
        <br />
        em uma frase, para colar no slack.
      </div>

      {/* CTA row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            gap: 4,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-muted)",
          }}
        >
          <span style={{ ...kbdStyle, height: 18, minWidth: 18, padding: "0 5px", fontSize: 10 }}>⌘</span>
          <span style={{ ...kbdStyle, height: 18, minWidth: 18, padding: "0 5px", fontSize: 10 }}>↵</span>
        </span>
        <button
          type="button"
          className="gx-cta"
          style={{ pointerEvents: "none" }}
          tabIndex={-1}
        >
          Preview
        </button>
      </div>

      {/* Preview meta strip */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 14,
          paddingTop: 12,
          borderTop: "var(--border-soft)",
          flexWrap: "wrap",
        }}
      >
        <MockPill k="state" v="preview ready" tone="ok" />
        <MockPill k="intent" v="summarize" />
        <MockPill k="confidence" v="0.92" />
        <MockPill k="model" v="sonnet-4.6" />
        <MockPill k="latency" v="612 ms" />
      </div>
    </div>
  );
}

function MockPill({
  k,
  v,
  tone,
}: {
  k: string;
  v: string;
  tone?: "ok";
}) {
  const okColor = "color-mix(in oklab, var(--cc-ok) 35%, var(--border-color-soft))";
  const okBg = "color-mix(in oklab, var(--cc-ok) 10%, transparent)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: 999,
        border:
          tone === "ok"
            ? `1px solid ${okColor}`
            : "var(--border-soft)",
        background:
          tone === "ok" ? okBg : "var(--bg-elevated)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-meta)",
      }}
    >
      <span style={{ color: "var(--text-muted)" }}>{k}</span>
      <span
        style={{
          color: tone === "ok" ? "var(--cc-ok)" : "var(--text-primary)",
        }}
      >
        {v}
      </span>
    </span>
  );
}
