import { type AgentCivilization, type AgentDomain, type AgentStatus } from "../dna/multi-agent";

interface AgentCivilizationStripProps {
  civilization: AgentCivilization;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function domainDotColor(domain: AgentDomain): string {
  switch (domain) {
    case "lab":
      return "var(--chamber-lab)";
    case "school":
      return "var(--chamber-school)";
    case "creation":
      return "var(--chamber-creation)";
    case "governance":
    case "security":
      return "var(--r-warn)";
    case "knowledge":
    case "analytics":
      return "var(--r-accent)";
    case "operations":
    case "distribution":
    case "platform":
      return "var(--r-subtext)";
    default:
      return "var(--r-dim)";
  }
}

function statusColor(status: AgentStatus): string {
  switch (status) {
    case "active":
      return "var(--r-ok)";
    case "busy":
      return "var(--r-accent)";
    case "suspended":
      return "var(--r-err)";
    case "dormant":
    default:
      return "var(--r-dim)";
  }
}

export function AgentCivilizationStrip({ civilization }: AgentCivilizationStripProps) {
  const visible = civilization.agents.filter((a) => a.status !== "decommissioned");

  return (
    <div style={{ background: "transparent" }}>
      {/* Header */}
      <div
        style={{
          ...MONO,
          textTransform: "uppercase",
          color: "var(--r-dim)",
          paddingBottom: "4px",
        }}
      >
        agents · {civilization.agents.length}
      </div>

      {visible.length === 0 ? (
        <div style={{ ...MONO, color: "var(--r-dim)" }}>no agents registered</div>
      ) : (
        visible.map((agent) => (
          <div
            key={agent.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "3px 0",
            }}
          >
            {/* Domain dot */}
            <div
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: domainDotColor(agent.domain),
                flexShrink: 0,
              }}
            />
            {/* Name */}
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {agent.name}
            </span>
            {/* Status */}
            <span style={{ ...MONO, color: statusColor(agent.status) }}>
              {agent.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
