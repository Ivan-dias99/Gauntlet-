import type { ThreadState } from "../spine/projections";

interface AccessSealProps {
  mode: "bind" | "return";
  repo?: string;
  state?: ThreadState | string;
  openThreads?: number;
  canonCount?: number;
  memoryCount?: number;
  unresolvedCount?: number;
  pendingReviews?: number;
}

export function AccessSeal({
  mode,
  repo,
  state,
  openThreads = 0,
  canonCount = 0,
  memoryCount = 0,
  unresolvedCount = 0,
  pendingReviews = 0,
}: AccessSealProps) {
  const routeLabel = mode === "bind" ? "bind → seed → forge" : "resume → chamber";
  const statusLabel = mode === "bind" ? "sealed" : state ?? "ready";

  return (
    <div className="rb-access-seal">
      <div className="rb-access-seal-header">
        <span className="rb-access-seal-kicker">Access Seal</span>
        <span className="rb-access-seal-chip">
          {mode === "bind" ? "institutional initiation" : "continuity recognized"}
        </span>
      </div>

      <div className="rb-access-seal-grid">
        <div className="rb-access-seal-cell">
          <span className="rb-access-seal-label">authority</span>
          <span className="rb-access-seal-value">main</span>
        </div>
        <div className="rb-access-seal-cell">
          <span className="rb-access-seal-label">route</span>
          <span className="rb-access-seal-value">{routeLabel}</span>
        </div>
        <div className="rb-access-seal-cell">
          <span className="rb-access-seal-label">state</span>
          <span className="rb-access-seal-value">{statusLabel}</span>
        </div>
        <div className="rb-access-seal-cell">
          <span className="rb-access-seal-label">repo</span>
          <span className="rb-access-seal-value">{repo ?? "unbound"}</span>
        </div>
      </div>

      {mode === "return" && (
        <div className="rb-access-seal-metrics">
          <span>threads {openThreads}</span>
          <span>canon {canonCount}</span>
          <span>memory {memoryCount}</span>
          {pendingReviews > 0 && <span>review {pendingReviews}</span>}
          {unresolvedCount > 0 && <span>tension {unresolvedCount}</span>}
        </div>
      )}
    </div>
  );
}
