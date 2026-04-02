/**
 * RUBERRA — Global Command Palette
 * ⌘K surface: search and navigate across the entire product graph.
 * Mineral-shell aesthetic. No dead ends.
 */

import { useEffect, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import { type NavFn, type Tab } from "./shell-types";
import { LAB_DOMAINS, SCHOOL_TRACKS, SCHOOL_ROLES, CREATION_BLUEPRINTS, CREATION_ENGINES } from "./product-data";
import { type SearchIndexEntry } from "./runtime-fabric";
import { CHAMBER_ACCENT } from "../dna/chamber-accent";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_RESULT_LIMIT = 18;

interface CmdEntry {
  id:      string;
  label:   string;
  meta:    string;
  chamber: Tab;
  action:  () => void;
}

const RUNTIME_RESULT_CAP = 14;

function buildStaticEntries(
  navigate: NavFn,
  onClose: () => void,
  missionCommands?: { onMissionNew: () => void; onMissionSwitch: () => void; onMissionHandoff?: () => void; activeMissionName?: string },
): CmdEntry[] {
  const go = (tab: "lab" | "school" | "creation" | "profile", view: string, id = "") => {
    navigate(tab, view, id);
    onClose();
  };

  const entries: CmdEntry[] = [
    { id: "mission-new", label: "Mission — New", meta: "Mission", chamber: "profile", action: () => { missionCommands?.onMissionNew(); onClose(); } },
    { id: "mission-switch", label: "Mission — Switch", meta: "Mission", chamber: "profile", action: () => { missionCommands?.onMissionSwitch(); onClose(); } },
    ...(missionCommands?.onMissionHandoff
      ? [{
          id: "mission-handoff",
          label: "Mission — Handoff",
          meta: missionCommands.activeMissionName ? `Mission · ${missionCommands.activeMissionName}` : "Mission",
          chamber: "profile" as const,
          action: () => { missionCommands.onMissionHandoff?.(); onClose(); },
        }]
      : []),
    // ── Navigation shortcuts ────────────────────────────────────────────────
    { id: "nav-lab-home",      label: "Lab — Home",           meta: "Chamber",  chamber: "lab",      action: () => go("lab",      "home")      },
    { id: "nav-lab-chat",      label: "Lab — Chat",           meta: "Chamber",  chamber: "lab",      action: () => go("lab",      "chat")      },
    { id: "nav-lab-analysis",  label: "Lab — Analysis Board", meta: "Chamber",  chamber: "lab",      action: () => go("lab",      "analysis")  },
    { id: "nav-lab-code",      label: "Lab — Code Surface",   meta: "Chamber",  chamber: "lab",      action: () => go("lab",      "code")      },
    { id: "nav-lab-archive",   label: "Lab — Archive",        meta: "Chamber",  chamber: "lab",      action: () => go("lab",      "archive")   },
    { id: "nav-sch-home",      label: "School — Home",        meta: "Chamber",  chamber: "school",   action: () => go("school",   "home")      },
    { id: "nav-sch-chat",      label: "School — Chat",        meta: "Chamber",  chamber: "school",   action: () => go("school",   "chat")      },
    { id: "nav-sch-library",   label: "School — Library",     meta: "Chamber",  chamber: "school",   action: () => go("school",   "library")   },
    { id: "nav-sch-browse",    label: "School — Role Paths",  meta: "Chamber",  chamber: "school",   action: () => go("school",   "browse")    },
    { id: "nav-sch-archive",   label: "School — Archive",     meta: "Chamber",  chamber: "school",   action: () => go("school",   "archive")   },
    { id: "nav-cre-home",      label: "Creation — Home",      meta: "Chamber",  chamber: "creation", action: () => go("creation", "home")      },
    { id: "nav-cre-chat",      label: "Creation — Chat",      meta: "Chamber",  chamber: "creation", action: () => go("creation", "chat")      },
    { id: "nav-cre-build",     label: "Creation — Build",     meta: "Chamber",  chamber: "creation", action: () => go("creation", "terminal")  },
    { id: "nav-cre-archive",   label: "Creation — Archive",   meta: "Chamber",  chamber: "creation", action: () => go("creation", "archive")   },
    // ── Profile routes ───────────────────────────────────────────────────────
    { id: "nav-pro-overview",  label: "Profile — Overview",   meta: "Profile",  chamber: "profile", action: () => go("profile",  "overview")  },
    { id: "nav-pro-projects",  label: "Profile — Projects",   meta: "Profile",  chamber: "profile", action: () => go("profile",  "projects")  },
    { id: "nav-pro-memory",    label: "Profile — Memory",     meta: "Profile",  chamber: "profile", action: () => go("profile",  "memory")    },
    { id: "nav-pro-settings",  label: "Profile — Settings",   meta: "Profile",  chamber: "profile", action: () => go("profile",  "settings")  },
    { id: "nav-pro-exports",   label: "Profile — Exports",    meta: "Profile",  chamber: "profile", action: () => go("profile",  "exports")   },

    // ── Lab domains ─────────────────────────────────────────────────────────
    ...LAB_DOMAINS.map((d) => ({
      id:      `lab-${d.id}`,
      label:   d.label,
      meta:    "Lab · Domain",
      chamber: "lab" as const,
      action:  () => go("lab", "domain", d.id),
    })),

    // ── Lab experiments ──────────────────────────────────────────────────────
    ...LAB_DOMAINS.flatMap((d) =>
      d.experiments.map((e) => ({
        id:      `exp-${e.id}`,
        label:   e.title,
        meta:    `Lab · Experiment · ${e.type}`,
        chamber: "lab" as const,
        action:  () => go("lab", "experiment", e.id),
      }))
    ),

    // ── School tracks ────────────────────────────────────────────────────────
    ...SCHOOL_TRACKS.map((t) => ({
      id:      `track-${t.id}`,
      label:   t.title,
      meta:    "School · Track",
      chamber: "school" as const,
      action:  () => go("school", "track", t.id),
    })),

    // ── School roles ─────────────────────────────────────────────────────────
    ...SCHOOL_ROLES.map((r) => ({
      id:      `role-${r.id}`,
      label:   r.title,
      meta:    `School · Role Path · ${r.domain}`,
      chamber: "school" as const,
      action:  () => go("school", "role", r.id),
    })),

    // ── Creation blueprints ──────────────────────────────────────────────────
    ...CREATION_BLUEPRINTS.map((b) => ({
      id:      `bp-${b.id}`,
      label:   b.title,
      meta:    `Creation · Blueprint · ${b.outputType}`,
      chamber: "creation" as const,
      action:  () => go("creation", "blueprint", b.id),
    })),

    // ── Creation engines ─────────────────────────────────────────────────────
    ...CREATION_ENGINES.map((e) => ({
      id:      `eng-${e.id}`,
      label:   e.title,
      meta:    "Creation · Engine",
      chamber: "creation" as const,
      action:  () => go("creation", "engine", e.id),
    })),
  ];

  return entries;
}

function buildRuntimeEntries(
  searchIndex: SearchIndexEntry[],
  navigate: NavFn,
  onClose: () => void
): CmdEntry[] {
  const go = (tab: Tab, view: string, id = "") => {
    navigate(tab, view, id);
    onClose();
  };

  return searchIndex.map((entry) => {
    const tab = entry.route.tab;
    const view = entry.route.view;
    const id = entry.route.id ?? "";
    const kindLabel =
      entry.kind === "object" ? "Object" : entry.kind === "continuity" ? "Continuity" : "Signal";
    return {
      id:      `rt:${entry.id}`,
      label:   entry.title,
      meta:    `${kindLabel} · ${entry.chamber}`,
      chamber: entry.chamber,
      action:  () => go(tab, view, id),
    };
  });
}

// ─── Chamber dot ──────────────────────────────────────────────────────────────

const CHAMBER_DOT: Record<string, string> = {
  lab:      CHAMBER_ACCENT.lab,
  school:   CHAMBER_ACCENT.school,
  creation: CHAMBER_ACCENT.creation,
  profile:  "var(--r-subtext)",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface GlobalCommandPaletteProps {
  open:        boolean;
  onClose:     () => void;
  navigate:    NavFn;
  searchIndex: SearchIndexEntry[];
  onMissionNew: () => void;
  onMissionSwitch: () => void;
  onMissionHandoff?: () => void;
  activeMissionName?: string;
}

export function GlobalCommandPalette({
  open, onClose, navigate, searchIndex, onMissionNew, onMissionSwitch, onMissionHandoff, activeMissionName,
}: GlobalCommandPaletteProps) {
  const staticEntries = buildStaticEntries(navigate, onClose, {
    onMissionNew,
    onMissionSwitch,
    onMissionHandoff,
    activeMissionName,
  });
  const runtimeEntries = buildRuntimeEntries(searchIndex, navigate, onClose);
  const allEntries = [...staticEntries, ...runtimeEntries];
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allEntries.filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.meta.toLowerCase().includes(q)
      )
    : [
        ...staticEntries.slice(0, DEFAULT_RESULT_LIMIT),
        ...runtimeEntries.slice(0, RUNTIME_RESULT_CAP),
      ];

  // Group by chamber
  const labs      = filtered.filter((e) => e.chamber === "lab");
  const schools   = filtered.filter((e) => e.chamber === "school");
  const creations = filtered.filter((e) => e.chamber === "creation");
  const profiles  = filtered.filter((e) => e.chamber === "profile");

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(26,23,20,0.38)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "14%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 201,
              width: "min(580px, calc(100vw - 32px))",
              background: "var(--r-surface)",
              borderRadius: "12px",
              border: "1px solid var(--r-border)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <CommandPrimitive
              onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
              shouldFilter={false}
            >
              {/* Search input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 16px",
                  borderBottom: "1px solid var(--r-border-soft)",
                  height: "50px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "var(--r-dim)", flexShrink: 0 }}>
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <CommandPrimitive.Input
                  ref={inputRef}
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search chambers, tracks, blueprints, experiments…"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "13px",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    color: "var(--r-text)",
                    letterSpacing: "-0.01em",
                  }}
                />
                <kbd
                  style={{
                    fontSize: "9px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--r-dim)",
                    background: "var(--r-rail)",
                    border: "1px solid var(--r-border-soft)",
                    borderRadius: "3px",
                    padding: "2px 5px",
                    letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <CommandPrimitive.List
                style={{
                  maxHeight: "360px",
                  overflowY: "auto",
                  padding: "6px",
                  scrollbarWidth: "none",
                }}
              >
                <CommandPrimitive.Empty
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    fontSize: "12px",
                    color: "var(--r-dim)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  No results for "{query}"
                </CommandPrimitive.Empty>

                {labs.length > 0 && (
                  <CmdGroup label="LAB" entries={labs} />
                )}
                {schools.length > 0 && (
                  <CmdGroup label="SCHOOL" entries={schools} />
                )}
                {creations.length > 0 && (
                  <CmdGroup label="CREATION" entries={creations} />
                )}
                {profiles.length > 0 && (
                  <CmdGroup label="PROFILE" entries={profiles} />
                )}
              </CommandPrimitive.List>

              {/* Footer */}
              <div
                style={{
                  borderTop: "1px solid var(--r-border-soft)",
                  padding: "7px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
                  ↑↓ navigate · ↵ select · ESC close
                </span>
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Ruberra · {filtered.length} results
                </span>
              </div>
            </CommandPrimitive>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Group ────────────────────────────────────────────────────────────────────

function CmdGroup({ label, entries }: { label: string; entries: CmdEntry[] }) {
  return (
    <CommandPrimitive.Group
      heading={label}
      style={{ marginBottom: "2px" }}
    >
      <div
        style={{
          fontSize: "8px",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.12em",
          color: "var(--r-dim)",
          padding: "4px 8px 2px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {entries.map((e) => (
        <CmdItem key={e.id} entry={e} />
      ))}
    </CommandPrimitive.Group>
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────

function CmdItem({ entry }: { entry: CmdEntry }) {
  return (
    <CommandPrimitive.Item
      value={entry.id}
      onSelect={entry.action}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "7px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        outline: "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--r-rail)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {/* Chamber dot */}
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: CHAMBER_DOT[entry.chamber] ?? "var(--r-dim)",
          flexShrink: 0,
        }}
      />
      {/* Label */}
      <span
        style={{
          flex: 1,
          fontSize: "12.5px",
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "var(--r-text)",
          letterSpacing: "-0.01em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {entry.label}
      </span>
      {/* Meta */}
      <span
        style={{
          fontSize: "9px",
          fontFamily: "'JetBrains Mono', monospace",
          color: "var(--r-dim)",
          letterSpacing: "0.04em",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {entry.meta}
      </span>
    </CommandPrimitive.Item>
  );
}
