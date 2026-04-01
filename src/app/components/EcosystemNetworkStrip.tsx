import {
  type EcosystemNetworkState,
  type ExtensionType,
  type ExtensionStatus,
  getAdmittedExtensions,
} from "../dna/ecosystem-network";

interface Props {
  ecosystem:      EcosystemNetworkState;
  maxExtensions?: number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function typeColor(type: ExtensionType): string {
  switch (type) {
    case "connector":    return "var(--r-accent)";
    case "intelligence": return "var(--chamber-lab)";
    case "workflow":     return "var(--chamber-creation)";
    case "agent":        return "var(--r-ok)";
    case "surface":      return "var(--r-subtext)";
    case "analytics":    return "var(--chamber-school)";
  }
}

function statusDot(status: ExtensionStatus): string {
  switch (status) {
    case "admitted":      return "var(--r-ok)";
    case "probationary":  return "var(--r-warn)";
    case "suspended":     return "var(--r-err)";
    case "vetting":       return "var(--r-subtext)";
    case "proposed":      return "var(--r-dim)";
    case "ejected":       return "var(--r-err)";
  }
}

export function EcosystemNetworkStrip({ ecosystem, maxExtensions = 5 }: Props) {
  const admitted = getAdmittedExtensions(ecosystem);
  const vetting  = ecosystem.extensions.filter((e) => e.status === "vetting" || e.status === "proposed");
  const visible  = ecosystem.extensions.slice(0, maxExtensions);

  if (ecosystem.extensions.length === 0) return null;

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
        ecosystem · {admitted.length} admitted
        {vetting.length > 0 && (
          <span style={{ color: "var(--r-subtext)", marginLeft: "6px" }}>
            {vetting.length} vetting
          </span>
        )}
      </div>

      {visible.map((ext, i) => {
        const isLast = i === visible.length - 1;
        return (
          <div
            key={ext.id}
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
                background: statusDot(ext.status),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {ext.name}
            </span>
            <span style={{ ...MONO, color: typeColor(ext.type) }}>
              {ext.type}
            </span>
            <span style={{ ...MONO, color: "var(--r-dim)" }}>
              {ext.version}
            </span>
          </div>
        );
      })}
    </div>
  );
}
