import { useState, useRef, useEffect } from "react";
import { type Tab } from "./shell-types";
import { AnimatePresence, motion } from "motion/react";
import {
  CHAMBER_TASKS,
  TASK_LABELS,
  getModelPool,
  type ChamberTab,
  type TaskType,
} from "./model-orchestration";

interface ModelSelectorProps {
  chamber: ChamberTab;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  mode: "chat" | "terminal";
}

export function ModelSelector({ chamber, task, modelId, onTaskChange, onModelChange, mode }: ModelSelectorProps) {
  const pool = getModelPool(chamber);
  const tasks = CHAMBER_TASKS[chamber];
  const selectedModel = pool.find((m) => m.id === modelId);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isTerminal = mode === "terminal";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", position: "relative" }} ref={ref}>
      <select
        value={task}
        onChange={(e) => onTaskChange(e.target.value as TaskType)}
        style={selectStyle(mode)}
      >
        {tasks.map((t) => (
          <option key={t} value={t}>{TASK_LABELS[t]}</option>
        ))}
      </select>

      <select
        value={modelId}
        onChange={(e) => onModelChange(e.target.value)}
        style={selectStyle(mode)}
      >
        {pool.map((m) => (
          <option key={m.id} value={m.id} disabled={m.unavailable}>
            {m.label}{m.unavailable ? " · unavailable" : ""}
          </option>
        ))}
      </select>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...selectStyle(mode),
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
          textAlign: "left"
        }}
      >
        <span>{selectedModel?.label || "Select Model"}</span>
        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {selectedModel && (
        <span style={badgeStyle(mode, !!selectedModel.unavailable)}>
          {selectedModel.provider}
        </span>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "100%", // pop UP
              left: "60px",
              marginBottom: "8px",
              width: "360px",
              background: isTerminal ? "#0f0e0d" : "var(--r-surface)",
              border: isTerminal ? "1px solid #2a2522" : "1px solid var(--r-border)",
              borderRadius: "8px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: isTerminal ? "1px solid #1a1816" : "1px solid var(--r-border-soft)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 600, fontFamily: "system-ui, sans-serif", letterSpacing: "0.03em", color: isTerminal ? "#d2cac2" : "var(--r-text)", textTransform: "uppercase" }}>
                  Active Battalion
                </span>
                <span style={{ padding: "2px 6px", background: "var(--r-accent)", color: "#fff", fontSize: "8px", fontFamily: "monospace", borderRadius: "3px" }}>Matrix</span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "9.5px", color: "var(--r-dim)", lineHeight: 1.4 }}>
                Select the primary commander for the active sequence. Fallbacks are negotiated automatically.
              </p>
            </div>

            <div style={{ maxHeight: "280px", overflowY: "auto", padding: "6px" }}>
              {pool.map(m => {
                const active = m.id === modelId;
                return (
                  <button
                    key={m.id}
                    disabled={m.unavailable}
                    onClick={() => {
                      onModelChange(m.id);
                      setIsOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      background: active ? (isTerminal ? "#1c1917" : "var(--r-bg)") : "transparent",
                      border: "none",
                      borderRadius: "6px",
                      cursor: m.unavailable ? "not-allowed" : "pointer",
                      opacity: m.unavailable ? 0.4 : 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "background 0.1s"
                    }}
                    onMouseEnter={(e) => {
                      if (!active && !m.unavailable) e.currentTarget.style.background = isTerminal ? "#1a1816" : "var(--r-bg)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active && !m.unavailable) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "11px", fontWeight: active ? 600 : 500, color: active ? (isTerminal ? "#e8e4df" : "var(--r-text)") : (isTerminal ? "#b0a8a0" : "var(--r-subtext)"), fontFamily: "system-ui, sans-serif" }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>
                        {m.role}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "monospace" }}>
                        {m.family} · {m.benchmark}
                      </span>
                      {active && (
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--r-accent)", marginLeft: "auto" }} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
            <div style={{ padding: "8px 14px", borderTop: isTerminal ? "1px solid #1a1816" : "1px solid var(--r-border-soft)", background: isTerminal ? "#0a0909" : "var(--r-bg)" }}>
               <span style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                 Runtime State: Connected
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function selectStyle(mode: "chat" | "terminal") {
  return {
    height: "22px",
    borderRadius: "5px",
    border: mode === "terminal" ? "1px solid #2a2522" : "1px solid var(--r-border)",
    background: mode === "terminal" ? "#131110" : "var(--r-surface)",
    color: mode === "terminal" ? "#8b8278" : "var(--r-subtext)",
    color: mode === "terminal" ? "#d2cac2" : "var(--r-subtext)",
    fontFamily: "monospace",
    fontSize: "9px",
    letterSpacing: "0.04em",
    padding: "0 8px",
    outline: "none",
    maxWidth: "170px",
    maxWidth: "180px",
  } as const;
}

function badgeStyle(mode: "chat" | "terminal", unavailable: boolean) {
  return {
    fontFamily: "monospace",
    fontSize: "8px",
    letterSpacing: "0.09em",
    textTransform: "uppercase" as const,
    color: unavailable ? "var(--r-err)" : mode === "terminal" ? "#5a5450" : "var(--r-dim)",
    border: mode === "terminal" ? "1px solid #252220" : "1px solid var(--r-border)",
    color: unavailable ? "var(--r-err)" : mode === "terminal" ? "#7c726a" : "var(--r-dim)",
    border: mode === "terminal" ? "1px solid #252220" : "1px solid var(--r-border-soft)",
    borderRadius: "999px",
    padding: "2px 7px",
  };
}
