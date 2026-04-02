/**
 * RUBERRA — Operations Panel
 * Stack 04 · Autonomous Operations visible surface
 *
 * Antigravity law:
 *   - ledger rows, not cards
 *   - consequence over decoration
 *   - no progress bars, no badge pills, no status theater
 *   - empty = honest silence, not marketing copy
 */

import { type CSSProperties } from "react";
import {
  type MissionTask,
  type TaskReview,
  type ApprovalRecord,
  type HandoffPacket,
  type OperationFlow,
  type OperationSignal,
  type ExecutionGovernanceRecord,
  type MissionTaskPhase,
  type OperationFlowStatus,
  type GovernanceAction,
  SIGNAL_KIND_LABEL,
} from "./autonomous-operations";
import { type Tab } from "./shell-types";
import { type NavFn } from "./shell-types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface OperationsPanelProps {
  tasks:      MissionTask[];
  reviews:    TaskReview[];
  approvals:  ApprovalRecord[];
  handoffs:   HandoffPacket[];
  flows:      OperationFlow[];
  signals:    OperationSignal[];
  governance: ExecutionGovernanceRecord[];
  navigate:   NavFn;
  onSignalRead:    (id: string) => void;
  onSignalResolve: (id: string) => void;
  onHandoffAccept: (id: string) => void;
  onHandoffReject: (id: string, reason: string) => void;
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

const CHAMBER_COLOR: Record<Exclude<Tab, "profile">, string> = {
  lab:      "var(--chamber-lab)",
  school:   "var(--chamber-school)",
  creation: "var(--chamber-creation)",
};

const PHASE_LABEL: Record<MissionTaskPhase, string> = {
  draft:        "draft",
  active:       "active",
  review:       "review",
  approved:     "approved",
  in_execution: "exec",
  completed:    "done",
  blocked:      "blocked",
  archived:     "archived",
};

const PHASE_COLOR: Record<MissionTaskPhase, string> = {
  draft:        "var(--r-dim)",
  active:       "var(--r-ok)",
  review:       "var(--r-warn)",
  approved:     "var(--r-accent)",
  in_execution: "var(--r-ok)",
  completed:    "var(--r-dim)",
  blocked:      "var(--r-err)",
  archived:     "var(--r-dim)",
};

const FLOW_STATUS_LABEL: Record<OperationFlowStatus, string> = {
  initializing: "init",
  active:       "live",
  paused:       "suspended",
  completing:   "closing",
  completed:    "closed",
  blocked:      "blocked",
  aborted:      "aborted",
};

const FLOW_STATUS_COLOR: Record<OperationFlowStatus, string> = {
  initializing: "var(--r-accent)",
  active:       "var(--r-ok)",
  paused:       "var(--r-warn)",
  completing:   "var(--r-ok)",
  completed:    "var(--r-dim)",
  blocked:      "var(--r-err)",
  aborted:      "var(--r-err)",
};

const GOV_ACTION_LABEL: Record<GovernanceAction, string> = {
  release:  "release",
  preview:  "preview",
  deploy:   "deploy",
  retry:    "retry",
  rollback: "rollback",
  abort:    "abort",
  pause:    "pause",
  resume:   "resume",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const mono8: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "8px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      ...mono8,
      color: "var(--r-subtext)",
      marginBottom: "6px",
      fontWeight: 600,
    }}>
      {children}
    </div>
  );
}

function EmptySlate({ label }: { label: string }) {
  return (
    <div style={{
      ...mono8,
      padding: "10px 0",
      color: "var(--r-dim)",
      textAlign: "center",
      fontSize: "7.5px",
    }}>
      {label}
    </div>
  );
}

