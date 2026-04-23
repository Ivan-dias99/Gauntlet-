import { useState } from "react";
import ChamberHead from "../../shell/ChamberHead";
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
  { key: "policies",      label: "Policies",      sub: "Princípios constitucionais" },
  { key: "routing",       label: "Routing",       sub: "Perfis de chamber" },
  { key: "permissions",   label: "Permissions",   sub: "Allowlist de tools" },
  { key: "orchestration", label: "Orchestration", sub: "Budgets · crew · triad" },
  { key: "system",        label: "System",        sub: "Theme · density · lang · diagnostics" },
];

export default function Core() {
  const [tab, setTab] = useState<Tab>("policies");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="chamber-shell" data-chamber="core">
      <ChamberHead kicker="— CORE" tagline={current.sub} />

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

      <div
        className="chamber-body"
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
