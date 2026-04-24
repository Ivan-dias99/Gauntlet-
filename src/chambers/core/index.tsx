import { useState } from "react";
import ChamberHead from "../../shell/ChamberHead";
import { useCopy } from "../../i18n/copy";
import CoreInstrument from "./CoreInstrument";
import Policies from "./Policies";
import Routing from "./Routing";
import Permissions from "./Permissions";
import Orchestration from "./Orchestration";
import System from "./System";

// Core chamber — strict tab structure:
//   Policies · Routing · Permissions · Orchestration · System
// Each tab sub comes from the i18n copy catalog so the tagline
// switches language with the rest of the shell.

type Tab = "policies" | "routing" | "permissions" | "orchestration" | "system";

export default function Core() {
  const copy = useCopy();
  const TABS: Array<{ key: Tab; label: string; sub: string }> = [
    { key: "policies",      label: "Policies",      sub: copy.coreTabPolicies },
    { key: "routing",       label: "Routing",       sub: copy.coreTabRouting },
    { key: "permissions",   label: "Permissions",   sub: copy.coreTabPermissions },
    { key: "orchestration", label: "Orchestration", sub: copy.coreTabOrchestration },
    { key: "system",        label: "System",        sub: copy.coreTabSystem },
  ];
  const [tab, setTab] = useState<Tab>("policies");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="chamber-shell" data-chamber="core">
      <ChamberHead kicker="— CORE" tagline={current.sub} />

      <CoreInstrument />

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
