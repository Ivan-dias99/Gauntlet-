import {
  type PresenceManifest,
  type PresenceChannelType,
} from "../dna/distribution-presence";

interface Props {
  manifest: PresenceManifest;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function channelColor(type: PresenceChannelType): string {
  switch (type) {
    case "desktop": return "var(--r-accent)";
    case "web":     return "var(--r-ok)";
    case "mobile":  return "var(--chamber-lab)";
    case "cli":     return "var(--chamber-creation)";
    case "api":     return "var(--r-subtext)";
    case "embed":   return "var(--r-dim)";
  }
}

export function DistributionPresenceStrip({ manifest }: Props) {
  const active   = manifest.channels.filter((c) => c.active);
  const inactive = manifest.channels.filter((c) => !c.active);

  if (manifest.channels.length === 0) return null;

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
        presence · {active.length}/{manifest.channels.length}
      </div>

      {manifest.channels.map((channel, i) => {
        const isPrimary = channel.id === manifest.primaryChannel;
        const isLast    = i === manifest.channels.length - 1;
        return (
          <div
            key={channel.id}
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
                background: channel.active ? channelColor(channel.type) : "var(--r-dim)",
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {channel.type}
            </span>
            {isPrimary && (
              <span style={{ ...MONO, color: "var(--r-accent)" }}>primary</span>
            )}
            {!channel.active && (
              <span style={{ ...MONO, color: "var(--r-dim)" }}>offline</span>
            )}
            {manifest.context.activeChamber && isPrimary && (
              <span style={{ ...MONO, color: "var(--r-subtext)" }}>
                {manifest.context.activeChamber}
              </span>
            )}
          </div>
        );
      })}

      {inactive.length > 0 && (
        <div
          style={{
            ...MONO,
            color: "var(--r-dim)",
            paddingTop: "4px",
          }}
        >
          {inactive.length} channel{inactive.length > 1 ? "s" : ""} offline
        </div>
      )}
    </div>
  );
}
