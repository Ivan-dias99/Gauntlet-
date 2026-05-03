// Sprint 1 — shared SVG icon set for the studio shell.
//
// Inline SVG keeps the bundle free of external icon dependencies and
// honours `currentColor` so each consumer can drive tone with a CSS
// variable. All icons share a 16×16 viewBox; size and stroke width are
// configurable per-call.
//
// Two families:
//   * Pillar icons (Idle hero) — clock, ear, shield, lightning.
//   * Sidebar icons (10 nav items) — home, compose, code, design,
//     analysis, memory, models, permissions, ledger, settings.

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function Svg({ size = 16, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

// ── Pillar icons ──────────────────────────────────────────────────────

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5 V8 L10.5 9.5" />
    </Svg>
  );
}

export function EarIcon(props: IconProps) {
  return (
    <Svg {...props}>
      {/* Concentric arcs — listening signal */}
      <path d="M8 8 m -1.5 0 a 1.5 1.5 0 1 0 3 0 a 1.5 1.5 0 1 0 -3 0" />
      <path d="M3.5 8 a 4.5 4.5 0 0 1 9 0" />
      <path d="M1 8 a 7 7 0 0 1 14 0" opacity="0.6" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.5 L13.5 3.5 V8 c0 3 -2 5.5 -5.5 6.5 c -3.5 -1 -5.5 -3.5 -5.5 -6.5 V3.5 Z" />
    </Svg>
  );
}

export function LightningIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 1.5 L3.5 9 H7.5 L6 14.5 L12 7 H8.5 Z" />
    </Svg>
  );
}

// ── Sidebar icons ─────────────────────────────────────────────────────

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 7 L8 2.5 L13.5 7 V13 a1 1 0 0 1 -1 1 H3.5 a1 1 0 0 1 -1 -1 Z" />
      <path d="M6.5 14 V10 H9.5 V14" />
    </Svg>
  );
}

export function ComposeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M11 2.5 L13.5 5 L5.5 13 H3 V10.5 Z" />
      <path d="M9.5 4 L12 6.5" />
    </Svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 4.5 L2 8 L5.5 11.5" />
      <path d="M10.5 4.5 L14 8 L10.5 11.5" />
      <path d="M9 3 L7 13" opacity="0.7" />
    </Svg>
  );
}

export function DesignIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" />
      <path d="M2.5 6 H13.5" />
      <path d="M6 6 V13.5" />
    </Svg>
  );
}

export function AnalysisIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 13.5 V2.5" />
      <path d="M2.5 13.5 H13.5" />
      <rect x="4.5" y="9" width="2" height="3.5" />
      <rect x="7.5" y="6" width="2" height="6.5" />
      <rect x="10.5" y="3.5" width="2" height="9" />
    </Svg>
  );
}

export function MemoryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="8" cy="4" rx="5.5" ry="2" />
      <path d="M2.5 4 V12 a5.5 2 0 0 0 11 0 V4" />
      <path d="M2.5 8 a5.5 2 0 0 0 11 0" />
    </Svg>
  );
}

export function ModelsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="3.5" cy="4" r="1.5" />
      <circle cx="3.5" cy="12" r="1.5" />
      <circle cx="12.5" cy="8" r="1.5" />
      <path d="M5 4 H8 L11 8" />
      <path d="M5 12 H8 L11 8" />
    </Svg>
  );
}

export function PermissionsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 1.5 L13.5 3.5 V8 c0 3 -2 5.5 -5.5 6.5 c -3.5 -1 -5.5 -3.5 -5.5 -6.5 V3.5 Z" />
      <path d="M5.5 8 L7.5 10 L11 6.5" />
    </Svg>
  );
}

export function LedgerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" />
      <path d="M5 5.5 H11" />
      <path d="M5 8 H11" />
      <path d="M5 10.5 H8" />
    </Svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.5 V3.5 M8 12.5 V14.5 M1.5 8 H3.5 M12.5 8 H14.5" />
      <path d="M3.5 3.5 L4.9 4.9 M11.1 11.1 L12.5 12.5 M3.5 12.5 L4.9 11.1 M11.1 4.9 L12.5 3.5" opacity="0.7" />
    </Svg>
  );
}

// ── Studio chip + chrome ──────────────────────────────────────────────

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 6 L8 10.5 L12.5 6" />
    </Svg>
  );
}
