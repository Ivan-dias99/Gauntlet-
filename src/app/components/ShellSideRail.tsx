/**
 * RUBERRA Shell Side Rail — polished
 * Calm, precise chamber navigation. Chamber identity through color + tone.
 */

import { motion } from "motion/react";
import {
  type Tab, type Message, type SignalStatus,
  type LabView, type SchoolView, type CreationView, type ProfileView, type NavFn,
} from "./shell-types";

interface ShellSideRailProps {
  activeTab:      Tab;
  messages:       Record<Tab, Message[]>;
  signals:        Record<Tab, SignalStatus>;
  labView:        LabView;
  schoolView:     SchoolView;
  creationView:   CreationView;
  profileView:    ProfileView;
  onLabView:      (v: LabView) => void;
  onSchoolView:   (v: SchoolView) => void;
  onCreationView: (v: CreationView) => void;
  onProfileView:  (v: ProfileView) => void;
  onNewNote:      () => void;
  onClearTab:     (tab: Tab) => void;
  navigate:       NavFn;
}

const ALL_TABS: Tab[] = ["lab", "school", "creation", "profile"];

// ─── Chamber accent colors — matches tokens.ts ────────────────────────────────

const TAB_ACCENT: Record<Tab, string> = {
  lab:      "var(--r-accent)",
  school:   "var(--r-ok)",
  creation: "var(--r-warn)",
  profile: "var(--r-pulse)",
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.11em",
        fontWeight: 600,
        color: "var(--r-dim)",
        marginBottom: "4px",
        paddingLeft: "2px",
        fontFamily: "'JetBrains Mono', monospace",
        userSelect: "none",
      }}
    >
      {children}
    </p>
  );
}

function NavBtn({
  label, icon, active, accent, onClick,
}: {
  label:   string;
  icon:    React.ReactNode;
  active:  boolean;
  accent:  string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "5px 7px",
        borderRadius: "5px",
        border: "none",
        background: active ? "var(--r-surface)" : "transparent",
        color: active ? "var(--r-text)" : "var(--r-subtext)",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "11.5px",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: active ? 500 : 400,
        outline: "none",
        transition: "background 0.12s ease, color 0.12s ease",
        marginBottom: "1px",
        letterSpacing: active ? "-0.01em" : "0",
        boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05), 0 0 0 0.5px rgba(0,0,0,0.04)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.04)";
          (e.currentTarget as HTMLElement).style.color = "var(--r-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)";
        }
      }}
    >
      <span
        style={{
          color: active ? accent : "var(--r-dim)",
          flexShrink: 0,
          display: "flex",
          opacity: active ? 1 : 0.7,
          transition: "color 0.12s ease, opacity 0.12s ease",
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "var(--r-border-soft)", margin: "6px 0" }} />;
}

