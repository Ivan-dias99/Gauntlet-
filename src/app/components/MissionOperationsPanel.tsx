/**
 * RUBERRA — Mission Operations Panel
 * Stack 04 · Autonomous Operations · Visible Shell
 *
 * The operational surface of a mission.
 * Shows task state, signals, approvals, and flow — ledger-weight only.
 *
 * Antigravity law:
 * - No card grid. No progress bars. No badge spam.
 * - Operations are ledger rows — dense, monospace, consequential.
 * - Signals are surfaced by priority, not volume.
 * - Approvals are actions, not notifications.
 * - The empty state is honest: no work started means no fabricated state.
 */

import { useState } from "react";
import {
  type MissionOperationsState,
  type MissionTask,
  type MissionSignal,
  type ApprovalRequest,
  type TaskStatus,
  TASK_STATUS_LABEL,
  SIGNAL_TYPE_LABEL,
  getActiveSignals,
  getActiveTasks,
  getBlockedTasks,
} from "../dna/autonomous-operations";
import { type MissionId } from "../dna/mission-substrate";

// ─── Accent helpers ───────────────────────────────────────────────────────────

function taskStatusColor(status: TaskStatus): string {
  if (status === "blocked")   return "var(--r-err)";
  if (status === "active")    return "var(--r-accent)";
  if (status === "completed") return "var(--r-ok)";
  if (status === "review")    return "var(--r-warn)";
  if (status === "approved")  return "var(--r-ok)";
  return "var(--r-dim)";
}

// ─── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task }: { task: MissionTask }) {
  return (
    <div
      style={{
        display:       "flex",
        alignItems:    "baseline",
        gap:           "10px",
        padding:       "7px 0",
        borderBottom:  "1px solid var(--r-border-soft)",
      }}
    >
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color:         taskStatusColor(task.status),
          minWidth:      "62px",
          flexShrink:    0,
        }}
      >
        {TASK_STATUS_LABEL[task.status]}
      </span>
      <span
        style={{
          fontFamily:    "'Inter', system-ui, sans-serif",
          fontSize:      "11px",
          color:         task.status === "completed" ? "var(--r-dim)" : "var(--r-text)",
          flex:          1,
          textDecoration: task.status === "completed" ? "line-through" : "none",
          lineHeight:    1.4,
        }}
      >
        {task.title}
      </span>
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          color:         "var(--r-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          flexShrink:    0,
        }}
      >
        {task.chamberLead}
      </span>
    </div>
  );
}

// ─── Signal row ───────────────────────────────────────────────────────────────

function SignalRow({
  signal,
  onDismiss,
}: {
  signal:    MissionSignal;
  onDismiss: (id: string) => void;
}) {
  const priorityColor =
    signal.priority === "critical" ? "var(--r-err)"    :
    signal.priority === "high"     ? "var(--r-warn)"   :
    signal.priority === "standard" ? "var(--r-accent)" : "var(--r-dim)";

  return (
    <div
      style={{
        display:       "flex",
        alignItems:    "baseline",
        gap:           "10px",
        padding:       "7px 0",
        borderBottom:  "1px solid var(--r-border-soft)",
      }}
    >
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "7.5px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color:         priorityColor,
          minWidth:      "76px",
          flexShrink:    0,
        }}
      >
        {SIGNAL_TYPE_LABEL[signal.type]}
      </span>
      <span
        style={{
          fontFamily:    "'Inter', system-ui, sans-serif",
          fontSize:      "11px",
          color:         "var(--r-text)",
          flex:          1,
          lineHeight:    1.4,
        }}
      >
        {signal.headline}
      </span>
      {signal.actionable && (
        <button
          onClick={() => onDismiss(signal.id)}
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color:         "var(--r-dim)",
            background:    "transparent",
            border:        "1px solid var(--r-border)",
            borderRadius:  "3px",
            padding:       "2px 6px",
            cursor:        "pointer",
            flexShrink:    0,
          }}
        >
          dismiss
        </button>
      )}
    </div>
  );
}

