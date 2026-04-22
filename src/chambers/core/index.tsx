import { useState } from "react";
import Policies from "./Policies";
import Routing from "./Routing";
import Permissions from "./Permissions";
import Orchestration from "./Orchestration";
import System from "./System";

// Wave-4 Core chamber — strict tab structure:
//   Policies · Routing · Permissions · Orchestration · System
//
// No junk drawer. Each tab carries one governance responsibility and
// nothing more. Wave 5 opens editability for Routing / Permissions /
// Orchestration; Wave 7 rewires keyboard + mission-pill continuity.

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
      <div
        className="chamber-head"
        style={{ display: "flex", alignItems: "baseline", gap: 12 }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          — CORE
        </span>
        <span style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)" }}>
          {current.sub}
        </span>
      </div>

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
