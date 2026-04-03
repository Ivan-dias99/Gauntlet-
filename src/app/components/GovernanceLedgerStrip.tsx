import { type AuditEntry, type ConsequenceRecord } from "../dna/trust-governance";

interface GovernanceLedgerStripProps {
  entries: AuditEntry[];
  consequences?: ConsequenceRecord[];
  maxVisible?: number;
}

const FONT: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "8px",
  letterSpacing: "0.04em",
};

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export function GovernanceLedgerStrip({
  entries,
  consequences = [],
  maxVisible = 5,
}: GovernanceLedgerStripProps) {
  const visibleAudit = entries.slice(-maxVisible);
  const visibleConsequences = consequences.slice(-3);

  return (
    <div style={{ background: "transparent", border: "none" }}>
      <div
        style={{
          ...FONT,
          fontSize: "8px",
          textTransform: "uppercase",
          color: "var(--r-dim)",
          paddingBottom: "4px",
        }}
      >
        governance · audit
      </div>

      {visibleAudit.length === 0 ? (
        <div style={{ ...FONT, color: "var(--r-dim)" }}>no audit entries</div>
      ) : (
        visibleAudit.map((entry) => {
          const row = truncate(
            `${entry.actor} → ${entry.action} · ${entry.consequence}`,
            80
          );
          return (
            <div
              key={entry.id}
              style={{
                ...FONT,
                color: "var(--r-text)",
                borderBottom: "1px solid var(--r-border-soft)",
                padding: "5px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row}
            </div>
          );
        })
      )}

      {visibleConsequences.length > 0 && (
        <>
          <div
            style={{
              ...FONT,
              fontSize: "8px",
              textTransform: "uppercase",
              color: "var(--r-dim)",
              paddingTop: "8px",
              paddingBottom: "4px",
            }}
          >
            consequence · irreversible
          </div>
          {visibleConsequences.map((rec) => (
            <div
              key={rec.id}
              style={{
                ...FONT,
                color: rec.reversible ? "var(--r-subtext)" : "var(--r-text)",
                borderBottom: "1px solid var(--r-border-soft)",
                padding: "5px 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {truncate(`${rec.action} · ${rec.consequence}`, 80)}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
