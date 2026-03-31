/**
 * RUBERRA — Mother Shell
 * Full state management ported from github.com/Ivan-star-dev/Ruberra
 * with Make-environment streaming via Supabase edge function.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { SovereignBar } from "./components/SovereignBar";
import { ShellSideRail } from "./components/ShellSideRail";
import { FloatingNoteSystem } from "./components/FloatingNoteSystem";
import { GlobalCommandPalette } from "./components/GlobalCommandPalette";
import { LabMode } from "./components/modes/LabMode";
import { SchoolMode } from "./components/modes/SchoolMode";
import { CreationMode } from "./components/modes/CreationMode";
import {
  type Tab, type Message, type SignalStatus,
  type LabView, type SchoolView, type CreationView,
  type FloatingNote, type Theme, type NavFn,
} from "./components/shell-types";
import { parseBlocks } from "./components/parseBlocks";
import {
  DEFAULT_TASK_BY_CHAMBER,
  DEFAULT_MODEL_BY_TASK,
  resolveExecutionPlan,
  type TaskType,
} from "./components/model-orchestration";

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: Tab[] = ["lab", "school", "creation"];
const STORAGE_KEY = "ruberra_messages_v2";
const MAX_CONTEXT = 20;
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b9f46b68`;

type TabMessages = Record<Tab, Message[]>;
type TabLoading  = Record<Tab, boolean>;
type TabSignals  = Record<Tab, SignalStatus>;
type TabDrafts   = Record<Tab, string>;
type TabTasks    = Record<Tab, TaskType>;
type TabModels   = Record<Tab, string>;

function emptyRecord<T>(value: T): Record<Tab, T> {
  return Object.fromEntries(TABS.map((t) => [t, value])) as Record<Tab, T>;
}

function loadMessages(): TabMessages {
  if (typeof window === "undefined") return emptyRecord<Message[]>([]);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TabMessages;
      if (TABS.every((t) => Array.isArray(parsed[t]))) return parsed;
    }
  } catch { /* corrupt storage */ }
  return emptyRecord<Message[]>([]);
}

