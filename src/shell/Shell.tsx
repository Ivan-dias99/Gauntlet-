import { useState, useEffect, useCallback } from "react";
import CanonRibbon from "./CanonRibbon";
import CommandPalette from "./CommandPalette";
import Landing from "../landing/Landing";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Insight from "../chambers/insight";
import Terminal from "../chambers/terminal";
import Archive from "../chambers/archive";
import Core from "../chambers/core";
import Surface from "../chambers/surface";
import ChamberErrorBoundary from "./ChamberErrorBoundary";
import { runViewTransition, useReducedMotion } from "../lib/motion";

const ENTERED_KEY = "signal:entered";

// Wave P-36 — every chamber renders inside its own error boundary so a
// crash in one doesn't take the shell down. The boundary key includes
// the chamber id so switching tabs after a crash remounts cleanly.

// Wave-2: shell is stripped of landing, ritual entry, and tweak-panel
// gates. Boot opens directly on the active chamber with its composer
// focused. First-send inside Insight creates a mission implicitly (see
// Lab.tsx). VisionLanding and RitualEntry have been deleted; TweaksPanel
// has been demoted (the TweaksContext provider still applies theme /
// density at mount — user-facing controls return in Core, Wave 4).

function renderChamber(c: Chamber) {
  switch (c) {
    case "insight":  return <Insight />;
    case "terminal": return <Terminal />;
    case "archive":  return <Archive />;
    case "core":     return <Core />;
    case "surface":  return <Surface />;
  }
}

export default function Shell() {
  const { activeMission } = useSpine();
  const [activeTab, setActiveTab] = useState<Chamber>(activeMission?.chamber ?? "insight");
  const [entered, setEntered] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ENTERED_KEY) === "true";
    } catch (e) {
      console.warn("[shell] localStorage.getItem failed — assuming not entered:", e);
      return false;
    }
  });
  const reduced = useReducedMotion();
  // Wave P-35 — command palette visibility lives at the shell because
  // ⌘K must work from any chamber. The palette closes itself; the
  // shell only owns the open boolean.
  const [paletteOpen, setPaletteOpen] = useState(false);

  function enterSignal() {
    try {
      localStorage.setItem(ENTERED_KEY, "true");
    } catch (e) {
      console.warn("[shell] localStorage.setItem failed — entered flag not persisted:", e);
    }
    setEntered(true);
  }

  // Wave P-34 — Chamber switch entry/exit motion.
  //
  // Every setActiveTab call funnels through runViewTransition so the
  // browser snapshots the outgoing chamber, runs the React re-render
  // inside the snapshot frame, and crossfades to the new chamber.
  // Chromium uses ::view-transition-old/new (styled in tokens.css);
  // browsers without the API silently no-op and the chamber swaps
  // instantly. Reduced-motion users bypass the snapshot entirely.
  const switchChamber = useCallback(
    (next: Chamber) => {
      runViewTransition(() => setActiveTab(next), { reduced });
    },
    [reduced],
  );

  // Follow the active mission's chamber whenever the user switches missions
  // (via the ribbon dropdown). A fresh mission created by Insight first-send
  // lands as chamber="insight", keeping the user in place.
  useEffect(() => {
    if (activeMission) switchChamber(activeMission.chamber);
  }, [activeMission?.id, switchChamber]);

  // Cross-chamber handoff — chambers can request a chamber switch by
  // dispatching `signal:chamber` with a Chamber detail. The legacy
  // `ruberra:chamber` event is still accepted during the Wave-0 → Wave-8
  // compatibility window so call sites can migrate gradually.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Chamber>;
      if (ce.detail) switchChamber(ce.detail);
    };
    window.addEventListener("signal:chamber", handler);
    window.addEventListener("ruberra:chamber", handler);
    return () => {
      window.removeEventListener("signal:chamber", handler);
      window.removeEventListener("ruberra:chamber", handler);
    };
  }, [switchChamber]);

  // Wave-7 keyboard shortcut: Alt+[1-5] switches chambers.
  // Index order mirrors the ribbon (insight, surface, terminal, archive, core).
  // Ignored when the user is typing — textarea / input / contenteditable
  // targets do not steal focus, and Alt is Option on macOS which avoids
  // the Cmd+K palette territory (Wave P-35 owns ⌘K below).
  useEffect(() => {
    const ORDER: Chamber[] = ["insight", "surface", "terminal", "archive", "core"];
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const idx = Number(e.key) - 1;
      if (Number.isInteger(idx) && idx >= 0 && idx < ORDER.length) {
        e.preventDefault();
        switchChamber(ORDER[idx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [switchChamber]);

  // Wave P-35 — ⌘K / Ctrl+K toggles the command palette anywhere, even
  // mid-typing. Browsers default-bind ⌘K to focus the URL bar; calling
  // preventDefault is what reclaims it. Esc-to-close is owned by the
  // palette itself (it has its own keydown handler) so the shell does
  // not double-handle the close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!entered) {
    return <Landing onEnter={enterSignal} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* Wave P-35 — WCAG 2.4.1 skip-link. Hidden until keyboard focus
          pulls it back into view. */}
      <a href="#main" className="skip-link">
        Skip to main
      </a>
      <CanonRibbon active={activeTab} onSelect={switchChamber} />
      {/* tabIndex={-1} makes <main> programmatically focusable so the
          skip-link's #main anchor activation actually moves keyboard
          focus here (the next Tab then continues from inside main
          instead of bouncing back to the ribbon). The element stays
          out of the normal Tab order because tabIndex is negative. */}
      <main
        id="main"
        tabIndex={-1}
        style={{
          flex: 1,
          overflow: "auto",
          outline: "none",
          // Wave P-34 — name the <main> region so the View Transitions
          // API can crossfade just the chamber body when state we
          // mutate is scoped here (e.g. mission switch). The root
          // pseudo (::view-transition-old/new(root)) still snapshots
          // the whole viewport for full chamber swaps.
          // viewTransitionName isn't in @types/react yet; cast via
          // an index signature so the property still serialises onto
          // the inline style attribute.
          ...({ viewTransitionName: "chamber" } as Record<string, string>),
        }}
      >
        <ChamberErrorBoundary key={activeTab} chamber={activeTab}>
          {renderChamber(activeTab)}
        </ChamberErrorBoundary>
      </main>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
