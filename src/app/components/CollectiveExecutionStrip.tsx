import {
  type CollectiveState,
  type OperatorRole,
  type MissionGraphNode,
} from "../dna/collective-execution";

interface Props {
  collective: CollectiveState;
  maxMembers?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function roleColor(role: OperatorRole): string {
  switch (role) {
    case "sovereign":  return "var(--r-accent)";
    case "lead":       return "var(--r-ok)";
    case "contributor":return "var(--r-subtext)";
    case "observer":   return "var(--r-dim)";
  }
}

function nodeStatusColor(status: MissionGraphNode["status"]): string {
  switch (status) {
    case "active":   return "var(--r-ok)";
    case "blocked":  return "var(--r-err)";
    case "complete": return "var(--r-dim)";
    case "pending":  return "var(--r-subtext)";
  }
}

export function CollectiveExecutionStrip({ collective, maxMembers = 5 }: Props) {
  const activeMembers = collective.members.slice(0, maxMembers);
  const activeNodes   = collective.missionGraph.filter((n) => n.status === "active" || n.status === "blocked");
  const collisions    = collective.collisionMap.filter((e) => e.riskLevel === "high" || e.riskLevel === "blocked");

  if (activeMembers.length === 0) return null;

  return (
    <div style={{ background: "transparent" }}>
      {/* Header */}
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
        collective · {collective.members.length}
        {collisions.length > 0 && (
          <span style={{ color: "var(--r-err)", marginLeft: "6px" }}>
            {collisions.length} collision{collisions.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Members */}
      {activeMembers.map((member, i) => {
        const isLast = i === activeMembers.length - 1 && activeNodes.length === 0;
        return (
          <div
            key={member.operatorId}
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
                height: "5px",
                borderRadius: "50%",
                background: roleColor(member.role),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {member.operatorId}
            </span>
            <span style={{ ...MONO, color: roleColor(member.role) }}>
              {member.role}
            </span>
          </div>
        );
      })}

      {/* Active mission graph nodes */}
      {activeNodes.map((node, i) => {
        const isLast = i === activeNodes.length - 1;
        return (
          <div
            key={node.missionId}
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
                background: nodeStatusColor(node.status),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-subtext)", flex: 1 }}>
              {node.missionId}
            </span>
            <span style={{ ...MONO, color: nodeStatusColor(node.status) }}>
              {node.status}
            </span>
            {node.assignedTo && (
              <span style={{ ...MONO, color: "var(--r-dim)" }}>
                @{node.assignedTo}
              </span>
            )}
          </div>
        );
      })}

      {/* Consequence attributions */}
      {collective.attributions.length > 0 && (
        <>
          <div
            style={{
              ...MONO,
              fontSize: "8px",
              textTransform: "uppercase",
              color: "var(--r-dim)",
              letterSpacing: "0.08em",
              marginTop: "10px",
              marginBottom: "6px",
            }}
          >
            consequence attributions · {collective.attributions.length}
          </div>
          {collective.attributions.slice(0, 4).map((attr, i) => {
            const isLast = i === Math.min(collective.attributions.length, 4) - 1;
            return (
              <div
                key={attr.id}
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
                    width: "2px",
                    height: "2px",
                    background: "var(--r-accent)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    ...MONO,
                    color: "var(--r-subtext)",
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {attr.action}
                </span>
                <span style={{ ...MONO, color: "var(--r-dim)", whiteSpace: "nowrap" }}>
                  @{attr.operatorId}
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
