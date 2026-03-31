/**
 * RUBERRA — ChamberChat  ·  Metamorphosis Edition
 * Shared premium chat surface for Lab / School / Creation.
 * Visual-first. Structured outputs. Semantic signals. Zero dead text.
 */

import { useRef, useEffect, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Message } from "./shell-types";
import { BlockRenderer, InlineMarkdown } from "./BlockRenderer";
import { ModelSelector } from "./ModelSelector";
import { type TaskType } from "./model-orchestration";

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
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ color: "var(--r-dim)" }}>
    <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M16 2v5M16 25v5M2 16h5M25 16h5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M6.1 6.1l3.5 3.5M22.4 22.4l3.5 3.5M25.9 6.1l-3.5 3.5M9.6 22.4l-3.5 3.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
);

export const SchoolGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ color: "var(--r-dim)" }}>
    <rect x="4" y="7" width="24" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M4 13h24M12 13v12" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M16 4.5l-2.5 2.5h5L16 4.5z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M17 18h5M17 21.5h3.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const CreationGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" style={{ color: "var(--r-dim)" }}>
    <path d="M7 25l5-14 5 9 4-6 5 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="25" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M7 10h6M7 15h4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
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
  glyph, label, tagline, id, onSend,
}: {
  glyph: React.ReactNode;
  label: string;
  tagline: string;
  id: string;
  onSend: (t: string) => void;
}) {
  const prompts = EMPTY_PROMPTS[id] ?? [];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "72px",
        paddingBottom: "32px",
      }}
    >
      <div style={{ marginBottom: "16px", opacity: 0.6 }}>{glyph}</div>
      <p
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--r-text)",
          fontFamily: "'Inter', system-ui, sans-serif",
          marginBottom: "5px",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "11px",
          color: "var(--r-subtext)",
          fontFamily: "'Inter', system-ui, sans-serif",
          textAlign: "center",
          maxWidth: "240px",
          lineHeight: "1.6",
          marginBottom: "28px",
        }}
      >
        {tagline}
      </p>

      {/* Quick start prompts */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
          maxWidth: "480px",
          padding: "0 16px",
        }}
      >
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSend(p)}
            style={{
              width: "100%",
              padding: "9px 14px",
              border: "1px solid var(--r-border)",
              borderRadius: "6px",
              background: "var(--r-surface)",
              cursor: "pointer",
              outline: "none",
              textAlign: "left",
              fontSize: "12px",
              color: "var(--r-subtext)",
              fontFamily: "'Inter', system-ui, sans-serif",
              lineHeight: 1.4,
              transition: "all 0.1s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)";
              (e.currentTarget as HTMLElement).style.color = "var(--r-text)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--r-subtext)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--r-surface)";
              (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--r-border)";
            }}
          >
            <span>{p}</span>
            <span style={{ color: "var(--r-dim)", fontSize: "10px", flexShrink: 0 }}>↵</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── User bubble ──────────────────────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          background: "var(--r-elevated)",
          borderRadius: "12px 12px 3px 12px",
          padding: "10px 15px",
          maxWidth: "72%",
          fontSize: "13px",
          color: "var(--r-text)",
          fontFamily: "'Inter', system-ui, sans-serif",
          lineHeight: "1.62",
          border: "1px solid var(--r-border-soft)",
        }}
      >
        {content}
      </div>
    </div>
  );
}

// ─── Agent label ──────────────────────────────────────────────────────────────

function AgentLabel({ accent, chamberLabel }: { accent: string; chamberLabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
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
          fontSize: "9px",
          letterSpacing: "0.12em",
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

// ─── Streaming indicator ──────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "4px", alignItems: "center", height: "20px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -2, 0] }}
          transition={{ duration: 1.1, delay: i * 0.16, repeat: Infinity, ease: "easeInOut" }}
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
  msg, accent, chamberLabel,
}: {
  msg: Message;
  accent: string;
  chamberLabel: string;
}) {
  return (
    <div>
      <AgentLabel accent={accent} chamberLabel={chamberLabel} />
      {msg.blocks && msg.blocks.length > 0 ? (
        <BlockRenderer blocks={msg.blocks} />
      ) : msg.content ? (
        <InlineMarkdown content={msg.content} />
      ) : (
        <ThinkingDots />
      )}
    </div>
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
        padding: "2px 32px",
        height: "22px",
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
              animate={{ opacity: [0.3, 1, 0.3] }}
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
                }}
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
            border: "1px solid var(--r-border)",
            borderRadius: "12px",
            padding: "12px 12px 8px 16px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            transition: "border-color 0.15s ease",
          }}
          onFocus={() => {}}
        >
          <textarea
            ref={ref}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={handleKey}
            disabled={isLoading}
            placeholder={placeholder}
            rows={1}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px",
              color: "var(--r-text)",
              background: "transparent",
              lineHeight: "1.6",
              minHeight: "36px",
              maxHeight: "160px",
              display: "block",
              caretColor: accent,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "6px",
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
                  }}
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
                border: `1px solid ${canSend ? "transparent" : "var(--r-border)"}`,
                background: canSend ? "var(--r-text)" : "transparent",
                cursor: canSend ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                flexShrink: 0,
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 8L2 2l3 6-3 6 12-6z"
                  stroke={canSend ? "white" : "var(--r-border)"}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
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
  messages: Message[];
  isLoading: boolean;
  draft: string;
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
        style={{ flex: 1, overflowY: "auto", padding: "24px 0 4px" }}
      >
        <div style={{ maxWidth: "660px", margin: "0 auto", padding: "0 32px" }}>
          {isEmpty ? (
            <EmptyState
              glyph={config.glyph}
              label={config.label}
              tagline={config.tagline}
              id={config.id}
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
