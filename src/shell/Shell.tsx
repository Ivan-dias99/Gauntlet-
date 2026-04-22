import { useState, useEffect } from "react";
import CanonRibbon from "./CanonRibbon";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Lab from "../chambers/Lab";
import Creation from "../chambers/Creation";
import Memory from "../chambers/Memory";
import School from "../chambers/School";
import Surface from "../chambers/surface";

// Wave-2: shell is stripped of landing, ritual entry, and tweak-panel
// gates. Boot opens directly on the active chamber with its composer
// focused. First-send inside Insight creates a mission implicitly (see
// Lab.tsx). VisionLanding and RitualEntry have been deleted; TweaksPanel
// has been demoted (the TweaksContext provider still applies theme /
// density at mount — user-facing controls return in Core, Wave 4).

function renderChamber(c: Chamber) {
  switch (c) {
    case "insight":  return <Lab />;
    case "terminal": return <Creation />;
    case "archive":  return <Memory />;
    case "core":     return <School />;
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
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderChamber(activeTab)}
      </main>
    </div>
  );
}
