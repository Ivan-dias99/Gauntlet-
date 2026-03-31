/**
 * RUBERRA — ChamberChat  ·  Metamorphosis Edition
 * Shared premium chat surface for Lab / School / Creation.
 * Visual-first. Structured outputs. Semantic signals. Zero dead text.
 */

import { useRef, useEffect, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Message } from "./shell-types";
import { BlockRenderer, InlineMarkdown } from "./BlockRenderer";
import { ModelSelector } from "./ModelSelector";
import { type TaskType } from "./model-orchestration";
import { getContractByChamber } from "./routing-contracts";
import { getPioneer } from "./pioneer-registry";
import { getExecutionTruth, TIER_LABEL, TIER_COLOR } from "./sovereign-runtime";

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
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "#52796A" }}>
    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M16 2.5v4.5M16 25v4.5M2.5 16H7M25 16h4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M6.5 6.5l3 3M22.5 22.5l3 3M25.5 6.5l-3 3M9.5 22.5l-3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const SchoolGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "#4A6B84" }}>
    <rect x="3.5" y="7" width="25" height="18" rx="2" stroke="currentColor" strokeWidth="1.25" />
    <path d="M3.5 13h25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M12 13v12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M16 4l-3 3h6L16 4z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.7" />
    <path d="M17 18.5h6M17 22h4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
    <path d="M5 17h4M5 20.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
  </svg>
);

export const CreationGlyph = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ color: "#8A6238" }}>
    <path d="M6 26l5-15 5 10 4-7 5 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="25.5" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M6 10.5h5.5M6 16h3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

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
  glyph, label, tagline, id, onSend, accent,
}: {
  glyph:   React.ReactNode;
  label:   string;
  tagline: string;
  id:      string;
  accent:  string;
  onSend:  (t: string) => void;
}) {
  const prompts = EMPTY_PROMPTS[id] ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "68px",
        paddingBottom: "32px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "18px" }}
      >
        {glyph}
      </motion.div>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--r-text)",
          fontFamily: "'Inter', system-ui, sans-serif",
          marginBottom: "6px",
          letterSpacing: "-0.015em",
          lineHeight: 1.3,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "12px",
          color: "var(--r-subtext)",
          fontFamily: "'Inter', system-ui, sans-serif",
          textAlign: "center",
          maxWidth: "260px",
          lineHeight: "1.65",
          marginBottom: "32px",
        }}
      >
        {tagline}
      </p>

      {/* Quick start prompts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "100%",
          maxWidth: "500px",
          padding: "0 16px",
        }}
      >
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
              borderRadius: "7px",
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
              el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
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
          background: "var(--r-elevated)",
          borderRadius: "14px 14px 3px 14px",
          padding: "10px 15px",
          maxWidth: "74%",
          fontSize: "13.5px",
          color: "var(--r-text)",
          fontFamily: "'Inter', system-ui, sans-serif",
          lineHeight: "1.65",
          border: "1px solid var(--r-border-soft)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
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
  "LAB":      "Research Agent",
  "SCHOOL":   "Learning Agent",
  "CREATION": "Build Agent",
};

function AgentLabel({ accent, chamberLabel }: { accent: string; chamberLabel: string }) {
  // chamberLabel is "RUBERRA · LAB" etc — extract chamber key
  const chamberKey = chamberLabel.split("·").pop()?.trim() ?? "";
  const roleLabel  = CHAMBER_ROLE[chamberKey] ?? "Agent";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 8px 3px 6px", border: `1px solid ${accent}28`, borderRadius: "4px", background: `${accent}0a` }}>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: accent,
            flexShrink: 0,
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8.5px",
            letterSpacing: "0.10em",
            color: accent,
            textTransform: "uppercase",
            userSelect: "none",
            fontWeight: 500,
          }}
        >
          {roleLabel}
        </span>
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "8px",
          letterSpacing: "0.08em",
          color: "var(--r-dim)",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
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

  return (
    <div
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        "5px",
        marginBottom: "7px",
        flexWrap:   "wrap",
      }}
    >
      {/* Lead pioneer chip */}
      {leadPioneer && (
        <span
          style={{
            fontSize:    "8px",
            fontFamily:  "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
            color:       leadPioneer.accent,
            background:  `${leadPioneer.accent}10`,
            border:      `1px solid ${leadPioneer.accent}22`,
            borderRadius: "3px",
            padding:     "1px 6px",
            userSelect:  "none",
          }}
        >
          {leadPioneer.name}
        </span>
      )}
      {/* Execution tier — the honest truth */}
      <span
        style={{
          fontSize:    "8px",
          fontFamily:  "'JetBrains Mono', monospace",
          letterSpacing: "0.07em",
          color:       tierColor,
          border:      `1px solid ${tierColor}28`,
          borderRadius: "3px",
          padding:     "1px 5px",
          userSelect:  "none",
          textTransform: "uppercase",
        }}
        title={
          tier === "A" ? "Running locally or in self-hosted runtime" :
          tier === "B" ? "Routing to free external provider — not guaranteed" :
          "Pioneer behavior via routing contracts — no live model"
        }
      >
        {tierLabel}
      </span>
      {/* Model label */}
      <span
        style={{
          fontSize:    "8px",
          fontFamily:  "'JetBrains Mono', monospace",
          letterSpacing: "0.05em",
          color:       "var(--r-dim)",
          userSelect:  "none",
        }}
      >
        {modelLabel}
      </span>
      {/* Support chain (compact) */}
      {contract.support_pioneers.length > 0 && (
        <span
          style={{
            fontSize:    "8px",
            fontFamily:  "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
            color:       "var(--r-dim)",
            userSelect:  "none",
            opacity:     0.7,
          }}
        >
          + {contract.support_pioneers
              .map((id) => getPioneer(id)?.name ?? id)
              .join(" · ")}
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
  msg, accent, chamberLabel, chamberId,
}: {
  msg: Message;
  accent: string;
  chamberLabel: string;
  chamberId: "lab" | "school" | "creation";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <ProvenanceTrace chamberId={chamberId} msgTruth={msg.execution_truth} />
      <AgentLabel accent={accent} chamberLabel={chamberLabel} />
      {(msg.meta?.pioneerId || msg.meta?.workflowId) && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
          {msg.meta?.pioneerId && <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "999px", padding: "1px 6px" }}>{msg.meta.pioneerId}</span>}
          {msg.meta?.workflowId && <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "999px", padding: "1px 6px" }}>{msg.meta.workflowId}</span>}
          {msg.meta?.hostingLevel && <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{msg.meta.hostingLevel}</span>}
        </div>
      )}
      {msg.blocks && msg.blocks.length > 0 ? (
        <BlockRenderer blocks={msg.blocks} />
      ) : msg.content ? (
        <InlineMarkdown content={msg.content} />
      ) : (
        <ThinkingDots />
      )}
    </motion.div>
  );
}

