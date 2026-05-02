// Composer V0 — placeholder shell.
//
// The five-chamber surface was archived under _legacy/ in Operação 3.
// The Control Center (Operação 4) reuses src/spine, src/lib, src/tweaks,
// src/trust, src/i18n, src/styles, src/hooks, src/design, src/components,
// src/tools — they survived the cut as shared infrastructure.
//
// Until the Control Center lands, this placeholder confirms the
// frontend still boots. The real product surface for V0 is the browser
// extension at apps/browser-extension/ (cursor capsule talking to the
// /composer/* routes).
//
// Reversibility: `git revert <op-3-commit>` brings the old shell back
// in one step. The _legacy/ tree stays accessible by inspection until
// Operação 5 selas Composer V0 in production.

const composerDocsHref = "https://github.com/Ivan-dias99/Aiinterfaceshelldesign";

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0c10",
        color: "#d6dde6",
        fontFamily:
          "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        gap: 24,
      }}
    >
      <header style={{ textAlign: "center", maxWidth: 640 }}>
        <p
          style={{
            margin: 0,
            letterSpacing: "0.22em",
            fontSize: 11,
            color: "#6b7888",
          }}
        >
          RUBERRA · COMPOSER
        </p>
        <h1
          style={{
            margin: "12px 0 0",
            fontWeight: 500,
            fontSize: 28,
            color: "#e6ecf2",
          }}
        >
          O cérebro continua a bater. A superfície migrou.
        </h1>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 14,
            lineHeight: 1.55,
            color: "#8995a6",
          }}
        >
          A cápsula vive na ponta da atenção, não numa página. Para usar o
          Composer hoje, instala a browser extension em{" "}
          <code style={{ color: "#c4cfdc" }}>apps/browser-extension</code> e
          chama <code style={{ color: "#c4cfdc" }}>Alt+Space</code> em qualquer
          página.
        </p>
      </header>

      <section
        style={{
          border: "1px solid #1f2734",
          background: "#0e1014",
          borderRadius: 10,
          padding: "20px 24px",
          maxWidth: 640,
          width: "100%",
          fontSize: 13,
          color: "#9eb1cc",
        }}
      >
        <p style={{ margin: 0, color: "#6b7888", fontSize: 11, letterSpacing: "0.18em" }}>
          ESTADO DA TRANSIÇÃO
        </p>
        <ul style={{ margin: "12px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
          <li>
            <strong style={{ color: "#9be6c0" }}>Op 1 — verde:</strong> rotas{" "}
            <code>/composer/*</code> ligadas ao engine real.
          </li>
          <li>
            <strong style={{ color: "#9be6c0" }}>Op 2 — verde (build):</strong>{" "}
            extension WXT/MV3 com cápsula no <code>Alt+Space</code>.
          </li>
          <li>
            <strong style={{ color: "#9be6c0" }}>Op 3 — verde:</strong> shell
            antigo arquivado em <code>_legacy/</code>.
          </li>
          <li>
            <strong style={{ color: "#c4cfdc" }}>Op 4 — pendente:</strong>{" "}
            Control Center (Settings, Models, Permissions, Memory Inspector,
            Ledger Viewer).
          </li>
          <li>
            <strong style={{ color: "#c4cfdc" }}>Op 5 — pendente:</strong>{" "}
            renomeação canónica + tag <code>composer-v0</code>.
          </li>
        </ul>
      </section>

      <footer style={{ fontSize: 11, color: "#5e6776", textAlign: "center" }}>
        <a
          href={composerDocsHref}
          style={{ color: "#6b7888", textDecoration: "none" }}
          rel="noreferrer"
        >
          {composerDocsHref}
        </a>
      </footer>
    </main>
  );
}
