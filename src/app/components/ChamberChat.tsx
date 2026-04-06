/**
 * RUBERRA — ChamberChat  ·  Metamorphosis Edition
 * Shared premium chat surface for Lab / School / Creation.
 * Visual-first. Structured outputs. Semantic signals. Zero dead text.
 */

import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Message } from "./shell-types";
import { BlockRenderer, MetamorphicPlainSurface, inferMetamorphicClassFromText } from "./BlockRenderer";
import { ModelSelector } from "./ModelSelector";
import { type TaskType } from "./model-orchestration";
import { getContractByChamber } from "./routing-contracts";
import { getPioneer, getPioneerFromRuntimeId } from "./pioneer-registry";
import { getExecutionTruth, TIER_LABEL, TIER_COLOR } from "./sovereign-runtime";
import { SovereignEmptyFrame } from "./SovereignEmptyFrame";
import { ExecutionConsequenceStrip } from "./ExecutionConsequenceStrip";
import { MiniConstellation, StructuralGridBg } from "./OrganismMotifs";

// ─── Chamber config ───────────────────────────────────────────────────────────

export interface ChamberConfig {
  id:          "lab" | "school" | "creation";
  label:       string;
  tagline:     string;
  placeholder: string;
  accent:      string;
  glyph:       React.ReactNode;
}

// ─── Glyphs ───────────────────────────────────────────────────────────────────

export const LabGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "var(--chamber-lab)" }}>
    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M16 2.5v4.5M16 25v4.5M2.5 16H7M25 16h4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M6.5 6.5l3 3M22.5 22.5l3 3M25.5 6.5l-3 3M9.5 22.5l-3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const SchoolGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "var(--chamber-school)" }}>
    <rect x="3.5" y="7" width="25" height="18" rx="2" stroke="currentColor" strokeWidth="1.25" />
    <path d="M3.5 13h25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M12 13v12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M16 4l-3 3h6L16 4z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.7" />
    <path d="M17 18.5h6M17 22h4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
    <path d="M5 17h4M5 20.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
  </svg>
);

export const CreationGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "var(--chamber-creation)" }}>
    <path d="M6 26l5-15 5 10 4-7 5 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="25.5" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M6 10.5h5.5M6 16h3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

const EMPTY_SOVEREIGN: Record<string, { kicker: string; title: string; body: string }> = {
  lab: {
    kicker: "Lab · ready",
    title:  "Awaiting first directive",
    body:   "The investigation field is live. Your first query becomes a structured object — evidence, verdicts, and matrices with consequence. Everything after compounds.",
  },
  school: {
    kicker: "School · ready",
    title:  "Awaiting first directive",
    body:   "Mastery tracks activate on your command. Lessons sequence, progress accumulates, and the curriculum remembers where you are. Begin.",
  },
  creation: {
    kicker: "Creation · ready",
    title:  "Awaiting first directive",
    body:   "The forge is hot. Directives compile to artifacts, blueprints, and executable output. Every build command leaves a structural trace. Command it.",
  },
};

const EMPTY_PROMPTS: Record<string, string[]> = {
  lab: [
    "Analyze the trade-offs between CQRS and Event Sourcing at scale",
    "Audit the reasoning behind the CAP theorem impossibility proof",
    "Compare Raft vs Paxos under asymmetric network partitions",
    "Build a decision matrix for consensus algorithm selection",
  ],
  school: [
    "Teach me distributed consensus from first principles",
    "Map out the curriculum path for AI systems engineering",
    "Give me a lesson on the CAP theorem with a mastery check",
    "Build a study dossier on zero-knowledge proofs",
  ],
  creation: [
    "Build an AI agent orchestration system blueprint",
    "Generate an executive strategy brief for technical leadership",
    "Design a secure API gateway architecture",
    "Create a technical deep-dive essay structure",
  ],
};

