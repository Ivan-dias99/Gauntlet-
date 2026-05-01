// Wave P-39a — landing page scaffold.
//
// Hero / pitch / 5-chamber preview / doctrine social-proof. Wave P-40
// fills the real flagship content. This file ships the route + minimal
// surface so the operator can navigate to it without a 404.

import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section
      data-page="landing"
      style={{
        padding: "var(--space-8)",
        maxWidth: 960,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-hero)",
          letterSpacing: "var(--track-display)",
          fontWeight: "var(--weight-regular)",
          margin: 0,
        }}
      >
        signal
      </h1>
      <p
        className="kicker"
        data-tone="ghost"
        style={{ marginTop: "calc(-1 * var(--space-3))" }}
      >
        sovereign ai workspace · operator-first
      </p>
      <p
        style={{
          fontSize: "var(--t-prominent)",
          lineHeight: "var(--leading-loose)",
          color: "var(--text-primary)",
          maxWidth: 640,
        }}
      >
        cinco câmaras cognitivas · doutrina conservadora · audit trail
        completo. signal recusa antes de adivinhar.
      </p>
      <nav
        style={{
          display: "flex",
          gap: "var(--space-3)",
          marginTop: "var(--space-3)",
        }}
      >
        <Link
          to="/chambers"
          className="btn"
          data-action="primary"
          style={{ padding: "var(--space-2) var(--space-4)" }}
        >
          abrir workspace
        </Link>
        <Link to="/docs" className="btn">
          ler doutrina
        </Link>
      </nav>
    </section>
  );
}