// ─── Approval row ─────────────────────────────────────────────────────────────

function ApprovalRow({
  req,
  onApprove,
  onReject,
}: {
  req:       ApprovalRequest;
  onApprove: (id: string) => void;
  onReject:  (id: string) => void;
}) {
  return (
    <div
      style={{
        padding:      "8px 0",
        borderBottom: "1px solid var(--r-border-soft)",
      }}
    >
      <div
        style={{
          display:       "flex",
          alignItems:    "baseline",
          gap:           "10px",
          marginBottom:  "5px",
        }}
      >
        <span
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color:         "var(--r-warn)",
            minWidth:      "76px",
            flexShrink:    0,
          }}
        >
          approval
        </span>
        <span
          style={{
            fontFamily:    "'Inter', system-ui, sans-serif",
            fontSize:      "11px",
            color:         "var(--r-text)",
            flex:          1,
            lineHeight:    1.4,
          }}
        >
          {req.description}
        </span>
      </div>
      {req.consequence && (
        <div
          style={{
            fontFamily:    "'Inter', system-ui, sans-serif",
            fontSize:      "10px",
            color:         "var(--r-subtext)",
            marginLeft:    "86px",
            marginBottom:  "6px",
            lineHeight:    1.4,
          }}
        >
          {req.consequence}
        </div>
      )}
      <div style={{ display: "flex", gap: "6px", marginLeft: "86px" }}>
        <button
          onClick={() => onApprove(req.id)}
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:         "var(--r-ok)",
            background:    "transparent",
            border:        "1px solid color-mix(in srgb, var(--r-ok) 40%, var(--r-border))",
            borderRadius:  "3px",
            padding:       "3px 8px",
            cursor:        "pointer",
          }}
        >
          approve
        </button>
        <button
          onClick={() => onReject(req.id)}
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:         "var(--r-err)",
            background:    "transparent",
            border:        "1px solid color-mix(in srgb, var(--r-err) 30%, var(--r-border))",
            borderRadius:  "3px",
            padding:       "3px 8px",
            cursor:        "pointer",
          }}
        >
          reject
        </button>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           "8px",
        marginBottom:  "2px",
        paddingBottom: "5px",
        borderBottom:  "1px solid var(--r-border)",
      }}
    >
      <span
        style={{
          fontFamily:    "'JetBrains Mono', monospace",
          fontSize:      "8px",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color:         "var(--r-subtext)",
          fontWeight:    600,
        }}
      >
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "7.5px",
            color:         "var(--r-dim)",
            letterSpacing: "0.04em",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function MissionOperationsPanel({
  missionId,
  ops,
  onSignalDismiss,
  onApprovalApprove,
  onApprovalReject,
}: {
  missionId:         MissionId;
  ops:               MissionOperationsState;
  onSignalDismiss:   (signalId: string) => void;
  onApprovalApprove: (requestId: string) => void;
  onApprovalReject:  (requestId: string) => void;
}) {
  type View = "tasks" | "signals" | "approvals";
  const [view, setView] = useState<View>("tasks");

  const activeTasks   = getActiveTasks(ops.tasks);
  const blockedTasks  = getBlockedTasks(ops.tasks);
  const activeSignals = getActiveSignals(ops.signals);
  const pendingApprovals = ops.pendingApprovals;

  const hasWork = ops.tasks.length > 0 || activeSignals.length > 0 || pendingApprovals.length > 0;

  const TAB = (id: View, label: string, badge?: number) => (
    <button
      onClick={() => setView(id)}
      style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      "9px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding:       "5px 12px",
        border:        "none",
        borderBottom:  view === id
          ? "2px solid var(--r-accent)"
          : "2px solid transparent",
        background:    "transparent",
        color:         view === id ? "var(--r-text)" : "var(--r-dim)",
        cursor:        "pointer",
        outline:       "none",
        fontWeight:    view === id ? 600 : 400,
      }}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span style={{ marginLeft: "5px", color: "var(--r-warn)" }}>
          {badge}
        </span>
      )}
    </button>
  );

  if (!hasWork) {
    return (
      <div
        style={{
          padding:       "14px 0",
        }}
      >
        <div
          style={{
            fontFamily:    "'JetBrains Mono', monospace",
            fontSize:      "8px",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color:         "var(--r-dim)",
          }}
        >
          operations · idle
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          display:      "flex",
          borderBottom: "1px solid var(--r-border)",
          marginBottom: "12px",
        }}
      >
        {TAB("tasks",     "Tasks",     blockedTasks.length || undefined)}
        {TAB("signals",   "Signals",   activeSignals.filter((s) => s.priority === "critical" || s.priority === "high").length || undefined)}
        {TAB("approvals", "Approvals", pendingApprovals.length || undefined)}
      </div>

      {/* Tasks view */}
      {view === "tasks" && (
        <div>
          {activeTasks.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <SectionHead label="Active" count={activeTasks.length} />
              {activeTasks.map((t) => <TaskRow key={t.id} task={t} />)}
            </div>
          )}
          {blockedTasks.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <SectionHead label="Blocked" count={blockedTasks.length} />
              {blockedTasks.map((t) => <TaskRow key={t.id} task={t} />)}
            </div>
          )}
          {ops.tasks.filter((t) => t.status === "completed").length > 0 && (
            <div>
              <SectionHead label="Completed" count={ops.tasks.filter((t) => t.status === "completed").length} />
              {ops.tasks
                .filter((t) => t.status === "completed")
                .slice(-5)
                .map((t) => <TaskRow key={t.id} task={t} />)
              }
            </div>
          )}
          {ops.tasks.filter((t) => t.status === "pending").length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <SectionHead label="Pending" count={ops.tasks.filter((t) => t.status === "pending").length} />
              {ops.tasks
                .filter((t) => t.status === "pending")
                .map((t) => <TaskRow key={t.id} task={t} />)
              }
            </div>
          )}
        </div>
      )}

      {/* Signals view */}
      {view === "signals" && (
        <div>
          {activeSignals.length === 0 ? (
            <div
              style={{
                fontFamily:    "'Inter', system-ui, sans-serif",
                fontSize:      "11px",
                color:         "var(--r-dim)",
                padding:       "12px 0",
              }}
            >
              No active signals.
            </div>
          ) : (
            activeSignals.map((s) => (
              <SignalRow
                key={s.id}
                signal={s}
                onDismiss={onSignalDismiss}
              />
            ))
          )}
        </div>
      )}

      {/* Approvals view */}
      {view === "approvals" && (
        <div>
          {pendingApprovals.length === 0 ? (
            <div
              style={{
                fontFamily:    "'Inter', system-ui, sans-serif",
                fontSize:      "11px",
                color:         "var(--r-dim)",
                padding:       "12px 0",
              }}
            >
              No pending approvals.
            </div>
          ) : (
            pendingApprovals.map((a) => (
              <ApprovalRow
                key={a.id}
                req={a}
                onApprove={onApprovalApprove}
                onReject={onApprovalReject}
              />
            ))
          )}
        </div>
      )}

      {/* Operational health footer */}
      <div
        style={{
          marginTop:     "14px",
          paddingTop:    "8px",
          borderTop:     "1px solid var(--r-border-soft)",
          display:       "flex",
          gap:           "14px",
        }}
      >
        {[
          { label: "active",   val: ops.operationState.activeTasks   },
          { label: "blocked",  val: ops.operationState.blockedTasks,  warn: true },
          { label: "done",     val: ops.operationState.completedTasks },
          { label: "approvals",val: ops.operationState.pendingApprovals, warn: true },
        ].map(({ label, val, warn }) => (
          <span
            key={label}
            style={{
              fontFamily:    "'JetBrains Mono', monospace",
              fontSize:      "7.5px",
              letterSpacing: "0.06em",
              color:         (warn && val > 0) ? "var(--r-warn)" : "var(--r-dim)",
            }}
          >
            {label} <span style={{ color: (warn && val > 0) ? "var(--r-warn)" : "var(--r-subtext)" }}>{val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
