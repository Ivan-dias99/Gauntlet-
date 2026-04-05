/**
 * RUBERRA — System Components
 * Foundational structural components enforcing the Organism Design Language.
 * No generic SaaS UI. No decorative filler. Sovereign density and consequence.
 */

import React from "react";
import { CHAMBER_COLOR } from "./shell-types";

// ─── Shared Styles ────────────────────────────────────────────────────────────

const fontMono = "'JetBrains Mono', monospace";
const fontSans = "'Inter', system-ui, sans-serif";

const styles = {
  border: "1px solid var(--r-border)",
  borderSoft: "1px solid var(--r-border-soft)",
  radius: "2px",
  surface: "var(--r-surface)",
  elevated: "var(--r-elevated)",
  bg: "var(--r-bg)",
};

// ─── Entity Components ────────────────────────────────────────────────────────

export function EntityTitleBlock({ title, type, status, accent = "var(--r-dim)" }: { title: string; type: string; status?: React.ReactNode; accent?: string }) {
  return (
    <div style={{ paddingBottom: "12px", borderBottom: styles.borderSoft, marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--r-text)", fontFamily: fontSans, margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {status && <div style={{ flexShrink: 0 }}>{status}</div>}
      </div>
      <p style={{ fontSize: "10px", color: accent, fontFamily: fontMono, textTransform: "uppercase", letterSpacing: "0.08em", margin: "6px 0 0" }}>
        {type}
      </p>
    </div>
  );
}

export function StateBadge({ state, color = "var(--r-dim)", variant = "outline" }: { state: string; color?: string; variant?: "outline" | "solid" | "ghost" }) {
  const bg = variant === "solid" ? color : variant === "ghost" ? "transparent" : `${color}14`;
  const border = variant === "solid" ? "none" : `1px solid ${color}20`;
  const textColor = variant === "solid" ? "var(--r-bg)" : color;

  return (
    <span style={{ fontSize: "8px", fontFamily: fontMono, color: textColor, background: bg, border, borderRadius: styles.radius, padding: "2px 6px", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {state}
    </span>
  );
}

export function EntitySummaryBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 14px", background: styles.surface, border: styles.border, borderRadius: styles.radius, margin: "12px 0" }}>
      <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: fontSans, margin: 0, lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}

export function RelationshipList({ title, items }: { title: string; items: { label: string; id: string; onClick?: () => void }[] }) {
  return (
    <div style={{ margin: "12px 0" }}>
      <p style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 6px" }}>{title}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {items.map((item) => (
          <button key={item.id} onClick={item.onClick} style={{ fontSize: "10px", fontFamily: fontMono, color: "var(--r-subtext)", background: "transparent", border: styles.borderSoft, padding: "2px 8px", borderRadius: styles.radius, cursor: item.onClick ? "pointer" : "default" }}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CanonStatusBlock({ status }: { status: "draft" | "active" | "canonical" | "unresolved" | "deprecated" | "conflicting" }) {
  const COLORS: Record<string, string> = {
    draft: "var(--r-dim)", active: "var(--r-accent)", canonical: "var(--r-ok)", unresolved: "var(--r-warn)", deprecated: "var(--r-err)", conflicting: "var(--r-err)"
  };
  return <StateBadge state={status} color={COLORS[status]} variant="outline" />;
}

export function EntityRow({ title, type, meta, onClick }: { title: string; type: React.ReactNode; meta?: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: styles.borderSoft, cursor: onClick ? "pointer" : "default", background: "transparent", transition: "background 0.1s ease" }}
      onMouseEnter={e => onClick && ((e.currentTarget as HTMLElement).style.background = styles.surface)}
      onMouseLeave={e => onClick && ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {typeof type === "string" ? <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-dim)", letterSpacing: "0.05em", transform: "translateY(1px)" }}>{type}</span> : type}
        <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: fontSans, fontWeight: 500 }}>{title}</span>
      </div>
      {meta && <div style={{ flexShrink: 0 }}>{meta}</div>}
    </div>
  );
}

// ─── Navigation Components ────────────────────────────────────────────────────

export function ChamberNavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {children}
      </div>
    </div>
  );
}

