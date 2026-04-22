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
// No junk drawer. Each tab carries one governance responsibility and
// nothing more. Routing / Permissions / Orchestration are read-only
// mirrors of the backend profiles today; editability opens when Core
// exposes a writeable governance surface.

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
        style={{
          display: "flex",
          gap: 2,
          padding: "var(--space-2) var(--space-3)",
          borderBottom: "var(--border-soft)",
          background: "var(--bg)",
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
              style={{
                fontFamily: "var(--sans)",
                fontSize: "var(--t-body-sec)",
                padding: "6px 12px",
                background: active ? "var(--bg-elevated)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                border: active ? "var(--border-soft)" : "1px solid transparent",
                borderRadius: "var(--radius-control)",
                cursor: "pointer",
                transition: "background var(--dur-fast) var(--ease-swift), color var(--dur-fast) var(--ease-swift)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="chamber-body" style={{ minHeight: 0 }}>
        {tab === "policies" && <Policies />}
        {tab === "routing" && <Routing />}
        {tab === "permissions" && <Permissions />}
        {tab === "orchestration" && <Orchestration />}
        {tab === "system" && <System />}
      </div>
    </div>
  );
}
