/**
 * RUBERRA — Organism Design Language
 * Reusable constellation motifs derived from the canonical landing organism.
 * Nodes, concentric rings, pulse dots, chamber links, telemetry clusters.
 * Used across: empty states, loading states, section backgrounds, chamber identity.
 *
 * NOT decoration — systemic language.
 */

import { motion } from "motion/react";

// ─── Chamber Node — a single living dot with concentric pulse ring ──────────

export function ChamberNode({
  color,
  size = 6,
  pulseSize = 18,
  delay = 0,
  label,
  style,
}: {
  color: string;
  size?: number;
  pulseSize?: number;
  delay?: number;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: `${pulseSize}px`, height: `${pulseSize}px`, ...style }}>
      {/* Concentric ring — breathing */}
      <motion.div
        animate={{ opacity: [0.08, 0.25, 0.08], scale: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: `${pulseSize}px`,
          height: `${pulseSize}px`,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          opacity: 0.15,
        }}
      />
      {/* Core dot */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.85, scale: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: color,
        }}
      />
      {/* Label */}
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          style={{
            position: "absolute",
            top: `${pulseSize + 4}px`,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "7px",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--r-dim)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}

// ─── Trinity Cluster — Lab + School + Creation in one compact motif ─────────

export function TrinityCluster({
  size = "sm",
  style,
}: {
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
}) {
  const s = size === "sm" ? 4 : size === "md" ? 6 : 8;
  const gap = size === "sm" ? 14 : size === "md" ? 20 : 28;
  const ring = size === "sm" ? 12 : size === "md" ? 18 : 24;
  const chambers = [
    { color: "var(--chamber-lab)", delay: 0 },
    { color: "var(--chamber-school)", delay: 0.3 },
    { color: "var(--chamber-creation)", delay: 0.6 },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${gap}px`, ...style }}>
      {chambers.map((c, i) => (
        <ChamberNode key={i} color={c.color} size={s} pulseSize={ring} delay={c.delay} />
      ))}
    </div>
  );
}

// ─── Pulse Dot — a minimal living indicator ─────────────────────────────────

export function PulseDot({
  color = "var(--r-ok)",
  size = 5,
  duration = 1.2,
}: {
  color?: string;
  size?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Telemetry Strip — a horizontal readout row (key · value) ───────────────

export function TelemetryStrip({
  items,
  style,
}: {
  items: { label: string; value: string; color?: string }[];
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "8px 12px",
        borderRadius: "2px",
        border: "1px solid var(--r-border-soft)",
        background: "color-mix(in srgb, var(--r-surface) 50%, var(--r-bg))",
        ...style,
      }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {i > 0 && <span style={{ width: "1px", height: "10px", background: "var(--r-border-soft)", flexShrink: 0 }} />}
          <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", color: item.color ?? "var(--r-dim)" }}>
            {item.label}
          </span>
          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.03em", color: "var(--r-subtext)" }}>
            {item.value}
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── Structural Grid Background — same thin grid as the landing ─────────────

export function StructuralGridBg({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(var(--r-border-soft) 1px, transparent 1px),
          linear-gradient(90deg, var(--r-border-soft) 1px, transparent 1px)
        `,
        backgroundSize: "52px 52px",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

// ─── Chamber Accent Line — a 2px accent line at the top of a surface ────────

export function ChamberAccentLine({ color, opacity = 0.5 }: { color: string; opacity?: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "2px",
        background: color,
        opacity,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Mini Constellation — compact organism for empty states / backgrounds ───

export function MiniConstellation({
  chamber,
  style,
}: {
  chamber: "lab" | "school" | "creation" | "profile";
  style?: React.CSSProperties;
}) {
  const chamberColor =
    chamber === "lab" ? "var(--chamber-lab)"
    : chamber === "school" ? "var(--chamber-school)"
    : chamber === "creation" ? "var(--chamber-creation)"
    : "var(--r-subtext)";

  const nodes = [
    { x: 50, y: 50, r: 3, color: chamberColor },
    { x: 25, y: 30, r: 1.8, color: "var(--r-dim)" },
    { x: 75, y: 30, r: 1.8, color: "var(--r-dim)" },
    { x: 35, y: 75, r: 1.5, color: "var(--r-dim)" },
    { x: 65, y: 75, r: 1.5, color: "var(--r-dim)" },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[1,2],[3,4]];

  return (
    <div style={{ width: "80px", height: "80px", position: "relative", ...style }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="var(--r-border)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
          />
        ))}
        {/* Pulse ring on center */}
        <motion.circle
          cx={50} cy={50} r={8}
          fill="none"
          stroke={chamberColor}
          strokeWidth="0.4"
          animate={{ opacity: [0.06, 0.2, 0.06], r: [6, 12, 6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r={n.r}
            fill={n.color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: i === 0 ? 0.9 : 0.6, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    </div>
  );
}
