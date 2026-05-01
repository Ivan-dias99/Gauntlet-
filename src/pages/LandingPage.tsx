// Wave P-40 — flagship landing page.
//
// Hero · pitch · five chambers · doctrine · connectors · ledger · CTA.
// Editorial register: Fraunces serif headline, mono kicker, atmospheric
// orbs, doctrine quote with ornament. The page lives inside PageShell
// (variant="hero") so it paints edge-to-edge under the global TopNav.
//
// Replaces the legacy `src/landing/Landing.tsx` first-visit gate. The
// SVG sigils are inherited verbatim from that file (P-39c removed the
// gate; this wave moves the assets to their final home).

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

const CHAMBERS: Array<{
  key: string;
  to: string;
  label: string;
  lead: string;
  sigil: () => ReactElement;
}> = [
  { key: "insight",  to: "/chambers/insight",  label: "INSIGHT",  lead: "três análises antes de uma resposta",       sigil: SigilInsight },
  { key: "surface",  to: "/chambers/surface",  label: "SURFACE",  lead: "design declarado · contrato visual selado", sigil: SigilSurface },
  { key: "terminal", to: "/chambers/terminal", label: "TERMINAL", lead: "código · agent loop · tool allowlist",      sigil: SigilTerminal },
  { key: "archive",  to: "/chambers/archive",  label: "ARCHIVE",  lead: "runs selados · proveniência · ledger",      sigil: SigilArchive },
  { key: "core",     to: "/chambers/core",     label: "CORE",     lead: "policies · routing · permissions",          sigil: SigilCore },
];

const CONNECTORS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "github",          label: "GitHub" },
  { id: "vercel",          label: "Vercel" },
  { id: "railway",         label: "Railway" },
  { id: "postgres",        label: "Postgres" },
  { id: "web",             label: "Web · Research" },
  { id: "model-gateway",   label: "Model Gateway" },
  { id: "browser-runtime", label: "Browser Runtime" },
  { id: "figma",           label: "Figma" },
  { id: "issue-tracker",   label: "Issue Tracker" },
  { id: "observability",   label: "Observability" },
];

