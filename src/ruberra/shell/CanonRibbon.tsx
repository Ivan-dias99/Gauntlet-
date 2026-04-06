// Ruberra — Canon ribbon. Ambient reminder of hardened truth.

import { useProjection } from "../spine/store";

export function CanonRibbon() {
  const p = useProjection();
  const canon = p.canon.filter((c) => c.state === "hardened");
  const memory = p.memory.filter((m) => !m.promoted);
  return (
    <aside className="rb-rail rb-rail-right">
      <h3 className="rb-section-title">Canon</h3>
      {canon.length === 0 ? (
        <div className="rb-unavail">
          <strong>no canon yet</strong>
          Promote memory to harden canon.
        </div>
      ) : (
        <ul className="rb-list">
          {canon.map((c) => (
            <li key={c.id}>
              <span className="rb-badge gold">hardened</span>
              {c.text}
            </li>
          ))}
        </ul>
      )}

      <h3 className="rb-section-title" style={{ marginTop: 22 }}>
        Memory
      </h3>
      {p.memory.length === 0 ? (
        <div className="rb-unavail">
          <strong>empty substrate</strong>
          Capture memory from Lab or Creation.
        </div>
      ) : (
        <ul className="rb-list">
          {memory.slice(-8).reverse().map((m) => (
            <li key={m.id}>{m.text}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
