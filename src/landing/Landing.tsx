import type { ReactElement } from "react";
import { useCopy } from "../i18n/copy";

// Landing — first-visit entry. The product is a workstation, not a
// chat or a code editor. The landing has to say so without flinching:
// massive serif headline carrying the doctrine, calm sans subtitle,
// the 5 chambers as a quiet grid, one CTA. No testimonials, no
// changelog, no marketing residue — Cursor-class confidence in our own
// editorial register. Atmospheric gradient inherits from .chamber-shell
// (we reuse the class so the same liquid glass envelopes the entry).
//
// Pass 1 (operator-approved, post-lovable revert): premium polish.
// Header gets a breathing dot + refined shadow. Hero gains an
// atmospheric backdrop of drifting chamber-DNA orbs and an entrance
// stagger. Each chamber slab earns a single-stroke SVG sigil keyed to
// its purpose. Doctrine quote earns an editorial ornament. All static
// content and copy preserved verbatim.

interface Props {
  onEnter: () => void;
}

const CHAMBERS: Array<{
  key: string;
  label: string;
  lead: string;
  sigil: () => ReactElement;
}> = [
  { key: "insight",  label: "INSIGHT",  lead: "três análises antes de uma resposta",     sigil: SigilInsight },
  { key: "surface",  label: "SURFACE",  lead: "design declarado · contrato visual selado", sigil: SigilSurface },
  { key: "terminal", label: "TERMINAL", lead: "código · agent loop · tool allowlist",     sigil: SigilTerminal },
  { key: "archive",  label: "ARCHIVE",  lead: "runs selados · proveniência · ledger",     sigil: SigilArchive },
  { key: "core",     label: "CORE",     lead: "policies · routing · permissions",          sigil: SigilCore },
];

export default function Landing({ onEnter }: Props) {
  const copy = useCopy();
  return (
    <div className="chamber-shell" data-landing>
      <header className="landing-ribbon">
        <span className="canon-ribbon-brand" aria-label="Signal">
          <span aria-hidden className="canon-ribbon-traffic">
            <span className="canon-ribbon-traffic-dot" data-tone="err" />
            <span className="canon-ribbon-traffic-dot" data-tone="warn" />
            <span className="canon-ribbon-traffic-dot" data-tone="ok" />
          </span>
          Signal
          <span aria-hidden className="landing-brand-pulse" />
          <span aria-hidden className="canon-ribbon-doctrine">
            {copy.brandDoctrine}
          </span>
        </span>
        <button
          type="button"
          className="landing-enter-pill"
          onClick={onEnter}
        >
          enter signal
          <span aria-hidden>→</span>
        </button>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          {/* Atmospheric backdrop — three slow-drifting chamber-DNA
              orbs blurred behind the headline. Decorative; aria-hidden. */}
          <div className="landing-hero-atmosphere" aria-hidden>
            <span className="landing-orb" data-orb="insight" />
            <span className="landing-orb" data-orb="surface" />
            <span className="landing-orb" data-orb="core" />
          </div>
          <span className="landing-hero-kicker landing-stagger" data-stagger="1">— a workstation, not a chat</span>
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
            <button
              type="button"
              className="landing-cta-primary"
              onClick={onEnter}
            >
              <span>Enter Signal</span>
              <span aria-hidden>→</span>
            </button>
            <span className="landing-cta-hint">
              alt + 1…5 to switch chambers · ⌘/ctrl + enter to commit
            </span>
          </div>
        </section>

        <section className="landing-chambers">
          <span className="landing-chambers-kicker">— the five chambers</span>
          <div className="landing-chambers-grid">
            {CHAMBERS.map((c) => (
              <div key={c.key} className="landing-chamber-slab" data-chamber={c.key}>
                <span className="landing-chamber-sigil" aria-hidden>
                  <c.sigil />
                </span>
                <span className="landing-chamber-label">{c.label}</span>
                <p className="landing-chamber-lead">{c.lead}</p>
              </div>
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

        <section className="landing-end">
          <button
            type="button"
            className="landing-cta-primary"
            onClick={onEnter}
          >
            <span>Enter Signal</span>
            <span aria-hidden>→</span>
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <span className="landing-footer-mark">Signal</span>
        <span className="landing-footer-meta">
          mock declared · provider swappable · 2026
        </span>
      </footer>
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

// Insight — three orbs converging onto a single answer-line below.
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

// Surface — layered planes (studio + canvas + contract).
function SigilSurface() {
  return (
    <svg {...SIGIL_PROPS}>
      <rect x="4"  y="6"  width="14" height="14" rx="1.5" />
      <rect x="9"  y="9"  width="14" height="14" rx="1.5" />
    </svg>
  );
}

// Terminal — chevron prompt with a horizontal command bed.
function SigilTerminal() {
  return (
    <svg {...SIGIL_PROPS}>
      <path d="M5 9 L10 14 L5 19" />
      <path d="M13 19 L23 19" />
    </svg>
  );
}

// Archive — stacked ledger entries with a sealing mark on the right.
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

// Core — concentric circles centered on a doctrine point.
function SigilCore() {
  return (
    <svg {...SIGIL_PROPS}>
      <circle cx="14" cy="14" r="9" />
      <circle cx="14" cy="14" r="5" />
      <circle cx="14" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Editorial ornament above the doctrine quote — a thin sigil row.
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
