// Ruberra — Canon ribbon. Ambient reminder of hardened truth.
// On narrow screens: rendered as an overlay rail; open/onClose driven by Shell.

import { useProjection } from "../spine/store";
import { useIsMobile } from "../../app/components/ui/use-mobile";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export function CanonRibbon({ open, onClose }: Props) {
  const p = useProjection();
  const isMobile = useIsMobile();
  const canon = p.canon.filter((c) => c.state === "hardened");
  const memory = p.memory.filter((m) => !m.promoted);

  const narrowClass = open
    ? "rb-rail rb-rail-right rb-rail--open"
    : "rb-rail rb-rail-right";
  const closedOnNarrow = isMobile && !open;

  return (
    <aside
      className={narrowClass}
      aria-hidden={closedOnNarrow ? true : undefined}
      style={closedOnNarrow ? { pointerEvents: "none" } : undefined}
    >
      {/* Close button visible when overlay is open on narrow screens */}
      {onClose && (
        <button
          className="rb-rail-toggle"
          style={{ marginBottom: 14, display: open ? "flex" : undefined }}
          onClick={onClose}
          aria-label="Close canon panel"
        >
          ✕ Close
        </button>
      )}

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
