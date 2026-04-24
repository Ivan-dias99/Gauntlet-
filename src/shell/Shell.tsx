import { useState, useEffect } from "react";
import CanonRibbon from "./CanonRibbon";
import Sidebar from "./Sidebar";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Insight from "../chambers/insight";
import Terminal from "../chambers/terminal";
import Archive from "../chambers/archive";
import Core from "../chambers/core";
import Surface from "../chambers/surface";

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

  // Follow the active mission's chamber whenever the user switches missions
  // (via the ribbon dropdown). A fresh mission created by Insight first-send
  // lands as chamber="insight", keeping the user in place.
  useEffect(() => {
    if (activeMission) setActiveTab(activeMission.chamber);
  }, [activeMission?.id]);

  // Cross-chamber handoff — chambers can request a chamber switch by
  // dispatching `signal:chamber` with a Chamber detail. The legacy
  // `ruberra:chamber` event is still accepted during the Wave-0 → Wave-8
  // compatibility window so call sites can migrate gradually.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Chamber>;
      if (ce.detail) setActiveTab(ce.detail);
    };
    window.addEventListener("signal:chamber", handler);
    window.addEventListener("ruberra:chamber", handler);
    return () => {
      window.removeEventListener("signal:chamber", handler);
      window.removeEventListener("ruberra:chamber", handler);
    };
  }, []);

  // Wave-7 keyboard shortcut: Alt+[1-5] switches chambers.
  // Index order mirrors the ribbon (insight, surface, terminal, archive, core).
  // Ignored when the user is typing — textarea / input / contenteditable
  // targets do not steal focus, and Alt is Option on macOS which avoids
  // the Cmd+K palette territory (reserved for a later wave).
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
        setActiveTab(ORDER[idx]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <CanonRibbon active={activeTab} onSelect={setActiveTab} />
      {/* Sidebar + chamber body share the remaining height. The sidebar
          is a flex child (not fixed) so its card-margin sits honestly
          inside the shell; chamber main takes every remaining pixel
          and keeps its own scroll. */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", minHeight: 0, overflow: "hidden" }}>
        <Sidebar active={activeTab} onSelect={setActiveTab} />
        <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          {renderChamber(activeTab)}
        </main>
      </div>
    </div>
  );
}
