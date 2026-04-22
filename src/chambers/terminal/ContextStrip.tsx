import type { Copy, RunMode } from "./helpers";

// Terminal chamber head. Two rows: kicker+mode+status (row 1),
// mission+objective breadcrumb (row 2). State comes in as props; no
// fetching or stateful logic here.

interface Props {
  copy: Copy;
  backendMode: "mock" | "real" | null;
  principlesCount: number;
  mode: RunMode;
  onModeChange: (m: RunMode) => void;
  pending: boolean;
  elapsed: number;
  exitCode: number | null;
  taskCount: number;
  doneCount: number;

  activeMissionTitle: string | null;
  currentObjective: string;
  allDone: boolean;
  allDoneLabel: string;
}

export default function ContextStrip({
  copy, backendMode, principlesCount,
  mode, onModeChange, pending, elapsed, exitCode, taskCount, doneCount,
  activeMissionTitle, currentObjective, allDone, allDoneLabel,
}: Props) {
  return (
    <div
      className="chamber-head"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {/* Row 1 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            fontFamily: "var(--mono)",
          }}
        >
          {copy.creationKicker}
        </span>
        <span style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)" }}>
          {copy.creationTagline}
        </span>

        {backendMode === "mock" && (
          <span
            data-backend-mode="mock"
            title="Backend em modo simulado — execuções são canned, não agentes reais"
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--cc-warn)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            mock
          </span>
        )}

        {principlesCount > 0 && (
          <span
            data-principles-in-context
            title={copy.creationPrinciplesPresent(principlesCount)}
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--accent)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            sob § {principlesCount}
          </span>
        )}

        <div
          role="tablist"
          aria-label="Execution mode"
          className="segmented"
          style={{ marginLeft: 12, height: 28 }}
        >
          {(["agent", "crew"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              data-active={mode === m ? "true" : undefined}
              disabled={pending}
              onClick={() => onModeChange(m)}
              className="segmented-opt"
              style={{
                minWidth: 60,
                opacity: pending && mode !== m ? 0.4 : 1,
                cursor: pending ? "not-allowed" : "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          {pending && (
            <span style={{ color: "var(--cc-info)", display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="breathe"
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
              />
              {elapsed.toFixed(1)}s
            </span>
          )}
          {exitCode !== null && !pending && (
            <span style={{ color: exitCode === 0 ? "var(--cc-ok)" : "var(--cc-err)" }}>
              exit {exitCode}
            </span>
          )}
          {taskCount > 0 && (
            <span style={{ color: "var(--text-muted)" }}>
              {doneCount}/{taskCount}
            </span>
          )}
        </div>
      </div>

      {/* Row 2 — mission + current objective */}
      {activeMissionTitle && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono)", fontSize: 11 }}>
          <span style={{ fontSize: 9, letterSpacing: 2, color: "var(--text-ghost)", textTransform: "uppercase" }}>
            missão
          </span>
          <span
            style={{
              color: "var(--text-secondary)",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeMissionTitle}
          </span>
          {currentObjective && (
            <>
              <span style={{ color: "var(--border-soft)", fontSize: 13 }}>›</span>
              <span
                style={{
                  color: "var(--chamber-dna, var(--accent))",
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentObjective}
              </span>
            </>
          )}
          {allDone && (
            <span
              style={{
                color: "var(--cc-ok)",
                fontSize: 10,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
              }}
            >
              · {allDoneLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
