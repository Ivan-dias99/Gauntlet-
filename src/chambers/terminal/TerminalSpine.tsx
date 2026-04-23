import type { ReactNode } from "react";
import type { Chamber } from "../../spine/types";
import type { Copy } from "./helpers";

// Terminal spine — left operational rail.
//
// A floating vertical slab that gives the chamber workstation authority
// without stealing breath from the composer or the execution field.
// Four restrained groups: identity · chambers · workspace · status.
//
// Native to Signal: warm paper surface, ultra-thin hairline, dual-edge
// inset, contact/mid/ambient shadow stack. The green atmospheric field
// passes through the rail as ambient tint only — the rail itself never
// goes green. Green remains semantic: active, live, online.
//
// Chamber shortcuts navigate via the existing `signal:chamber` custom
// event that Shell already listens for (Shell.tsx:48). Workspace items
// are static placeholders until their routing wave lands; they do not
// produce broken behavior.

interface Props {
  copy: Copy;
  activeChamber: Chamber;
  backendMode: "mock" | "real" | null;
  missionTitle: string | null;
  taskCount: number;
  doneCount: number;
  artifactsCount: number;
  notesCount: number;
  principlesCount: number;
  mode: "agent" | "crew";
}

const CHAMBER_ORDER: Chamber[] = ["terminal", "insight", "surface", "archive", "core"];

function selectChamber(c: Chamber) {
  window.dispatchEvent(new CustomEvent<Chamber>("signal:chamber", { detail: c }));
}

