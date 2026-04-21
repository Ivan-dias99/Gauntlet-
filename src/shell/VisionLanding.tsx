import { useEffect, useRef, useState } from "react";
import { useSpine } from "../spine/SpineContext";
import { useCopy } from "../i18n/copy";
import { useTweaks } from "../tweaks/TweaksContext";
import { formatPulse } from "../spine/pulse";

interface Props {
  onEnter: () => void;
  onNewMission: () => void;
}

export default function VisionLanding({ onEnter, onNewMission }: Props) {
  const { state, switchMission } = useSpine();
  const copy = useCopy();
  const { values } = useTweaks();
  const [now, setNow] = useState<Date>(() => new Date());
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString(values.lang === "en" ? "en-US" : "pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const missions = state.missions.slice(0, 4);
  const canContinue = state.missions.length > 0;

  const heroOpacity = Math.max(0, 1 - scrollY / 500);
  const heroBlur = Math.min(10, scrollY / 80);
  const heroLift = Math.max(-40, -scrollY / 6);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        color: "var(--text-primary)",
        overflow: "hidden",
        zIndex: 200,
        animation: "landingIn .9s var(--ease-emph) both",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(1200px 760px at 78% 14%, var(--accent-glow), transparent 60%)," +
            "radial-gradient(980px 680px at 10% 88%, var(--accent-glow), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="breathe"
        style={{
          position: "absolute",
          top: "22%",
          right: "-6vw",
          width: "30vw",
          height: "30vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--ember) 18%, transparent), transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.45,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "overlay",
        }}
      />

      <header
        className="glass"
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          top: 16,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 22px",
          borderRadius: 999,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            className="breathe"
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--ember)",
              boxShadow: "0 0 0 5px color-mix(in oklab, var(--ember) 20%, transparent)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.34em",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
            }}
          >
            R · U · B · E · I · R · A
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.24em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            {dateStr} · {timeStr}
          </span>
          <button
            onClick={onEnter}
            disabled={!canContinue}
            className="landingPill"
          >
            {canContinue ? copy.enter : copy.noMission}
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        {/* ACT I — hero */}
        <section
          style={{
            minHeight: "100vh",
            padding:
              "clamp(120px, 18vh, 220px) clamp(32px, 4vw, 72px) clamp(80px, 14vh, 160px)",
            position: "relative",
            opacity: heroOpacity,
            filter: `blur(${heroBlur}px)`,
            transform: `translateY(${heroLift}px)`,
            transition: "opacity .1s, filter .1s",
          }}
        >
          <div
            className="visionKicker"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.42em",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              marginBottom: 48,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>{copy.sovereignInstrument}</span>
          </div>

          <h1
            className="visionTitle"
            style={{
              fontFamily: "'Fraunces', 'EB Garamond', Georgia, serif",
              fontSize: "clamp(108px, 19vw, 300px)",
              lineHeight: 0.84,
              letterSpacing: "-0.055em",
              fontWeight: 300,
              margin: 0,
              textWrap: "balance",
              fontVariationSettings: "'opsz' 144",
            }}
          >
            Ruberra
            <span
              style={{
                display: "inline-block",
                width: "0.16em",
                height: "0.16em",
                borderRadius: "50%",
                background: "var(--ember)",
                verticalAlign: "baseline",
                marginLeft: "0.06em",
                transform: "translateY(-0.04em)",
                boxShadow: "0 0 40px color-mix(in oklab, var(--ember) 40%, transparent)",
              }}
            />
          </h1>

          <p
            className="visionSub"
            style={{
              marginTop: 56,
              maxWidth: 680,
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(22px, 1.8vw, 30px)",
              lineHeight: 1.3,
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--text-secondary)",
              letterSpacing: "-0.005em",
            }}
          >
            {copy.heroSub}
          </p>

          <div
            className="visionActions"
            style={{
              marginTop: 64,
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onEnter}
              disabled={!canContinue}
              className="visionPrimary"
            >
              {missions.length > 0 ? copy.resumeMission : copy.enter}
              <span style={{ marginLeft: 8, opacity: 0.7 }}>→</span>
            </button>
            <button onClick={onNewMission} className="visionGhost">
              {copy.newMissionLong}
            </button>
            <span
              style={{
                marginLeft: 8,
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: ".24em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              {copy.scrollCue}
            </span>
          </div>

          <div
            aria-hidden
            style={{
              position: "absolute",
              right: "4vw",
              bottom: "8vh",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".4em",
              color: "var(--text-ghost)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            MMXXVI · ARCHIVE · LIVE
          </div>
        </section>

        {/* ACT II — four chambers */}
        <section
          style={{
            padding: "clamp(80px, 10vh, 140px) clamp(32px, 4vw, 72px)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".4em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            {copy.fourChambersKicker}
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.02,
              fontWeight: 300,
              letterSpacing: "-0.035em",
              margin: "0 0 72px",
              maxWidth: 900,
              textWrap: "balance",
            }}
          >
            {copy.chambersHeading}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${copy.chamberDeck.length}, 1fr)`,
              borderTop: "1px solid var(--border-subtle)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            {copy.chamberDeck.map((c) => (
              <article
                key={c.key}
                className="vl-chamber"
                data-dna={c.key.toLowerCase()}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: 28,
                  }}
                >
                  <span className="t-kicker" data-tone="ghost">
                    {c.k}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 20,
                      color: "var(--text-muted)",
                      opacity: 0.6,
                    }}
                  >
                    {c.glyph}
                  </span>
                </div>
                <h3
                  className="t-serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    lineHeight: 1.1,
                    margin: "0 0 6px",
                  }}
                >
                  {c.title}
                </h3>
                <div className="vl-chamber-tag">{c.tag}</div>
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: "var(--text-secondary)",
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {c.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ACT III — manifesto strip */}
        <section
          style={{
            padding: "clamp(80px, 12vh, 160px) clamp(32px, 4vw, 72px)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".4em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            {copy.manifesto}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {copy.manifestoItems.map((m, i) => (
              <div
                key={i}
                style={{
                  borderLeft: "1px solid var(--border)",
                  paddingLeft: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: ".3em",
                    color: "var(--text-ghost)",
                    marginBottom: 10,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "clamp(20px, 1.7vw, 26px)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.015em",
                    color: "var(--text-primary)",
                  }}
                >
                  {m}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACT IV — missions */}
        <section
          style={{
            padding:
              "clamp(80px, 10vh, 140px) clamp(32px, 4vw, 72px) clamp(60px, 8vh, 100px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 48,
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: ".4em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {copy.activeMissions}
              </div>
              {missions.length === 0 ? (
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontStyle: "italic",
                    fontSize: 26,
                    color: "var(--text-muted)",
                  }}
                >
                  {copy.emptyMissions}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {missions.map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchMission(m.id);
                        onEnter();
                      }}
                      className="visionMission"
                    >
                      <span className="vmK">{String(i + 1).padStart(2, "0")}</span>
                      <span className="vmT">{m.title}</span>
                      <span className="vmM">
                        {(() => {
                          const pulse = formatPulse(m);
                          const label = copy.chambers[m.chamber].label;
                          return pulse ? `${label} · ${pulse}` : label;
                        })()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <button onClick={onNewMission} className="visionGhost">
                {copy.newMissionLong}
              </button>
              <button
                onClick={onEnter}
                disabled={!canContinue}
                className="visionPrimary"
              >
                {copy.resumeMission}
                <span style={{ marginLeft: 6, opacity: 0.7 }}>→</span>
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 120,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: ".3em",
              color: "var(--text-ghost)",
              textTransform: "uppercase",
            }}
          >
            <span>© MMXXVI · Archive mode</span>
            <span>Privado. Local. Soberano.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
