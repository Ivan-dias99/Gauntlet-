import {
  type ExchangeLedger,
  type ValueUnitType,
  type ValueStatus,
} from "../dna/value-exchange";

interface Props {
  ledger:     ExchangeLedger;
  maxUnits?:  number;
}

const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "7.5px",
  letterSpacing: "0.04em",
};

function typeColor(type: ValueUnitType): string {
  switch (type) {
    case "artifact":    return "var(--r-accent)";
    case "knowledge":   return "var(--chamber-lab)";
    case "capability":  return "var(--chamber-creation)";
    case "service":     return "var(--r-ok)";
    case "credential":  return "var(--r-warn)";
  }
}

function statusDot(status: ValueStatus): string {
  switch (status) {
    case "available":   return "var(--r-ok)";
    case "reserved":    return "var(--r-warn)";
    case "transferred": return "var(--r-dim)";
    case "revoked":     return "var(--r-err)";
    case "draft":       return "var(--r-subtext)";
  }
}

export function ValueExchangeStrip({ ledger, maxUnits = 5 }: Props) {
  const visible = ledger.units
    .filter((u) => u.status !== "revoked")
    .slice(0, maxUnits);

  if (visible.length === 0) return null;

  const pending = ledger.transfers.filter((t) => !t.fulfilled).length;

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
        value · {ledger.units.length}
        {pending > 0 && (
          <span style={{ color: "var(--r-warn)", marginLeft: "6px" }}>
            {pending} pending
          </span>
        )}
      </div>

      {visible.map((unit, i) => {
        const isLast = i === visible.length - 1;
        return (
          <div
            key={unit.id}
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
                background: statusDot(unit.status),
                flexShrink: 0,
              }}
            />
            <span style={{ ...MONO, color: "var(--r-text)", flex: 1 }}>
              {unit.label}
            </span>
            <span style={{ ...MONO, color: typeColor(unit.type) }}>
              {unit.type}
            </span>
            <span style={{ ...MONO, color: "var(--r-dim)" }}>
              {unit.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
