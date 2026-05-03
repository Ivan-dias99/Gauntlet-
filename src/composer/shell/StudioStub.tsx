// Sprint 1 — StudioStub with stronger visual framing.
//
// Breadcrumb header (Studio › Section), serif title with a prominent
// fase pill, "What needs to ship" requirements card with cyan-tinted
// border, and a subtle notice pointing operators at /control while
// the studio absorption is in progress.
//
// Honest about state: never claims functionality the route does not
// have. Every fase / requirement is verifiable against the codebase.

import type { CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import Pill from "../../components/atoms/Pill";

interface StubMeta {
  title: string;
  fase: string;
  blurb: string;
  requires: string[];
}

const STUBS: Record<string, StubMeta> = {
  "/composer/compose": {
    title: "Compose",
    fase: "Fase 3",
    blurb: "Direct invocation of the /composer/* pipeline from inside the studio — input, plan, preview with cost + latency + files-impacted, reasoning trace.",
    requires: [
      "ComposeCanvas restored from src/composer/panels/",
      "preview rendering with cost + latency annotations",
      "approval inline + audit hand-off to ledger",
    ],
  },
  "/composer/code": {
    title: "Code",
    fase: "Wave 1",
    blurb: "IDE-style patch + diff renderer with syntax highlighting, working-tree apply, test-pass gate.",
    requires: [
      "diff renderer",
      "patch apply against the workspace",
      "test gate before commit",
    ],
  },
  "/composer/design": {
    title: "Design",
    fase: "Wave 2",
    blurb: "Canvas with frames, components, and tokens — Figma client cutover already scaffolded in signal-backend/figma_client.py.",
    requires: [
      "canvas renderer",
      "/composer/design endpoint",
      "Figma import flow live",
    ],
  },
  "/composer/analysis": {
    title: "Analysis",
    fase: "Wave 2",
    blurb: "Long-form report builder with charts, tables, narrative blocks. CSV / SQL / JSON ingestion.",
    requires: [
      "report renderer (charts + tables)",
      "data ingestion (csv / sql / json)",
      "exec summary generator with extended thinking",
    ],
  },
  "/composer/memory": {
    title: "Memory",
    fase: "Fase 2",
    blurb: "Failure memory + spine inspector + semantic search over runs. Migrates the current /control/memory surface into the studio.",
    requires: [
      "absorb /control/memory page contents",
      "tag system + provenance fields (Wave 1)",
      "semantic search across runs (Wave 1)",
    ],
  },
  "/composer/models": {
    title: "Models",
    fase: "Fase 2",
    blurb: "Model routing, gateway summary, cost tables. Migrates the current /control/models surface into the studio.",
    requires: [
      "absorb /control/models page contents",
      "per-tool latency + cost summary (Wave 1)",
    ],
  },
  "/composer/permissions": {
    title: "Permissions",
    fase: "Fase 2",
    blurb: "Connector × scope matrix. Migrates the current /control/permissions surface; mutation lands when /permissions/{set,get} ships.",
    requires: [
      "absorb /control/permissions page contents",
      "/permissions/{set,get} backend (Wave 1)",
    ],
  },
  "/composer/ledger": {
    title: "Ledger",
    fase: "Fase 2",
    blurb: "Filterable run log with detail panel. Migrates the current /control/ledger surface into the studio.",
    requires: [
      "absorb /control/ledger page contents",
      "ledger event hash + signature (Wave 2)",
    ],
  },
  "/composer/settings": {
    title: "Settings",
    fase: "Fase 2",
    blurb: "Backend config, API keys, runtime, theme. Migrates the current /control/settings surface into the studio.",
    requires: [
      "absorb /control/settings page contents",
      "operator-side write surface for permissions (Wave 1)",
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
  borderRadius: "var(--radius-md, 8px)",
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

const noticeStyle: CSSProperties = {
  margin: 0,
  padding: "10px 14px",
  background: "color-mix(in oklab, var(--bg-elevated) 70%, transparent)",
  border: "1px dashed var(--border-color-soft)",
  borderRadius: "var(--radius-md, 8px)",
  fontSize: 13,
  color: "var(--text-muted)",
  lineHeight: 1.5,
};

const fallback: StubMeta = {
  title: "Studio",
  fase: "Fase 2+",
  blurb: "This studio surface is not wired in this fase.",
  requires: [],
};

export default function StudioStub() {
  const { pathname } = useLocation();
  const meta = STUBS[pathname] ?? fallback;

  return (
    <section style={wrapStyle} data-studio-stub={pathname}>
      <nav style={breadcrumbStyle} aria-label="breadcrumb">
        <Link to="/composer" style={breadcrumbLinkStyle}>Studio</Link>
        <span aria-hidden>›</span>
        <span style={{ color: "var(--text-primary)" }}>{meta.title}</span>
      </nav>

      <header style={titleRowStyle}>
        <h1 style={titleStyle}>{meta.title}</h1>
        <span style={fasePillStyle}>{meta.fase}</span>
        <span style={{ marginLeft: "auto" }}>
          <Pill tone="ghost">stub</Pill>
        </span>
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

      <p style={noticeStyle}>
        Today: visit{" "}
        <Link to="/control" style={{ color: "var(--accent)", textDecoration: "none" }}>
          /control
        </Link>
        {" "}for the operator surfaces still active during the studio migration.
      </p>
    </section>
  );
}
