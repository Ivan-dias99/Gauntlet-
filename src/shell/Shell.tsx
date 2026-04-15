import { useState } from "react";
import CanonRibbon, { Chamber } from "./CanonRibbon";
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
  const [active, setActive] = useState<Chamber>("Lab");

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#0c0c0c",
      fontFamily: "system-ui, sans-serif",
    }}>
      <CanonRibbon active={active} onSelect={setActive} />
      <main style={{ flex: 1, overflow: "auto" }}>
        {renderChamber(active)}
      </main>
    </div>
  );
}
