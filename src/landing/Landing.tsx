import { useCopy } from "../i18n/copy";

// Landing — first-visit entry. The product is a workstation, not a
// chat or a code editor. The landing has to say so without flinching:
// massive serif headline carrying the doctrine, calm sans subtitle,
// the 5 chambers as a quiet grid, one CTA. No testimonials, no
// changelog, no marketing residue — Cursor-class confidence in our own
// editorial register. Atmospheric gradient inherits from .chamber-shell
// (we reuse the class so the same liquid glass envelopes the entry).

interface Props {
  onEnter: () => void;
}

const CHAMBERS: Array<{ key: string; label: string; lead: string }> = [
  { key: "insight",  label: "INSIGHT",  lead: "três análises antes de uma resposta" },
  { key: "surface",  label: "SURFACE",  lead: "design declarado · contrato visual selado" },
  { key: "terminal", label: "TERMINAL", lead: "código · agent loop · tool allowlist" },
  { key: "archive",  label: "ARCHIVE",  lead: "runs selados · proveniência · ledger" },
  { key: "core",     label: "CORE",     lead: "policies · routing · permissions" },
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
          <span className="landing-hero-kicker">— a workstation, not a chat</span>
          <h1 className="landing-hero-title">
            Refuse before guessing.
            <br />
            The AI workstation that says no first.
          </h1>
          <p className="landing-hero-sub">
            Five chambers of disciplined thinking — Insight, Surface,
            Terminal, Archive, Core. Three analyses before one answer.
            Divergence becomes refusal. Every artifact sealed in a
            mission ledger.
          </p>
          <div className="landing-hero-cta">
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
                <span className="landing-chamber-label">{c.label}</span>
                <p className="landing-chamber-lead">{c.lead}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-doctrine">
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
