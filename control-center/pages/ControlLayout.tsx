// Control Center layout — Gauntlet flagship cockpit.
//
// Doctrine for this surface:
//   * Console de operador, NOT product. No hero, no CTA, no onboarding.
//   * Densidade calma, tipografia técnica, cor sóbria.
//   * Quem chega aqui já sabe porque chegou — the cursor capsule
//     (apps/browser-extension) is the actual product surface.

import { NavLink, Outlet } from "react-router-dom";
import type { CSSProperties } from "react";
import { useBackendStatus } from "../hooks/useBackendStatus";

interface NavEntry {
  to: string;
  label: string;
  hint: string;
  glyph: string;
}

const NAV: NavEntry[] = [
  { to: "/control",             label: "Overview",    hint: "Health · readiness",          glyph: "◐" },
  { to: "/control/settings",    label: "Settings",    hint: "Shortcuts · voice · theme",   glyph: "◇" },
  { to: "/control/models",      label: "Models",      hint: "Routing · gateway · cost",    glyph: "◈" },
  { to: "/control/permissions", label: "Permissions", hint: "Connector × scope",           glyph: "◉" },
  { to: "/control/governance",  label: "Governance",  hint: "Composer policy · domains",   glyph: "◊" },
  { to: "/control/memory",      label: "Memory",      hint: "Failures · spine · search",   glyph: "◍" },
  { to: "/control/ledger",      label: "Ledger",      hint: "Runs · provenance",           glyph: "◎" },
];

export default function ControlLayout() {
  const status = useBackendStatus();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "256px 1fr",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
      }}
    >
      <aside
        style={{
          borderRight: "var(--border-soft)",
          background:
            "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg) 100%)",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <header
          style={{
            padding: "22px 22px 18px",
            borderBottom: "var(--border-soft)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span className="gx-mark" aria-hidden />
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--mono)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "var(--track-kicker)",
                color: "var(--text-primary)",
              }}
            >
              GAUNTLET
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontFamily: "var(--mono)",
                fontSize: "9px",
                letterSpacing: "var(--track-meta)",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              control · garage
            </p>
          </div>
        </header>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "14px 10px",
            gap: 2,
            flex: 1,
          }}
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/control"}
              style={({ isActive }) => navItemStyle(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden
                    style={{
                      width: 3,
                      alignSelf: "stretch",
                      borderRadius: 2,
                      background: isActive
                        ? "var(--ember)"
                        : "transparent",
                      boxShadow: isActive
                        ? "0 0 12px color-mix(in oklab, var(--ember) 60%, transparent)"
                        : "none",
                      transition: "background 200ms var(--motion-easing-out)",
                    }}
                  />
                  <span
                    aria-hidden
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 14,
                      color: isActive
                        ? "var(--ember)"
                        : "var(--text-muted)",
                      width: 16,
                      textAlign: "center",
                    }}
                  >
                    {item.glyph}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 9,
                        letterSpacing: "var(--track-meta)",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.hint}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <footer
          style={{
            marginTop: "auto",
            padding: "16px 22px 20px",
            borderTop: "var(--border-soft)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <ReadinessIndicator status={status} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "var(--mono)",
              fontSize: 9,
              letterSpacing: "var(--track-meta)",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            <span>cursor capsule</span>
            <span>v0</span>
          </div>
        </footer>
      </aside>

      <main
        style={{
          padding: "36px 44px 64px",
          overflow: "auto",
          minWidth: 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1180 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function navItemStyle(active: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 10px 10px 0",
    borderRadius: "var(--radius-sm, 6px)",
    textDecoration: "none",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    background: active
      ? "linear-gradient(90deg, color-mix(in oklab, var(--ember) 8%, transparent) 0%, transparent 80%)"
      : "transparent",
    transition:
      "background 200ms var(--motion-easing-out), color 200ms var(--motion-easing-out)",
  };
}

function ReadinessIndicator({ status }: { status: ReturnType<typeof useBackendStatus> }) {
  const tone = !status.reachable
    ? "err"
    : status.readiness === "degraded"
    ? "warn"
    : "ok";
  const label = !status.reachable
    ? "unreachable"
    : status.readiness === "degraded"
    ? "degraded"
    : "ready";
  const sub = !status.reachable
    ? status.unreachableReason ?? "no contact"
    : status.mode ?? "—";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
      }}
    >
      <span className="gx-dot" data-tone={tone} aria-hidden />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            color: "var(--text-primary)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 160,
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  );
}

// Reusable section header used by every page.
export function SurfaceHeader({
  title,
  subtitle,
  eyebrow,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header
      style={{
        marginBottom: 28,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        {eyebrow && <span className="gx-eyebrow">{eyebrow}</span>}
        <h1
          style={{
            margin: eyebrow ? "8px 0 0" : 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "var(--t-section)",
            color: "var(--text-primary)",
            letterSpacing: "var(--track-tight)",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "8px 0 0",
              color: "var(--text-secondary)",
              fontSize: 13,
              maxWidth: 720,
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </header>
  );
}

// Card primitive, also reused.
export function Panel({
  children,
  title,
  hint,
  tone,
}: {
  children: React.ReactNode;
  title?: string;
  hint?: string;
  tone?: "default" | "hero";
}) {
  return (
    <section
      className="gx-card"
      data-tone={tone === "hero" ? "hero" : undefined}
      style={{ marginBottom: 16 }}
    >
      {(title || hint) && (
        <header style={{ marginBottom: 14 }}>
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "var(--track-kicker)",
                textTransform: "uppercase",
                fontFamily: "var(--mono)",
              }}
            >
              {title}
            </h2>
          )}
          {hint && (
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              {hint}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

// Key/value table primitive used by Settings and Overview.
export function Kv({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <dl
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        rowGap: 10,
        columnGap: 16,
        fontSize: 13,
      }}
    >
      {rows.map(([k, v]) => (
        <RowPair key={k} k={k} v={v} />
      ))}
    </dl>
  );
}

function RowPair({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <dt
        style={{
          color: "var(--text-muted)",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "var(--track-meta)",
          textTransform: "uppercase",
        }}
      >
        {k}
      </dt>
      <dd style={{ margin: 0, color: "var(--text-primary)" }}>{v}</dd>
    </>
  );
}
