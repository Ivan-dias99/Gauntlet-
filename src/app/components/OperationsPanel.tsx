/**
 * RUBERRA — Operations Panel
 * Stack 04 · Autonomous Operations visible surface
 *
 * Visual law:
 *   - flagship · premium · calm · consequence over decoration
 *   - no dashboard card spam
 *   - no noisy alert badges
 *   - operational truth only: what is running, what is blocked, what requires action
 *   - Ruberra-native tone — not SaaS project management
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
  draft:        "Draft",
  active:       "Active",
  review:       "Review",
  approved:     "Approved",
  in_execution: "Executing",
  completed:    "Completed",
  blocked:      "Blocked",
  archived:     "Archived",
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
  initializing: "Initializing",
  active:       "Active",
  paused:       "Paused",
  completing:   "Completing",
  completed:    "Completed",
  blocked:      "Blocked",
  aborted:      "Aborted",
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
  release:  "Release",
  preview:  "Preview",
  deploy:   "Deploy",
  retry:    "Retry",
  rollback: "Rollback",
  abort:    "Abort",
  pause:    "Pause",
  resume:   "Resume",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--r-subtext)",
      marginBottom: "10px",
    }}>
      {children}
    </div>
  );
}

function EmptySlate({ label }: { label: string }) {
  return (
    <div style={{
      padding: "20px 0",
      color: "var(--r-dim)",
      fontSize: "12px",
      textAlign: "center",
      letterSpacing: "0.02em",
    }}>
      {label}
    </div>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 7px",
      borderRadius: "4px",
      background: `color-mix(in srgb, ${color} 14%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
      color,
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.04em",
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
      padding: "10px 14px",
      borderBottom: "1px solid var(--r-border)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskList({ tasks, navigate }: { tasks: MissionTask[]; navigate: NavFn }) {
  if (tasks.length === 0) return <EmptySlate label="No active tasks" />;

  return (
    <div>
      {tasks.map((task) => (
        <Row key={task.id}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: PHASE_COLOR[task.phase],
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--r-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {task.title}
            </div>
            <div style={{
              fontSize: "11px",
              color: "var(--r-subtext)",
              marginTop: "2px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {task.intent}
            </div>
          </div>
          <Pill color={CHAMBER_COLOR[task.chamber]} label={task.chamber} />
          <Pill color={PHASE_COLOR[task.phase]}   label={PHASE_LABEL[task.phase]} />
          {task.phase === "blocked" && task.blockerReason && (
            <span style={{
              fontSize: "11px",
              color: "var(--r-err)",
              maxWidth: "140px",
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
                padding: "3px 8px",
                borderRadius: "5px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-subtext)",
                fontSize: "11px",
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
  if (pending.length === 0) return <EmptySlate label="No pending handoffs" />;

  return (
    <div>
      {pending.map((h) => (
        <Row key={h.id}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--r-text)",
            }}>
              {h.fromChamber} → {h.toChamber}
              {h.toPioneerId && (
                <span style={{ color: "var(--r-subtext)", fontWeight: 400 }}>
                  {" "}· {h.toPioneerId}
                </span>
              )}
            </div>
            <div style={{
              fontSize: "11px",
              color: "var(--r-subtext)",
              marginTop: "2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {h.context}
            </div>
          </div>
          <button
            onClick={() => onAccept(h.id)}
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              border: "1px solid var(--r-ok)",
              background: "color-mix(in srgb, var(--r-ok) 10%, transparent)",
              color: "var(--r-ok)",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={() => onReject(h.id, "rejected by operator")}
            style={{
              padding: "3px 8px",
              borderRadius: "5px",
              border: "1px solid var(--r-border)",
              background: "transparent",
              color: "var(--r-subtext)",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </Row>
      ))}
    </div>
  );
}

// ─── Operation flows ──────────────────────────────────────────────────────────

function FlowList({ flows }: { flows: OperationFlow[] }) {
  const live = flows.filter((f) => f.status !== "completed" && f.status !== "aborted");
  if (live.length === 0) return <EmptySlate label="No active operation flows" />;

  return (
    <div>
      {live.map((flow) => {
        const total    = flow.phases.length;
        const done     = flow.phases.filter((p) => p.status === "completed" || p.status === "skipped").length;
        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <Row key={flow.id} style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--r-text)",
                }}>
                  {flow.label}
                </span>
              </div>
              <Pill color={FLOW_STATUS_COLOR[flow.status]} label={FLOW_STATUS_LABEL[flow.status]} />
            </div>

            {/* Progress bar */}
            <div style={{ width: "100%", height: "3px", background: "var(--r-border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                background: FLOW_STATUS_COLOR[flow.status],
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }} />
            </div>

            {/* Phase trail */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {flow.phases.map((phase) => (
                <span
                  key={phase.id}
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: phase.status === "active"    ? "color-mix(in srgb, var(--r-ok) 14%, transparent)"
                              : phase.status === "completed" ? "color-mix(in srgb, var(--r-dim) 14%, transparent)"
                              : phase.status === "blocked"   ? "color-mix(in srgb, var(--r-err) 14%, transparent)"
                              : "var(--r-border)",
                    color: phase.status === "active"    ? "var(--r-ok)"
                         : phase.status === "completed" ? "var(--r-dim)"
                         : phase.status === "blocked"   ? "var(--r-err)"
                         : "var(--r-subtext)",
                    fontWeight: phase.status === "active" ? 600 : 400,
                  }}
                >
                  {phase.label}
                </span>
              ))}
            </div>

            {/* Blockers */}
            {flow.blockers.length > 0 && (
              <div style={{ fontSize: "11px", color: "var(--r-err)" }}>
                Blocked: {flow.blockers.join(" · ")}
              </div>
            )}
          </Row>
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
  if (live.length === 0) return <EmptySlate label="No active signals" />;

  return (
    <div>
      {live.map((sig) => (
        <Row
          key={sig.id}
          style={{ opacity: sig.read ? 0.6 : 1, cursor: sig.actionRoute ? "pointer" : "default" }}
          // onClick ignored — use explicit buttons
        >
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: sig.severity === "critical" ? "var(--r-err)"
                      : sig.severity === "warn"     ? "var(--r-warn)"
                      : "var(--r-accent)",
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)" }}>
              {SIGNAL_KIND_LABEL[sig.kind]}
            </div>
            <div style={{
              fontSize: "11px",
              color: "var(--r-subtext)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {sig.body}
            </div>
          </div>
          {!sig.read && (
            <button
              onClick={() => onRead(sig.id)}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              Read
            </button>
          )}
          {sig.actionRoute && (
            <button
              onClick={() => navigate(sig.actionRoute!.tab, sig.actionRoute!.view, sig.actionRoute?.id)}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--r-accent)",
                background: "color-mix(in srgb, var(--r-accent) 10%, transparent)",
                color: "var(--r-accent)",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              →
            </button>
          )}
          {!sig.resolved && (
            <button
              onClick={() => onResolve(sig.id)}
              style={{
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                fontSize: "10px",
                cursor: "pointer",
              }}
            >
              Resolve
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
  if (recent.length === 0) return <EmptySlate label="No governance records yet" />;

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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--r-text)",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}>
                <span style={{ color: resultColor }}>{GOV_ACTION_LABEL[rec.action]}</span>
                <span style={{ color: "var(--r-dim)", fontWeight: 400, fontSize: "11px" }}>
                  by {rec.triggeredBy}
                </span>
              </div>
              <div style={{
                fontSize: "11px",
                color: "var(--r-subtext)",
                marginTop: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {rec.consequence}
              </div>
            </div>
            {rec.result && (
              <Pill
                color={resultColor}
                label={rec.result.replace("_", " ")}
              />
            )}
            {!rec.result && (
              <Pill color="var(--r-warn)" label="in flight" />
            )}
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
  const unresolvedSignals = signals.filter((s) => !s.resolved);

  const requiresAttention = blockedTasks.length > 0 ||
    pendingHandoffs.length > 0 ||
    unresolvedSignals.some((s) => s.severity === "critical");

  const containerStyle: CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "var(--r-text)",
    maxWidth: "100%",
  };

  const sectionStyle: CSSProperties = {
    marginBottom: "28px",
  };

  const cardStyle: CSSProperties = {
    background: "var(--r-surface-raised, color-mix(in srgb, var(--r-surface) 85%, var(--r-bg)))",
    border: "1px solid var(--r-border)",
    borderRadius: "10px",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      {/* Status bar */}
      <div style={{
        padding: "12px 16px",
        marginBottom: "24px",
        background: requiresAttention
          ? "color-mix(in srgb, var(--r-warn) 8%, var(--r-surface))"
          : "color-mix(in srgb, var(--r-ok) 6%, var(--r-surface))",
        border: "1px solid",
        borderColor: requiresAttention ? "color-mix(in srgb, var(--r-warn) 20%, var(--r-border))" : "var(--r-border)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: requiresAttention ? "var(--r-warn)" : "var(--r-ok)",
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--r-text)" }}>
            {requiresAttention ? "Requires Attention" : "Operations Nominal"}
          </div>
          <div style={{ fontSize: "11px", color: "var(--r-subtext)", marginTop: "1px" }}>
            {activeTasks.length} active · {blockedTasks.length} blocked · {flows.filter((f) => f.status === "active").length} flows running · {pendingHandoffs.length} handoffs pending
          </div>
        </div>
      </div>

      {/* Active tasks */}
      <div style={sectionStyle}>
        <SectionLabel>Active Tasks</SectionLabel>
        <div style={cardStyle}>
          <TaskList tasks={activeTasks} navigate={navigate} />
        </div>
      </div>

      {/* Blocked tasks */}
      {blockedTasks.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Blocked</SectionLabel>
          <div style={cardStyle}>
            <TaskList tasks={blockedTasks} navigate={navigate} />
          </div>
        </div>
      )}

      {/* Operation flows */}
      <div style={sectionStyle}>
        <SectionLabel>Operation Flows</SectionLabel>
        <div style={cardStyle}>
          <FlowList flows={flows} />
        </div>
      </div>

      {/* Handoff queue */}
      {pendingHandoffs.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Handoff Queue</SectionLabel>
          <div style={cardStyle}>
            <HandoffQueue
              handoffs={handoffs}
              onAccept={onHandoffAccept}
              onReject={onHandoffReject}
            />
          </div>
        </div>
      )}

      {/* Signal feed */}
      <div style={sectionStyle}>
        <SectionLabel>Signals</SectionLabel>
        <div style={cardStyle}>
          <SignalFeed
            signals={signals}
            onRead={onSignalRead}
            onResolve={onSignalResolve}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Governance trail */}
      <div style={sectionStyle}>
        <SectionLabel>Execution Governance</SectionLabel>
        <div style={cardStyle}>
          <GovernanceTrail records={governance} />
        </div>
      </div>
    </div>
  );
}
