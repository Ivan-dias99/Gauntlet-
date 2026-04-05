/**
 * RUBERRA Detail Views — shared primitives
 * Used by Lab, School, and Creation detail surfaces.
 */
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { type Tab, type NavFn } from "../shell-types";
import { EntityTitleBlock, CanonStatusBlock, RelationshipList, ConsequenceLog, DirectiveStack, AIExecutionModeSelector } from "../SystemComponents";

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export function Breadcrumb({
  items, onNavigate,
}: {
  items: { label: string; tab: Tab; view: string; id?: string }[];
  onNavigate: NavFn;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "22px" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {i > 0 && (
            <span style={{ fontSize: "10px", color: "var(--r-dim)", userSelect: "none" }}>›</span>
          )}
          <button
            onClick={() => onNavigate(item.tab, item.view, item.id)}
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: i === items.length - 1 ? "var(--r-subtext)" : "var(--r-dim)",
              background: "transparent",
              border: "none",
              cursor: i === items.length - 1 ? "default" : "pointer",
              outline: "none",
              padding: "0",
              pointerEvents: i === items.length - 1 ? "none" : "auto",
            }}
          >
            {item.label}
          </button>
        </span>
      ))}
    </div>
  );
}

// ─── Cross-chamber link card ──────────────────────────────────────────────────

export function XChamberLink({
  chamber, label, title, subtitle, navigate, tab, view, id,
}: {
  chamber: "lab" | "school" | "creation";
  label: string;
  title: string;
  subtitle: string;
  navigate: NavFn;
  tab: Tab;
  view: string;
  id?: string;
}) {
  const accentMap = {
    lab:      { color: "var(--r-accent)", bg: "var(--r-accent-dim)" },
    school:   { color: "var(--r-ok)",     bg: "color-mix(in srgb, var(--r-ok) 10%, var(--r-surface))" },
    creation: { color: "var(--r-warn)",   bg: "color-mix(in srgb, var(--r-warn) 10%, var(--r-surface))" },
  };
  const accent = accentMap[chamber];

  return (
    <button
      onClick={() => navigate(tab, view, id)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 12px",
        border: "1px solid var(--r-border)",
        borderRadius: "2px",
        background: "var(--r-surface)",
        cursor: "pointer",
        outline: "none",
        textAlign: "left",
        transition: "background 0.1s ease",
        gap: "10px",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <span
          style={{
            fontSize: "8px",
            fontFamily: "monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accent.color,
            background: accent.bg,
            padding: "2px 6px",
            borderRadius: "2px",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </p>
          <p style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <ArrowRight size={10} color="var(--r-dim)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
    </button>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

export function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
      <p style={{ fontSize: "9px", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--r-dim)", margin: 0 }}>
        {label}
      </p>
      {count !== undefined && (
        <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{count}</span>
      )}
    </div>
  );
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────

export function Tag({ label, color }: { label: string; color?: string }) {
  return (
    <span
      style={{
        fontSize: "9px",
        fontFamily: "monospace",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: color ?? "var(--r-subtext)",
        background: "var(--r-rail)",
        border: "1px solid var(--r-border)",
        padding: "2px 7px",
        borderRadius: "2px",
      }}
    >
      {label}
    </span>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

export function PrimaryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 14px",
        borderRadius: "2px",
        border: "none",
        background: "var(--r-text)",
        color: "var(--r-bg)",
        cursor: "pointer",
        outline: "none",
        fontSize: "11px",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        transition: "opacity 0.15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    >
      {label}
      <ArrowRight size={10} strokeWidth={1.8} />
    </button>
  );
}

export function SecondaryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "7px 14px",
        borderRadius: "2px",
        border: "1px solid var(--r-border)",
        background: "transparent",
        color: "var(--r-subtext)",
        cursor: "pointer",
        outline: "none",
        fontSize: "11px",
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: "background 0.1s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-rail)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {label}
    </button>
  );
}

// ─── Detail page wrapper ──────────────────────────────────────────────────────

export function DetailPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--r-bg)", padding: "28px 0 48px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Empty detail fallback ────────────────────────────────────────────────────

export function EmptyDetail({ onBack, label }: { onBack: () => void; label?: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--r-bg)", gap: "10px" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.12em", color: "var(--r-dim)", textTransform: "uppercase" }}>
        {label ?? "Item not found"}
      </span>
      <button
        onClick={onBack}
        style={{ fontSize: "10px", fontFamily: "monospace", color: "var(--r-subtext)", background: "transparent", border: "1px solid var(--r-border)", borderRadius: "2px", padding: "4px 12px", cursor: "pointer", outline: "none", letterSpacing: "0.05em" }}
      >
        ← Back
      </button>
    </div>
  );
}