export default function App() {
  // ── Core state ──────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<Tab>("lab");
  const [messages,     setMessages]     = useState<TabMessages>(loadMessages);
  const [loading,      setLoading]      = useState<TabLoading>(emptyRecord(false));
  const [signals,      setSignals]      = useState<TabSignals>(emptyRecord<SignalStatus>("idle"));
  const [drafts,       setDrafts]       = useState<TabDrafts>(emptyRecord(""));
  const [tasks, setTasks] = useState<TabTasks>({
    lab: DEFAULT_TASK_BY_CHAMBER.lab,
    school: DEFAULT_TASK_BY_CHAMBER.school,
    creation: DEFAULT_TASK_BY_CHAMBER.creation,
  });
  const [activeModels, setActiveModels] = useState<TabModels>({
    lab: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.lab],
    school: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.school],
    creation: DEFAULT_MODEL_BY_TASK[DEFAULT_TASK_BY_CHAMBER.creation],
  });

  // ── Chamber sub-views ────────────────────────────────────────────────────────
  const [labView,      setLabView]      = useState<LabView>("home");
  const [schoolView,   setSchoolView]   = useState<SchoolView>("home");
  const [creationView, setCreationView] = useState<CreationView>("home");

  // ── Detail navigation ────────────────────────────────────────────────────────
  const [detailId, setDetailId] = useState<string>("");

  // ── Navigation system — the heart of product connectivity ────────────────────
  const navigate = useCallback<NavFn>((tab, view, id = "") => {
    setActiveTab(tab);
    if (tab === "lab")      setLabView(view as LabView);
    if (tab === "school")   setSchoolView(view as SchoolView);
    if (tab === "creation") setCreationView(view as CreationView);
    setDetailId(id);
  }, []);

  // ── Floating notes ───────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<FloatingNote[]>([]);

  // ── Theme ────────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>("light");

  // ── Command palette ───────────────────────────────────────────────────────────
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  // ── Persistence ───────────────────────────────────────────────���──────────────
  const messagesRef = useRef<TabMessages>(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch { /* storage full */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [messages]);

  // ── Abort refs ───────────────────────────────────────────────────────────────
  const abortRefs = useRef<Record<Tab, AbortController | null>>(
    emptyRecord<AbortController | null>(null)
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    abortRefs.current[activeTab]?.abort();
  }, [activeTab]);

  const handleDraftChange = useCallback((text: string) => {
    setDrafts((prev) => ({ ...prev, [activeTab]: text }));
  }, [activeTab]);

  const handleClearTab = useCallback((tab: Tab) => {
    setMessages((prev) => ({ ...prev, [tab]: [] }));
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TabMessages;
        parsed[tab] = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch { /* ignore */ }
  }, []);

  const handleTaskChange = useCallback((tab: Tab, task: TaskType) => {
    setTasks((prev) => ({ ...prev, [tab]: task }));
    setActiveModels((prev) => ({ ...prev, [tab]: DEFAULT_MODEL_BY_TASK[task] }));
  }, []);

  const handleModelChange = useCallback((tab: Tab, modelId: string) => {
    setActiveModels((prev) => ({ ...prev, [tab]: modelId }));
  }, []);

  const applyParsedBlocks = useCallback((id: string, tab: Tab) => {
    setMessages((prev) => ({
      ...prev,
      [tab]: prev[tab].map((m) => {
        if (m.id !== id || m.role !== "assistant") return m;
        const blocks = parseBlocks(m.content);
        return blocks.length > 0 ? { ...m, blocks } : m;
      }),
    }));
  }, []);

  // ── Stream handler ────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text: string) => {
    const tab = activeTab;
    const task = tasks[tab];
    const requestedModelId = activeModels[tab];
    const plan = resolveExecutionPlan(tab, task, requestedModelId);
    const selectedModelId = plan.selectedModel?.id ?? requestedModelId;
    if (selectedModelId !== requestedModelId) {
      setActiveModels((prev) => ({ ...prev, [tab]: selectedModelId }));
    }

    abortRefs.current[tab]?.abort();
    const controller = new AbortController();
    abortRefs.current[tab] = controller;

    const userMsg: Message = {
      id:        crypto.randomUUID(),
      role:      "user",
      content:   text,
      tab,
      timestamp: Date.now(),
    };

    setMessages((prev) => ({ ...prev, [tab]: [...prev[tab], userMsg] }));
    setLoading((prev)  => ({ ...prev, [tab]: true }));
    setSignals((prev)  => ({ ...prev, [tab]: "streaming" }));

    const assistantId = crypto.randomUUID();
    setMessages((prev) => ({
      ...prev,
      [tab]: [
        ...prev[tab],
        { id: assistantId, role: "assistant", content: "", tab, timestamp: Date.now() },
      ],
    }));

    let parseOnComplete = true;

    try {
      const history = messagesRef.current[tab]
        .filter((m) => m.id !== assistantId)
        .slice(-MAX_CONTEXT)
        .map(({ role, content }) => ({ role, content }));

      const res = await fetch(`${SERVER_URL}/chat`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body:   JSON.stringify({
          tab,
          task,
          model: selectedModelId,
          fallbackChain: plan.fallbackChain,
          messages: [...history, { role: "user", content: text }],
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => ({
            ...prev,
            [tab]: prev[tab].map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            ),
          }));
        }
      } finally {
        reader.releaseLock();
      }

      setSignals((prev) => ({ ...prev, [tab]: "completed" }));
      setTimeout(() => {
        setSignals((prev) =>
          prev[tab] === "completed" ? { ...prev, [tab]: "idle" } : prev
        );
      }, 2400);

    } catch (err) {
      const isAbort = err instanceof Error && err.name === "AbortError";
      parseOnComplete = false;

      if (isAbort) {
        setSignals((prev) => ({ ...prev, [tab]: "idle" }));
      } else {
        console.error("[Ruberra] stream error", err);
        setMessages((prev) => ({
          ...prev,
          [tab]: prev[tab].map((m) =>
            m.id === assistantId
              ? { ...m, content: "Error — please try again." }
              : m
          ),
        }));
        setSignals((prev) => ({ ...prev, [tab]: "error" }));
        setTimeout(() => {
          setSignals((prev) =>
            prev[tab] === "error" ? { ...prev, [tab]: "idle" } : prev
          );
        }, 2400);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [tab]: false }));
      abortRefs.current[tab] = null;
      if (parseOnComplete) {
        applyParsedBlocks(assistantId, tab);
      }
    }
  }, [activeTab, activeModels, applyParsedBlocks, tasks]);

  // ── Notes ─────────────────────────────────────────────────────────────────────
  const addNote = useCallback(() => {
    const note: FloatingNote = {
      id:        crypto.randomUUID(),
      content:   "",
      tab:       activeTab,
      pinned:    false,
      x:         Math.max(80, window.innerWidth / 2 - 128 + Math.random() * 60),
      y:         Math.max(80, 120 + Math.random() * 80),
      timestamp: Date.now(),
    };
    setNotes((prev) => [...prev, note]);
  }, [activeTab]);

  const updateNote = useCallback((id: string, updates: Partial<FloatingNote>) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id || n.pinned));
  }, []);

  const isLive = Object.values(signals).some((s) => s === "streaming");

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--r-bg)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        transition: "background 0.2s ease",
      }}
    >
      {/* Sovereign Bar */}
      <SovereignBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLive={isLive}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onSearch={() => setCmdOpen(true)}
      />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Side Rail */}
        <ShellSideRail
          activeTab={activeTab}
          messages={messages}
          signals={signals}
          labView={labView}
          schoolView={schoolView}
          creationView={creationView}
          onLabView={(v) => { setLabView(v); setDetailId(""); }}
          onSchoolView={(v) => { setSchoolView(v); setDetailId(""); }}
          onCreationView={(v) => { setCreationView(v); setDetailId(""); }}
          onNewNote={addNote}
          onClearTab={handleClearTab}
          navigate={navigate}
        />

        {/* Operational Surface */}
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}
            >
              {activeTab === "lab" && (
                <LabMode
                  messages={messages.lab}
                  isLoading={loading.lab}
                  draft={drafts.lab}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  labView={labView}
                  onLabView={(v) => { setLabView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.lab}
                  modelId={activeModels.lab}
                  onTaskChange={(task) => handleTaskChange("lab", task)}
                  onModelChange={(modelId) => handleModelChange("lab", modelId)}
                />
              )}
              {activeTab === "school" && (
                <SchoolMode
                  messages={messages.school}
                  isLoading={loading.school}
                  draft={drafts.school}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  schoolView={schoolView}
                  onSchoolView={(v) => { setSchoolView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.school}
                  modelId={activeModels.school}
                  onTaskChange={(task) => handleTaskChange("school", task)}
                  onModelChange={(modelId) => handleModelChange("school", modelId)}
                />
              )}
              {activeTab === "creation" && (
                <CreationMode
                  messages={messages.creation}
                  isLoading={loading.creation}
                  draft={drafts.creation}
                  onDraftChange={handleDraftChange}
                  onSend={handleSend}
                  onCancel={handleCancel}
                  creationView={creationView}
                  onCreationView={(v) => { setCreationView(v); setDetailId(""); }}
                  navigate={navigate}
                  detailId={detailId}
                  task={tasks.creation}
                  modelId={activeModels.creation}
                  onTaskChange={(task) => handleTaskChange("creation", task)}
                  onModelChange={(modelId) => handleModelChange("creation", modelId)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Status bar */}
      <div
        style={{
          height: "22px",
          borderTop: "1px solid var(--r-border)",
          background: "var(--r-surface)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,
          gap: "0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <motion.div
            animate={{ opacity: isLive ? [0.4, 1, 0.4] : [0.3, 0.7, 0.3] }}
            transition={{ duration: isLive ? 0.85 : 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: isLive ? "var(--r-accent)" : "var(--r-pulse)",
            }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.10em", color: "var(--r-dim)", textTransform: "uppercase" }}>
            {isLive ? "streaming" : "ready"}
          </span>
        </div>

        <div style={{ width: "1px", height: "9px", background: "var(--r-border)", margin: "0 10px" }} />

        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
          {activeModels[activeTab]}
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {activeTab}
        </span>

        <div style={{ width: "1px", height: "9px", background: "var(--r-border)", margin: "0 10px" }} />

        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", color: "var(--r-dim)", letterSpacing: "0.03em" }}>
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Floating notes layer */}
      <FloatingNoteSystem notes={notes} onChange={updateNote} onRemove={removeNote} />

      {/* Global command palette */}
      <GlobalCommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} navigate={navigate} />
    </div>
  );
}
