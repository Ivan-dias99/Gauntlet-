import ChamberHead from "../../shell/ChamberHead";
import type { Copy, RunMode } from "./helpers";

// Terminal chamber head. Uses the shared ChamberHead primitive so the
// grammar (kicker · tagline · mock · principles · inline control ·
// right slot · optional row-2) is identical to every other chamber;
// Terminal-specific extras (mode toggle, elapsed timer, exit-code pill,
// task counter, mission breadcrumb) are slotted in through named props.

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
  const modeToggle = (
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
  );

  const statusCluster = (
    <>
      {pending && (
        <span
          style={{
            color: "var(--cc-info)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          <span
            className="breathe"
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
          />
          {elapsed.toFixed(1)}s
        </span>
      )}
      {exitCode !== null && !pending && (
        <span
          style={{
            color: exitCode === 0 ? "var(--cc-ok)" : "var(--cc-err)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          exit {exitCode}
        </span>
      )}
      {taskCount > 0 && (
        <span
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          {doneCount}/{taskCount}
        </span>
      )}
    </>
  );

  const breadcrumb = activeMissionTitle ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--mono)",
        fontSize: 11,
      }}
    >
      <span
        style={{
          fontSize: 9,
          letterSpacing: 2,
          color: "var(--text-ghost)",
          textTransform: "uppercase",
        }}
      >
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
  ) : null;

  return (
    <ChamberHead
      kicker={copy.creationKicker}
      tagline={copy.creationTagline}
      mock={backendMode === "mock"}
      principlesCount={principlesCount}
      inline={modeToggle}
      right={statusCluster}
      below={breadcrumb}
    />
  );
}
