import { useState, useEffect } from "react";
import CanonRibbon from "./CanonRibbon";
import RitualEntry from "./RitualEntry";
import VisionLanding from "./VisionLanding";
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

function readLanded(): boolean {
  try { return localStorage.getItem("ruberra:landed") === "1"; } catch { return false; }
}

export default function Shell() {
  const { state, activeMission } = useSpine();
  const [activeTab, setActiveTab] = useState<Chamber>(activeMission?.chamber ?? "Lab");
  const [showRitual, setShowRitual] = useState(false);
  const [landed, setLanded] = useState<boolean>(() => readLanded());

  useEffect(() => {
    if (activeMission) setActiveTab(activeMission.chamber);
  }, [activeMission?.id]);

  useEffect(() => {
    try { localStorage.setItem("ruberra:landed", landed ? "1" : "0"); } catch {}
  }, [landed]);

  if (showRitual) {
    return (
      <RitualEntry
        onDone={() => {
          setShowRitual(false);
          setLanded(true);
        }}
      />
    );
  }

  if (!landed) {
    return (
      <VisionLanding
        onEnter={() => {
          if (state.missions.length === 0) {
            setShowRitual(true);
          } else {
            setLanded(true);
          }
        }}
        onNewMission={() => setShowRitual(true)}
      />
    );
  }

  if (state.missions.length === 0) {
    return (
      <RitualEntry
        onDone={() => setLanded(true)}
      />
    );
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg)",
    }}>
      <CanonRibbon
        active={activeTab}
        onSelect={setActiveTab}
        onNew={() => setShowRitual(true)}
        onHome={() => setLanded(false)}
      />
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderChamber(activeTab)}
      </main>
    </div>
  );
}
