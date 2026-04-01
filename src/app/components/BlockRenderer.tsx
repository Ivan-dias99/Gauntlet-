/**
 * RUBERRA BlockRenderer — Metamorphosis Edition
 * Turns AI structured output into materialized visual surfaces.
 * Mineral white / structured / semantic / zero noise.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { type MessageBlock, type StatusFlag, type BlockType } from "./shell-types";

/** Metamorphic output class — container hierarchy adapts per response kind */
export type MetamorphicResponseClass =
  | "analytical"
  | "execution"
  | "lesson"
  | "artifact"
  | "status_progress"
  | "signal_pulse";

function blockTypeToResponseClass(type: BlockType): MetamorphicResponseClass {
  switch (type) {
    case "execution":
    case "blueprint":
      return "execution";
    case "lesson":
      return "lesson";
    case "creation":
      return "artifact";
    case "timeline":
      return "status_progress";
    case "signal":
      return "signal_pulse";
    default:
      return "analytical";
  }
}

export interface MetamorphicSurfaceStyle {
  responseClass: MetamorphicResponseClass;
  rail:          string;
  railWidth:     string;
  bg:            string;
  radius:        string;
  shadow:        string;
  headerBg:      string;
  bodyPad:       string;
}

export type MetamorphicChamber = "lab" | "school" | "creation";

function chamberAccentRail(ch: MetamorphicChamber): string {
  if (ch === "lab") return "var(--chamber-lab)";
  if (ch === "school") return "var(--chamber-school)";
  return "var(--chamber-creation)";
}

export function getMetamorphicSurface(block: MessageBlock, chamber?: MetamorphicChamber): MetamorphicSurfaceStyle {
  const responseClass = blockTypeToResponseClass(block.type as BlockType);
  const surface = getMetamorphicSurfaceForClass(responseClass);
  if (chamber && responseClass === "analytical") {
    return { ...surface, rail: chamberAccentRail(chamber) };
  }
  return surface;
}

