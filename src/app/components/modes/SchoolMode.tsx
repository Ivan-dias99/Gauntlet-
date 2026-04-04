/**
 * RUBERRA School — Learning Chamber
 * Discover → Chat / Library / Archive
 */

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type Message, type SchoolView } from "../shell-types";
import { type NavFn } from "../shell-types";
import { ChamberChat, SchoolGlyph, type ChamberConfig } from "../ChamberChat";
import { SchoolDiscover } from "../discovery/SchoolDiscover";
import { SchoolTrackDetail } from "../detail/SchoolTrackDetail";
import { SchoolLessonDetail } from "../detail/SchoolLessonDetail";
import { SchoolRoleDetail } from "../detail/SchoolRoleDetail";
import { SCHOOL_ROLES } from "../product-data";
import { type TaskType } from "../model-orchestration";
import { buildMessageObject, findObject, listObjectsForChamber, mergeObjectsByRecency, openObject } from "../object-graph";
import { SovereignEmptyFrame, emptyActionBtn } from "../SovereignEmptyFrame";

const SCHOOL_CONFIG: ChamberConfig = {
  id:          "school",
  label:       "School",
  tagline:     "Structured progression. First principles first.",
  placeholder: "Ask School…",
  accent:      "var(--chamber-school)",
  glyph:       <SchoolGlyph />,
};

// ─── Library ──────────────────────────────────────────────────────────────────

interface LibraryResource {
  id: string;
  title: string;
  category: string;
  desc: string;
  kind: "framework" | "blueprint" | "guide" | "reference" | "track";
}

const LIBRARY: LibraryResource[] = [
  { id: "r1",  title: "First Principles Thinking",  category: "Frameworks", desc: "Break any problem to its foundational axioms before reasoning upward.",                 kind: "framework" },
  { id: "r2",  title: "Feynman Technique",          category: "Frameworks", desc: "Teach what you learn, expose gaps, simplify until mastered.",                           kind: "framework" },
  { id: "r3",  title: "Zettelkasten Method",        category: "Blueprints", desc: "Networked note system for building a living knowledge graph.",                          kind: "blueprint" },
  { id: "r4",  title: "Spaced Repetition",          category: "Blueprints", desc: "Review intervals timed to the forgetting curve for lasting retention.",                 kind: "blueprint" },
  { id: "r5",  title: "Systems Thinking",           category: "Frameworks", desc: "Understand feedback loops, emergence, and leverage points.",                            kind: "framework" },
  { id: "r6",  title: "Analytical Reading",         category: "Guides",     desc: "Active reading as dialogue: question, annotate, synthesize, judge.",                   kind: "guide"     },
  { id: "r7",  title: "Mental Models Index",        category: "References", desc: "Curated mental models from physics, mathematics, and psychology.",                     kind: "reference" },
  { id: "r8",  title: "Deep Work Protocol",         category: "Guides",     desc: "Structure focused sessions to produce cognitively demanding output.",                  kind: "guide"     },
  { id: "r9",  title: "Logic & Argumentation",      category: "Tracks",     desc: "From syllogisms to informal fallacies — clean reasoning foundation.",                 kind: "track"     },
  { id: "r10", title: "Research Methods",           category: "Tracks",     desc: "Empirical design, evidence hierarchy, and analytical writing.",                        kind: "track"     },
];

const KIND_ACCENT: Record<LibraryResource["kind"], string> = {
  framework: "#4A6B84",
  blueprint: "#52796A",
  guide:     "#786220",
  reference: "var(--r-subtext)",
  track:     "#4A6B84",
};

const CATS = ["All", "Frameworks", "Blueprints", "Guides", "References", "Tracks"];

