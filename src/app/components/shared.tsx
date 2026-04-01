/**
 * RUBERRA Shared Components
 * Atomic primitives shared across all three chambers.
 * One design bloodline.
 */

import React from "react";
import { R } from "./tokens";

// ─── Section Label ─────────────────────────────────────────────────────────────
interface RLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function RLabel({ children, style }: RLabelProps) {
  return (
    <span
      style={{
        display: "block",
        ...R.t.label,
        color: R.ink4,
        textTransform: "uppercase" as const,
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Icon Button ───────────────────────────────────────────────────────────────
interface RIconButtonProps {
  title?: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function RIconButton({
  title,
  onClick,
  children,
  active = false,
  size = 30,
  style,
  className,
}: RIconButtonProps) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: R.r.lg,
        border: `1px solid ${active ? R.strong : R.hairline}`,
        background: active ? R.selected : hov ? "var(--r-elevated)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
        transition: "background 0.12s ease, border-color 0.12s ease",
        flexShrink: 0,
        ...style,
      }}
      className={className}
    >
      {children}
    </button>
  );
}

// ─── Chip ──────────────────────────────────────────────────────────────────────
interface RChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  accent?: string;
}

export function RChip({ label, active = false, onClick, accent }: RChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "3px 10px",
        borderRadius: R.r.sm,
        border: `1px solid ${active ? R.strong : R.hairline}`,
        background: active ? R.selected : "transparent",
        ...R.t.ui,
        fontWeight: active ? 500 : 400,
        color: active ? (accent || R.ink) : R.ink3,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.12s ease",
        outline: "none",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </button>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
interface RDividerProps {
  vertical?: boolean;
  style?: React.CSSProperties;
}

export function RDivider({ vertical = false, style }: RDividerProps) {
  return (
    <div
      style={{
        background: R.hairline,
        ...(vertical
          ? { width: "1px", alignSelf: "stretch" }
          : { height: "1px", width: "100%" }),
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ─── Chamber Tag ───────────────────────────────────────────────────────────────
interface RChamberTagProps {
  label: string;
  color: string;
}

export function RChamberTag({ label, color }: RChamberTagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 8px",
        borderRadius: R.r.sm,
        border: `1px solid ${R.hairline}`,
        background: R.shell,
        ...R.t.label,
        color: color,
        fontFamily: "'Inter', sans-serif",
        textTransform: "uppercase" as const,
      }}
    >
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
interface RProgressProps {
  value: number; // 0–100
  color?: string;
  height?: number;
}

export function RProgress({ value, color = R.ink, height = 2 }: RProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      style={{
        height: `${height}px`,
        background: R.hairline,
        borderRadius: "2px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${clamped}%`,
          background: color,
          borderRadius: "2px",
          transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

// ─── Segment dots ──────────────────────────────────────────────────────────────
interface RSegmentDotsProps {
  total: number;
  filled: number;
  color?: string;
}

export function RSegmentDots({ total, filled, color = R.ink }: RSegmentDotsProps) {
  const safeFilled = Math.min(filled, total);
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "14px",
            height: "2px",
            borderRadius: "1px",
            background: i < safeFilled ? color : R.hairline,
          }}
        />
      ))}
    </div>
  );
}