function EmptyState({
  glyph, label, id, onSend, accent,
}: {
  glyph:   React.ReactNode;
  label:   string;
  id:      string;
  accent:  string;
  onSend:  (t: string) => void;
}) {
  const prompts = EMPTY_PROMPTS[id] ?? [];
  const sovereign = EMPTY_SOVEREIGN[id] ?? {
    kicker: "Chamber",
    title:  `${label} — ready`,
    body:   "Begin a session. Output accumulates under the same mother shell law as every other chamber.",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "56px",
        paddingBottom: "32px",
        position: "relative",
      }}
    >
      {/* Chamber ambient background */}
      <div style={{
        position: "absolute",
        top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "400px",
        height: "200px",
        background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${accent} 14%, transparent) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: [0.7, 1, 0.7], scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: "20px", position: "relative" }}
      >
        <MiniConstellation chamber={id as "lab" | "school" | "creation"} />
      </motion.div>
      <SovereignEmptyFrame
        accentVar={accent}
        kicker={sovereign.kicker}
        title={sovereign.title}
        body={sovereign.body}
      />

      {/* Quick start prompts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "100%",
          maxWidth: "500px",
          padding: "20px 16px 0",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--r-dim)",
            margin: "0 0 10px",
            textAlign: "center",
          }}
        >
          Issue a directive
        </p>
        {prompts.map((p, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.12 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSend(p)}
            style={{
              width: "100%",
              padding: "9px 14px",
              border: "1px solid var(--r-border)",
              borderLeft: `3px solid ${accent}`,
              borderRadius: "2px",
              background: "var(--r-surface)",
              cursor: "pointer",
              outline: "none",
              textAlign: "left",
              fontSize: "12.5px",
              color: "var(--r-subtext)",
              fontFamily: "'Inter', system-ui, sans-serif",
              lineHeight: 1.45,
              transition: "all 0.12s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--r-elevated)";
              el.style.color = "var(--r-text)";
              el.style.borderColor = "var(--r-border-soft)";
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "0 2px 8px color-mix(in srgb, var(--r-text) 5%, transparent)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "var(--r-surface)";
              el.style.color = "var(--r-subtext)";
              el.style.borderColor = "var(--r-border)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            <span>{p}</span>
            <span
              style={{
                color: accent,
                fontSize: "11px",
                flexShrink: 0,
                opacity: 0.6,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ↵
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── User bubble ──────────────────────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <div
        style={{
          background: "var(--r-text)",
          borderRadius: "2px",
          padding: "11px 16px",
          maxWidth: "74%",
          fontSize: "13.5px",
          color: "var(--r-bg)",
          fontFamily: "'Inter', system-ui, sans-serif",
          lineHeight: "1.65",
          boxShadow: "none",
          border: "1px solid var(--r-text)",
          letterSpacing: "-0.003em",
        }}
      >
        {content}
      </div>
    </motion.div>
  );
}

// ─── Agent label ──────────────────────────────────────────────────────────────

const CHAMBER_ROLE: Record<string, string> = {
  "LAB":      "Lab intelligence",
  "SCHOOL":   "School intelligence",
  "CREATION": "Creation intelligence",
};

function AgentLabel({ accent, chamberLabel }: { accent: string; chamberLabel: string }) {
  const chamberKey = chamberLabel.split("·").pop()?.trim() ?? "";
  const roleLabel  = CHAMBER_ROLE[chamberKey] ?? "Chamber";

  return (
    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 9px 3px 7px",
        border: `1px solid color-mix(in srgb, ${accent} 32%, var(--r-border))`,
        borderRadius: "2px",
        background: `color-mix(in srgb, ${accent} 10%, var(--r-surface))`,
        boxShadow: "none",
      }}>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "5px", height: "5px", borderRadius: "50%", background: accent, flexShrink: 0, display: "inline-block" }}
        />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.1em", color: accent, textTransform: "uppercase", userSelect: "none", fontWeight: 700 }}>
          {roleLabel}
        </span>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.08em", color: "var(--r-dim)", textTransform: "uppercase", userSelect: "none" }}>
        {chamberLabel}
      </span>
    </div>
  );
}

// ─── Provenance trace ─────────────────────────────────────────────────────────

function ProvenanceTrace({
  chamberId,
  msgTruth,
}: {
  chamberId: "lab" | "school" | "creation";
  msgTruth?: Message["execution_truth"];
}) {
  const contract    = getContractByChamber(chamberId);
  const leadPioneer = getPioneer(contract.lead_pioneer);

  // Prefer message-attached truth; fall back to sovereign stack resolution
  const sovereign   = getExecutionTruth(chamberId);
  const tier        = msgTruth?.tier        ?? sovereign.tier;
  const tierLabel   = msgTruth?.tier_label  ?? sovereign.tier_label;
  const modelLabel  = msgTruth?.model_label ?? sovereign.model_label;
  const tierColor   = TIER_COLOR[tier];
  const accentStr   = leadPioneer?.accent ?? "var(--r-dim)";

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "6px",
        marginBottom: "12px",
        flexWrap:     "wrap",
        paddingBottom: "10px",
        borderBottom: "1px solid var(--r-border-soft)",
      }}
    >
      {/* Lead pioneer chip — compact */}
      {leadPioneer && (
        <span
          style={{
            fontSize:      "7.5px",
            fontFamily:    "'JetBrains Mono', monospace",
            letterSpacing: "0.07em",
            color:         accentStr,
            background:    accentStr + "0d",
            border:        "1px solid " + accentStr + "20",
            borderRadius: "2px",
            padding:       "1px 5px",
            userSelect:    "none",
          }}
        >
          {leadPioneer.short_role}
        </span>
      )}
      {/* Execution tier — honest, tooltip explains */}
      <span
        style={{
          fontSize:      "7.5px",
          fontFamily:    "'JetBrains Mono', monospace",
          letterSpacing: "0.07em",
          color:         tierColor,
          border:        "1px solid " + tierColor + "28",
          borderRadius: "2px",
          padding:       "1px 5px",
          userSelect:    "none",
          textTransform: "uppercase" as const,
        }}
        title={
          tier === "A" ? "Local/hosted runtime" :
          tier === "B" ? "Wrapped free provider — not guaranteed" :
          "Proxy — no live model"
        }
      >
        {tierLabel}
      </span>
      {/* Model — compact */}
      <span
        style={{
          fontSize:      "7.5px",
          fontFamily:    "'JetBrains Mono', monospace",
          letterSpacing: "0.04em",
          color:         "var(--r-dim)",
          userSelect:    "none",
        }}
      >
        {modelLabel}
      </span>
      {/* Support chain (compact — first only) */}
      {contract.support_pioneers.length > 0 && (
        <span
          style={{
            fontSize:      "7.5px",
            fontFamily:    "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
            color:       "var(--r-dim)",
            userSelect:  "none",
            opacity:     0.7,
          }}
        >
          + {getPioneer(contract.support_pioneers[0])?.short_role ?? contract.support_pioneers[0]}
            {contract.support_pioneers.length > 1 && ` +${contract.support_pioneers.length - 1}`}
        </span>
      )}
    </div>
  );
}

