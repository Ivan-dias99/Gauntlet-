// Control Center layout (Operação 4 V0).
//
// Doctrine for this surface:
//   * Console de operador, NOT product. No hero, no CTA, no onboarding.
//   * Densidade calma, tipografia técnica, cor sóbria.
//   * Quem chega aqui já sabe porque chegou — the cursor capsule
//     (apps/browser-extension) is the actual product surface.
//
// Five sections in the sidebar, plus an Overview entry. Each section is
// a single page that talks directly to existing backend endpoints —
// nothing here invents new state primitives.

import { NavLink, Outlet } from "react-router-dom";
import { useBackendStatus } from "../hooks/useBackendStatus";
import Pill from "../components/atoms/Pill";

interface NavEntry {
  to: string;
  label: string;
  hint: string;
}

const NAV: NavEntry[] = [
  { to: "/control", label: "Overview", hint: "Health · readiness" },
  { to: "/control/settings", label: "Settings", hint: "API · runtime · theme" },
  { to: "/control/models", label: "Models", hint: "Routing · gateway · cost" },
  { to: "/control/permissions", label: "Permissions", hint: "Connector × scope" },
  { to: "/control/memory", label: "Memory", hint: "Failures · spine · search" },
  { to: "/control/ledger", label: "Ledger", hint: "Runs · provenance" },
];

export default function ControlLayout() {
  const status = useBackendStatus();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "var(--sans)",
      }}
    >
      <aside
        style={{
          borderRight: "var(--border-soft)",
          background: "var(--bg-surface)",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <header style={{ padding: "0 20px 16px", borderBottom: "var(--border-soft)" }}>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--mono)",
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-kicker)",
              color: "var(--text-muted)",
            }}
          >
            GAUNTLET · CONTROL
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            Operator console
          </p>
        </header>

        <nav style={{ display: "flex", flexDirection: "column", padding: "12px 12px" }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/control"}
              style={({ isActive }) => ({
                padding: "10px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                textDecoration: "none",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-elevated)" : "transparent",
                display: "block",
                fontSize: 13,
                lineHeight: 1.3,
              })}
            >
              <div style={{ fontWeight: 500 }}>{item.label}</div>
              <div
                style={{
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {item.hint}
              </div>
            </NavLink>
          ))}
        </nav>

        <footer
          style={{
            marginTop: "auto",
            padding: "16px 20px",
            borderTop: "var(--border-soft)",
            fontSize: "var(--t-micro)",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <ReadinessPill status={status} />
          <span style={{ fontFamily: "var(--mono)", letterSpacing: "var(--track-meta)" }}>
            Gauntlet
          </span>
        </footer>
      </aside>

      <main style={{ padding: "32px 40px", overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}

function ReadinessPill({ status }: { status: ReturnType<typeof useBackendStatus> }) {
  if (!status.reachable) {
    return (
      <Pill tone="danger">
        backend unreachable{status.unreachableReason ? ` · ${status.unreachableReason}` : ""}
      </Pill>
    );
  }
  if (status.readiness === "degraded") {
    return <Pill tone="warn">degraded</Pill>;
  }
  return (
    <Pill tone="ok">
      ready · {status.mode ?? "?"}
    </Pill>
  );
}

// Reusable section header used by every page.
export function SurfaceHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header
      style={{
        marginBottom: 24,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "var(--t-section)",
            color: "var(--text-primary)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              margin: "6px 0 0",
              color: "var(--text-secondary)",
              fontSize: 13,
              maxWidth: 720,
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
}: {
  children: React.ReactNode;
  title?: string;
  hint?: string;
}) {
  return (
    <section
      style={{
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: "var(--radius-md, 8px)",
        padding: "16px 18px",
        marginBottom: 16,
      }}
    >
      {(title || hint) && (
        <header style={{ marginBottom: 12 }}>
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--text-primary)",
                letterSpacing: "var(--track-meta)",
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
                margin: "4px 0 0",
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
        rowGap: 8,
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
      <dt style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12 }}>
        {k}
      </dt>
      <dd style={{ margin: 0, color: "var(--text-primary)" }}>{v}</dd>
    </>
  );
}