export function getMetamorphicSurfaceForClass(responseClass: MetamorphicResponseClass): MetamorphicSurfaceStyle {
  const base = {
    railWidth: "3px",
    radius:    "10px",
    shadow:    "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
    bodyPad:   "0",
    headerBg:  "var(--r-elevated)",
  };
  switch (responseClass) {
    case "analytical":
      return { ...base, responseClass, rail: "var(--r-accent)", bg: "var(--r-surface)", headerBg: "var(--r-elevated)", shadow: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px var(--r-border-soft)" };
    case "execution":
      return { ...base, responseClass, rail: "var(--r-warn)", bg: "var(--r-surface)", headerBg: "color-mix(in srgb, var(--r-warn) 6%, var(--r-elevated))", shadow: "0 2px 14px rgba(0,0,0,0.05), 0 0 0 1px color-mix(in srgb, var(--r-warn) 12%, var(--r-border))" };
    case "lesson":
      return { ...base, responseClass, rail: "var(--r-ok)", bg: "var(--r-surface)", headerBg: "color-mix(in srgb, var(--r-ok) 7%, var(--r-elevated))", shadow: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px color-mix(in srgb, var(--r-ok) 14%, var(--r-border-soft))" };
    case "artifact":
      return { ...base, responseClass, rail: "var(--chamber-creation)", bg: "var(--r-surface)", headerBg: "color-mix(in srgb, var(--chamber-creation) 8%, var(--r-elevated))", shadow: "0 2px 14px rgba(0,0,0,0.05), 0 0 0 1px color-mix(in srgb, var(--chamber-creation) 16%, var(--r-border-soft))" };
    case "status_progress":
      return { ...base, responseClass, rail: "var(--r-accent-soft)", bg: "var(--r-surface)", headerBg: "var(--r-elevated)", shadow: "0 1px 8px rgba(0,0,0,0.03), 0 0 0 1px var(--r-border-soft)" };
    case "signal_pulse":
      return { ...base, responseClass, rail: "var(--r-subtext)", railWidth: "2px", bg: "var(--r-surface)", headerBg: "var(--r-bg)", shadow: "0 1px 6px rgba(0,0,0,0.03), 0 0 0 1px var(--r-border-soft)" };
    default:
      return { ...base, responseClass: "analytical", rail: "var(--r-accent)", bg: "var(--r-surface)", headerBg: "var(--r-elevated)", shadow: base.shadow };
  }
}

/** Heuristic class for plain assistant text (no structured blocks) */
export function inferMetamorphicClassFromText(content: string): MetamorphicResponseClass {
  const sample = content.slice(0, 1200).toLowerCase();
  if (/\b(lesson|curriculum|mastery|objective|quiz|practice)\b/.test(sample)) return "lesson";
  if (/\b(artifact|bundle|export|ship|release)\b/.test(sample) || /```[\s\S]{20,}/.test(content)) return "artifact";
  if (/\b(phase\s*\d|step\s*\d|progress|checkpoint|milestone|\d+\s*%\s*(complete|done))\b/.test(sample)) return "status_progress";
  if (/\b(signal|alert|pulse|notable|heads[\s-]?up)\b/.test(sample)) return "signal_pulse";
  if (/\b(execute|deploy|run\s+pipeline|build\s+and)\b/.test(sample)) return "execution";
  if (/\b(therefore|hypothesis|trade-?off|evidence|analysis|audit)\b/.test(sample)) return "analytical";
  return "analytical";
}

// ─── Status system ────────────────────────────────────────────────────────────

const STATUS_COLOR: Partial<Record<StatusFlag, string>> = {
  pass:     "var(--r-ok)",
  done:     "var(--r-ok)",
  live:     "var(--r-ok)",
  verified: "var(--r-ok)",
  active:   "var(--r-ok)",
  warn:     "var(--r-warn)",
  partial:  "var(--r-warn)",
  draft:    "var(--r-warn)",
  review:   "var(--r-warn)",
  current:  "var(--r-accent)",
  running:  "var(--r-accent)",
  fail:     "var(--r-err)",
  error:    "var(--r-err)",
  blocked:  "var(--r-err)",
  pending:  "var(--r-subtext)",
  locked:   "var(--r-dim)",
  skip:     "var(--r-dim)",
};

const STATUS_ICON: Partial<Record<StatusFlag, string>> = {
  pass: "✓", done: "✓", verified: "✓", live: "●", active: "●",
  current: "→", running: "◎",
  warn: "◐", partial: "◐", draft: "◐", review: "◐",
  fail: "✗", error: "✗", blocked: "✗",
  pending: "○", locked: "⌥", skip: "–",
};

function getStatusColor(s?: StatusFlag): string {
  return s ? (STATUS_COLOR[s] ?? "var(--r-dim)") : "var(--r-dim)";
}

function StatusDot({ status }: { status?: StatusFlag }) {
  const c = getStatusColor(status);
  return (
    <span
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: status && ["pass","done","live","verified","active"].includes(status) ? c : "transparent",
        border: `1.5px solid ${c}`,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

function StatusChip({ status }: { status: StatusFlag }) {
  const color = getStatusColor(status);
  const icon  = STATUS_ICON[status] ?? "·";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        padding: "1px 7px",
        borderRadius: "3px",
        border: `1px solid ${color}28`,
        background: `${color}0e`,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        fontWeight: 500,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color,
        flexShrink: 0,
        whiteSpace: "nowrap",
        lineHeight: 1.6,
      }}
    >
      <span style={{ fontSize: "8px", opacity: 0.85 }}>{icon}</span>
      {status}
    </span>
  );
}

// ─── Block type → visual identity ─────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  verdict:   { label: "VERDICT",   color: "var(--r-accent)", icon: "⊞" },
  report:    { label: "REPORT",    color: "var(--r-accent)", icon: "≡" },
  execution: { label: "EXECUTION", color: "var(--r-warn)",   icon: "▸" },
  lesson:    { label: "LESSON",    color: "var(--r-ok)",     icon: "◈" },
  creation:  { label: "CREATION",  color: "var(--r-ok)",     icon: "◇" },
  signal:    { label: "SIGNAL",    color: "var(--r-subtext)",icon: "◉" },
  audit:     { label: "AUDIT",     color: "var(--r-warn)",   icon: "◻" },
  matrix:    { label: "MATRIX",    color: "var(--r-accent)", icon: "⊠" },
  tree:      { label: "TREE",      color: "var(--r-ok)",     icon: "⊢" },
  timeline:  { label: "TIMELINE",  color: "var(--r-subtext)",icon: "⊸" },
  evidence:  { label: "EVIDENCE",  color: "var(--r-ok)",     icon: "⊙" },
  dossier:   { label: "DOSSIER",   color: "var(--r-accent)", icon: "⊟" },
  blueprint: { label: "BLUEPRINT", color: "var(--r-warn)",   icon: "⊕" },
};

// ─── Block header ─────────────────────────────────────────────────────────────

function BlockHeader({ block, headerBackground }: { block: MessageBlock; headerBackground?: string }) {
  const cfg = TYPE_CONFIG[block.type] ?? { label: block.type.toUpperCase(), color: "var(--r-subtext)", icon: "·" };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid var(--r-border-soft)",
        background: headerBackground ?? "var(--r-elevated)",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
        <span style={{ color: cfg.color, fontSize: "11px", lineHeight: 1, flexShrink: 0, opacity: 0.9 }}>
          {cfg.icon}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.11em",
            color: cfg.color,
            flexShrink: 0,
            textTransform: "uppercase",
          }}
        >
          {cfg.label}
        </span>
        {block.title && (
          <>
            <span style={{ color: "var(--r-border)", fontSize: "9px", flexShrink: 0, opacity: 0.5 }}>│</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--r-text)",
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
              }}
            >
              {block.title}
            </span>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {block.meta?.progress && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              color: "var(--r-subtext)",
              letterSpacing: "0.05em",
            }}
          >
            {block.meta.progress}
          </span>
        )}
        {block.status && <StatusChip status={block.status} />}
      </div>
    </div>
  );
}

// ─── Progress bar row ─────────────────────────────────────────────────────────

function ProgressBarInline({ status }: { status?: StatusFlag }) {
  if (!status) return null;
  const pct =
    status === "done"    ? 100 :
    status === "current" || status === "running" ? 55 :
    status === "partial" || status === "review"  ? 40 :
    status === "pending" ? 15 :
    status === "locked"  ? 0  : null;

  if (pct === null) return null;
  const color = getStatusColor(status);

  return (
    <div
      style={{
        width: "48px",
        height: "3px",
        background: "var(--r-border)",
        borderRadius: "1.5px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: "1.5px",
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

// ─── Standard item row ────────────────────────────────────────────────────────

function ItemRow({
  item, isLast, showBar,
}: {
  item: { label: string; value?: string; status?: StatusFlag };
  isLast: boolean;
  showBar?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "5px 0",
        borderBottom: isLast ? "none" : "1px solid var(--r-border-soft)",
        minHeight: "28px",
      }}
    >
      <StatusDot status={item.status} />
      <span
        style={{
          fontSize: "12px",
          color: item.status === "locked" ? "var(--r-dim)" : "var(--r-text)",
          flex: 1,
          fontFamily: "'Inter', system-ui, sans-serif",
          lineHeight: "1.45",
          letterSpacing: "-0.005em",
        }}
      >
        {item.label}
      </span>
      {item.value && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "var(--r-subtext)",
            flexShrink: 0,
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.value}
        </span>
      )}
      {showBar && <ProgressBarInline status={item.status} />}
      {item.status && <StatusChip status={item.status} />}
    </div>
  );
}

// ─── Section renderers by block type ─────────────────────────────────────────

function SectionDefault({ section, showBars, airy }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
  showBars?: boolean;
  airy?: boolean;
}) {
  return (
    <div style={{ padding: airy ? "12px 18px 10px" : "9px 15px 6px" }}>
      {section.heading && (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--r-subtext)",
            marginBottom: "4px",
          }}
        >
          {section.heading}
        </p>
      )}
      {section.items.map((item, i) => (
        <ItemRow
          key={i}
          item={item}
          isLast={i === section.items.length - 1}
          showBar={showBars}
        />
      ))}
    </div>
  );
}

function SectionExecution({ section }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
}) {
  return (
    <div style={{ padding: "12px 16px 10px" }}>
      {section.heading && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-subtext)", marginBottom: "6px" }}>
          {section.heading}
        </p>
      )}
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: "8px", top: "10px", bottom: "10px", width: "1px", background: "var(--r-border-soft)" }} />
        {section.items.map((item, i) => {
          const color = getStatusColor(item.status);
          const icon  = item.status ? (STATUS_ICON[item.status] ?? "○") : "○";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "4px 0",
                position: "relative",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: ["pass","done","live","active"].includes(item.status ?? "") ? color : "var(--r-surface)",
                  border: `1.5px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "7px",
                  color: ["pass","done","live","active"].includes(item.status ?? "") ? "white" : color,
                  flexShrink: 0,
                  marginTop: "2px",
                  zIndex: 1,
                }}
              >
                {["pass","done"].includes(item.status ?? "") ? "✓" : ""}
              </span>
              <div style={{ flex: 1, paddingBottom: "6px", borderBottom: i < section.items.length - 1 ? "none" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: item.status === "current" || item.status === "running" ? 500 : 400,
                      color: item.status === "locked" ? "var(--r-dim)" : "var(--r-text)",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </span>
                  {item.status && <StatusChip status={item.status} />}
                </div>
                {item.value && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "var(--r-subtext)", display: "block", marginTop: "2px" }}>
                    {item.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionAudit({ section }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
}) {
  const passes  = section.items.filter(i => i.status === "pass" || i.status === "done").length;
  const fails   = section.items.filter(i => i.status === "fail" || i.status === "error" || i.status === "blocked").length;
  const warns   = section.items.filter(i => i.status === "warn" || i.status === "partial").length;
  const total   = section.items.length;

  return (
    <div style={{ padding: "8px 14px 4px" }}>
      {section.heading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-subtext)", margin: 0 }}>
            {section.heading}
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {passes > 0 && <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-ok)" }}>{passes} pass</span>}
            {warns  > 0 && <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-warn)" }}>{warns} warn</span>}
            {fails  > 0 && <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-err)" }}>{fails} fail</span>}
          </div>
        </div>
      )}
      {section.items.map((item, i) => {
        const color = getStatusColor(item.status);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 8px",
              marginBottom: "3px",
              borderRadius: "3px",
              background: item.status === "fail" || item.status === "error" ? `${color}09` :
                          item.status === "warn" ? `${color}08` :
                          item.status === "pass" || item.status === "done" ? `${color}07` : "transparent",
              borderLeft: `2px solid ${color}44`,
            }}
          >
            <span style={{ color, fontFamily: "monospace", fontSize: "11px", flexShrink: 0 }}>
              {STATUS_ICON[item.status ?? "pending"] ?? "·"}
            </span>
            <span style={{ fontSize: "12px", color: "var(--r-text)", flex: 1, fontFamily: "'Inter', system-ui, sans-serif" }}>
              {item.label}
            </span>
            {item.value && (
              <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "monospace", flexShrink: 0 }}>
                {item.value}
              </span>
            )}
            {item.status && <StatusChip status={item.status} />}
          </div>
        );
      })}
    </div>
  );
}