// ─── Object Detail Surface (Ruberra Canonical Structure) ──────────────────────

export interface ObjectDetailProps {
  identity: { title: string; type: string; id: string };
  state: { status: string; statusColor?: string; canon: "draft" | "active" | "canonical" | "unresolved" | "deprecated" | "conflicting" };
  missionBinding: { chamber: string; text: string };
  aiReasoning?: string;
  directiveRelevance?: { id: string; text: string; priority: "high" | "normal" }[];
  meshRelations?: { id: string; label: string; onClick?: () => void }[];
  consequenceTrace?: { id: string; desc: string; time: string; type: "mutate" | "view" | "canon" }[];
  activeMemory?: { id: string; label: string; onClick?: () => void }[];
  children: React.ReactNode;
}

export function ObjectDetailSurface({
  identity, state, missionBinding, aiReasoning, directiveRelevance, meshRelations, consequenceTrace, activeMemory, children
}: ObjectDetailProps) {
  return (
    <DetailPage>
      {/* 1. Object Identity & State */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.10em", color: "var(--r-dim)" }}>
            #{identity.id}
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: state.statusColor || "var(--r-text)", border: "1px solid var(--r-border)", padding: "2px 6px", borderRadius: "2px" }}>
              {state.status}
            </span>
            <CanonStatusBlock status={state.canon} />
          </div>
        </div>
        <EntityTitleBlock title={identity.title} type={identity.type} />
      </div>

      {/* 2. Mission Binding */}
      <div style={{ padding: "10px 14px", background: "var(--r-surface)", border: "1px solid var(--r-border)", borderRadius: "2px", marginBottom: "24px", display: "flex", gap: "10px" }}>
        <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>Mission</span>
        <span style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>
          <strong style={{ fontWeight: 600 }}>{missionBinding.chamber}</strong> · {missionBinding.text}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", alignItems: "start" }}>
        {/* Left Column: Children (Specific content like threads, campaigns, artifacts) */}
        <div>
          {children}
        </div>

        {/* Right Column: Neural Mesh, Memory, Consequence, Directives, AI Reasoning */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {aiReasoning && (
            <div style={{ padding: "12px", border: "1px solid var(--r-border-soft)", background: "var(--r-surface)", borderRadius: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Object Reasoning</span>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--r-accent)" }} />
              </div>
              <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.5, margin: 0 }}>
                {aiReasoning}
              </p>
            </div>
          )}

          {directiveRelevance && directiveRelevance.length > 0 && (
            <div>
              <SectionHead label="Directive Relevance" />
              <DirectiveStack directives={directiveRelevance} />
            </div>
          )}

          {meshRelations && meshRelations.length > 0 && (
            <div>
              <RelationshipList title="Mesh Relations" items={meshRelations} />
            </div>
          )}

          {activeMemory && activeMemory.length > 0 && (
            <div>
              <RelationshipList title="Active Memory Recall" items={activeMemory} />
            </div>
          )}

          {consequenceTrace && consequenceTrace.length > 0 && (
            <div>
               <SectionHead label="Consequence Trace" />
               <div style={{ padding: "12px", background: "var(--r-bg)", border: "1px solid var(--r-border)", borderRadius: "2px" }}>
                 <ConsequenceLog events={consequenceTrace} />
               </div>
            </div>
          )}
        </div>
      </div>
    </DetailPage>
  );
}
