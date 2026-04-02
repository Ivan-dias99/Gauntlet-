/**
 * RUBERRA Side Rail — Chamber-Aware Navigation Master
 * Each chamber gets its own native taxonomy. Nothing dead. Nothing decorative.
 */

import {
  MessageSquare,
  Search,
  BarChart2,
  Terminal,
  Package,
  Clock,
  BookOpen,
  Layers,
  PenLine,
  BookMarked,
  TrendingUp,
  Grid2x2,
  FileText,
  Zap,
  Image,
  Sliders,
  Upload,
  Archive,
  Settings,
  Cpu,
} from "lucide-react";
import { R, Mode } from "./tokens";

interface SideRailProps {
  activeMode: Mode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

// Chamber-native navigation taxonomies
const chamberNav: Record<Mode, { id: string; icon: typeof MessageSquare; label: string }[]> = {
  lab: [
    { id: "sessions",  icon: MessageSquare, label: "Sessions"  },
    { id: "research",  icon: Search,        label: "Research"  },
    { id: "analysis",  icon: BarChart2,     label: "Analysis"  },
    { id: "code",      icon: Terminal,      label: "Code"      },
    { id: "artifacts", icon: Package,       label: "Artifacts" },
    { id: "history",   icon: Clock,         label: "History"   },
  ],
  school: [
    { id: "curriculum", icon: Layers,      label: "Curriculum" },
    { id: "lessons",    icon: BookOpen,    label: "Lessons"    },
    { id: "notes",      icon: PenLine,     label: "Notes"      },
    { id: "references", icon: BookMarked,  label: "References" },
    { id: "progress",   icon: TrendingUp,  label: "Progress"   },
    { id: "blueprints", icon: Grid2x2,     label: "Blueprints" },
  ],
  creation: [
    { id: "drafts",   icon: FileText, label: "Drafts"   },
    { id: "build",    icon: Zap,      label: "Build"    },
    { id: "assets",   icon: Image,    label: "Assets"   },
    { id: "tools",    icon: Sliders,  label: "Tools"    },
    { id: "export",   icon: Upload,   label: "Export"   },
    { id: "archive",  icon: Archive,  label: "Archive"  },
  ],
};

// Chamber accent colors
const chamberAccentColor: Record<Mode, string> = {
  lab:      R.lab,
  school:   R.school,
  creation: R.creation,
};

export function SideRail({ activeMode, activeSection, onSectionChange }: SideRailProps) {
  const items = chamberNav[activeMode];
  const accent = chamberAccentColor[activeMode];

  return (
    <aside
      style={{
        width: "48px",
        borderRight: `1px solid ${R.hairline}`,
        background: R.shell,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "14px",
        paddingBottom: "14px",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Model mark — sovereign identity glyph */}
      <div
        title="RUBERRA Core Model"
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          background: R.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
          flexShrink: 0,
        }}
      >
        <Cpu size={12} color={R.shell} strokeWidth={1.5} />
      </div>

      {/* Hairline separator */}
      <div
        style={{
          width: "24px",
          height: "1px",
          background: R.hairline,
          marginBottom: "12px",
          flexShrink: 0,
        }}
      />

      {/* Chamber-native nav items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          flex: 1,
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={item.label}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: R.r.lg,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive ? R.selected : "transparent",
                transition: "background 0.12s ease",
                outline: "none",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = R.hover; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Active chamber-colored left indicator */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: "-2px",
                    top: "10px",
                    bottom: "10px",
                    width: "2px",
                    borderRadius: "0 2px 2px 0",
                    background: accent,
                  }}
                />
              )}
              <Icon
                size={14}
                color={isActive ? accent : R.ink4}
                strokeWidth={isActive ? 1.75 : 1.5}
                style={{ transition: "color 0.12s ease" }}
              />
            </button>
          );
        })}
      </div>

      {/* Bottom separator */}
      <div
        style={{
          width: "24px",
          height: "1px",
          background: R.hairline,
          marginTop: "12px",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      />

      {/* Settings — always present */}
      <button
        title="Settings"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: R.r.lg,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          transition: "background 0.12s ease",
          outline: "none",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = R.hover; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <Settings size={14} color={R.ink5} strokeWidth={1.5} />
      </button>
    </aside>
  );
}
