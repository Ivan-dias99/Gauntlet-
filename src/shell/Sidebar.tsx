import type { ReactNode } from "react";
import { useSpine } from "../spine/SpineContext";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { useCopy } from "../i18n/copy";
import type { Chamber } from "../spine/types";

// Signal sidebar — the left dock of the chamber. Three sections on top
// of a footer status strip:
//
//   · Brand header      — Signal · TERMINAL · wave badge
//   · CHAMBERS list     — 5 chambers, sage-highlighted active row,
//                         live task counter on Terminal from the active
//                         mission (other chambers intentionally quiet)
//   · WORKSPACE list    — Mission / Context / Docs / Artifacts / Doctrine,
//                         counts wired to spine where honest: Context =
//                         notes.length, Doctrine = principles.length
//   · Footer status     — BACKEND live|mock · MODE agent · MISSION title ·
//                         DOCTRINE § N. Each line only renders when the
//                         signal has real data; otherwise it's hidden
//                         (no placeholder clutter)
//
// The sidebar is a floating Signal object — border + inner top highlight
// + shadow-panel, same material grammar as Surface / Terminal instruments.
// No chamber-DNA ring on the hull; sage accents live inside, on the
// active chamber row, and on the footer semantic dots.

export const CHAMBERS: Chamber[] = ["insight", "surface", "terminal", "archive", "core"];

const CHAMBER_GLYPH: Record<Chamber, string> = {
  insight:  "◉",
  surface:  "◐",
  terminal: "›_",
  archive:  "◇",
  core:     "§",
};

interface Props {
  active: Chamber;
  onSelect: (c: Chamber) => void;
}

export default function Sidebar({ active, onSelect }: Props) {
  const { state, activeMission } = useSpine();
  const backend = useBackendStatus();
  const copy = useCopy();

  const taskCount = activeMission?.tasks.length ?? 0;
  const noteCount = activeMission?.notes.length ?? 0;
  const artifactCount = activeMission?.artifacts.length ?? 0;
  const principleCount = state.principles.length;

  return (
    <aside
      data-signal-sidebar
      aria-label="Signal sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        width: 272,
        minWidth: 272,
        height: "100%",
        margin: "var(--space-3)",
        padding: 0,
        background: "var(--bg-surface)",
        border: "var(--border-mid)",
        borderRadius: "var(--radius-panel)",
        boxShadow: [
          "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
          "var(--shadow-panel)",
        ].join(", "),
        overflow: "hidden",
      }}
    >
      <BrandHeader />

      <div style={{ flex: 1, overflow: "auto", padding: "4px 0" }}>
        <Section label="Chambers">
          {CHAMBERS.map((c) => (
            <ChamberRow
              key={c}
              chamber={c}
              label={copy.chambers[c].label}
              glyph={CHAMBER_GLYPH[c]}
              count={c === "terminal" && taskCount > 0 ? taskCount : undefined}
              active={active === c}
              onClick={() => onSelect(c)}
            />
          ))}
        </Section>

        <Section label="Workspace">
          <WorkspaceRow glyph="◎" label="Mission" hint={activeMission?.title ?? "sem missão"} />
          <WorkspaceRow glyph="▭" label="Context" count={noteCount > 0 ? noteCount : undefined} />
          <WorkspaceRow glyph="▤" label="Docs" />
          <WorkspaceRow glyph="◆" label="Artifacts" count={artifactCount > 0 ? artifactCount : undefined} />
          <WorkspaceRow glyph="§" label="Doctrine" count={principleCount > 0 ? principleCount : undefined} />
        </Section>
      </div>

      <Footer
        backendLabel={backend.mode === "mock" ? "mock" : "live"}
        backendOk={backend.mode !== "mock"}
        showMode={active === "terminal"}
        missionTitle={activeMission?.title ?? null}
        principleCount={principleCount}
      />
    </aside>
  );
}