export function TabSet({ tabs, active, onSelect }: { tabs: { id: string; label: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ display: "flex", borderBottom: styles.border, gap: "16px", marginBottom: "16px" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          style={{ padding: "8px 0", fontSize: "11px", fontFamily: fontMono, color: active === tab.id ? "var(--r-text)" : "var(--r-dim)", background: "transparent", border: "none", borderBottom: `2px solid ${active === tab.id ? "var(--r-text)" : "transparent"}`, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Shell Components ─────────────────────────────────────────────────────────

export function ContextBand({ chamber, pressure, state }: { chamber: "lab" | "school" | "creation" | "profile"; pressure?: number; state?: string }) {
  const color = CHAMBER_COLOR[chamber] ?? "var(--r-subtext)";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px", background: `color-mix(in srgb, ${color} 4%, var(--r-bg))`, borderTop: `1px solid ${color}20`, borderBottom: `1px solid ${color}20` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "9px", fontFamily: fontMono, color, letterSpacing: "0.10em", textTransform: "uppercase" }}>{chamber} Context</span>
        {state && <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-dim)" }}>| {state}</span>}
      </div>
      {pressure !== undefined && (
        <span style={{ fontSize: "9px", fontFamily: fontMono, color: pressure > 0 ? "var(--r-warn)" : "var(--r-ok)", letterSpacing: "0.05em" }}>
          P: {pressure}
        </span>
      )}
    </div>
  );
}

// ─── Intelligence Components ──────────────────────────────────────────────────

export function AIThreadSurface({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--r-bg)", borderRight: styles.borderSoft }}>
      {children}
    </div>
  );
}

export function AIGroundingPanel({ chamber, memoryCount, objects }: { chamber: string; memoryCount: number; objects: string[] }) {
  return (
    <div style={{ padding: "8px 12px", background: styles.surface, borderBottom: styles.borderSoft, display: "flex", alignItems: "center", gap: "12px", overflowX: "auto" }}>
      <span style={{ fontSize: "8px", fontFamily: fontMono, color: "var(--r-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Grounding</span>
      <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-subtext)" }}>Chamber: {chamber}</span>
      <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-subtext)" }}>Memory: {memoryCount} nodes</span>
      {objects.length > 0 && <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-subtext)" }}>Objects: {objects.join(", ")}</span>}
    </div>
  );
}

export function AIExecutionModeSelector({ modes, active, onSelect }: { modes: string[]; active: string; onSelect: (m: string) => void }) {
  return (
    <div style={{ display: "inline-flex", background: styles.elevated, border: styles.border, borderRadius: styles.radius, padding: "2px" }}>
      {modes.map(m => (
        <button key={m} onClick={() => onSelect(m)} style={{ fontSize: "9px", fontFamily: fontMono, textTransform: "uppercase", padding: "4px 8px", background: active === m ? "var(--r-bg)" : "transparent", color: active === m ? "var(--r-text)" : "var(--r-dim)", border: "none", borderRadius: styles.radius, cursor: "pointer" }}>
          {m}
        </button>
      ))}
    </div>
  );
}

// ─── Memory / Directive / Consequence Components ──────────────────────────────

export function DirectiveStack({ directives }: { directives: { id: string; text: string; priority: "high" | "normal" }[] }) {
  return (
    <div style={{ padding: "12px", background: "var(--r-surface)", border: styles.border, borderRadius: styles.radius }}>
      <p style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>Active Directives</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {directives.map(d => (
          <div key={d.id} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: d.priority === "high" ? "var(--r-warn)" : "var(--r-dim)", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: fontSans, lineHeight: 1.4 }}>{d.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConsequenceLog({ events }: { events: { id: string; desc: string; time: string; type: "mutate" | "view" | "canon" }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {events.map((e, index) => (
        <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", position: "relative" }}>
          {index < events.length - 1 && <div style={{ position: "absolute", left: "3px", top: "12px", bottom: "-12px", width: "1px", background: styles.borderSoft }} />}
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: e.type === "canon" ? "var(--r-ok)" : e.type === "mutate" ? "var(--r-warn)" : "var(--r-dim)", marginTop: "4px", zIndex: 1 }} />
          <div>
            <p style={{ fontSize: "10px", fontFamily: fontSans, color: "var(--r-text)", margin: "0 0 2px" }}>{e.desc}</p>
            <p style={{ fontSize: "8px", fontFamily: fontMono, color: "var(--r-dim)" }}>{e.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Command Components ───────────────────────────────────────────────────────

export function CommandInputSurface({ value, onChange, onSubmit, placeholder }: { value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", background: styles.elevated, border: styles.border, borderRadius: styles.radius, padding: "8px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <span style={{ fontSize: "12px", fontFamily: fontMono, color: "var(--r-accent)", marginRight: "10px" }}>»</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSubmit(); }}
        placeholder={placeholder ?? "Enter directive..."}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--r-text)", fontSize: "13px", fontFamily: fontSans }}
      />
    </div>
  );
}

export function TargetContextBlock({ target }: { target: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: styles.surface, border: styles.borderSoft, padding: "2px 8px", borderRadius: styles.radius }}>
      <span style={{ fontSize: "8px", fontFamily: fontMono, color: "var(--r-dim)", textTransform: "uppercase" }}>Target</span>
      <span style={{ fontSize: "10px", fontFamily: fontMono, color: "var(--r-text)" }}>{target}</span>
    </div>
  );
}

export function ExecutionPathBlock({ steps }: { steps: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", margin: "10px 0" }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <span style={{ fontSize: "9px", fontFamily: fontMono, color: "var(--r-subtext)", padding: "2px 6px", border: styles.border, borderRadius: styles.radius }}>{step}</span>
          {i < steps.length - 1 && <span style={{ fontSize: "8px", color: "var(--r-dim)" }}>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
