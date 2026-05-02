import { useState } from "react";
import ChamberHead from "../../shell/ChamberHead";
import HandoffInbox from "../../shell/HandoffInbox";
import ChamberIdleShell from "../../shell/ChamberIdleShell";
import { useSpine } from "../../spine/SpineContext";
import CoreWorkbench from "./CoreWorkbench";
import Policies from "./Policies";
import Routing from "./Routing";
import Permissions from "./Permissions";
import Orchestration from "./Orchestration";
import System from "./System";

// Core chamber — strict tab structure:
//   Policies · Routing · Permissions · Orchestration · System
//
// Tab row flows through the shared .tab-sub-band + .tab-sub primitives
// so Core's instrumentation band reads as a continuous strip with
// underline-active grammar, matching the shell's canon ribbon one notch
// down. Each tab body owns one governance responsibility; Routing /
// Permissions / Orchestration remain read-only mirrors until Core gains
// a writeable governance surface.

type Tab = "policies" | "routing" | "permissions" | "orchestration" | "system";

const TABS: Array<{ key: Tab; label: string; sub: string }> = [
  { key: "policies",      label: "Policies",      sub: "Constitutional principles" },
  { key: "routing",       label: "Routing",       sub: "Chamber profiles" },
  { key: "permissions",   label: "Permissions",   sub: "Tool allowlist" },
  { key: "orchestration", label: "Orchestration", sub: "Budgets · crew · triad" },
  { key: "system",        label: "System",        sub: "Theme · density · lang · diagnostics" },
];

export default function Core() {
  const [tab, setTab] = useState<Tab>("policies");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];
  const { principles } = useSpine();

  // Wave P-43.4 — Core is "idle" when no principles have been declared
  // yet AND the operator hasn't navigated away from the default
  // Policies tab. The unified shell takes over so the empty Core
  // doesn't read as broken.
  if (tab === "policies" && principles.length === 0) {
    return (
      <div className="chamber-shell" data-chamber="core">
        <ChamberIdleShell chamber="core" />
      </div>
    );
  }

  return (
    <div className="chamber-shell" data-chamber="core">
      <ChamberHead kicker="— CORE" tagline={current.sub} />
      <HandoffInbox chamber="core" />

      {/* Workbench pill — sibling family of Terminal/Surface/Insight.
          Reads system telemetry as 5 lenses (Chambers · Tools ·
          Doctrine · Backend · Spine). Sits between the chamber head
          and the sub-tab band; the 5 sub-tabs below remain the
          governance domain navigation. */}
      <CoreWorkbench />

      <div
        role="tablist"
        aria-label="Core tabs"
        className="tab-sub-band"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              data-core-tab={t.key}
              data-active={active ? "true" : undefined}
              className="tab-sub"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Wave P-34 — panel mount entry.
          Keying by tab remounts the body when the user flips the
          sub-tab band; motion-fade-up runs a 200ms translateY(4px)
          + opacity ramp so the new tab body announces itself
          instead of jump-cutting in. The fine-grained per-panel
          stagger lives inside System (which has the densest grid);
          single-panel tabs read fine with the parent fade alone. */}
      <div
        key={tab}
        className="chamber-body motion-fade-up"
        style={{ minHeight: 0, padding: 0 }}
      >
        {tab === "policies" && <Policies />}
        {tab === "routing" && <Routing />}
        {tab === "permissions" && <Permissions />}
        {tab === "orchestration" && <Orchestration />}
        {tab === "system" && <System />}
      </div>
    </div>
  );
}
