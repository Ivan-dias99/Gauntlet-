import ChamberHead from "../../shell/ChamberHead";
import type { Copy } from "./helpers";

// Terminal chamber head — minimal. Mode toggle moved into the
// ExecutionComposer workspace bar (Claude-Code-class), so the head
// stays calm: kicker · tagline · mock · principles · live timer.
// Status (running / exit / counters) lives in the run-canvas header
// + workbench bench bar; this strip just narrates identity.

interface Props {
  copy: Copy;
  backendMode: "mock" | "real" | null;
  principlesCount: number;
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
  pending, elapsed, exitCode, taskCount, doneCount,
  activeMissionTitle, currentObjective, allDone, allDoneLabel,
}: Props) {
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
            fontSize: "var(--t-meta)",
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
            fontSize: "var(--t-meta)",
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
            fontSize: "var(--t-meta)",
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
        fontSize: "var(--t-meta)",
      }}
    >
      <span
        style={{
          fontSize: "var(--t-micro)",
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
          <span style={{ color: "var(--border-soft)", fontSize: "var(--t-body)" }}>›</span>
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
            fontSize: "var(--t-meta)",
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
      tagline={copy.chambers.terminal.sub}
      mock={backendMode === "mock"}
      principlesCount={principlesCount}
      right={statusCluster}
      below={breadcrumb}
    />
  );
}