// ─── Status strip ─────────────────────────────────────────────────────────────

function StatusStrip({
  execStatus, onCancel, accent, chamberLabel, modelBadge,
}: {
  execStatus: "idle" | "thinking" | "streaming";
  onCancel: () => void;
  accent: string;
  chamberLabel: string;
  modelBadge: string;
}) {
  return (
    <div
      style={{
        maxWidth: "660px",
        margin: "0 auto",
        width: "100%",
        padding: "3px 32px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.1em", color: "var(--r-dim)" }}>
          {chamberLabel}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", letterSpacing: "0.08em", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "999px", padding: "1px 6px" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.10em", color: "var(--r-dim)" }}>
          {chamberLabel}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "8px",
            letterSpacing: "0.06em",
            color: "var(--r-dim)",
            border: "1px solid var(--r-border)",
            borderRadius: "999px",
            padding: "1px 7px",
          }}
        >
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
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
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
                fontSize: "9px",
                letterSpacing: "0.10em",
                color: accent,
                textTransform: "uppercase",
              }}
            >
              {execStatus}
            </span>
            {execStatus === "streaming" && (
              <button
                onClick={onCancel}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
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
  task, modelId, onTaskChange, onModelChange,
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
    if (!text || isLoading) return;
    onDraftChange("");
    onSend(text);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
    if (e.key === "Escape" && isLoading) onCancel();
  }

  const canSend = !!draft.trim() && !isLoading;

  return (
    <div style={{ padding: "6px 0 20px", background: "var(--r-bg)" }}>
      <div style={{ maxWidth: "660px", margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            background: "var(--r-surface)",
            border: `1px solid ${focused ? "var(--r-border)" : "var(--r-border)"}`,
            borderRadius: "12px",
            padding: "12px 12px 8px 16px",
            boxShadow: focused
              ? `0 0 0 3px ${accent}15, 0 1px 8px rgba(0,0,0,0.05)`
              : "0 1px 6px rgba(0,0,0,0.03)",
            transition: "box-shadow 0.18s ease, border-color 0.18s ease",
          }}
        >
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            placeholder={placeholder}
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
                borderRadius: "8px",
                border: canSend ? "none" : "1px solid var(--r-border)",
                background: canSend ? accent : "transparent",
                cursor: canSend ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                flexShrink: 0,
                transition: "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
                boxShadow: canSend ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
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
                  fill={canSend ? "white" : "var(--r-border)"}
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
      }}
    >
      {/* Thread */}
      <div
        ref={threadRef}
        className="hide-scrollbar"
        style={{ flex: 1, overflowY: "auto", padding: "28px 0 4px" }}
      >
        <div style={{ maxWidth: "660px", margin: "0 auto", padding: "0 32px" }}>
          {isEmpty ? (
            <EmptyState
              glyph={config.glyph}
              label={config.label}
              tagline={config.tagline}
              id={config.id}
              accent={config.accent}
              onSend={onSend}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ marginBottom: msg.role === "user" ? "20px" : "28px" }}
                >
                  {msg.role === "user" ? (
                    <UserBubble content={msg.content} />
                  ) : (
                    <AssistantMessage
                      msg={msg}
                      accent={config.accent}
                      chamberLabel={chamberLabel}
                      chamberId={config.id}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <StatusStrip execStatus={execStatus} onCancel={onCancel} accent={config.accent} chamberLabel={chamberLabel} modelBadge={modelId} />
      <StatusStrip
        execStatus={execStatus}
        onCancel={onCancel}
        accent={config.accent}
        chamberLabel={chamberLabel}
        modelBadge={modelId}
      />

      {/* Composer */}
      <Composer
        draft={draft}
        onDraftChange={onDraftChange}
        onSend={onSend}
        onCancel={onCancel}
        isLoading={isLoading}
        placeholder={config.placeholder}
        accent={config.accent}
        configId={config.id}
        task={task}
        modelId={modelId}
        onTaskChange={onTaskChange}
        onModelChange={onModelChange}
      />
    </div>
  );
}
