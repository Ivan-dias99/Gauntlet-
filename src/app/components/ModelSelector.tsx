/**
 * RUBERRA ModelSelector — Active Battalion Layer
 * Premium floating model/task matrix. Chamber-filtered. Sovereign-grade.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CHAMBER_TASKS,
  TASK_LABELS,
  getModelPool,
  type ChamberTab,
  type TaskType,
  type ModelDescriptor,
} from "./model-orchestration";
import { CHAMBER_ACCENT } from "../dna/chamber-accent";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  chamber: ChamberTab;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  mode: "chat" | "terminal";
}

// ─── Constants ─────────────────────────────────────────────────────────────────


const QUALITY_DOT: Record<ModelDescriptor["quality"], string> = {
  good:   "var(--r-dim)",
  strong: "var(--r-warn)",
  elite:  "var(--r-ok)",
};

const LATENCY_LABEL: Record<ModelDescriptor["latency"], string> = {
  low:    "fast",
  medium: "mid",
  high:   "slow",
};

// ─── Floating matrix panel ─────────────────────────────────────────────────────

function MatrixPanel({
  chamber,
  task,
  modelId,
  onTaskChange,
  onModelChange,
  onClose,
}: {
  chamber: ChamberTab;
  task: TaskType;
  modelId: string;
  onTaskChange: (t: TaskType) => void;
  onModelChange: (id: string) => void;
  onClose: () => void;
}) {
  const accent = CHAMBER_ACCENT[chamber];
  const pool   = getModelPool(chamber);
  const tasks  = CHAMBER_TASKS[chamber];
  const ref    = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position:     "absolute",
        bottom:       "calc(100% + 8px)",
        left:         0,
        zIndex:       200,
        width:        "320px",
        background:   "var(--r-surface)",
        border:       "1px solid var(--r-border)",
        borderRadius: "2px",
        boxShadow: "none",
        overflow:     "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--r-border-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.10em", textTransform: "uppercase", color: accent }}>
            {chamber} · active battalion
          </span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--r-dim)", padding: "0 2px", outline: "none", lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        {/* Task selector */}
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {tasks.map((t) => (
            <button
              key={t}
              onClick={() => { onTaskChange(t); onModelChange(getModelPool(chamber)[0]?.id ?? modelId); }}
              style={{
                fontSize:      "9px",
                fontFamily:    "'JetBrains Mono', monospace",
                letterSpacing: "0.05em",
                padding:       "3px 8px",
                borderRadius: "2px",
                border:        task === t ? `1px solid ${accent}` : "1px solid var(--r-border)",
                background:    task === t ? `${accent}14` : "transparent",
                color:         task === t ? accent : "var(--r-dim)",
                cursor:        "pointer",
                outline:       "none",
                transition:    "all 0.1s ease",
              }}
            >
              {TASK_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Model list */}
      <div style={{ maxHeight: "240px", overflowY: "auto", padding: "6px 0" }}>
        {pool.map((m) => {
          const selected = m.id === modelId;
          return (
            <button
              key={m.id}
              disabled={m.unavailable}
              onClick={() => { if (!m.unavailable) { onModelChange(m.id); onClose(); } }}
              style={{
                width:      "100%",
                display:    "flex",
                alignItems: "flex-start",
                gap:        "10px",
                padding:    "8px 14px",
                border:     "none",
                background: selected ? `${accent}0d` : "transparent",
                cursor:     m.unavailable ? "default" : "pointer",
                textAlign:  "left",
                outline:    "none",
                opacity:    m.unavailable ? 0.4 : 1,
                borderLeft: selected ? `2px solid ${accent}` : "2px solid transparent",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => { if (!m.unavailable && !selected) (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
              onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Quality dot */}
              <div style={{
                width:        "6px",
                height:       "6px",
                borderRadius: "50%",
                background:   QUALITY_DOT[m.quality],
                flexShrink:   0,
                marginTop:    "4px",
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: selected ? accent : "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.005em" }}>
                    {m.label}
                  </span>
                  {m.unavailable && (
                    <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-err)", letterSpacing: "0.06em" }}>unavailable</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.02em" }}>
                    {m.role}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
                <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
                  {m.benchmark.slice(0, 16)}
                </span>
                <span style={{
                  fontSize:      "7px",
                  fontFamily:    "monospace",
                  letterSpacing: "0.06em",
                  color:         "var(--r-dim)",
                  background:    "var(--r-rail)",
                  border:        "1px solid var(--r-border)",
                  borderRadius: "2px",
                  padding:       "1px 4px",
                }}>
                  {LATENCY_LABEL[m.latency]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding:      "8px 14px",
        borderTop:    "1px solid var(--r-border-soft)",
        display:      "flex",
        alignItems:   "center",
        gap:          "6px",
      }}>
        <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.06em", flex: 1 }}>
          {pool.filter(m => !m.unavailable).length} active · {pool.filter(m => m.unavailable).length} unavailable
        </span>
        <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
          esc to close
        </span>
      </div>
    </motion.div>
  );
}

// ─── Compact trigger (inline in status bar) ────────────────────────────────────

export function ModelSelector({
  chamber, task, modelId, onTaskChange, onModelChange, mode,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const accent          = CHAMBER_ACCENT[chamber];
  const pool            = getModelPool(chamber);
  const selectedModel   = pool.find((m) => m.id === modelId);

  // Keyboard: Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const terminalBase: React.CSSProperties = {
    background:    "#131110",
    border:        "1px solid #2a2522",
    color:         "#8b8278",
  };

  const lightBase: React.CSSProperties = {
    background:    "var(--r-surface)",
    border:        "1px solid var(--r-border)",
    color:         "var(--r-subtext)",
  };

  const baseStyle = mode === "terminal" ? terminalBase : lightBase;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "5px" }}>
      {/* Task chip */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...baseStyle,
          display:       "flex",
          alignItems:    "center",
          gap:           "5px",
          height:        "22px",
          padding:       "0 9px",
          borderRadius: "2px",
          cursor:        "pointer",
          outline:       "none",
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "9px",
          letterSpacing: "0.04em",
          transition:    "all 0.12s ease",
          whiteSpace:    "nowrap",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = accent;
          el.style.color = accent;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = mode === "terminal" ? "#2a2522" : "var(--r-border)";
          el.style.color = mode === "terminal" ? "#8b8278" : "var(--r-subtext)";
        }}
      >
        {TASK_LABELS[task]}
        <span style={{ color: "var(--r-dim)", fontSize: "8px" }}>▾</span>
      </button>

      {/* Model chip */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...baseStyle,
          display:       "flex",
          alignItems:    "center",
          gap:           "5px",
          height:        "22px",
          padding:       "0 9px",
          borderRadius: "2px",
          cursor:        "pointer",
          outline:       "none",
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "9px",
          letterSpacing: "0.04em",
          transition:    "all 0.12s ease",
          whiteSpace:    "nowrap",
          maxWidth:      "140px",
          overflow:      "hidden",
          textOverflow:  "ellipsis",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = accent;
          el.style.color = accent;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = mode === "terminal" ? "#2a2522" : "var(--r-border)";
          el.style.color = mode === "terminal" ? "#8b8278" : "var(--r-subtext)";
        }}
      >
        {/* Quality dot */}
        {selectedModel && (
          <span style={{
            width:        "5px",
            height:       "5px",
            borderRadius: "50%",
            background:   QUALITY_DOT[selectedModel.quality],
            display:      "inline-block",
            flexShrink:   0,
          }} />
        )}
        {selectedModel?.label ?? "—"}
      </button>

      {/* Floating matrix panel */}
      <AnimatePresence>
        {open && (
          <MatrixPanel
            chamber={chamber}
            task={task}
            modelId={modelId}
            onTaskChange={onTaskChange}
            onModelChange={onModelChange}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
