// Wave P-9 — Evidence trail consumer.
//
// Wave E (#224) shipped EvidenceRecord; Wave P-3 (#243) opened the
// producer side so the agent loop emits typed `evidence` events
// alongside gate/diff signals. This panel is the consumer: a small
// collapsible list pinned near the Terminal output canvas that
// shows every evidence record collected during the current run.
//
// Records are append-only inside a single run and reset on the next
// submit (the parent owns the array via useState; this component
// just renders it).

import type { EvidenceRecordPayload } from "../../hooks/useSignal";

interface Props {
  records: EvidenceRecordPayload[];
}

const KIND_LABEL: Record<string, string> = {
  gate: "gate",
  diff: "diff",
  command: "command",
  file_change: "file",
  tool_result: "tool",
};

const GATE_TONE: Record<string, string> = {
  pass: "ok",
  fail: "danger",
  unavailable: "warn",
};

export default function EvidencePanel({ records }: Props) {
  if (records.length === 0) return null;
  return (
    <section
      data-evidence-panel
      style={{
        margin: "var(--space-2) auto 0",
        maxWidth: 820,
        padding: "var(--space-2)",
        borderRadius: "var(--radius-md)",
        border: "1px solid currentColor",
        opacity: 0.88,
        fontSize: "0.85em",
      }}
      aria-label="evidence trail"
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.8em",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        ↪ {records.length} evidence record{records.length === 1 ? "" : "s"}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {records.map((r) => (
          <li
            key={r.id}
            data-evidence-id={r.id}
            data-evidence-kind={r.kind}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "baseline",
              fontFamily: "var(--mono)",
              fontSize: "0.8em",
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid currentColor",
              opacity: 0.85,
            }}
          >
            <span data-evidence-iter style={{ opacity: 0.6 }}>
              i{r.iteration}
            </span>
            <span data-evidence-kind-label style={{ fontWeight: 600 }}>
              {KIND_LABEL[r.kind] ?? r.kind}
            </span>
            <span data-evidence-summary style={{ flex: 1 }}>
              {summary(r)}
            </span>
            <span data-evidence-source style={{ opacity: 0.6 }}>
              {r.source}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function summary(r: EvidenceRecordPayload): string {
  if (r.kind === "gate") {
    const tone = r.gateState ? GATE_TONE[r.gateState] ?? "" : "";
    return `${r.gateName ?? "?"} → ${r.gateState ?? "?"}${tone ? ` (${tone})` : ""}`;
  }
  if (r.kind === "diff") {
    const f = r.diffFiles ?? 0;
    const a = r.diffAdded ?? 0;
    const d = r.diffRemoved ?? 0;
    return `${f} file${f === 1 ? "" : "s"} +${a} -${d}`;
  }
  if (r.kind === "command") {
    const cmd = r.commandLine ? r.commandLine.slice(0, 50) : "?";
    return `${cmd} (exit ${r.commandExitCode ?? "?"})`;
  }
  if (r.kind === "file_change") {
    return `${r.fileChange ?? "?"} ${r.filePath ?? "?"}`;
  }
  if (r.kind === "tool_result") {
    return `${r.toolName ?? "?"} ${r.toolOk ? "ok" : "fail"}`;
  }
  return r.note ?? "";
}
