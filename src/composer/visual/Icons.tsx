// Wave 8 — inline SVG icon set for the composer surface.
//
// All icons are stroke-based on a 24×24 viewBox, single colour
// (currentColor) so they pick up the surrounding text colour. No
// runtime dep — every glyph is hand-shaped here.

import type { CSSProperties } from "react";

export type IconName =
  // Modes (numbered panels around the central composer)
  | "idle"
  | "context"
  | "compose"
  | "code"
  | "design"
  | "analysis"
  | "memory"
  | "apply"
  | "route"
  // Mode tabs (smaller, inside Compose canvas)
  | "tab-code"
  | "tab-web"
  | "tab-image"
  | "tab-terminal"
  | "tab-memory"
  | "tab-analysis"
  | "tab-design"
  // Pipeline stages
  | "pipe-context"
  | "pipe-intent"
  | "pipe-router"
  | "pipe-tools"
  | "pipe-memory"
  | "pipe-preview"
  | "pipe-approval"
  | "pipe-execution"
  // Decorative
  | "cursor"
  | "arrow-right";

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
  title?: string;
}

export default function Icon({ name, size = 18, strokeWidth = 1.5, style, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={style}
    >
      <PathFor name={name} />
    </svg>
  );
}

function PathFor({ name }: { name: IconName }) {
  switch (name) {
    case "idle":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        </>
      );
    case "context":
      return (
        <>
          <path d="M5 4 H19 V20 H5 Z" />
          <path d="M9 9 H15" />
          <path d="M9 13 H15" />
          <path d="M9 17 H12" />
        </>
      );
    case "compose":
      return (
        <>
          <path d="M3 6 H21" />
          <path d="M3 12 H15" />
          <path d="M3 18 H18" />
          <circle cx="20" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </>
      );
    case "code":
    case "tab-code":
      return (
        <>
          <path d="M9 7 L4 12 L9 17" />
          <path d="M15 7 L20 12 L15 17" />
        </>
      );
    case "design":
    case "tab-design":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="8" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="11" cy="16" r="1.2" fill="currentColor" stroke="none" />
        </>
      );
    case "analysis":
    case "tab-analysis":
      return (
        <>
          <path d="M4 20 V10" />
          <path d="M9 20 V6" />
          <path d="M14 20 V13" />
          <path d="M19 20 V8" />
          <path d="M3 20 H21" />
        </>
      );
    case "memory":
    case "tab-memory":
    case "pipe-memory":
      return (
        <>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6 V12 C4 13.66 7.58 15 12 15 C16.42 15 20 13.66 20 12 V6" />
          <path d="M4 12 V18 C4 19.66 7.58 21 12 21 C16.42 21 20 19.66 20 18 V12" />
        </>
      );
    case "apply":
      return (
        <>
          <path d="M5 12 L10 17 L19 6" />
        </>
      );
    case "route":
      return (
        <>
          <circle cx="5" cy="6" r="2" />
          <circle cx="5" cy="18" r="2" />
          <circle cx="19" cy="12" r="2" />
          <path d="M7 7 Q12 9 17 11" />
          <path d="M7 17 Q12 15 17 13" />
        </>
      );
    case "tab-web":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12 H21" />
          <path d="M12 3 Q7 12 12 21" />
          <path d="M12 3 Q17 12 12 21" />
        </>
      );
    case "tab-image":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8" cy="10" r="1.5" />
          <path d="M5 17 L10 12 L14 16 L17 13 L21 17" />
        </>
      );
    case "tab-terminal":
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 10 L11 13 L7 16" />
          <path d="M13 16 H17" />
        </>
      );
    case "pipe-context":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4 V2" />
          <path d="M12 22 V20" />
          <path d="M4 12 H2" />
          <path d="M22 12 H20" />
        </>
      );
    case "pipe-intent":
      return (
        <>
          <path d="M12 3 C8 3 5 6 5 10 C5 12 6 14 7 15 V18 C7 19 8 20 9 20 H15 C16 20 17 19 17 18 V15 C18 14 19 12 19 10 C19 6 16 3 12 3 Z" />
          <path d="M9 14 H15" />
        </>
      );
    case "pipe-router":
      return (
        <>
          <circle cx="5" cy="12" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="19" cy="18" r="2" />
          <path d="M7 11 L17 7" />
          <path d="M7 13 L17 17" />
        </>
      );
    case "pipe-tools":
      return (
        <>
          <path d="M14 7 L18 3 L21 6 L17 10" />
          <path d="M5 21 L13 13" />
          <path d="M13 13 L17 10" />
          <circle cx="6" cy="20" r="1" />
        </>
      );
    case "pipe-preview":
      return (
        <>
          <path d="M2 12 C5 7 8 5 12 5 C16 5 19 7 22 12 C19 17 16 19 12 19 C8 19 5 17 2 12 Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      );
    case "pipe-approval":
      return (
        <>
          <path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z" />
          <path d="M9 12 L11 14 L15 10" />
        </>
      );
    case "pipe-execution":
      return (
        <>
          <path d="M5 4 V20 L20 12 Z" />
        </>
      );
    case "cursor":
      return (
        <>
          <path d="M5 3 L19 10 L12 12 L10 19 Z" fill="currentColor" />
        </>
      );
    case "arrow-right":
      return (
        <>
          <path d="M5 12 H19" />
          <path d="M14 7 L19 12 L14 17" />
        </>
      );
  }
}

// Map mode → icon name + ordinal (for the numbered badge). Index
// matches the canonical Foto 3 numbering: 1 IDLE, 2 CONTEXT, 3 COMPOSE,
// 4 CODE, 5 DESIGN, 6 ANALYSIS, 7 MEMORY, 8 APPLY, 9 ROUTE.
export const MODE_ICON: Record<string, { icon: IconName; n: number }> = {
  idle:     { icon: "idle",     n: 1 },
  context:  { icon: "context",  n: 2 },
  compose:  { icon: "compose",  n: 3 },
  code:     { icon: "code",     n: 4 },
  design:   { icon: "design",   n: 5 },
  analysis: { icon: "analysis", n: 6 },
  memory:   { icon: "memory",   n: 7 },
  apply:    { icon: "apply",    n: 8 },
  route:    { icon: "route",    n: 9 },
};

// Pipeline stages → icon. Order matches PIPELINE_STAGES in types.ts.
export const PIPELINE_ICON: Record<string, IconName> = {
  "Context Capture":      "pipe-context",
  "Intent Understanding": "pipe-intent",
  "Model Router":         "pipe-router",
  "Tool Registry":        "pipe-tools",
  "Memory Layer":         "pipe-memory",
  "Preview":              "pipe-preview",
  "Approval":             "pipe-approval",
  "Execution":            "pipe-execution",
};

// Pipeline stages → one-line description (subtitle in the strip).
export const PIPELINE_BLURB: Record<string, string> = {
  "Context Capture":      "Selection · screen · files",
  "Intent Understanding": "What the operator wants",
  "Model Router":         "Best model per call",
  "Tool Registry":        "Code · web · image · terminal",
  "Memory Layer":         "Canon · runs · provenance",
  "Preview":              "Diff · plan · artifact",
  "Approval":             "Risk gate before execution",
  "Execution":            "Apply changes · run actions",
};
