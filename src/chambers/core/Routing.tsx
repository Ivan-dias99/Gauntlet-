// Core · Routing — read-only mirror of signal-backend/chambers/profiles.py.
//
// Hardcoded values are kept in sync with profiles.py. Editability moves
// here when Core opens a writeable governance surface (the /chambers
// endpoint plus a typed patch flow); until then this table is the
// single place a governor can inspect what each chamber does with an
// incoming query.

const PROFILES: Array<{
  key: string;
  label: string;
  dispatch: string;
  purpose: string;
  note?: string;
}> = [
  { key: "insight",  label: "Insight",  dispatch: "triad",
    purpose: "Self-consistency triad + judge. Pressão de evidência, recusa sobre fabrico." },
  { key: "surface",  label: "Surface",  dispatch: "mock",
    purpose: "Design workstation. Plano estruturado (mock) valida o contrato SurfacePlan.",
    note: "Quando o provider real estiver ligado, o mesmo contrato é validado server-side e design_system passa a obrigatório." },
  { key: "terminal", label: "Terminal", dispatch: "agent",
    purpose: "Agent loop + tool use. Código, execução, patches." },
  { key: "archive",  label: "Archive",  dispatch: "triad",
    purpose: "Retrieval conservador. Summaries não inventam." },
  { key: "core",     label: "Core",     dispatch: "triad",
    purpose: "Governance. Respostas sobre regras caem na triad." },
];

export default function Routing() {
  return (
    <div
      style={{
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        maxWidth: 900,
      }}
    >
      <Heading kicker="— Chamber profiles" sub="Router decide por chamber.dispatch quando query.chamber está presente; cai em is_dev_intent quando ausente." />
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <Th>Chamber</Th><Th>Dispatch</Th><Th>Propósito</Th>
          </tr>
        </thead>
        <tbody>
          {PROFILES.map((p) => (
            <tr key={p.key}>
              <Td>
                <span style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--text-primary)" }}>
                  {p.label}
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--text-ghost)",
                    textTransform: "uppercase",
                    letterSpacing: "var(--track-meta)",
                  }}
                >
                  {p.key}
                </span>
              </Td>
              <Td>
                <code
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--accent)",
                    background: "var(--bg-sunken)",
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {p.dispatch}
                </code>
              </Td>
              <Td style={{ color: "var(--text-muted)" }}>
                {p.purpose}
                {p.note && (
                  <div style={{ marginTop: 4, color: "var(--text-ghost)", fontSize: 11, fontStyle: "italic" }}>
                    {p.note}
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Heading({ kicker, sub }: { kicker: string; sub: string }) {
  return (
    <>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: "var(--t-micro)",
          letterSpacing: "var(--track-label)",
          textTransform: "uppercase",
          color: "var(--text-ghost)",
        }}
      >
        {kicker}
      </div>
      <div style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)", lineHeight: "var(--lh-body)" }}>
        {sub}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        fontFamily: "var(--mono)",
        fontSize: "var(--t-micro)",
        letterSpacing: "var(--track-label)",
        textTransform: "uppercase",
        color: "var(--text-ghost)",
        padding: "8px 12px",
        borderBottom: "var(--border-soft)",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td
      style={{
        padding: "10px 12px",
        borderBottom: "var(--border-soft)",
        fontSize: "var(--t-body-sec)",
        verticalAlign: "top",
        ...style,
      }}
    >
      {children}
    </td>
  );
}