// ─── Streaming indicator ──────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", alignItems: "center", height: "22px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -2.5, 0] }}
          transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--r-dim)",
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

// ─── Assistant message ────────────────────────────────────────────────────────

function AssistantMessage({
  msg, accent, chamberLabel, chamberId, missionName,
}: {
  msg: Message;
  accent: string;
  chamberLabel: string;
  chamberId: "lab" | "school" | "creation";
  missionName?: string;
}) {
  const sovereign = getExecutionTruth(chamberId);
  const trace = msg.execution_trace;
  const leadShort =
    trace?.leadPioneerId != null
      ? getPioneerFromRuntimeId(trace.leadPioneerId)?.short_role ?? trace.leadPioneerId
      : undefined;
  const hasArtifactMutation = chamberId === "creation" && (trace?.executionResults ?? []).some((r) =>
    /artifact|build|package|finalize/i.test(r.phase) || /artifact|build|package/i.test(r.summary)
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <AgentLabel accent={accent} chamberLabel={chamberLabel} />
      {/* ── Provenance bar — chamber attribution line ── */}
      <div
        style={{
          borderLeft: `3px solid color-mix(in srgb, ${accent} 55%, transparent)`,
          paddingLeft: "14px",
          marginLeft: "1px",
        }}
      >
        {trace ? (
          <ExecutionConsequenceStrip
            trace={trace}
            accent={accent}
            leadPioneerShort={leadShort}
            giName={trace.giLabel ?? trace.giId}
            tierLabel={TIER_LABEL[sovereign.tier]}
            tierColor={TIER_COLOR[sovereign.tier]}
            modelTruthLabel={sovereign.tier_label}
            missionName={missionName}
            artifactDiff={hasArtifactMutation ? { summary: trace.executionResults.slice(-1)[0]?.summary ?? "artifact mutation captured" } : undefined}
          />
        ) : (
          <ProvenanceTrace chamberId={chamberId} msgTruth={msg.execution_truth} />
        )}
        {(msg.meta?.pioneerId || msg.meta?.workflowId) && !trace && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            {msg.meta?.pioneerId && <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "2px", padding: "1px 6px", letterSpacing: "0.04em" }}>{msg.meta.pioneerId}</span>}
            {msg.meta?.workflowId && <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "2px", padding: "1px 6px", letterSpacing: "0.04em" }}>{msg.meta.workflowId}</span>}
            {msg.meta?.hostingLevel && <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.04em" }}>{msg.meta.hostingLevel}</span>}
          </div>
        )}
        {msg.content && (
          <ConsequenceTypeTag
            type={inferConsequenceType(msg.content, chamberId, msg.blocks)}
            accent={accent}
          />
        )}
        {msg.blocks && msg.blocks.length > 0 ? (
          <BlockRenderer blocks={msg.blocks} chamber={chamberId} />
        ) : msg.content ? (
          <MetamorphicPlainSurface
            content={msg.content}
            responseClass={inferMetamorphicClassFromText(msg.content)}
            chamber={chamberId}
          />
        ) : (
          <ThinkingDots />
        )}
        {msg.content && (
          <MutableFooter
            content={msg.content}
            chamberId={chamberId}
            accent={accent}
            missionName={missionName}
          />
        )}
      </div>
    </motion.div>
  );
}

