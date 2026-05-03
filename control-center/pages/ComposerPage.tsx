// Gauntlet — Composer landing (Control Center).
//
// The Composer is NOT a tab in this console. The actual Composer is the
// cursor capsule shipped as the browser extension. This page exists only
// to point the operator at the real surface and to keep the /composer
// route alive for legacy bookmarks.
//
// Doctrine: O Composer é o carro. O Control Center é a garagem. Nunca
// compete com o Composer como local de trabalho.

import { Link } from "react-router-dom";

const stepStyle = {
  display: "grid",
  gridTemplateColumns: "32px 1fr",
  alignItems: "start",
  gap: 14,
  padding: "12px 0",
  borderBottom: "var(--border-soft)",
};

const stepIndex = {
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

const kbdStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 22,
  height: 22,
  padding: "0 6px",
  fontFamily: "var(--mono)",
  fontSize: 11,
  background: "var(--bg-elevated)",
  border: "var(--border-soft)",
  borderRadius: 5,
  color: "var(--text-primary)",
  margin: "0 2px",
};

const codeStyle = {
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
    <div
      style={{
        position: "relative",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      data-composer-redirect
    >
      <div className="gx-aurora" aria-hidden />

      <header
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "var(--border-soft)",
          background:
            "linear-gradient(180deg, var(--bg-surface) 0%, transparent 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
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
            borderRadius: "var(--radius-sm, 6px)",
            padding: "7px 14px",
            transition: "color 200ms ease, border-color 200ms ease",
          }}
        >
          → Control
        </Link>
      </header>

      <main
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <section
          className="gx-rise"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: 40,
            maxWidth: 1100,
            width: "100%",
            alignItems: "center",
          }}
        >
          <div>
            <span className="gx-eyebrow">flagship surface</span>
            <h1
              className="gx-display"
              style={{ marginTop: 10 }}
            >
              O Composer vive
              <br />
              na <span style={{ color: "var(--ember)" }}>ponta do cursor</span>.
            </h1>
            <p
              style={{
                margin: "20px 0 0",
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
                marginTop: 28,
                padding: "8px 0 0",
                borderTop: "var(--border-soft)",
              }}
            >
              <span className="gx-eyebrow">summon</span>
              <ol style={{ margin: "10px 0 0", padding: 0, listStyle: "none" }}>
                <li style={stepStyle}>
                  <span style={stepIndex}>01</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Build da extensão:{" "}
                    <code style={codeStyle}>cd apps/browser-extension && npm run dev</code>
                  </span>
                </li>
                <li style={stepStyle}>
                  <span style={stepIndex}>02</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Carregar a build em <code style={codeStyle}>chrome://extensions</code> (Load unpacked)
                  </span>
                </li>
                <li style={stepStyle}>
                  <span style={stepIndex}>03</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Em qualquer página: <kbd style={kbdStyle}>Alt</kbd>
                    <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>+</span>
                    <kbd style={kbdStyle}>Space</kbd>
                  </span>
                </li>
                <li style={{ ...stepStyle, borderBottom: "none" }}>
                  <span style={stepIndex}>04</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Escrever o pedido. <kbd style={kbdStyle}>Esc</kbd> dispensa a cápsula.
                  </span>
                </li>
              </ol>
            </div>
          </div>

          {/* Capsule mockup — purely illustrative, not interactive */}
          <CapsuleMockup />
        </section>
      </main>

      <footer
        style={{
          position: "relative",
          padding: "20px 32px",
          borderTop: "var(--border-soft)",
          background: "var(--bg-surface)",
        }}
      >
        <div className="gx-trail">
          <span className="gx-eyebrow" style={{ color: "var(--text-muted)" }}>
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
          "linear-gradient(180deg, color-mix(in oklab, var(--bg-elevated) 90%, transparent) 0%, color-mix(in oklab, var(--bg-surface) 90%, transparent) 100%)",
        border: "1px solid color-mix(in oklab, var(--ember) 18%, var(--border-color-mid))",
        boxShadow:
          "0 0 0 1px color-mix(in oklab, var(--ember) 10%, transparent), 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 color-mix(in oklab, white 6%, transparent)",
        padding: "18px 20px",
        backdropFilter: "blur(20px)",
        fontFamily: "var(--sans)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="gx-mark" />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "var(--track-kicker)", color: "var(--text-primary)" }}>
              GAUNTLET
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "var(--track-meta)", color: "var(--text-muted)", marginTop: 2 }}>
              cursor · capsule
            </div>
          </div>
        </div>
        <span
          style={{
            border: "var(--border-soft)",
            borderRadius: 5,
            padding: "3px 7px",
            fontFamily: "var(--mono)",
            fontSize: 9,
            color: "var(--text-muted)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          esc
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: "var(--ember)",
            background: "color-mix(in oklab, var(--ember) 14%, transparent)",
            border: "1px solid color-mix(in oklab, var(--ember) 30%, transparent)",
            borderRadius: 999,
            padding: "2px 8px",
            letterSpacing: "var(--track-meta)",
          }}
        >
          browser
        </span>
        <span style={{ flex: 1, fontFamily: "var(--sans)", textTransform: "none", letterSpacing: 0, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>
          docs.anthropic.com / claude / pricing
        </span>
      </div>

      <pre
        style={{
          margin: 0,
          padding: "8px 10px",
          background: "var(--bg-sunken)",
          border: "var(--border-soft)",
          borderRadius: 8,
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-secondary)",
          maxHeight: 70,
          overflow: "hidden",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        Sonnet 4.6 input $3/MTok, output $15/MTok.
        Cache hits 1/10 of input. Batch -50%.
      </pre>

      <textarea
        readOnly
        rows={2}
        defaultValue="Resume os preços do Sonnet em PT, em uma frase, para colar no slack."
        style={{
          width: "100%",
          marginTop: 12,
          background: "var(--bg-input)",
          color: "var(--text-primary)",
          border: "1px solid color-mix(in oklab, var(--ember) 30%, transparent)",
          boxShadow: "0 0 0 1px color-mix(in oklab, var(--ember) 18%, transparent), 0 0 24px color-mix(in oklab, var(--ember) 14%, transparent)",
          borderRadius: 8,
          padding: "10px 12px",
          fontFamily: "var(--sans)",
          fontSize: 13,
          resize: "none",
          outline: "none",
          boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <span style={{ display: "inline-flex", gap: 4, fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-muted)" }}>
          <span style={{ ...kbdStyle, height: 16, minWidth: 16, fontSize: 10 }}>⌘</span>
          <span style={{ ...kbdStyle, height: 16, minWidth: 16, fontSize: 10 }}>↵</span>
        </span>
        <button
          type="button"
          className="gx-cta"
          style={{ pointerEvents: "none" }}
          tabIndex={-1}
        >
          Compor
        </button>
      </div>
    </div>
  );
}
