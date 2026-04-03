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
  active:       "Live",
  paused:       "Suspended",
  completing:   "Closing",
  completed:    "Closed",
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
      fontWeight: 400,
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
      padding: "10px 0",
      color: "var(--r-dim)",
      fontSize: "10px",
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    }}>
      {label}
    </div>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "1px 5px",
      borderRadius: "2px",
      background: `color-mix(in srgb, ${color} 10%, transparent)`,
      border: `1px solid color-mix(in srgb, ${color} 14%, transparent)`,
      color,
      fontSize: "8px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
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
      padding: "6px 0",
      borderBottom: "1px solid var(--r-border-soft)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Task list ────────────────────────────────────────────────────────────────

function TaskList({ tasks, navigate }: { tasks: MissionTask[]; navigate: NavFn }) {
  if (tasks.length === 0) return <EmptySlate label="no tasks" />;

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
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--r-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.01em",
            }}>
              {task.intent}
            </div>
            <div style={{
              fontSize: "10px",
              color: "var(--r-dim)",
              marginTop: "1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "0.02em",
            }}>
              {task.title}
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
                padding: "2px 6px",
                borderRadius: "2px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-subtext)",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.04em",
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
  if (pending.length === 0) return <EmptySlate label="no handoffs" />;

  return (
    <div>
      {pending.map((h) => (
        <Row key={h.id}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "11px",
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
              padding: "2px 6px",
              borderRadius: "2px",
              border: "1px solid var(--r-border)",
              background: "transparent",
              color: "var(--r-subtext)",
              fontSize: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            receive
          </button>
          <button
            onClick={() => onReject(h.id, "declined by operator")}
            style={{
              padding: "2px 6px",
              borderRadius: "2px",
              border: "1px solid var(--r-border)",
              background: "transparent",
              color: "var(--r-subtext)",
              fontSize: "10px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
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
  if (live.length === 0) return <EmptySlate label="no flows" />;

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
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--r-text)",
                }}>
                  {flow.label}
                </span>
              </div>
              <Pill color={FLOW_STATUS_COLOR[flow.status]} label={FLOW_STATUS_LABEL[flow.status]} />
            </div>

            {/* Execution progress */}
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "2px", background: "var(--r-border)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: FLOW_STATUS_COLOR[flow.status],
                  borderRadius: "2px",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <span style={{
                fontSize: "9px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--r-dim)",
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}>
                {done}/{total}
              </span>
            </div>

            {/* Execution trace — phase sequence */}
            <div style={{ display: "flex", alignItems: "center", gap: "0", flexWrap: "wrap" }}>
              {flow.phases.map((phase, idx) => (
                <span key={phase.id} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: phase.status === "active" ? "9px" : "10px",
                      padding: "2px 8px",
                      borderRadius: "3px",
                      background: phase.status === "active"    ? "color-mix(in srgb, var(--r-ok) 14%, transparent)"
                                : phase.status === "completed" ? "transparent"
                                : phase.status === "blocked"   ? "color-mix(in srgb, var(--r-err) 14%, transparent)"
                                : "transparent",
                      border: phase.status === "active"    ? "1px solid color-mix(in srgb, var(--r-ok) 32%, transparent)"
                            : phase.status === "completed" ? "1px solid transparent"
                            : phase.status === "blocked"   ? "1px solid color-mix(in srgb, var(--r-err) 28%, transparent)"
                            : "1px solid transparent",
                      color: phase.status === "active"    ? "var(--r-ok)"
                           : phase.status === "completed" ? "var(--r-dim)"
                           : phase.status === "blocked"   ? "var(--r-err)"
                           : "color-mix(in srgb, var(--r-subtext) 35%, transparent)",
                      fontWeight: phase.status === "active" ? 600 : 400,
                      letterSpacing: "0.04em",
                      textTransform: phase.status === "active" ? "uppercase" : "none",
                      fontFamily: phase.status === "active" ? "'JetBrains Mono', monospace" : "inherit",
                    }}
                  >
                    {phase.label}
                  </span>
                  {idx < flow.phases.length - 1 && (
                    <span style={{
                      fontSize: "9px",
                      color: "color-mix(in srgb, var(--r-dim) 35%, transparent)",
                      padding: "0 1px",
                      userSelect: "none",
                    }}>→</span>
                  )}
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
  if (live.length === 0) return <EmptySlate label="no signals" />;

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
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <div style={{
                fontSize: "11px",
                fontWeight: 600,
                color: sig.severity === "critical" ? "var(--r-err)"
                     : sig.severity === "warn"     ? "var(--r-warn)"
                     : "var(--r-text)",
                letterSpacing: "0.01em",
              }}>
                {SIGNAL_KIND_LABEL[sig.kind]}
              </div>
              {sig.chamber && (
                <span style={{
                  fontSize: "9px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--r-dim)",
                }}>
                  {sig.chamber}
                </span>
              )}
            </div>
            <div style={{
              fontSize: "10px",
              color: "var(--r-subtext)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "1px",
            }}>
              {sig.body}
            </div>
          </div>
          {!sig.read && (
            <button
              onClick={() => onRead(sig.id)}
              style={{
                padding: "1px 5px",
                borderRadius: "2px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                fontSize: "9px",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              read
            </button>
          )}
          {sig.actionRoute && (
            <button
              onClick={() => navigate(sig.actionRoute!.tab, sig.actionRoute!.view, sig.actionRoute?.id)}
              style={{
                padding: "1px 5px",
                borderRadius: "2px",
                border: "1px solid color-mix(in srgb, var(--r-accent) 40%, var(--r-border))",
                background: "transparent",
                color: "var(--r-accent)",
                fontSize: "9px",
                fontFamily: "'JetBrains Mono', monospace",
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
                padding: "1px 5px",
                borderRadius: "2px",
                border: "1px solid var(--r-border)",
                background: "transparent",
                color: "var(--r-dim)",
                fontSize: "9px",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
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
  if (recent.length === 0) return <EmptySlate label="clear" />;

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
                display: "flex",
                gap: "8px",
                alignItems: "baseline",
              }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: resultColor,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {GOV_ACTION_LABEL[rec.action]}
                </span>
                <span style={{ color: "var(--r-dim)", fontWeight: 400, fontSize: "10px", letterSpacing: "0.01em" }}>
                  — {rec.triggeredBy}
                </span>
              </div>
              <div style={{
                fontSize: "10px",
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
              <Pill color="var(--r-warn)" label="executing" />
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
    marginBottom: "18px",
  };

  const sectionBorder: CSSProperties = {
    borderTop: "1px solid var(--r-border)",
  };

  return (
    <div style={containerStyle}>
      {/* Status line */}
      <div style={{
        padding: "0 0 10px 0",
        marginBottom: "14px",
        borderBottom: "1px solid var(--r-border)",
        display: "flex",
        alignItems: "baseline",
        gap: "12px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "8px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        <span style={{
          color: requiresAttention ? "var(--r-warn)" : "var(--r-dim)",
        }}>
          {requiresAttention ? "attention required" : "nominal"}
        </span>
        <span style={{ color: "var(--r-dim)" }}>
          {activeTasks.length} active
        </span>
        {blockedTasks.length > 0 && (
          <span style={{ color: "var(--r-err)" }}>
            {blockedTasks.length} blocked
          </span>
        )}
        <span style={{ color: "var(--r-dim)" }}>
          {flows.filter((f) => f.status === "active").length} flows
        </span>
        {pendingHandoffs.length > 0 && (
          <span style={{ color: "var(--r-warn)" }}>
            {pendingHandoffs.length} handoffs
          </span>
        )}
      </div>

      {/* Mission tasks */}
      <div style={sectionStyle}>
        <SectionLabel>Tasks</SectionLabel>
        <div style={sectionBorder}>
          <TaskList tasks={activeTasks} navigate={navigate} />
        </div>
      </div>

      {/* Mission blockers */}
      {blockedTasks.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Blocked</SectionLabel>
          <div style={sectionBorder}>
            <TaskList tasks={blockedTasks} navigate={navigate} />
          </div>
        </div>
      )}

      {/* Execution flows */}
      <div style={sectionStyle}>
        <SectionLabel>Flows</SectionLabel>
        <div style={sectionBorder}>
          <FlowList flows={flows} />
        </div>
      </div>

      {/* Mission handoffs */}
      {pendingHandoffs.length > 0 && (
        <div style={sectionStyle}>
          <SectionLabel>Handoffs</SectionLabel>
          <div style={sectionBorder}>
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
        <div style={sectionBorder}>
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
        <SectionLabel>Governance</SectionLabel>
        <div style={sectionBorder}>
          <GovernanceTrail records={governance} />
        </div>
      </div>
    </div>
  );
}
