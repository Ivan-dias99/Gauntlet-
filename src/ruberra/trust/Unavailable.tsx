// Ruberra — Explicit Unavailable state. Never lie about capability.

interface Props {
  title: string;
  reason: string;
  remediation?: string;
}

export function Unavailable({ title, reason, remediation }: Props) {
  return (
    <div className="rb-unavail">
      <strong>{title}</strong>
      {reason}
      {remediation ? <div style={{ marginTop: 8 }}>→ {remediation}</div> : null}
    </div>
  );
}