function SchoolLibrary({ navigate }: { navigate: NavFn }) {
  const [filter, setFilter]     = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = filter === "All" ? LIBRARY : LIBRARY.filter(r => r.category === filter);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--r-bg)" }}>
      {/* Header */}
      <div
        style={{
          padding: "14px 32px 12px",
          borderBottom: "1px solid var(--r-border)",
          background: `color-mix(in srgb, var(--chamber-school) 5%, var(--r-surface))`,
          borderTop: `2px solid color-mix(in srgb, var(--chamber-school) 50%, transparent)`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>Library</p>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)" }}>{visible.length} resources</span>
        </div>
        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontSize: "10px",
                padding: "3px 10px",
                borderRadius: "2px",
                border: "none",
                background: filter === cat ? "var(--r-border)" : "transparent",
                color: filter === cat ? "var(--r-text)" : "var(--r-subtext)",
                cursor: "pointer",
                outline: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: filter === cat ? 500 : 400,
                transition: "background 0.1s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 32px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {visible.map(r => (
            <div
              key={r.id}
              style={{
                border: "1px solid var(--r-border)",
                borderRadius: "2px",
                background: "var(--r-surface)",
                marginBottom: "6px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "11px 14px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  outline: "none",
                }}
              >
                <span
                  style={{
                    width: "2px",
                    alignSelf: "stretch",
                    borderRadius: "1px",
                    background: KIND_ACCENT[r.kind],
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "9px", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>
                      {r.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: "8px",
                        letterSpacing: "0.10em",
                        color: KIND_ACCENT[r.kind],
                        textTransform: "uppercase",
                        opacity: 0.8,
                      }}
                    >
                      {r.kind}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.55", margin: 0 }}>
                    {r.desc}
                  </p>
                </div>
                <span style={{ fontSize: "10px", color: "var(--r-dim)", flexShrink: 0, marginTop: "1px" }}>
                  {expanded === r.id ? "▾" : "▸"}
                </span>
              </button>
              {expanded === r.id && (
                <div
                  style={{
                    padding: "10px 14px 14px",
                    borderTop: "1px solid var(--r-border-soft)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", lineHeight: "1.6", margin: 0 }}>
                    {r.desc} Ask School to guide you through it, generate a study plan, or produce examples.
                  </p>
                  <span style={{ fontSize: "10px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {r.category}
                  </span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button onClick={() => navigate("school", "chat")} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 7px", borderRadius: "2px", cursor: "pointer" }}>Ask School</button>
                    <button onClick={() => navigate("school", "archive")} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 7px", borderRadius: "2px", cursor: "pointer" }}>Save Path</button>
                    <button onClick={() => navigate("school", "browse")} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 7px", borderRadius: "2px", cursor: "pointer" }}>Related Roles</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Archive ──────────────────────────────────────────────────────────────────

function SchoolArchive({ messages, navigate }: { messages: Message[]; navigate: NavFn }) {
  const runtimeObjects = [...messages].reverse().slice(0, 18).map(buildMessageObject);
  const objects = mergeObjectsByRecency(runtimeObjects, listObjectsForChamber("school")).slice(0, 36);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "var(--r-bg)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "18px" }}>
          <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>School Archive</p>
          <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)" }}>{objects.length} entries</span>
        </div>
        {objects.length === 0 ? (
          <SovereignEmptyFrame
            align="left"
            accentVar="var(--chamber-school)"
            kicker="School · archive"
            title="No saved learning objects"
            body="Tracks, lessons, and roles you touch will surface here with continuity. Start from Library, Browse, or Chat to seed the archive."
            actions={
              <Fragment>
                {emptyActionBtn(() => navigate("school", "library"), "Open Library", "var(--chamber-school)")}
                {emptyActionBtn(() => navigate("school", "chat"), "Open School Chat", "var(--chamber-school)")}
              </Fragment>
            }
          />
        ) : objects.map((obj, i) => (
          <div key={`${obj.id}-${i}`} style={{ border: "1px solid var(--r-border)", borderRadius: "2px", padding: "10px 12px", marginBottom: "8px", background: "var(--r-surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 500 }}>{obj.title}</span>
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{obj.type}</span>
            </div>
            <p style={{ fontSize: "11px", color: "var(--r-subtext)", margin: "0 0 8px" }}>{obj.summary}</p>
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
              <button onClick={() => openObject(navigate, obj)} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "2px", cursor: "pointer" }}>Open</button>
              <button onClick={() => navigate("school", "chat")} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "2px", cursor: "pointer" }}>Continue in Chat</button>
              {obj.related_items.slice(0, 1).map((rid) => {
                const related = findObject(rid);
                if (!related) return null;
                return <button key={rid} onClick={() => openObject(navigate, related)} style={{ border: "1px solid var(--r-border)", background: "transparent", fontSize: "10px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "2px", cursor: "pointer" }}>Related → {related.title.slice(0, 18)}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SchoolMode({
  messages, isLoading, draft, onDraftChange, onSend, onCancel,
  schoolView, onSchoolView, navigate, detailId, task, modelId, onTaskChange, onModelChange, missionName, missionStatus,
}: {
  messages: Message[];
  isLoading: boolean;
  draft: string;
  onDraftChange: (t: string) => void;
  onSend: (t: string) => void;
  onCancel: () => void;
  schoolView: SchoolView;
  onSchoolView: (v: SchoolView) => void;
  navigate: NavFn;
  detailId: string;
  task: TaskType;
  modelId: string;
  onTaskChange: (task: TaskType) => void;
  onModelChange: (modelId: string) => void;
  missionName?: string;
  missionStatus?: string;
}) {
  const composerLocked = missionStatus === "completed" || missionStatus === "archived";
  const composerLockLabel = composerLocked
    ? `Mission ${missionStatus} — release or activate a mission to continue`
    : missionStatus === "blocked"
      ? "Mission blocked — resolve blockers in Profile → Operations"
      : undefined;
  const showHome = schoolView === "home" || (!messages.length && schoolView === "chat");

  if (showHome) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="school-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <SchoolDiscover
            onEnterLesson={() => { onSchoolView("chat"); onSend("I want to learn about distributed systems — start from first principles"); }}
            navigate={navigate}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (schoolView === "track")  return <SchoolTrackDetail  trackId={detailId}  navigate={navigate} onStartChat={(p) => { onSchoolView("chat"); onSend(p); }} />;
  if (schoolView === "lesson") return <SchoolLessonDetail lessonId={detailId} navigate={navigate} onStartChat={(p) => { onSchoolView("chat"); onSend(p); }} />;
  if (schoolView === "role")   return <SchoolRoleDetail   roleId={detailId}   navigate={navigate} onStartChat={(p) => { onSchoolView("chat"); onSend(p); }} />;
  if (schoolView === "browse") return <SchoolBrowse navigate={navigate} />;
  if (schoolView === "library") return <SchoolLibrary navigate={navigate} />;
  if (schoolView === "archive") return <SchoolArchive messages={messages} navigate={navigate} />;

  return (
    <ChamberChat
      messages={messages} isLoading={isLoading} draft={draft}
      onDraftChange={onDraftChange} onSend={onSend} onCancel={onCancel}
      config={SCHOOL_CONFIG}
      task={task}
      modelId={modelId}
      onTaskChange={onTaskChange}
      onModelChange={onModelChange}
      missionName={missionName}
      composerLocked={composerLocked}
      composerLockLabel={composerLockLabel}
      missionStatus={missionStatus}
    />
  );
}

// ─── Browse — all roles and tracks ───────────────────────────────────────────

function SchoolBrowse({ navigate }: { navigate: NavFn }) {
  const DEMAND_COLOR: Record<string, string> = { Critical: "var(--r-err)", High: "var(--r-warn)", Emerging: "var(--r-ok)" };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: "var(--r-bg)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>Future Role Paths</p>
          <button onClick={() => navigate("school", "home")} style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)", background: "transparent", border: "none", cursor: "pointer", outline: "none" }}>← Back</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SCHOOL_ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => navigate("school", "role", role.id)}
              style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 16px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", cursor: "pointer", outline: "none", textAlign: "left", transition: "background 0.1s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-elevated)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--r-surface)"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>{role.title}</span>
                  <span style={{ fontSize: "8px", fontFamily: "monospace", color: DEMAND_COLOR[role.demand], letterSpacing: "0.08em" }}>{role.demand}</span>
                </div>
                <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 8px", lineHeight: 1.5 }}>{role.desc.slice(0, 100)}…</p>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {role.skills.map(s => (
                    <span key={s} style={{ fontSize: "8px", fontFamily: "monospace", color: "var(--r-dim)", background: "var(--r-rail)", border: "1px solid var(--r-border)", padding: "2px 6px", borderRadius: "2px" }}>{s}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: "10px", color: "var(--r-dim)", flexShrink: 0, marginTop: "2px" }}>{role.requiredTracks.length} tracks →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
