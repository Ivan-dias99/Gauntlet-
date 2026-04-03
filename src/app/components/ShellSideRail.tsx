/**
 * RUBERRA Shell Side Rail — polished
 * Calm, precise chamber navigation. Chamber identity through color + tone.
 */

import { motion } from "motion/react";
import { type ReactNode } from "react";
import {
  type Tab, type Message, type SignalStatus,
  type LabView, type SchoolView, type CreationView, type ProfileView,
  type NavFn,
} from "./shell-types";
import { CHAMBER_ACCENT, CHAMBER_ACCENT_LIGHT, CHAMBER_LABEL } from "../dna/chamber-accent";

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
  navigate:       NavFn;
  onTabChange:    (tab: Tab) => void;
  collapsed:      boolean;
  onToggleCollapsed: () => void;
}

const ALL_TABS: Tab[] = ["lab", "school", "creation", "profile"];

const CHAMBER_SURFACE: Record<Tab, { primary: string; light: string; label: string }> = {
  lab:      { primary: CHAMBER_ACCENT.lab,      light: CHAMBER_ACCENT_LIGHT.lab,      label: CHAMBER_LABEL.lab },
  school:   { primary: CHAMBER_ACCENT.school,   light: CHAMBER_ACCENT_LIGHT.school,   label: CHAMBER_LABEL.school },
  creation: { primary: CHAMBER_ACCENT.creation, light: CHAMBER_ACCENT_LIGHT.creation, label: CHAMBER_LABEL.creation },
  profile:  { primary: CHAMBER_ACCENT.profile,  light: CHAMBER_ACCENT_LIGHT.profile,  label: CHAMBER_LABEL.profile },
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function SLabel({ children }: { children: ReactNode }) {
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
  label, icon, active, accent, onClick, collapsed = false,
}: {
  label:   string;
  icon:    ReactNode;
  active:  boolean;
  accent:  string;
  onClick: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: collapsed ? "0" : "7px",
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "6px 0" : "5px 7px",
        borderRadius: "2px",
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
        boxShadow: active ? "0 1px 3px color-mix(in srgb, var(--r-text) 5%, transparent), 0 0 0 0.5px color-mix(in srgb, var(--r-text) 4%, var(--r-border-soft))" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--r-text) 6%, transparent)";
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
      {!collapsed && label}
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

// ─── Lab rail ─────────────────────────────────────────────────────────────────

function LabRail({ view, onView }: {
  view: LabView; onView: (v: LabView) => void;
}) {
  const accent = CHAMBER_ACCENT.lab;
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
    </>
  );
}

// ─── School rail ──────────────────────────────────────────────────────────────

function SchoolRail({ view, onView, messages, signal }: {
  view: SchoolView; onView: (v: SchoolView) => void; messages: Message[]; signal: SignalStatus;
}) {
  const accent = CHAMBER_ACCENT.school;
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
    </>
  );
}

// ─── Creation rail ────────────────────────────────────────────────────────────

function CreationRail({ view, onView, messages, signal }: {
  view: CreationView; onView: (v: CreationView) => void; messages: Message[]; signal: SignalStatus;
}) {
  const accent = CHAMBER_ACCENT.creation;
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
        <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em", paddingLeft: "1px" }}>
          outputs · {artifacts.length}
        </span>
      </section>
    </>
  );
}

function ProfileRail({ view, onView }: { view: ProfileView; onView: (v: ProfileView) => void }) {
  const accent = CHAMBER_ACCENT.profile;
  return (
    <>
      <section style={{ padding: "10px 10px 8px" }}>
        <SLabel>Ledger</SLabel>
        <NavBtn label="Overview"   active={view === "overview"}   accent={accent} onClick={() => onView("overview")}   icon={<IHome />}     />
        <NavBtn label="Projects"   active={view === "projects"}   accent={accent} onClick={() => onView("projects")}   icon={<IArchive />}  />
        <NavBtn label="Memory"     active={view === "memory"}     accent={accent} onClick={() => onView("memory")}     icon={<ILibrary />}  />
        <NavBtn label="Exports"    active={view === "exports"}    accent={accent} onClick={() => onView("exports")}    icon={<ITerminal />} />
      </section>
      <Divider />
      <section style={{ padding: "8px 10px 8px" }}>
        <SLabel>Orchestration</SLabel>
        <NavBtn label="Pioneers"   active={view === "pioneers"}   accent={accent} onClick={() => onView("pioneers")}   icon={<IRole />}     />
        <NavBtn label="Workflows"  active={view === "workflows"}  accent={accent} onClick={() => onView("workflows")}  icon={<IAnalysis />} />
        <NavBtn label="Connectors" active={view === "connectors"} accent={accent} onClick={() => onView("connectors")} icon={<ICode />}     />
        <NavBtn label="Operations" active={view === "operations"} accent={accent} onClick={() => onView("operations")} icon={<ITerminal />} />
      </section>
      <Divider />
      <section style={{ padding: "8px 10px 8px" }}>
        <SLabel>System</SLabel>
        <NavBtn label="Settings"   active={view === "settings"}   accent={accent} onClick={() => onView("settings")}   icon={<IChat />}     />
      </section>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ShellSideRail({
  activeTab, messages, signals,
  labView, schoolView, creationView, profileView,
  onLabView, onSchoolView, onCreationView, onProfileView,
  navigate, onTabChange, collapsed, onToggleCollapsed,
}: ShellSideRailProps) {
  const chamber = CHAMBER_SURFACE[activeTab];

  return (
    <aside
      style={{
        width: collapsed ? "44px" : "180px",
        flexShrink: 0,
        borderRight: "1px solid var(--r-border)",
        background: "rgba(var(--r-surface-rgb), 0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "background 0.25s ease",
      }}
    >
      {collapsed ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0", gap: "8px" }}>
          <button onClick={onToggleCollapsed} title="Expand rail" aria-label="Expand side rail" style={{ border: "none", background: "transparent", color: "var(--r-dim)", cursor: "pointer", fontSize: "11px" }}>»</button>
          <button onClick={onToggleCollapsed} title="Expand rail" style={{ border: "none", background: "transparent", color: "var(--r-dim)", cursor: "pointer", fontSize: "11px" }}>»</button>
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab;
            const accentColor = CHAMBER_SURFACE[tab].primary;
            const icon = tab === "lab" ? <IHome /> : tab === "school" ? <ILibrary /> : tab === "creation" ? <ITerminal /> : <IRole />;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                title={tab}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "2px",
                  border: "1px solid var(--r-border-soft)",
                  background: isActive ? "var(--r-elevated)" : "transparent",
                  color: isActive ? accentColor : "var(--r-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
      ) : (
      <>
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
          onClick={onToggleCollapsed}
          title="Collapse rail"
          aria-label="Collapse side rail"
          style={{ border: "none", background: "transparent", color: "var(--r-dim)", cursor: "pointer", fontSize: "10px" }}
        >
          «
        </button>
      </div>

      {/* Chamber nav */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        {activeTab === "lab" && (
          <LabRail view={labView} onView={onLabView} />
        )}
        {activeTab === "school" && (
          <SchoolRail view={schoolView} onView={onSchoolView} messages={messages.school} signal={signals.school} />
        )}
        {activeTab === "creation" && (
          <CreationRail view={creationView} onView={onCreationView} messages={messages.creation} signal={signals.creation} />
        )}
        {activeTab === "profile" && (
          <ProfileRail view={profileView} onView={onProfileView} />
        )}
      </div>

      </>
      )}
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
