// Ruberra — Canon ribbon. Weight-bearing truth rail.
// Hardened canon = law. Revoked canon = scar. Memory = raw substrate.
// On narrow screens: rendered as an overlay rail; open/onClose driven by Shell.

import { useProjection } from "../spine/store";
import { useIsMobile } from "./use-mobile";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function CanonRibbon({ open, onClose }: Props) {
  const p = useProjection();
  const isMobile = useIsMobile();
  const canon = p.canon.filter((c) => c.state === "hardened");
  const revoked = p.canon.filter((c) => c.state === "revoked");
  const recentMemory = p.memory.slice(-3).reverse();

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

      {/* Canon section — authority zone */}
      <div className="rb-canon-header">
        <div className="rb-canon-header-row">
          <span className="rb-canon-header-title">Authority</span>
          {canon.length > 0 && (
            <span className="rb-canon-header-count">{canon.length} canon</span>
          )}
        </div>
        <div className="rb-canon-header-rule" />
      </div>

      {canon.length === 0 ? (
        <div className="rb-unavail">
          <strong>no canon</strong>
        </div>
      ) : (
        <div className="rb-canon-list">
          {canon.map((c) => (
            <div key={c.id} className="rb-canon-entry">
              <span className="rb-canon-entry-text">{c.text}</span>
              <span className="rb-canon-entry-provenance">
                hardened · {timeAgo(c.hardenedAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Consequence Highlights — recent memory substrate */}
      {recentMemory.length > 0 && (
        <div className="rb-canon-memory-section">
          <div className="rb-section-title">Recent Consequences</div>
          {recentMemory.map((m) => (
            <div key={m.id} className="rb-canon-memory-entry">
              <span className="rb-canon-memory-text">{m.text}</span>
              <div className="rb-canon-memory-meta">
                {m.promoted && <span className="rb-badge gold">promoted</span>}
                <span className="time">{timeAgo(m.ts)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revoked canon — scars, not deleted */}
      {revoked.length > 0 && (
        <div className="rb-canon-revoked-section">
          <div className="rb-section-title">Scars</div>
          {revoked.map((c) => (
            <div key={c.id} className="rb-canon-revoked">
              <span className="rb-canon-revoked-text">{c.text}</span>
              {c.revokeReason && (
                <span className="rb-canon-revoked-reason">{c.revokeReason}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
