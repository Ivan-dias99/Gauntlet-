// Gauntlet — Composer page (Control Center).
//
// The Composer is NOT a tab in this console. The actual Composer is the
// cursor capsule shipped as the browser extension (apps/browser-extension).
// This page exists only to point the operator at the real surface and to
// keep the /composer route alive for legacy bookmarks.
//
// Doctrine: O Composer é o carro. O Control Center é a garagem. Nunca
// compete com o Composer como local de trabalho.

import { Link } from "react-router-dom";

const containerStyle = {
  background: "var(--bg)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column" as const,
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderBottom: "var(--border-soft)",
  background: "var(--bg-surface)",
};

const mainStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 32,
};

const cardStyle = {
  maxWidth: 640,
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  borderRadius: "var(--radius-md, 8px)",
  padding: "32px 36px",
};

const kbdStyle = {
  fontFamily: "var(--mono)",
  background: "var(--bg-elevated)",
  border: "var(--border-soft)",
  borderRadius: 4,
  padding: "2px 8px",
  fontSize: 12,
};

export default function ComposerPage() {
  return (
    <div style={containerStyle} data-composer-redirect>
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            aria-hidden
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "var(--accent, #4a7cff)",
              boxShadow: "0 0 14px var(--accent, #4a7cff)",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-meta)",
              letterSpacing: "var(--track-kicker)",
              color: "var(--text-muted)",
            }}
          >
            GAUNTLET · COMPOSER
          </p>
        </div>
        <Link
          to="/control"
          style={{
            color: "var(--text-secondary, var(--text-muted))",
            textDecoration: "none",
            fontFamily: "var(--mono)",
            fontSize: "var(--t-meta)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
            border: "var(--border-soft)",
            borderRadius: "var(--radius-sm, 4px)",
            padding: "6px 12px",
          }}
        >
          → Control
        </Link>
      </header>

      <main style={mainStyle}>
        <section style={cardStyle}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--serif)",
              fontWeight: 400,
              fontSize: "var(--t-section)",
              color: "var(--text-primary)",
            }}
          >
            O Composer vive na ponta do cursor.
          </h1>
          <p
            style={{
              margin: "16px 0 0",
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            A cápsula é a experiência principal do Gauntlet. Não há composer
            dentro deste console — o Control Center é a garagem, não o carro.
            Para invocar a cápsula, instala a extensão e carrega no atalho
            global.
          </p>

          <ol
            style={{
              margin: "24px 0 0",
              paddingLeft: 20,
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            <li>
              Build da extensão:{" "}
              <code style={kbdStyle}>cd apps/browser-extension && npm run dev</code>
            </li>
            <li>Carregar a build em <code style={kbdStyle}>chrome://extensions</code> (Load unpacked)</li>
            <li>
              Em qualquer página: <code style={kbdStyle}>Alt</code> + <code style={kbdStyle}>Space</code>
            </li>
            <li>Escrever o pedido. <code style={kbdStyle}>Esc</code> dispensa a cápsula.</li>
          </ol>

          <p
            style={{
              margin: "24px 0 0",
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "var(--mono)",
              letterSpacing: "var(--track-meta)",
            }}
          >
            backend → /composer/{"{context,intent,preview,apply}"}
          </p>
        </section>
      </main>
    </div>
  );
}