function SectionMatrix({ section }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
}) {
  return (
    <div style={{ padding: "8px 0 4px" }}>
      {section.heading && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-subtext)", margin: "0 14px 6px" }}>
          {section.heading}
        </p>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
          <tbody>
            {section.items.map((item, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < section.items.length - 1 ? "1px solid var(--r-border-soft)" : "none" }}
              >
                <td style={{ padding: "5px 14px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", width: "38%", verticalAlign: "top" }}>
                  {item.label}
                </td>
                <td style={{ padding: "5px 8px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", verticalAlign: "top" }}>
                  {item.value ?? "—"}
                </td>
                <td style={{ padding: "5px 14px 5px 0", textAlign: "right", verticalAlign: "top", width: "80px" }}>
                  {item.status && <StatusChip status={item.status} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionTimeline({ section }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
}) {
  return (
    <div style={{ padding: "8px 14px 4px" }}>
      {section.heading && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-subtext)", marginBottom: "8px" }}>
          {section.heading}
        </p>
      )}
      {section.items.map((item, i) => {
        const color = getStatusColor(item.status);
        const isLast = i === section.items.length - 1;
        return (
          <div key={i} style={{ display: "flex", gap: "12px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: ["done","pass","live"].includes(item.status ?? "") ? color : "var(--r-surface)",
                  border: `2px solid ${color}`,
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              />
              {!isLast && (
                <div style={{ width: "1px", flex: 1, background: "var(--r-border-soft)", marginTop: "3px", minHeight: "20px" }} />
              )}
            </div>
            <div style={{ paddingBottom: isLast ? "4px" : "12px", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: item.status === "current" || item.status === "running" ? 500 : 400 }}>
                  {item.label}
                </span>
                {item.status && <StatusChip status={item.status} />}
              </div>
              {item.value && (
                <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace", display: "block", marginTop: "2px" }}>
                  {item.value}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionEvidence({ section }: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
}) {
  return (
    <div style={{ padding: "11px 16px 9px" }}>
      {section.heading && (
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-subtext)", marginBottom: "6px" }}>
          {section.heading}
        </p>
      )}
      {section.items.map((item, i) => {
        const color = getStatusColor(item.status);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              padding: "6px 0",
              borderBottom: i < section.items.length - 1 ? "1px solid var(--r-border-soft)" : "none",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: "2px", alignSelf: "stretch", borderRadius: "1px", background: color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.5, display: "block" }}>
                {item.label}
              </span>
              {item.value && (
                <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace", display: "block", marginTop: "2px" }}>
                  {item.value}
                </span>
              )}
            </div>
            {item.status && <StatusChip status={item.status} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

function BlockSection({
  section,
  blockType,
}: {
  section: { heading: string; items: { label: string; value?: string; status?: StatusFlag }[] };
  blockType: BlockType;
}) {
  switch (blockType) {
    case "execution":
      return <SectionExecution section={section} />;
    case "audit":
      return <SectionAudit section={section} />;
    case "matrix":
      return <SectionMatrix section={section} />;
    case "timeline":
      return <SectionTimeline section={section} />;
    case "evidence":
      return <SectionEvidence section={section} />;
    case "lesson":
      return <SectionDefault section={section} showBars airy />;
    default:
      return <SectionDefault section={section} />;
  }
}

// ─── Block footer ─────────────────────────────────────────────────────────────

function BlockFooter({ block }: { block: MessageBlock }) {
  if (!block.meta?.next && !block.meta?.tags?.length) return null;

  return (
    <div
      style={{
        padding: "7px 14px",
        borderTop: "1px solid var(--r-border-soft)",
        background: "var(--r-elevated)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {block.meta?.next && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.11em",
              color: "var(--r-dim)",
              textTransform: "uppercase",
              flexShrink: 0,
              border: "1px solid var(--r-border)",
              borderRadius: "2px",
              padding: "1px 5px",
            }}
          >
            NEXT
          </span>
          <span style={{ fontSize: "11.5px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {block.meta.next}
          </span>
        </div>
      )}
      {block.meta?.tags?.length ? (
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", flexShrink: 0 }}>
          {block.meta.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "1px 7px",
                borderRadius: "3px",
                border: "1px solid var(--r-border)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.06em",
                color: "var(--r-dim)",
                lineHeight: 1.6,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ─── Single block ─────────────────────────────────────────────────────────────

function SingleBlock({ block, chamber }: { block: MessageBlock; chamber?: MetamorphicChamber }) {
  const [collapsed, setCollapsed] = useState(false);
  const surface = getMetamorphicSurface(block, chamber);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        borderRadius: surface.radius,
        overflow: "hidden",
        background: surface.bg,
        boxShadow: surface.shadow,
        border: "1px solid var(--r-border-soft)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          width: surface.railWidth,
          flexShrink: 0,
          background: surface.rail,
          opacity: 0.92,
        }}
        aria-hidden
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => block.sections.length > 0 && setCollapsed((c) => !c)}
          style={{
            cursor: block.sections.length > 0 ? "pointer" : "default",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") setCollapsed((c) => !c);
          }}
        >
          <BlockHeader block={block} headerBackground={surface.headerBg} />
        </div>

        {!collapsed &&
          block.sections.map((section, j) => (
            <div key={j} style={{ borderBottom: j < block.sections.length - 1 ? "1px solid var(--r-border-soft)" : "none" }}>
              <BlockSection section={section} blockType={block.type as BlockType} />
            </div>
          ))}

        <BlockFooter block={block} />
      </div>
    </div>
  );
}

// ─── Inline markdown renderer (for plain-text fallback) ───────────────────────

export function InlineMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: "7px" }} />;

        // Heading h1
        if (/^#\s/.test(trimmed)) {
          const text = trimmed.replace(/^#\s/, "");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0 6px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--r-text)",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {text}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--r-border-soft)" }} />
            </div>
          );
        }

        // Heading h2/h3
        if (/^#{2,3}\s/.test(trimmed)) {
          const text = trimmed.replace(/^#{2,3}\s/, "");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px 0 4px" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "var(--r-subtext)",
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </span>
              <div style={{ flex: 1, height: "1px", background: "var(--r-border-soft)" }} />
            </div>
          );
        }

        // Checklist done
        if (/^\[x\]\s/i.test(trimmed)) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "2.5px 0" }}>
              <span style={{ color: "var(--r-ok)", fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "4px" }}>✓</span>
              <span style={{ fontSize: "13.5px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.65", textDecoration: "line-through", letterSpacing: "-0.003em" }}>
                {trimmed.replace(/^\[x\]\s/i, "")}
              </span>
            </div>
          );
        }

        // Checklist pending
        if (/^\[ \]\s/.test(trimmed)) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "2.5px 0" }}>
              <span style={{ color: "var(--r-dim)", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "5px" }}>○</span>
              <span style={{ fontSize: "13.5px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.65", letterSpacing: "-0.003em" }}>
                <RenderInline text={trimmed.replace(/^\[ \]\s/, "")} />
              </span>
            </div>
          );
        }

        // Bullet list
        if (/^[-*•]\s/.test(trimmed)) {
          const text = trimmed.replace(/^[-*•]\s/, "");
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "2px 0" }}>
              <span style={{ color: "var(--r-dim)", fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "6px" }}>–</span>
              <span style={{ fontSize: "13.5px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.65", letterSpacing: "-0.003em" }}>
                <RenderInline text={text} />
              </span>
            </div>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const num  = trimmed.match(/^(\d+)/)?.[1];
          const text = trimmed.replace(/^\d+\.\s/, "");
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px", padding: "2px 0" }}>
              <span style={{ color: "var(--r-subtext)", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, marginTop: "3px", minWidth: "18px", textAlign: "right" }}>{num}.</span>
              <span style={{ fontSize: "13.5px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.65", letterSpacing: "-0.003em" }}>
                <RenderInline text={text} />
              </span>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={i} style={{ fontSize: "13.5px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.72", margin: "2px 0", letterSpacing: "-0.003em" }}>
            <RenderInline text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

function RenderInline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={i} style={{ fontWeight: 600, color: "var(--r-text)", letterSpacing: "-0.01em" }}>{part.slice(2, -2)}</strong>;
        }
        if (/^`[^`]+`$/.test(part)) {
          return (
            <code
              key={i}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                background: "var(--r-elevated)",
                border: "1px solid var(--r-border-soft)",
                padding: "0 5px",
                borderRadius: "4px",
                color: "var(--r-accent-soft)",
                lineHeight: 1.5,
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (/^\*[^*]+\*$/.test(part)) {
          return <em key={i} style={{ fontStyle: "italic", color: "var(--r-subtext)" }}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Plain assistant text wrapped in metamorphic surface (no structured blocks) */
export function MetamorphicPlainSurface({
  content,
  responseClass,
  chamber,
}: {
  content: string;
  responseClass: MetamorphicResponseClass;
  chamber?: MetamorphicChamber;
}) {
  let surface = getMetamorphicSurfaceForClass(responseClass);
  if (chamber && responseClass === "analytical") {
    surface = { ...surface, rail: chamberAccentRail(chamber) };
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        borderRadius: surface.radius,
        overflow: "hidden",
        background: surface.bg,
        boxShadow: surface.shadow,
        border: "1px solid var(--r-border-soft)",
      }}
    >
      <div
        style={{ width: surface.railWidth, flexShrink: 0, background: surface.rail, opacity: 0.88 }}
        aria-hidden
      />
      <div style={{ flex: 1, minWidth: 0, padding: "14px 18px 16px", background: surface.bg }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: "var(--r-dim)",
            marginBottom: "12px",
            userSelect: "none",
          }}
        >
          {responseClass === "analytical" && "Analytical surface"}
          {responseClass === "execution" && "Execution surface"}
          {responseClass === "lesson" && "Lesson surface"}
          {responseClass === "artifact" && "Artifact surface"}
          {responseClass === "status_progress" && "Progress surface"}
          {responseClass === "signal_pulse" && "Signal surface"}
        </div>
        <InlineMarkdown content={content} />
      </div>
    </div>
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export function BlockRenderer({ blocks, chamber }: { blocks: MessageBlock[]; chamber?: MetamorphicChamber }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <SingleBlock block={block} chamber={chamber} />
        </motion.div>
      ))}
    </div>
  );
}
