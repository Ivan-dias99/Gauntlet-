// Sprint 3 — Studio stub with premium framing + actionable CTAs.
//
// Honest about state (route is not wired), but never a dead end. Each
// stub now offers two concrete paths: a primary action that opens the
// nearest live surface (Ledger, Memory, Settings, Overview), and a
// secondary action that returns Home. Operators always have somewhere
// to go.

import type { CSSProperties, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ContextIcon,
  ComposeIcon,
  CodeIcon,
  DesignIcon,
  AnalysisIcon,
  RouteIcon,
  ChevronRightIcon,
} from "./icons";

interface StubAction {
  label: string;
  to: string;
  primary?: boolean;
}

interface StubMeta {
  title: string;
  fase: string;
  blurb: string;
  requires: string[];
  icon: ReactNode;
  actions: StubAction[];
}

const STUBS: Record<string, StubMeta> = {
  "/composer/context": {
    title: "Context",
    fase: "Wave 1",
    icon: <ContextIcon size={20} />,
    blurb: "Live context inspector — selection, screen, files, app source, and the confidence the brain assigned. Manual override + re-capture.",
    requires: [
      "context capture stream from /composer/context",
      "confidence + provenance fields per source",
      "manual override + re-capture controls",
    ],
    actions: [
      { label: "View latest captures", to: "/composer/ledger", primary: true },
      { label: "Open Settings", to: "/composer/settings" },
    ],
  },
  "/composer/compose": {
    title: "Compose",
    fase: "Fase 3",
    icon: <ComposeIcon size={20} />,
    blurb: "Direct invocation of the /composer/* pipeline from inside the studio — input, plan, preview with cost + latency + files-impacted, reasoning trace.",
    requires: [
      "ComposeCanvas restored from src/composer/panels/",
      "preview rendering with cost + latency annotations",
      "approval inline + audit hand-off to ledger",
    ],
    actions: [
      { label: "Use the cursor capsule", to: "/composer", primary: true },
      { label: "Inspect previous runs", to: "/composer/ledger" },
    ],
  },
  "/composer/code": {
    title: "Code",
    fase: "Wave 1",
    icon: <CodeIcon size={20} />,
    blurb: "IDE-style patch + diff renderer with syntax highlighting, working-tree apply, test-pass gate.",
    requires: [
      "diff renderer",
      "patch apply against the workspace",
      "test gate before commit",
    ],
    actions: [
      { label: "Browse code runs in Ledger", to: "/composer/ledger", primary: true },
      { label: "Open Memory inspector", to: "/composer/memory" },
    ],
  },
  "/composer/design": {
    title: "Design",
    fase: "Wave 2",
    icon: <DesignIcon size={20} />,
    blurb: "Canvas with frames, components, and tokens — Figma client cutover already scaffolded in signal-backend/figma_client.py.",
    requires: [
      "canvas renderer",
      "/composer/design endpoint",
      "Figma import flow live",
    ],
    actions: [
      { label: "View design connectors", to: "/composer/permissions", primary: true },
      { label: "Return Home", to: "/composer" },
    ],
  },
  "/composer/analysis": {
    title: "Analysis",
    fase: "Wave 2",
    icon: <AnalysisIcon size={20} />,
    blurb: "Long-form report builder with charts, tables, narrative blocks. CSV / SQL / JSON ingestion.",
    requires: [
      "report renderer (charts + tables)",
      "data ingestion (csv / sql / json)",
      "exec summary generator with extended thinking",
    ],
    actions: [
      { label: "View run analytics", to: "/composer/overview", primary: true },
      { label: "Inspect Memory", to: "/composer/memory" },
    ],
  },
  "/composer/route": {
    title: "Route",
    fase: "Wave 1",
    icon: <RouteIcon size={20} />,
    blurb: "Tool routing console — model gateway state, per-tool latency, cost, and the routing reasons.",
    requires: [
      "tools registry visualisation (read from registry.ts)",
      "model gateway routing reasons",
      "per-tool latency + cost summary",
    ],
    actions: [
      { label: "View model gateway", to: "/composer/models", primary: true },
      { label: "Open Settings", to: "/composer/settings" },
    ],
  },
};

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
  padding: "24px 0",
  maxWidth: 760,
};

const breadcrumbStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const breadcrumbLinkStyle: CSSProperties = {
  color: "var(--text-secondary)",
  textDecoration: "none",
};

const titleRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};

const iconBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: 10,
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  border: "1px solid color-mix(in oklab, var(--accent) 38%, transparent)",
  color: "var(--accent)",
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--serif)",
  fontWeight: 400,
  fontSize: "clamp(28px, 3vw, 36px)",
  color: "var(--text-primary)",
  letterSpacing: "var(--track-tight, -0.015em)",
};

const fasePillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "999px",
  background: "color-mix(in oklab, var(--accent) 14%, transparent)",
  border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
  color: "var(--accent)",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
};

const blurbStyle: CSSProperties = {
  margin: 0,
  fontSize: 14.5,
  color: "var(--text-secondary)",
  lineHeight: 1.7,
};

const cardStyle: CSSProperties = {
  background: "color-mix(in oklab, var(--bg-surface) 92%, transparent)",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-md, 10px)",
  boxShadow: "0 0 0 1px color-mix(in oklab, var(--accent) 10%, transparent)",
  padding: "16px 18px",
};

const cardHeaderStyle: CSSProperties = {
  margin: "0 0 10px",
  fontFamily: "var(--mono)",
  fontSize: "var(--t-meta, 11px)",
  letterSpacing: "var(--track-meta, 0.12em)",
  textTransform: "uppercase",
  color: "var(--text-muted)",
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 4,
};

const primaryActionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  background: "color-mix(in oklab, var(--accent) 22%, transparent)",
  border: "1px solid color-mix(in oklab, var(--accent) 60%, transparent)",
  borderRadius: "var(--radius-sm, 6px)",
  color: "var(--text-primary)",
  fontFamily: "var(--sans)",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
};

const secondaryActionStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 16px",
  background: "transparent",
  border: "1px solid var(--border-color-soft)",
  borderRadius: "var(--radius-sm, 6px)",
  color: "var(--text-secondary)",
  fontFamily: "var(--sans)",
  fontSize: 13,
  cursor: "pointer",
  textDecoration: "none",
};

const fallback: StubMeta = {
  title: "Studio",
  fase: "Fase 2+",
  icon: null,
  blurb: "This studio surface is not wired in this fase.",
  requires: [],
  actions: [{ label: "Return Home", to: "/composer", primary: true }],
};

export default function StudioStub() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = STUBS[pathname] ?? fallback;

  return (
    <section style={wrapStyle} data-studio-stub={pathname}>
      <nav style={breadcrumbStyle} aria-label="breadcrumb">
        <Link to="/composer" style={breadcrumbLinkStyle}>Studio</Link>
        <span aria-hidden>›</span>
        <span style={{ color: "var(--text-primary)" }}>{meta.title}</span>
      </nav>

      <header style={titleRowStyle}>
        {meta.icon && <span style={iconBadgeStyle} aria-hidden>{meta.icon}</span>}
        <h1 style={titleStyle}>{meta.title}</h1>
        <span style={fasePillStyle}>{meta.fase}</span>
      </header>

      <p style={blurbStyle}>{meta.blurb}</p>

      {meta.requires.length > 0 && (
        <div style={cardStyle}>
          <h3 style={cardHeaderStyle}>What needs to ship</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--text-primary)", lineHeight: 1.75 }}>
            {meta.requires.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={actionsRowStyle}>
        {meta.actions.map((a) => (
          <button
            key={a.to + a.label}
            type="button"
            onClick={() => navigate(a.to)}
            style={a.primary ? primaryActionStyle : secondaryActionStyle}
          >
            {a.label}
            <ChevronRightIcon size={12} />
          </button>
        ))}
      </div>
    </section>
  );
}
