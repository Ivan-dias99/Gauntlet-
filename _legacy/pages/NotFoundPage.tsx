// Wave P-39a — 404 page scaffold.

import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <section
      data-page="not-found"
      style={{
        padding: "var(--space-8)",
        maxWidth: 480,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--serif)",
          fontSize: "var(--t-display)",
          margin: 0,
        }}
      >
        ✕
      </p>
      <p
        className="kicker"
        data-tone="ghost"
        style={{ marginTop: "var(--space-2)" }}
      >
        rota não existe — {pathname}
      </p>
      <p style={{ marginTop: "var(--space-4)" }}>
        <Link to="/" className="btn">
          voltar
        </Link>
      </p>
    </section>
  );
}