export default function LandingPage() {
  return (
    <div className="chamber-shell" data-landing data-page="landing">
      <main className="landing-main">
        <section className="landing-hero">
          {/* Atmospheric backdrop — three slow-drifting chamber-DNA
              orbs blurred behind the headline. Decorative; aria-hidden. */}
          <div className="landing-hero-atmosphere" aria-hidden>
            <span className="landing-orb" data-orb="insight" />
            <span className="landing-orb" data-orb="surface" />
            <span className="landing-orb" data-orb="core" />
          </div>
          <span className="landing-hero-kicker landing-stagger" data-stagger="1">
            — a workstation, not a chat
          </span>
          <h1 className="landing-hero-title landing-stagger" data-stagger="2">
            Refuse before guessing.
            <br />
            The AI workstation that says no first.
          </h1>
          <p className="landing-hero-sub landing-stagger" data-stagger="3">
            Five chambers of disciplined thinking — Insight, Surface,
            Terminal, Archive, Core. Three analyses before one answer.
            Divergence becomes refusal. Every artifact sealed in a
            mission ledger.
          </p>
          <div className="landing-hero-cta landing-stagger" data-stagger="4">
            <Link to="/chambers/insight" className="landing-cta-primary">
              <span>Enter Signal</span>
              <span aria-hidden>→</span>
            </Link>
            <span className="landing-cta-hint">
              alt + 1…5 to switch chambers · ⌘/ctrl + enter to commit
            </span>
          </div>
        </section>

        <section className="landing-chambers">
          <span className="landing-chambers-kicker">— the five chambers</span>
          <div className="landing-chambers-grid">
            {CHAMBERS.map((c) => (
              <Link
                key={c.key}
                to={c.to}
                className="landing-chamber-slab"
                data-chamber={c.key}
                style={{ textDecoration: "none" }}
              >
                <span className="landing-chamber-sigil" aria-hidden>
                  <c.sigil />
                </span>
                <span className="landing-chamber-label">{c.label}</span>
                <p className="landing-chamber-lead">{c.lead}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-doctrine">
          <DoctrineOrnament />
          <p className="landing-doctrine-quote">
            “Three analyses before one answer · divergence becomes refusal.”
          </p>
          <span className="landing-doctrine-source">— signal doctrine</span>
        </section>

        <section className="landing-connectors">
          <span className="landing-chambers-kicker">— ten connectors</span>
          <p className="landing-connectors-lead">
            Every chamber pulls from the same matrix. Tokens scoped per
            connector, allowlists declared in policy, telemetry sealed.
          </p>
          <ul className="landing-connectors-grid">
            {CONNECTORS.map((c) => (
              <li
                key={c.id}
                className="landing-connector-pill"
                data-connector={c.id}
              >
                <span className="landing-connector-monogram" aria-hidden>
                  {c.label.slice(0, 1)}
                </span>
                <span className="landing-connector-label">{c.label}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/connectors"
            className="landing-connectors-link"
          >
            ver todos os conectores →
          </Link>
        </section>

        <section className="landing-ledger">
          <span className="landing-chambers-kicker">— mission ledger</span>
          <h2 className="landing-ledger-title">
            Cada artefato selado.
            <br />
            Cada decisão auditável.
          </h2>
          <div className="landing-ledger-card" data-mock>
            <header className="landing-ledger-card-head">
              <span className="landing-ledger-card-id">M-2026-05-018</span>
              <span className="landing-ledger-card-status" data-tone="ok">sealed</span>
            </header>
            <ol className="landing-ledger-steps">
              <li><span className="landing-ledger-step-ts">14:02</span> insight · 3 análises convergem</li>
              <li><span className="landing-ledger-step-ts">14:03</span> surface · contrato visual aprovado</li>
              <li><span className="landing-ledger-step-ts">14:08</span> terminal · 4 ferramentas autorizadas</li>
              <li><span className="landing-ledger-step-ts">14:14</span> archive · run selado · sha:7f3a91c</li>
            </ol>
            <footer className="landing-ledger-card-foot">
              <span>4 chambers · 11 tools · 0 rejeições</span>
              <span aria-hidden>●</span>
            </footer>
          </div>
        </section>

        <section className="landing-end">
          <Link to="/chambers/insight" className="landing-cta-primary">
            <span>Enter Signal</span>
            <span aria-hidden>→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}

// ── Sigils — one per chamber, single-stroke, currentColor, 28x28 ─────
// Style mirrors the WorkbenchStrip icon family (1.5 stroke, round caps).
// Each glyph is editorial, not literal — points at the chamber's
// posture instead of its UI. Color is inherited from chamber-DNA via
// .landing-chamber-slab[data-chamber=...] CSS.

const SIGIL_PROPS = {
  width: 28,
  height: 28,
  viewBox: "0 0 28 28",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SigilInsight() {
  return (
    <svg {...SIGIL_PROPS}>
      <circle cx="8"  cy="9" r="2.5" />
      <circle cx="14" cy="9" r="2.5" />
      <circle cx="20" cy="9" r="2.5" />
      <path d="M8 13 L14 19" />
      <path d="M14 11 L14 19" />
      <path d="M20 13 L14 19" />
      <path d="M6 21 L22 21" />
    </svg>
  );
}

function SigilSurface() {
  return (
    <svg {...SIGIL_PROPS}>
      <rect x="4"  y="6"  width="14" height="14" rx="1.5" />
      <rect x="9"  y="9"  width="14" height="14" rx="1.5" />
    </svg>
  );
}

function SigilTerminal() {
  return (
    <svg {...SIGIL_PROPS}>
      <path d="M5 9 L10 14 L5 19" />
      <path d="M13 19 L23 19" />
    </svg>
  );
}

function SigilArchive() {
  return (
    <svg {...SIGIL_PROPS}>
      <path d="M5 8  L18 8" />
      <path d="M5 13 L18 13" />
      <path d="M5 18 L18 18" />
      <circle cx="22" cy="13" r="2" />
    </svg>
  );
}

function SigilCore() {
  return (
    <svg {...SIGIL_PROPS}>
      <circle cx="14" cy="14" r="9" />
      <circle cx="14" cy="14" r="5" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DoctrineOrnament() {
  return (
    <svg
      className="landing-doctrine-ornament"
      width="86"
      height="14"
      viewBox="0 0 86 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M2 7 L34 7" opacity="0.6" />
      <circle cx="43" cy="7" r="3" opacity="0.85" />
      <circle cx="43" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <path d="M52 7 L84 7" opacity="0.6" />
    </svg>
  );
}