function PhaseTag({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      ...mono8,
      fontSize: "7.5px",
      color,
      minWidth: "52px",
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

function Row({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "6px 10px",
      borderBottom: "1px solid var(--r-border-soft)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskList({ tasks, navigate }: { tasks: MissionTask[]; navigate: NavFn }) {
  if (tasks.length === 0) return <EmptySlate label="— idle —" />;

  return (
    <div>
      {tasks.map((task) => (
        <Row key={task.id}>
          <PhaseTag color={PHASE_COLOR[task.phase]} label={PHASE_LABEL[task.phase]} />
          <span style={{
            flex: 1,
            minWidth: 0,
            fontSize: "11px",
            color: task.phase === "completed" ? "var(--r-dim)" : "var(--r-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
          }}>
            {task.title}
          </span>
          <span style={{
            ...mono8,
            fontSize: "7.5px",
            color: CHAMBER_COLOR[task.chamber],
            flexShrink: 0,
          }}>
            {task.chamber}
          </span>
          {task.phase === "blocked" && task.blockerReason && (
            <span style={{
              ...mono8,
              fontSize: "7.5px",
              color: "var(--r-err)",
              maxWidth: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {task.blockerReason}
            </span>
          )}
          {task.handoffTarget && task.phase !== "completed" && (
            <button
              onClick={() => navigate(task.handoffTarget!.chamber, "chat")}
              style={{
                ...mono8,
                fontSize: "7.5px",
                padding: "2px 6px",
                borderRadius: "3px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                cursor: "pointer",
              }}
            >
              → {task.handoffTarget.chamber}
            </button>
          )}
        </Row>
      ))}
    </div>
  );
}

// ─── Handoff queue ────────────────────────────────────────────────────────────

function HandoffQueue({
  handoffs,
  onAccept,
  onReject,
}: {
  handoffs:  HandoffPacket[];
  onAccept:  (id: string) => void;
  onReject:  (id: string, reason: string) => void;
}) {
  const pending = handoffs.filter((h) => h.state === "pending");
  if (pending.length === 0) return <EmptySlate label="— idle —" />;

  return (
    <div>
      {pending.map((h) => (
        <Row key={h.id}>
          <span style={{
            ...mono8,
            fontSize: "7.5px",
            color: "var(--r-warn)",
            minWidth: "52px",
            flexShrink: 0,
          }}>
            handoff
          </span>
          <span style={{
            flex: 1,
            minWidth: 0,
            fontSize: "11px",
            color: "var(--r-text)",
            lineHeight: 1.4,
          }}>
            {h.fromChamber} → {h.toChamber}
            {h.toPioneerId && (
              <span style={{ color: "var(--r-dim)" }}> · {h.toPioneerId}</span>
            )}
          </span>
          <button
            onClick={() => onAccept(h.id)}
            style={{
              ...mono8,
              fontSize: "7.5px",
              padding: "2px 6px",
              borderRadius: "3px",
              border: "1px solid color-mix(in srgb, var(--r-ok) 40%, var(--r-border))",
              background: "transparent",
              color: "var(--r-ok)",
              cursor: "pointer",
            }}
          >
            receive
          </button>
          <button
            onClick={() => onReject(h.id, "declined by operator")}
            style={{
              ...mono8,
              fontSize: "7.5px",
              padding: "2px 6px",
              borderRadius: "3px",
              border: "1px solid var(--r-border)",
              background: "transparent",
              color: "var(--r-dim)",
              cursor: "pointer",
            }}
          >
            decline
          </button>
        </Row>
      ))}
    </div>
  );
}

// ─── Operation flows ──────────────────────────────────────────────────────────

function FlowList({ flows }: { flows: OperationFlow[] }) {
  const live = flows.filter((f) => f.status !== "completed" && f.status !== "aborted");
  if (live.length === 0) return <EmptySlate label="— idle —" />;

  return (
    <div>
      {live.map((flow) => {
        const total = flow.phases.length;
        const done  = flow.phases.filter((p) => p.status === "completed" || p.status === "skipped").length;

        return (
          <div key={flow.id} style={{ padding: "6px 10px", borderBottom: "1px solid var(--r-border-soft)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
              <PhaseTag color={FLOW_STATUS_COLOR[flow.status]} label={FLOW_STATUS_LABEL[flow.status]} />
              <span style={{
                flex: 1,
                fontSize: "11px",
                color: "var(--r-text)",
                lineHeight: 1.4,
              }}>
                {flow.label}
              </span>
              <span style={{
                ...mono8,
                fontSize: "7.5px",
                color: "var(--r-dim)",
                flexShrink: 0,
              }}>
                {done}/{total}
              </span>
            </div>

            {/* Phase sequence — flat text, no decorative backgrounds */}
            <div style={{ display: "flex", alignItems: "center", gap: "0", flexWrap: "wrap", marginLeft: "52px" }}>
              {flow.phases.map((phase, idx) => (
                <span key={phase.id} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{
                    ...mono8,
                    fontSize: "7.5px",
                    color: phase.status === "active"    ? "var(--r-ok)"
                         : phase.status === "completed" ? "var(--r-dim)"
                         : phase.status === "blocked"   ? "var(--r-err)"
                         : "var(--r-dim)",
                    fontWeight: phase.status === "active" ? 600 : 400,
                    padding: "1px 4px",
                  }}>
                    {phase.label}
                  </span>
                  {idx < flow.phases.length - 1 && (
                    <span style={{ fontSize: "7px", color: "var(--r-dim)", padding: "0 1px", userSelect: "none" }}>→</span>
                  )}
                </span>
              ))}
            </div>

            {/* Blockers */}
            {flow.blockers.length > 0 && (
              <div style={{ ...mono8, fontSize: "7.5px", color: "var(--r-err)", marginTop: "3px", marginLeft: "52px" }}>
                blocked: {flow.blockers.join(" · ")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Signal feed ──────────────────────────────────────────────────────────────

function SignalFeed({
  signals,
  onRead,
  onResolve,
  navigate,
}: {
  signals:   OperationSignal[];
  onRead:    (id: string) => void;
  onResolve: (id: string) => void;
  navigate:  NavFn;
}) {
  const live = signals.filter((s) => !s.resolved).slice(0, 12);
  if (live.length === 0) return <EmptySlate label="— idle —" />;

  return (
    <div>
      {live.map((sig) => (
        <Row key={sig.id} style={{ opacity: sig.read ? 0.55 : 1 }}>
          <span style={{
            ...mono8,
            fontSize: "7.5px",
            color: sig.severity === "critical" ? "var(--r-err)"
                 : sig.severity === "warn"     ? "var(--r-warn)"
                 : "var(--r-accent)",
            minWidth: "76px",
            flexShrink: 0,
          }}>
            {SIGNAL_KIND_LABEL[sig.kind]}
          </span>
          <span style={{
            flex: 1,
            minWidth: 0,
            fontSize: "11px",
            color: sig.severity === "critical" ? "var(--r-err)" : "var(--r-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
          }}>
            {sig.title}
          </span>
          {sig.chamber && (
            <span style={{ ...mono8, fontSize: "7.5px", color: "var(--r-dim)", flexShrink: 0 }}>
              {sig.chamber}
            </span>
          )}
          {!sig.read && (
            <button
              onClick={() => onRead(sig.id)}
              style={{
                ...mono8,
                fontSize: "7.5px",
                padding: "2px 6px",
                borderRadius: "3px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                cursor: "pointer",
              }}
            >
              ack
            </button>
          )}
          {sig.actionRoute && (
            <button
              onClick={() => navigate(sig.actionRoute!.tab, sig.actionRoute!.view, sig.actionRoute?.id)}
              style={{
                ...mono8,
                fontSize: "7.5px",
                padding: "2px 6px",
                borderRadius: "3px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-accent)",
                cursor: "pointer",
              }}
            >
              go
            </button>
          )}
          {!sig.resolved && (
            <button
              onClick={() => onResolve(sig.id)}
              style={{
                ...mono8,
                fontSize: "7.5px",
                padding: "2px 6px",
                borderRadius: "3px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                cursor: "pointer",
              }}
            >
              clear
            </button>
          )}
        </Row>
      ))}
    </div>
  );
}

// ─── Governance trail ─────────────────────────────────────────────────────────

function GovernanceTrail({ records }: { records: ExecutionGovernanceRecord[] }) {
  const recent = records.slice(0, 8);
  if (recent.length === 0) return <EmptySlate label="— idle —" />;

  return (
    <div>
      {recent.map((rec) => {
        const resultColor = !rec.result             ? "var(--r-dim)"
                          : rec.result === "success" ? "var(--r-ok)"
                          : rec.result === "failed"  ? "var(--r-err)"
                          : rec.result === "rolled_back" ? "var(--r-warn)"
                          : "var(--r-dim)";

        return (
          <Row key={rec.id}>
            <PhaseTag
              color={resultColor}
              label={rec.result ? rec.result.replace("_", " ") : "exec"}
            />
            <span style={{
              ...mono8,
              fontSize: "7.5px",
              color: resultColor,
              flexShrink: 0,
            }}>
              {GOV_ACTION_LABEL[rec.action]}
            </span>
            <span style={{
              flex: 1,
              minWidth: 0,
              fontSize: "11px",
              color: "var(--r-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.4,
            }}>
              {rec.consequence}
            </span>
            <span style={{ ...mono8, fontSize: "7.5px", color: "var(--r-dim)", flexShrink: 0 }}>
              {rec.triggeredBy}
            </span>
          </Row>
        );
      })}
    </div>
  );
}

// ─── Root panel ───────────────────────────────────────────────────────────────

export function OperationsPanel({
  tasks,
  reviews: _reviews,
  approvals: _approvals,
  handoffs,
  flows,
  signals,
  governance,
  navigate,
  onSignalRead,
  onSignalResolve,
  onHandoffAccept,
  onHandoffReject,
}: OperationsPanelProps) {
  const activeTasks    = tasks.filter((t) => t.phase === "active" || t.phase === "in_execution" || t.phase === "review" || t.phase === "approved");
  const blockedTasks   = tasks.filter((t) => t.phase === "blocked");
  const pendingHandoffs = handoffs.filter((h) => h.state === "pending");

  const containerStyle: CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "var(--r-text)",
    maxWidth: "100%",
  };

  const sectionStyle: CSSProperties = {
    marginBottom: "16px",
  };

  const ledgerStyle: CSSProperties = {
    border: "1px solid var(--r-border-soft)",
    borderRadius: "4px",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      {/* Tasks */}
      <div style={sectionStyle}>
        <SectionLabel>tasks</SectionLabel>
        <div style={ledgerStyle}>
          <TaskList tasks={activeTasks} navigate={navigate} />
        </div>
      </div>

      {/* Blockers */}
      {blockedTasks.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>blocked</SectionLabel>
          <div style={ledgerStyle}>
            <TaskList tasks={blockedTasks} navigate={navigate} />
          </div>
        </div>
      )}

      {/* Flows */}
      <div style={sectionStyle}>
        <SectionLabel>flows</SectionLabel>
        <div style={ledgerStyle}>
          <FlowList flows={flows} />
        </div>
      </div>

      {/* Handoffs */}
      {pendingHandoffs.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>handoffs</SectionLabel>
          <div style={ledgerStyle}>
            <HandoffQueue
              handoffs={handoffs}
              onAccept={onHandoffAccept}
              onReject={onHandoffReject}
            />
          </div>
        </div>
      )}

      {/* Signals */}
      <div style={sectionStyle}>
        <SectionLabel>signals</SectionLabel>
        <div style={ledgerStyle}>
          <SignalFeed
            signals={signals}
            onRead={onSignalRead}
            onResolve={onSignalResolve}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Governance */}
      <div style={sectionStyle}>
        <SectionLabel>governance</SectionLabel>
        <div style={ledgerStyle}>
          <GovernanceTrail records={governance} />
        </div>
      </div>
    </div>
  );
}
