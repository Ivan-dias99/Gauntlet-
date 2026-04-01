import {
  type PersonalSovereignOSState,
  type PersonalAgentState,
  type PersonalMemoryClass,
} from "../dna/personal-sovereign-os";

interface Props {
  os:          PersonalSovereignOSState;
  maxMemories?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function agentStateColor(state: PersonalAgentState): string {
  switch (state) {
    case "active":     return "var(--r-ok)";
    case "executing":  return "var(--r-accent)";
    case "learning":   return "var(--chamber-school)";
    case "reflecting": return "var(--chamber-lab)";
    case "dormant":    return "var(--r-dim)";
  }
}

function memoryClassColor(cls: PersonalMemoryClass): string {
  switch (cls) {
    case "insight":        return "var(--r-accent)";
    case "domain_context": return "var(--chamber-lab)";
    case "mission_history":return "var(--r-subtext)";
    case "preference":     return "var(--chamber-creation)";
    case "resolved":       return "var(--r-ok)";
    case "shortcut":       return "var(--r-dim)";
  }
}

export function PersonalSovereignOSStrip({ os, maxMemories = 4 }: Props) {
  const { profile, agent, context } = os;
  const memories = context?.recentMemories.slice(0, maxMemories) ?? [];

  return (
    <div style={{ background: "transparent" }}>
      <div
        style={{
          ...MONO,
          fontSize: "8px",
          textTransform: "uppercase",
          color: "var(--r-dim)",
          letterSpacing: "0.08em",
          marginBottom: "6px",
        }}
      >
        personal os · {profile.operatorId}
      </div>

      {/* Agent state row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 0",
          borderBottom: memories.length > 0 ? "1px solid var(--r-border-soft)" : undefined,
        }}
      >
        <div
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: agentStateColor(agent.state),
            flexShrink: 0,
          }}
        />
        <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
          agent
        </span>
        {agent.currentMission && (
          <span style={{ ...MONO, color: "var(--r-subtext)" }}>
            {agent.currentMission}
          </span>
        )}
        <span style={{ ...MONO, color: agentStateColor(agent.state) }}>
          {agent.state}
        </span>
      </div>

      {memories.map((mem, i) => {
        const isLast = i === memories.length - 1;
        return (
          <div
            key={mem.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
              borderBottom: isLast ? undefined : "1px solid var(--r-border-soft)",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "2px",
                background: memoryClassColor(mem.class),
                flexShrink: 0,
              }}
            />
            <span
              style={{
                ...MONO,
                color: "var(--r-subtext)",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {mem.content}
            </span>
            <span style={{ ...MONO, color: "var(--r-dim)" }}>
              {mem.confidence.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