export default function TerminalSpine({
  copy, activeChamber, backendMode, missionTitle,
  taskCount, doneCount, artifactsCount, notesCount, principlesCount, mode,
}: Props) {
  const openCount = taskCount - doneCount;

  return (
    <aside className="term-spine" aria-label="Terminal operations">
      {/* — Identity ———————————————————————————————— */}
      <header className="term-spine-brand">
        <span className="term-spine-brand-mark" aria-hidden>
          <IconSignalMark />
        </span>
        <span className="term-spine-brand-text">
          <span className="term-spine-brand-name">Signal</span>
          <span className="term-spine-brand-dot" aria-hidden />
          <span className="term-spine-brand-chamber">Terminal</span>
        </span>
        <span className="term-spine-brand-version" title="Signal wave">
          w8
        </span>
      </header>

      {/* — Chamber shortcuts —————————————————————— */}
      <nav className="term-spine-group" aria-label="Chambers">
        <span className="term-spine-group-label">Chambers</span>
        <ul className="term-spine-list">
          {CHAMBER_ORDER.map((c) => (
            <li key={c}>
              <button
                type="button"
                className="term-spine-item"
                data-active={activeChamber === c ? "true" : undefined}
                onClick={() => selectChamber(c)}
                title={copy.chambers[c].sub}
              >
                <span className="term-spine-item-icon" aria-hidden>
                  <ChamberIcon chamber={c} />
                </span>
                <span className="term-spine-item-label">
                  {copy.chambers[c].label}
                </span>
                {c === "terminal" && openCount > 0 && (
                  <span className="term-spine-item-count" title="open tasks">
                    {openCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* — Workspace ——————————————————————————— */}
      <nav className="term-spine-group" aria-label="Workspace">
        <span className="term-spine-group-label">Workspace</span>
        <ul className="term-spine-list">
          <WorkspaceItem
            label="Mission"
            count={missionTitle ? undefined : 0}
            countLabel={missionTitle ? undefined : "—"}
            icon={<IconTarget />}
            dim={!missionTitle}
          />
          <WorkspaceItem
            label="Context"
            count={notesCount || undefined}
            icon={<IconContextChip />}
            dim={notesCount === 0}
          />
          <WorkspaceItem label="Docs" icon={<IconDocsSheet />} dim />
          <WorkspaceItem
            label="Artifacts"
            count={artifactsCount || undefined}
            icon={<IconArtifact />}
            dim={artifactsCount === 0}
          />
          <WorkspaceItem
            label="Doctrine"
            count={principlesCount || undefined}
            icon={<IconDoctrine />}
            dim={principlesCount === 0}
          />
        </ul>
      </nav>

      {/* — Status block ——————————————————————— */}
      <footer className="term-spine-status" aria-label="Runtime status">
        <div className="term-spine-status-row" data-tone={backendMode === "real" ? "ok" : "warn"}>
          <span
            className={backendMode === "real" ? "term-spine-status-dot breathe" : "term-spine-status-dot"}
            aria-hidden
          />
          <span className="term-spine-status-label">Backend</span>
          <span className="term-spine-status-value">
            {backendMode === "real" ? "live" : backendMode === "mock" ? "mock" : "—"}
          </span>
        </div>

        <div className="term-spine-status-row">
          <span className="term-spine-status-dot" data-tone="neutral" aria-hidden />
          <span className="term-spine-status-label">Mode</span>
          <span className="term-spine-status-value">{mode}</span>
        </div>

        <div className="term-spine-status-row" data-mute={missionTitle ? undefined : "true"}>
          <span className="term-spine-status-dot" data-tone="neutral" aria-hidden />
          <span className="term-spine-status-label">Mission</span>
          <span className="term-spine-status-value" title={missionTitle ?? "—"}>
            {missionTitle
              ? missionTitle.length > 14
                ? missionTitle.slice(0, 12).trimEnd() + "…"
                : missionTitle
              : "—"}
          </span>
        </div>

        {principlesCount > 0 && (
          <div className="term-spine-status-row">
            <span className="term-spine-status-dot" data-tone="neutral" aria-hidden />
            <span className="term-spine-status-label">Doctrine</span>
            <span className="term-spine-status-value">§ {principlesCount}</span>
          </div>
        )}
      </footer>
    </aside>
  );
}

// — Workspace list item — low-ceremony, optional count on the right —
function WorkspaceItem({
  label, count, countLabel, icon, dim,
}: {
  label: string;
  count?: number;
  countLabel?: string;
  icon: ReactNode;
  dim?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        className="term-spine-item"
        data-dim={dim ? "true" : undefined}
      >
        <span className="term-spine-item-icon" aria-hidden>
          {icon}
        </span>
        <span className="term-spine-item-label">{label}</span>
        {(count !== undefined || countLabel !== undefined) && (
          <span className="term-spine-item-count">
            {countLabel ?? count}
          </span>
        )}
      </button>
    </li>
  );
}

// ——— Icon set ————————————————————————————————
// Single family: viewBox 24, stroke 1.75, currentColor. Same grammar
// as the WorkbenchStrip icons so the glyph language stays unified.

const SVG_PROPS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ChamberIcon({ chamber }: { chamber: Chamber }) {
  switch (chamber) {
    case "insight":  return <IconInsight />;
    case "surface":  return <IconSurface />;
    case "terminal": return <IconTerminalGlyph />;
    case "archive":  return <IconArchive />;
    case "core":     return <IconCore />;
  }
}

function IconSignalMark() {
  return (
    <svg {...SVG_PROPS} width={15} height={15}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="9" opacity="0.5" />
    </svg>
  );
}
function IconTerminalGlyph() {
  return (
    <svg {...SVG_PROPS}>
      <path d="m5 9 3 3-3 3" />
      <path d="M11 15h8" />
    </svg>
  );
}
function IconInsight() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </svg>
  );
}
function IconSurface() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M4 12h16" />
    </svg>
  );
}
function IconArchive() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M3 6h18v4H3z" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
      <path d="M10 14h4" />
    </svg>
  );
}
function IconCore() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconContextChip() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconDocsSheet() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}
function IconArtifact() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 2 3 7v10l9 5 9-5V7z" />
      <path d="M3 7l9 5 9-5" />
      <path d="M12 12v10" />
    </svg>
  );
}
function IconDoctrine() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" />
      <path d="M4 17a3 3 0 0 1 3-3h13" />
    </svg>
  );
}
