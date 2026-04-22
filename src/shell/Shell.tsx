import { useState, useEffect } from "react";
import CanonRibbon from "./CanonRibbon";
import RitualEntry from "./RitualEntry";
import VisionLanding from "./VisionLanding";
import TweaksPanel from "./TweaksPanel";
import { useSpine } from "../spine/SpineContext";
import { Chamber } from "../spine/types";
import Lab from "../chambers/Lab";
import Creation from "../chambers/Creation";
import Memory from "../chambers/Memory";
import School from "../chambers/School";

// Wave-1: internal keys flipped to the canonical five. Visual labels
// still come from copy.chambers[key].label (preserved for Wave 6). The
// underlying chamber components (Lab, Creation, Memory, School) are
// decomposed / renamed in Wave 4 — not in this wave. Surface has no
// rendered chamber yet (W3); falling through to Insight keeps the shell
// stable if a migrated snapshot ever carries it before the stub lands.
function renderChamber(c: Chamber) {
  switch (c) {
    case "insight":  return <Lab />;
    case "terminal": return <Creation />;
    case "archive":  return <Memory />;
    case "core":     return <School />;
    case "surface":  return <Lab />;
  }
}

// Wave-0 rename: signal:landed is canonical; ruberra:landed is still read
// as a silent legacy fallback so a returning user does not get the ritual
// flow again after an upgrade. Writes always target the new key; the
// legacy key is left in place until Wave 8.
const LANDED_KEY = "signal:landed";
const LEGACY_LANDED_KEY = "ruberra:landed";

function readLanded(): boolean {
  try {
    const v =
      localStorage.getItem(LANDED_KEY) ??
      localStorage.getItem(LEGACY_LANDED_KEY);
    return v === "1";
  } catch {
    return false;
  }
}

export default function Shell() {
  const { state, activeMission } = useSpine();
  const [activeTab, setActiveTab] = useState<Chamber>(activeMission?.chamber ?? "insight");
  const [showRitual, setShowRitual] = useState(false);
  const [landed, setLanded] = useState<boolean>(() => readLanded());
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    if (activeMission) setActiveTab(activeMission.chamber);
  }, [activeMission?.id]);

  // Cross-chamber handoff — chambers can request a chamber switch by
  // dispatching `signal:chamber` with a Chamber detail (e.g. Lab promoting
  // an analysis into a Creation task). The legacy `ruberra:chamber` event
  // is still accepted during the Wave-0 → Wave-8 compatibility window so
  // call sites can migrate gradually.
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

  useEffect(() => {
    try { localStorage.setItem(LANDED_KEY, landed ? "1" : "0"); } catch {}
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <CanonRibbon
        active={activeTab}
        onSelect={setActiveTab}
        onNew={() => setShowRitual(true)}
        onHome={() => setLanded(false)}
        onTweaks={() => setTweaksOpen((v) => !v)}
      />
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderChamber(activeTab)}
      </main>
      <TweaksPanel
        open={tweaksOpen}
        onClose={() => setTweaksOpen(false)}
        chamber={activeTab}
      />
    </div>
  );
}
