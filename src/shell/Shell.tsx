import { useState, useEffect } from "react";
import CanonRibbon from "./CanonRibbon";
import RitualEntry from "./RitualEntry";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Lab from "../chambers/Lab";
import Creation from "../chambers/Creation";
import Memory from "../chambers/Memory";
import School from "../chambers/School";

function renderChamber(c: Chamber) {
  switch (c) {
    case "Lab":      return <Lab />;
    case "Creation": return <Creation />;
    case "Memory":   return <Memory />;
    case "School":   return <School />;
  }
}

export default function Shell() {
  const { state, activeMission } = useSpine();
  const [activeTab, setActiveTab] = useState<Chamber>(activeMission?.chamber ?? "Lab");
  const [showRitual, setShowRitual] = useState(false);

  // Sync tab when active mission changes (e.g. after ritual entry)
  useEffect(() => {
    if (activeMission) setActiveTab(activeMission.chamber);
  }, [activeMission?.id]);

  if (state.missions.length === 0 || showRitual) {
    return <RitualEntry onDone={() => setShowRitual(false)} />;
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0c0c0c",
      fontFamily: "system-ui, sans-serif",
    }}>
      <CanonRibbon
        active={activeTab}
        onSelect={setActiveTab}
        missionTitle={activeMission?.title}
        onNew={() => setShowRitual(true)}
      />
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderChamber(activeTab)}
      </main>
    </div>
  );
}