function StatusDot({ status, accent }: { status: SignalStatus; accent: string }) {
  const color =
    status === "streaming"  ? accent               :
    status === "completed"  ? "var(--r-ok)"        :
    status === "error"      ? "var(--r-err)"       :
    "var(--r-dim)";
  const isActive = status === "streaming";
  return (
    <motion.span
      animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={isActive ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
      style={{
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
}

function SMeta({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1.5px 1px" }}>
      <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>{label}</span>
      <span style={{ fontSize: "9px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  );
}

// ─── Lab rail ─────────────────────────────────────────────────────────────────

function LabRail({ view, onView, messages, signal, navigate }: {
  view: LabView; onView: (v: LabView) => void; messages: Message[]; signal: SignalStatus; navigate: NavFn;
}) {
  const accent = CHAMBER_ACCENT.lab.primary;
  const history = messages.filter((m) => m.role === "user").slice().reverse().slice(0, 5);
  return (
    <>
      <section style={{ padding: "10px 10px 8px" }}>
        <SLabel>Navigate</SLabel>
        <NavBtn label="Home"     active={view === "home"}     accent={accent} onClick={() => onView("home")}     icon={<IHome />} />
        <NavBtn label="Chat"     active={view === "chat"}     accent={accent} onClick={() => onView("chat")}     icon={<IChat />} />
        <NavBtn label="Analysis" active={view === "analysis"} accent={accent} onClick={() => onView("analysis")} icon={<IAnalysis />} />
        <NavBtn label="Code"     active={view === "code"}     accent={accent} onClick={() => onView("code")}     icon={<ICode />} />
        <NavBtn label="Archive"  active={view === "archive"}  accent={accent} onClick={() => onView("archive")}  icon={<IArchive />} />
      </section>
      <Divider />
      <section style={{ padding: "8px 10px", flex: 1, overflowY: "auto" }}>
        <SLabel>Session</SLabel>
        {history.length === 0 ? (
          <p style={{ fontSize: "10px", color: "var(--r-dim)", paddingLeft: "2px", fontFamily: "'Inter', system-ui, sans-serif" }}>—</p>
        ) : history.map((m) => (
          <button
            key={m.id}
            onClick={() => onView("chat")}
            title={m.content}
            style={{ width: "100%", display: "block", fontSize: "10px", color: "var(--r-subtext)", padding: "3px 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', system-ui, sans-serif", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", outline: "none", transition: "color 0.1s ease", lineHeight: 1.5 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
          >
            {m.content.slice(0, 36)}{m.content.length > 36 ? "…" : ""}
          </button>
        ))}
      </section>
      <Divider />
      <section style={{ padding: "8px 10px" }}>
        <SLabel>Kernel</SLabel>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "1px", marginBottom: "5px" }}>
          <StatusDot status={signal} accent={accent} />
          <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", textTransform: "capitalize" }}>{signal}</span>
        </div>
        <SMeta label="exchanges" value={String(messages.filter(m => m.role === "assistant" && m.content.length > 0).length)} />
      </section>
    </>
  );
}

// ─── School rail ──────────────────────────────────────────────────────────────

function SchoolRail({ view, onView, messages, signal, navigate }: {
  view: SchoolView; onView: (v: SchoolView) => void; messages: Message[]; signal: SignalStatus; navigate: NavFn;
}) {
  const accent = CHAMBER_ACCENT.school.primary;
  const history = messages.filter((m) => m.role === "user").slice().reverse().slice(0, 5);
  return (
    <>
      <section style={{ padding: "10px 10px 8px" }}>
        <SLabel>Navigate</SLabel>
        <NavBtn label="Home"    active={view === "home"}    accent={accent} onClick={() => onView("home")}    icon={<IHome />} />
        <NavBtn label="Chat"    active={view === "chat"}    accent={accent} onClick={() => onView("chat")}    icon={<IChat />} />
        <NavBtn label="Roles"   active={view === "browse"}  accent={accent} onClick={() => onView("browse")}  icon={<IRole />} />
        <NavBtn label="Library" active={view === "library"} accent={accent} onClick={() => onView("library")} icon={<ILibrary />} />
        <NavBtn label="Archive" active={view === "archive"} accent={accent} onClick={() => onView("archive")} icon={<IArchive />} />
      </section>
      <Divider />
      <section style={{ padding: "8px 10px", flex: 1, overflowY: "auto" }}>
        <SLabel>Queries</SLabel>
        {history.length === 0 ? (
          <p style={{ fontSize: "10px", color: "var(--r-dim)", paddingLeft: "2px", fontFamily: "'Inter', system-ui, sans-serif" }}>—</p>
        ) : history.map((m) => (
          <button
            key={m.id}
            onClick={() => onView("chat")}
            title={m.content}
            style={{ width: "100%", display: "block", fontSize: "10px", color: "var(--r-subtext)", padding: "3px 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', system-ui, sans-serif", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", outline: "none", transition: "color 0.1s ease", lineHeight: 1.5 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
          >
            {m.content.slice(0, 36)}{m.content.length > 36 ? "…" : ""}
          </button>
        ))}
      </section>
      <Divider />
      <section style={{ padding: "8px 10px" }}>
        <SLabel>Status</SLabel>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "1px" }}>
          <StatusDot status={signal} accent={accent} />
          <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", textTransform: "capitalize" }}>{signal}</span>
        </div>
      </section>
    </>
  );
}

// ─── Creation rail ────────────────────────────────────────────────────────────

function CreationRail({ view, onView, messages, signal, navigate }: {
  view: CreationView; onView: (v: CreationView) => void; messages: Message[]; signal: SignalStatus; navigate: NavFn;
}) {
  const accent = CHAMBER_ACCENT.creation.primary;
  const artifacts = messages.filter(m => m.role === "assistant" && m.content.length > 0).slice().reverse().slice(0, 5);
  return (
    <>
      <section style={{ padding: "10px 10px 8px" }}>
        <SLabel>Navigate</SLabel>
        <NavBtn label="Home"    active={view === "home"}     accent={accent} onClick={() => onView("home")}     icon={<IHome />} />
        <NavBtn label="Chat"    active={view === "chat"}     accent={accent} onClick={() => onView("chat")}     icon={<IChat />} />
        <NavBtn label="Build"   active={view === "terminal"} accent={accent} onClick={() => onView("terminal")} icon={<ITerminal />} />
        <NavBtn label="Archive" active={view === "archive"}  accent={accent} onClick={() => onView("archive")}  icon={<IArchive />} />
      </section>
      <Divider />
      <section style={{ padding: "8px 10px", flex: 1, overflowY: "auto" }}>
        <SLabel>Artifacts</SLabel>
        {artifacts.length === 0 ? (
          <p style={{ fontSize: "10px", color: "var(--r-dim)", paddingLeft: "2px", fontFamily: "'Inter', system-ui, sans-serif" }}>—</p>
        ) : artifacts.map((m) => (
          <button
            key={m.id}
            onClick={() => onView("chat")}
            title={m.content}
            style={{ width: "100%", display: "block", fontSize: "10px", color: "var(--r-subtext)", padding: "3px 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Inter', system-ui, sans-serif", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", outline: "none", transition: "color 0.1s ease", lineHeight: 1.5 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--r-subtext)"; }}
          >
            {m.content.slice(0, 36)}{m.content.length > 36 ? "…" : ""}
          </button>
        ))}
      </section>
      <Divider />
      <section style={{ padding: "8px 10px" }}>
        <SLabel>Forge</SLabel>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "1px", marginBottom: "5px" }}>
          <StatusDot status={signal} accent={accent} />
          <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", textTransform: "capitalize" }}>{signal}</span>
        </div>
        <SMeta label="outputs" value={String(artifacts.length)} />
      </section>
    </>
  );
}

function ProfileRail({ view, onView }: { view: ProfileView; onView: (v: ProfileView) => void }) {
  return (
    <>
      <section style={{ padding: "11px 10px 10px" }}>
        <SLabel>Ledger</SLabel>
        <NavBtn label="Overview" active={view === "overview"} onClick={() => onView("overview")} icon={<IHome />} />
        <NavBtn label="Projects" active={view === "projects"} onClick={() => onView("projects")} icon={<IArchive />} />
        <NavBtn label="Memory" active={view === "memory"} onClick={() => onView("memory")} icon={<ILibrary />} />
        <NavBtn label="Settings" active={view === "settings"} onClick={() => onView("settings")} icon={<IAnalysis />} />
        <NavBtn label="Exports" active={view === "exports"} onClick={() => onView("exports")} icon={<ITerminal />} />
      </section>
      <Divider />
      <section style={{ padding: "10px", fontSize: "10px", color: "var(--r-subtext)" }}>
        Profile unifies active, paused, completed, and memory continuity.
      </section>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ShellSideRail({
  activeTab, messages, signals,
  labView, schoolView, creationView, profileView,
  onLabView, onSchoolView, onCreationView, onProfileView,
  onNewNote, onClearTab, navigate,
}: ShellSideRailProps) {
  const chamber = CHAMBER_ACCENT[activeTab];

  return (
    <aside
      style={{
        width: "188px",
        flexShrink: 0,
        borderRight: "1px solid var(--r-border)",
        background: "var(--r-rail)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "background 0.25s ease",
      }}
    >
      {/* Chamber header — color-identified */}
      <div
        style={{
          padding: "10px 11px 9px",
          borderBottom: "1px solid var(--r-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {/* Chamber accent bar */}
          <div
            style={{
              width: "3px",
              height: "14px",
              borderRadius: "2px",
              background: chamber.primary,
              flexShrink: 0,
              opacity: 0.85,
            }}
          />
          <span
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
              color: "var(--r-text)",
              fontFamily: "'JetBrains Mono', monospace",
              userSelect: "none",
            }}
          >
            {chamber.label}
          </span>
        </div>
        <button
          onClick={onNewNote}
          title="New floating note"
          style={{
            fontSize: "9px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--r-dim)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            padding: "2px 4px",
            borderRadius: "3px",
            letterSpacing: "0.04em",
            transition: "color 0.1s ease, background 0.1s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--r-text)";
            (e.currentTarget as HTMLElement).style.background = "var(--r-border-soft)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--r-dim)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          + note
        </button>
      </div>

      {/* Chamber nav */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        {activeTab === "lab" && (
          <LabRail view={labView} onView={onLabView} messages={messages.lab} signal={signals.lab} navigate={navigate} />
        )}
        {activeTab === "school" && (
          <SchoolRail view={schoolView} onView={onSchoolView} messages={messages.school} signal={signals.school} navigate={navigate} />
        )}
        {activeTab === "creation" && (
          <CreationRail view={creationView} onView={onCreationView} messages={messages.creation} signal={signals.creation} navigate={navigate} />
        )}
        {activeTab === "profile" && (
          <ProfileRail view={profileView} onView={onProfileView} />
        )}
      </div>

      {/* Session summary */}
      <div style={{ borderTop: "1px solid var(--r-border)", padding: "8px 10px 6px" }}>
        <SLabel>Sessions</SLabel>
        {ALL_TABS.map((tab) => {
          const count    = messages[tab].filter((m) => m.role === "assistant" && m.content.length > 0).length;
          const isActive = tab === activeTab;
          const accentColor = CHAMBER_ACCENT[tab].primary;
          return (
            <div
              key={tab}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "2.5px 1px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isActive ? accentColor : "var(--r-dim)",
                    display: "inline-block",
                    flexShrink: 0,
                    opacity: isActive ? 1 : 0.5,
                    transition: "opacity 0.15s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    color: isActive ? "var(--r-text)" : "var(--r-subtext)",
                    textTransform: "capitalize",
                    fontWeight: isActive ? 500 : 400,
                    transition: "color 0.15s ease",
                  }}
                >
                  {tab}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isActive ? accentColor : "var(--r-dim)",
                  }}
                >
                  {count > 0 ? count : "—"}
                </span>
                {count > 0 && (
                  <button
                    onClick={() => onClearTab(tab)}
                    title={`Clear ${tab}`}
                    style={{
                      fontSize: "8px",
                      color: "var(--r-dim)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                      lineHeight: 1,
                      padding: "1px 2px",
                      borderRadius: "2px",
                      opacity: 0.5,
                      transition: "opacity 0.1s ease",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "5px 11px 7px",
          borderTop: "1px solid var(--r-border-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "8px",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.10em",
            color: "var(--r-dim)",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          mode · <span style={{ color: chamber.primary }}>{activeTab}</span>
        </span>
        <span
          style={{
            fontSize: "7px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--r-dim)",
            letterSpacing: "0.06em",
            opacity: 0.6,
            userSelect: "none",
          }}
        >
          v2
        </span>
      </div>
    </aside>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IChat()     { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 1.5h10v7H7l-3 2.5V8.5H1z" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" /></svg>; }
function IAnalysis() { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 9.5l3-4 2.5 2.5 2.5-4 2 2.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 11h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" /></svg>; }
function ICode()     { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.5 3.5L1 6l2.5 2.5M8.5 3.5L11 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.8 2.5l-1.6 7" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" /></svg>; }
function IArchive()  { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="3" rx=".5" stroke="currentColor" strokeWidth="1.1" /><path d="M1.5 4v6.5h9V4" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M4.5 7h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>; }
function ILibrary()  { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 2h2v8H1zM5 2h2v8H5zM9 2l2 1v7l-2-1V2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>; }
function ITerminal() { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="1.5" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1" /><path d="M3 5l2 1.5L3 8M6.5 8h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IHome()    { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 5.5L6 1l5 4.5V11H7.5V8h-3v3H1V5.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>; }
function IRole()    { return <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.1" /><path d="M1 11c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>; }