function BrandHeader() {
  return (
    <div
      data-signal-brand
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "16px 16px 14px",
        borderBottom: "var(--border-soft)",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "var(--bg-elevated)",
          border: "var(--border-soft)",
          boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--text-primary) 5%, transparent)",
          fontFamily: "var(--serif)",
          fontSize: 15,
          color: "var(--accent)",
          lineHeight: 1,
        }}
      >
        ◉
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--serif)",
            fontSize: 17,
            color: "var(--text-primary)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: 6,
          }}
        >
          Signal
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: 999,
              background: "var(--ember)",
              transform: "translateY(-3px)",
            }}
          />
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            color: "var(--text-ghost)",
          }}
        >
          terminal
        </span>
      </span>
      <span
        aria-label="Wave"
        title="Signal development wave"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          padding: "2px 8px",
          borderRadius: 999,
          border: "var(--border-soft)",
          background: "var(--bg-elevated)",
        }}
      >
        W8
      </span>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "14px 8px 4px" }}>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
          padding: "0 10px 6px",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function ChamberRow({
  chamber, label, glyph, count, active, onClick,
}: {
  chamber: Chamber;
  label: string;
  glyph: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-chamber={chamber}
      data-active={active || undefined}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "20px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "7px 12px 7px 14px",
        background: active
          ? "color-mix(in oklab, var(--cc-ok) 6%, var(--bg-elevated))"
          : "transparent",
        border: "1px solid transparent",
        borderColor: active
          ? "color-mix(in oklab, var(--cc-ok) 22%, var(--border-color-soft))"
          : "transparent",
        borderRadius: "var(--radius-control)",
        cursor: "pointer",
        color: active ? "var(--text-primary)" : "var(--text-muted)",
        textAlign: "left",
        transition:
          "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift), border-color var(--dur-fast) var(--ease-swift)",
      }}
      onMouseEnter={(e) => {
        if (active) return;
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "var(--bg-elevated)";
        el.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        if (active) return;
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = "transparent";
        el.style.color = "var(--text-muted)";
      }}
    >
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 3,
            top: 7,
            bottom: 7,
            width: 2,
            borderRadius: 2,
            background: "color-mix(in oklab, var(--cc-ok) 72%, transparent)",
            boxShadow: "0 0 6px color-mix(in oklab, var(--cc-ok) 30%, transparent)",
          }}
        />
      )}
      <span
        aria-hidden
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: active ? "var(--cc-ok)" : "var(--text-ghost)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
        }}
      >
        {glyph}
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body-sec)",
          color: "inherit",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: active ? "var(--cc-ok)" : "var(--text-ghost)",
            padding: "1px 7px",
            borderRadius: 999,
            border: active
              ? "1px solid color-mix(in oklab, var(--cc-ok) 34%, transparent)"
              : "var(--border-soft)",
            background: active
              ? "color-mix(in oklab, var(--cc-ok) 8%, transparent)"
              : "transparent",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function WorkspaceRow({
  glyph, label, count, hint,
}: {
  glyph: string;
  label: string;
  count?: number;
  hint?: string;
}) {
  return (
    <div
      data-workspace-row
      title={hint}
      style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "6px 12px 6px 14px",
        color: "var(--text-muted)",
      }}
    >
      <span
        aria-hidden
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-ghost)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
        }}
      >
        {glyph}
      </span>
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: "var(--t-body-sec)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-label)",
            color: "var(--text-muted)",
            padding: "1px 7px",
            borderRadius: 999,
            border: "var(--border-soft)",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function Footer({
  backendLabel, backendOk, showMode, missionTitle, principleCount,
}: {
  backendLabel: string;
  backendOk: boolean;
  showMode: boolean;
  missionTitle: string | null;
  principleCount: number;
}) {
  return (
    <div
      data-signal-sidebar-footer
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "10px 14px 12px",
        borderTop: "var(--border-soft)",
        background: "color-mix(in oklab, var(--text-primary) 2%, var(--bg-surface))",
      }}
    >
      <FooterLine label="backend" value={backendLabel} tone={backendOk ? "ok" : "warn"} />
      {showMode && <FooterLine label="mode" value="agent" />}
      {missionTitle && <FooterLine label="mission" value={missionTitle} />}
      {principleCount > 0 && (
        <FooterLine label="doctrine" value={`§ ${principleCount}`} />
      )}
    </div>
  );
}

function FooterLine({
  label, value, tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn";
}) {
  const dotColor =
    tone === "ok"
      ? "color-mix(in oklab, var(--cc-ok) 78%, transparent)"
      : tone === "warn"
        ? "color-mix(in oklab, var(--cc-warn) 78%, transparent)"
        : "color-mix(in oklab, var(--text-ghost) 52%, transparent)";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "10px auto 1fr",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
      }}
    >
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: 999,
          background: dotColor,
        }}
      />
      <span style={{ color: "var(--text-ghost)" }}>{label}</span>
      <span
        style={{
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
