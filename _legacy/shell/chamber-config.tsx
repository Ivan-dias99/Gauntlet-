// Shared chamber identity — sigils, taglines, nav items.
//
// Wave P-43.4 — every chamber wears the same idle shell (rail +
// workbench hero + sidecar). The only thing that varies between
// chambers is identity metadata: which glyph, which tagline, which
// nav items. This file is the single source of truth for that
// metadata so the unified shell never branches on chamber name in
// JSX.
//
// Sigils inherited from src/pages/LandingPage.tsx where they were
// authored for the landing grid. Reusing them keeps the visual
// vocabulary one piece across landing + product.

import type { ReactElement } from "react";
import type { Chamber } from "../spine/types";

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
      <circle cx="14" cy="14" r="9" />
      <path d="M14 5 L14 23" />
      <path d="M5 14 L23 14" />
      <path d="M7.5 7.5 L20.5 20.5" />
      <path d="M20.5 7.5 L7.5 20.5" />
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
      <rect x="7" y="13" width="14" height="9" rx="1" />
      <path d="M10 13 V10 a4 4 0 0 1 8 0 V13" />
    </svg>
  );
}

function SigilCore() {
  return (
    <svg {...SIGIL_PROPS}>
      <circle cx="14" cy="14" r="3" />
      <circle cx="7" cy="9" r="2" />
      <circle cx="21" cy="9" r="2" />
      <circle cx="14" cy="22" r="2" />
      <path d="M9 10.5 L12.5 12.5" />
      <path d="M19 10.5 L15.5 12.5" />
      <path d="M14 17 L14 20" />
    </svg>
  );
}

export interface ChamberConfig {
  /** Mono uppercase identity label for the rail card and breadcrumb. */
  label: string;
  /** Mono uppercase tagline rendered top-right of the workbench header. */
  tagline: string;
  /** Optional rail tagline (mono dotted form, e.g. "AGENT · CODE · COMMAND"). */
  taglineRail?: string;
  /** SVG sigil — reused in rail card, sidecar idle glyph, and rail nav. */
  sigil: () => ReactElement;
  /** Three middle nav items (between Workbench and Recents). */
  navItems: ReadonlyArray<{ label: string; glyph: string }>;
  /** Hero copy when the chamber has no active work. Imperative serif. */
  heroTitle: string;
  /** Hero subtitle. Sans body, single sentence. */
  heroBody: string;
  /** Sidecar idle subtitle — sits below "SIDECAR IDLE" kicker. */
  sidecarBody: string;
}

export const CHAMBER_CONFIG: Record<Chamber, ChamberConfig> = {
  insight: {
    label: "INSIGHT",
    tagline: "EVIDENCE BEFORE ANSWER",
    taglineRail: "TRIAD · ROUTE · ANSWER",
    sigil: SigilInsight,
    navItems: [
      { label: "Threads", glyph: "◇" },
      { label: "Memory",  glyph: "❒" },
    ],
    heroTitle: "Start with context",
    heroBody:
      "Designs grounded in real context turn out better. Composer lands here in the next phase.",
    sidecarBody:
      "Files, previews and artifacts surface here once a mission opens.",
  },
  surface: {
    label: "SURFACE",
    tagline: "CONTRACTS BECOME INTERFACE",
    taglineRail: "DESIGN · CONTRACT · BUILD",
    sigil: SigilSurface,
    navItems: [
      { label: "Files",          glyph: "❑" },
      { label: "Design Systems", glyph: "▦" },
    ],
    heroTitle: "Start with context",
    heroBody:
      "Designs grounded in real context turn out better. Composer lands here in the next phase.",
    sidecarBody:
      "Files, previews and artifacts surface here once a mission opens.",
  },
  terminal: {
    label: "TERMINAL",
    tagline: "COMMANDS WITH CONSEQUENCE",
    taglineRail: "AGENT · CODE · COMMAND",
    sigil: SigilTerminal,
    navItems: [
      { label: "Routines", glyph: "◐" },
      { label: "Tools",    glyph: "◇" },
    ],
    heroTitle: "Start with context",
    heroBody:
      "Designs grounded in real context turn out better. Composer lands here in the next phase.",
    sidecarBody:
      "Files, previews and artifacts surface here once a mission opens.",
  },
  archive: {
    label: "ARCHIVE",
    tagline: "SEALED MEMORY · PROVENANCE",
    taglineRail: "SEAL · LEDGER · REPLAY",
    sigil: SigilArchive,
    navItems: [
      { label: "Filters",        glyph: "▽" },
      { label: "Failure Memory", glyph: "▣" },
    ],
    heroTitle: "Start with context",
    heroBody:
      "Designs grounded in real context turn out better. Composer lands here in the next phase.",
    sidecarBody:
      "Files, previews and artifacts surface here once a mission opens.",
  },
  core: {
    label: "CORE",
    tagline: "POLICY GOVERNS MOTION",
    taglineRail: "POLICY · ROUTING · BUDGETS",
    sigil: SigilCore,
    navItems: [
      { label: "Routing",     glyph: "↳" },
      { label: "Permissions", glyph: "◇" },
    ],
    heroTitle: "Start with context",
    heroBody:
      "Designs grounded in real context turn out better. Composer lands here in the next phase.",
    sidecarBody:
      "Files, previews and artifacts surface here once a mission opens.",
  },
};