// ─── Status strip ─────────────────────────────────────────────────────────────

const EXEC_STATE_LABEL: Record<"idle" | "thinking" | "streaming", string> = {
  idle:      "",
  thinking:  "ROUTING",
  streaming: "STREAMING",
};

function StatusStrip({
  execStatus, onCancel, accent, chamberLabel, modelBadge,
}: {
  execStatus: "idle" | "thinking" | "streaming";
  onCancel: () => void;
  accent: string;
  chamberLabel: string;
  modelBadge: string;
}) {
  const stateLabel = EXEC_STATE_LABEL[execStatus];
  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        width: "100%",
        padding: "6px 32px 8px",
        minHeight: "26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid var(--r-border-soft)",
        background: "linear-gradient(to bottom, var(--r-surface) 0%, var(--r-bg) 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.1em", color: "var(--r-dim)", textTransform: "uppercase", userSelect: "none" }}>
          {chamberLabel}
        </span>
        <span style={{ color: "var(--r-border)", fontSize: "9px", userSelect: "none" }}>·</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.03em", userSelect: "none" }}>
          {modelBadge}
        </span>
      </div>
      <AnimatePresence>
        {execStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: accent,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "8px",
                letterSpacing: "0.11em",
                color: accent,
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              {stateLabel}
            </span>
            {execStatus === "streaming" && (
              <button
                onClick={onCancel}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "8px",
                  color: "var(--r-dim)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                  padding: "0 0 0 6px",
                  letterSpacing: "0.05em",
                  transition: "color 0.1s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-dim)"; }}
              >
                · esc
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Composer ─────────────────────────────────────────────────────────────────

function Composer({
  draft, onDraftChange, onSend, onCancel, isLoading, placeholder, accent, configId,
  task, modelId, onTaskChange, onModelChange, composerLocked = false, composerLockLabel,
}: {
  draft: string;
  onDraftChange: (t: string) => void;
  onSend: (t: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  placeholder: string;
  accent: string;
  configId: "lab" | "school" | "creation";
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  composerLocked?: boolean;
  composerLockLabel?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft]);

  function submit() {
    const text = draft.trim();
    if (!text || isLoading || composerLocked) return;
    onDraftChange("");
    onSend(text);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
    if (e.key === "Escape" && isLoading) onCancel();
  }

  const canSend = !!draft.trim() && !isLoading && !composerLocked;

  return (
    <div style={{ padding: "10px 0 24px", background: "var(--r-bg)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 32px" }}>
        {/* Chamber accent scan line above composer */}
        <div style={{
          height: "1px",
          marginBottom: "8px",
          background: `linear-gradient(90deg, transparent 0%, ${accent} 30%, ${accent} 70%, transparent 100%)`,
          opacity: focused ? 0.65 : 0.2,
          transition: "opacity 0.2s ease",
        }} />
        <div
          style={{
            background: "var(--r-surface)",
            border: `1px solid ${focused ? `color-mix(in srgb, ${accent} 32%, var(--r-border))` : "var(--r-border-soft)"}`,
            borderRadius: "2px",
            padding: "14px 14px 10px 18px",
            boxShadow: focused
              ? `0 0 0 1px color-mix(in srgb, ${accent} 22%, transparent)`
              : "none",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
        >
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading || composerLocked}
            placeholder={composerLocked ? (composerLockLabel ?? placeholder) : placeholder}
            rows={1}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13.5px",
              color: "var(--r-text)",
              background: "transparent",
              lineHeight: "1.62",
              minHeight: "36px",
              maxHeight: "160px",
              display: "block",
              caretColor: accent,
              letterSpacing: "-0.003em",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
              gap: "8px",
            }}
          >
            <ModelSelector
              chamber={configId}
              task={task}
              modelId={modelId}
              onTaskChange={onTaskChange}
              onModelChange={onModelChange}
              mode="chat"
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "var(--r-dim)",
                letterSpacing: "0.05em",
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {isLoading ? (
                <button
                  onClick={onCancel}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    color: "var(--r-muted)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    padding: 0,
                    letterSpacing: "0.05em",
                    transition: "color 0.1s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-muted)"; }}
                >
                  esc to stop
                </button>
              ) : composerLocked ? (
                composerLockLabel ?? "mission state locked"
              ) : (
                "↵ send · ⇧↵ newline"
              )}
            </span>
            <button
              onClick={submit}
              disabled={!canSend}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "2px",
                border: canSend ? "none" : "1px solid var(--r-border)",
                background: canSend ? accent : "transparent",
                cursor: canSend ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                flexShrink: 0,
                transition: "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
                boxShadow: "none",
              }}
              onMouseEnter={e => {
                if (canSend) (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={e => {
                if (canSend) (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8L2 2l3 6-3 6 12-6z"
                  fill={canSend ? "var(--r-bg)" : "var(--r-border)"}
                  strokeWidth="0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Live Header Rail ─────────────────────────────────────────────────────────

const THINKING_CYCLE = ["ROUTING", "ANALYZING", "THINKING"] as const;

function LiveHeaderRail({
  accent, chamberId, modelId, providerId, execStatus, eiName,
}: {
  accent: string;
  chamberId: "lab" | "school" | "creation";
  modelId: string;
  providerId?: string;
  execStatus: "idle" | "thinking" | "streaming";
  eiName?: string;
}) {
  const [thinkIdx, setThinkIdx] = useState(0);

  useEffect(() => {
    if (execStatus !== "thinking") { setThinkIdx(0); return; }
    const id = setInterval(() => setThinkIdx((i) => (i + 1) % THINKING_CYCLE.length), 1800);
    return () => clearInterval(id);
  }, [execStatus]);

  const isLive = execStatus !== "idle";
  const stateLabel =
    execStatus === "thinking"  ? THINKING_CYCLE[thinkIdx] :
    execStatus === "streaming" ? "STREAMING" : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 32px",
        height: "34px",
        background: `color-mix(in srgb, var(--chamber-${chamberId}) 6%, var(--r-surface))`,
        borderBottom: `1px solid color-mix(in srgb, ${accent} 18%, var(--r-border-soft))`,
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Chamber ambient glow */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: "4px",
        background: accent,
        opacity: 0.85,
      }} />
      {/* Chamber accent anchor */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "7.5px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent,
          fontWeight: 700,
          flexShrink: 0,
          userSelect: "none",
          paddingLeft: "8px",
        }}
      >
        {chamberId}
      </span>
      <span style={{ color: "var(--r-border)", fontSize: "9px", userSelect: "none" }}>·</span>

      {/* EI / agent — if known */}
      {eiName && (
        <>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7.5px",
              color: "var(--r-subtext)",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {eiName}
          </span>
          <span style={{ color: "var(--r-border)", fontSize: "9px", userSelect: "none" }}>·</span>
        </>
      )}

      {/* Model · provider */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "7.5px",
          color: "var(--r-dim)",
          letterSpacing: "0.03em",
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "140px",
        }}
      >
        {modelId}{providerId ? ` · ${providerId}` : ""}
      </span>

      <div style={{ flex: 1 }} />

      {/* Runtime state — live pulse when active */}
      {isLive && stateLabel && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: accent,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "7.5px",
              letterSpacing: "0.11em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {stateLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Consequence type ─────────────────────────────────────────────────────────

type ConsequenceType = "FINDING" | "VERDICT" | "DOSSIER" | "DIRECTIVE" | "BUILD NOTE" | "ARTIFACT DELTA" | "HANDOFF" | "LESSON" | "WARNING";

function inferConsequenceType(
  content: string,
  chamberId: "lab" | "school" | "creation",
  blocks?: Message["blocks"],
): ConsequenceType {
  if (blocks && blocks.length > 0) {
    const bt = blocks[0].type;
    if (bt === "verdict" || bt === "audit")        return "VERDICT";
    if (bt === "evidence" || bt === "matrix")      return "FINDING";
    if (bt === "dossier")                          return "DOSSIER";
    if (bt === "blueprint" || bt === "execution")  return "DIRECTIVE";
    if (bt === "lesson")                           return "LESSON";
  }
  const c = content.toLowerCase();
  if (chamberId === "lab") {
    if (c.includes("verdict") || c.includes("conclusion") || c.includes("result")) return "VERDICT";
    if (c.includes("warning") || c.includes("risk") || c.includes("critical"))     return "WARNING";
    return "FINDING";
  }
  if (chamberId === "school") {
    if (c.includes("handoff") || c.includes("transfer"))   return "HANDOFF";
    if (c.includes("warning") || c.includes("important"))  return "WARNING";
    return "LESSON";
  }
  // creation
  if (c.includes("artifact") || c.includes("diff") || c.includes("changed"))      return "ARTIFACT DELTA";
  if (c.includes("directive") || c.includes("deploy"))                             return "DIRECTIVE";
  return "BUILD NOTE";
}

function ConsequenceTypeTag({ type, accent }: { type: ConsequenceType; accent: string }) {
  const color =
    type === "WARNING"        ? "var(--r-warn)" :
    type === "VERDICT"        ? "var(--r-ok)"   :
    type === "ARTIFACT DELTA" || type === "DIRECTIVE" || type === "BUILD NOTE" ? accent :
    "var(--r-dim)";

  return (
    <div style={{ marginBottom: "10px" }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "7px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color,
          border: `1px solid color-mix(in srgb, ${color} 28%, var(--r-border))`,
          borderRadius: "2px",
          padding: "1px 6px",
          userSelect: "none",
        }}
      >
        {type}
      </span>
    </div>
  );
}

// ─── Mutable footer ───────────────────────────────────────────────────────────

function inferNextStep(content: string, chamberId: "lab" | "school" | "creation"): string | null {
  const c = content.toLowerCase();
  if (chamberId === "lab") {
    if (c.includes("recommend") || c.includes("suggest")) return "Run deeper audit";
    if (c.includes("compare")   || c.includes("versus"))  return "Build decision matrix";
    if (c.includes("evidence")  || c.includes("finding")) return "Validate evidence chain";
  }
  if (chamberId === "school") {
    if (c.includes("mastery") || c.includes("check"))  return "Attempt mastery check";
    if (c.includes("module")  || c.includes("next"))   return "Advance to next module";
    if (c.includes("lesson")  || c.includes("learn"))  return "Continue learning path";
  }
  if (chamberId === "creation") {
    if (c.includes("build")     || c.includes("generate"))   return "Execute build directive";
    if (c.includes("blueprint") || c.includes("architect"))  return "Compile blueprint";
    if (c.includes("artifact")  || c.includes("package"))    return "Finalize artifact";
  }
  return null;
}

function MutableFooter({
  content, chamberId, accent, missionName,
}: {
  content: string;
  chamberId: "lab" | "school" | "creation";
  accent: string;
  missionName?: string;
}) {
  const next = inferNextStep(content, chamberId);
  if (!next && !missionName) return null;

  return (
    <div
      style={{
        marginTop: "12px",
        paddingTop: "8px",
        borderTop: "1px solid var(--r-border-soft)",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
      }}
    >
      {next && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.07em", color: "var(--r-dim)" }}>
          <span style={{ color: accent, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "6px" }}>NEXT</span>
          {next}
        </span>
      )}
      {missionName && (
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.06em", color: "var(--r-dim)" }}>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.1em", marginRight: "6px" }}>MISSION STATE</span>
          {missionName}
        </span>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChamberChat({
  messages,
  isLoading,
  draft,
  onDraftChange,
  onSend,
  onCancel,
  config,
  task,
  modelId,
  onTaskChange,
  onModelChange,
  missionName,
  composerLocked = false,
  composerLockLabel,
  missionStatus,
}: {
  messages:      Message[];
  isLoading:     boolean;
  draft:         string;
  onDraftChange: (t: string) => void;
  onSend: (t: string) => void;
  onCancel: () => void;
  config: ChamberConfig;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  /** Mission binding — propagated into each assistant message execution strip */
  missionName?: string;
  composerLocked?: boolean;
  composerLockLabel?: string;
  /** Mission ledger state — drives terminal-state consequence lock */
  missionStatus?: string;
}) {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const execStatus: "idle" | "thinking" | "streaming" =
    !isLoading ? "idle"
    : messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      messages[messages.length - 1].content.length > 0
    ? "streaming"
    : "thinking";

  // Derive EI name + active provider from the last assistant trace
  const lastAssistantTrace = [...messages].reverse()
    .find((m) => m.role === "assistant" && m.execution_trace)?.execution_trace;
  const eiName = lastAssistantTrace?.leadPioneerId != null
    ? getPioneerFromRuntimeId(lastAssistantTrace.leadPioneerId)?.short_role ?? undefined
    : undefined;
  const activeProviderId = lastAssistantTrace?.providerId;

  const isEmpty = messages.length === 0;
  const chamberLabel = `RUBERRA · ${config.label.toUpperCase()}`;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--r-bg)",
        position: "relative",
      }}
    >
      {/* Live Header Rail — chamber · EI · model · state (mission owned by MissionContextBand) */}
      <LiveHeaderRail
        accent={config.accent}
        chamberId={config.id}
        modelId={modelId}
        providerId={activeProviderId}
        execStatus={execStatus}
        eiName={eiName}
      />
      {/* Structural grid — same mother surface as landing */}
      <StructuralGridBg opacity={0.12} />

      {/* Thread */}
      <div
        ref={threadRef}
        className="hide-scrollbar"
        style={{ flex: 1, overflowY: "auto", padding: "32px 0 8px" }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 32px" }}>
          {isEmpty ? (
            <EmptyState
              glyph={config.glyph}
              label={config.label}
              id={config.id}
              accent={config.accent}
              onSend={onSend}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ marginBottom: msg.role === "user" ? "22px" : "32px" }}
                >
                  {msg.role === "user" ? (
                    <div>
                      <UserBubble content={msg.content} />
                      {(msg.meta?.modelId || msg.meta?.workflowId) && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px", paddingRight: "4px" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.06em", color: "var(--r-dim)", textTransform: "uppercase" }}>
                            dispatch
                            {msg.meta?.modelId && ` · ${msg.meta.modelId}`}
                            {msg.meta?.workflowId && ` · ${msg.meta.workflowId}`}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <AssistantMessage
                      msg={msg}
                      accent={config.accent}
                      chamberLabel={chamberLabel}
                      chamberId={config.id}
                      missionName={missionName}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <StatusStrip
        execStatus={execStatus}
        onCancel={onCancel}
        accent={config.accent}
        chamberLabel={chamberLabel}
        modelBadge={modelId}
      />

      {/* Stack 05: Terminal mission consequence notice */}
      {(missionStatus === "completed" || missionStatus === "archived") && (
        <div
          style={{
            padding: "8px 32px",
            background: "color-mix(in srgb, var(--r-dim) 8%, var(--r-surface))",
            borderTop: "1px solid var(--r-border-soft)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--r-dim)", flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--r-dim)" }}>
            MISSION {missionStatus.toUpperCase()} · open a new mission to continue
          </span>
        </div>
      )}

      {/* Composer */}
      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        onSend={onSend}
        onCancel={onCancel}
        isLoading={isLoading || missionStatus === "completed" || missionStatus === "archived"}
        placeholder={
          missionStatus === "completed" ? "Mission completed — open a new mission to continue"
          : missionStatus === "archived" ? "Mission archived — open a new mission to continue"
          : config.placeholder
        }
        accent={config.accent}
        configId={config.id}
        task={task}
        modelId={modelId}
        onTaskChange={onTaskChange}
        onModelChange={onModelChange}
        composerLocked={composerLocked}
        composerLockLabel={composerLockLabel}
      />
    </div>
  );
}
