import { type Message, type MessageExecutionTrace, type NavFn, type Tab, type ProfileView } from "../shell-types";
import { type Mission } from "../../dna/mission-substrate";
import { MissionRepository } from "../MissionRepository";
import { MissionOperationsPanel } from "../MissionOperationsPanel";
import { findObject, listObjectsForChamber, mergeObjectsByRecency, openObject, type RuberraObject } from "../object-graph";
import { type CSSProperties, useState } from "react";
import {
  type ContinuityItem,
  type ConnectorState,
  type ContinuityRecommendation,
  type PreferenceState,
  type RewardRecord,
  type RuntimeSignal,
  type PluginRuntimeState,
  type AISettingsState,
  type WorkspaceKnowledge,
  type RuntimeFabric,
} from "../runtime-fabric";
import { PIONEER_REGISTRY, getVisiblePioneers, getPioneerFromRuntimeId, type Pioneer } from "../pioneer-registry";
import {
  CONNECTOR_REGISTRY,
  CONNECTOR_CATEGORY_LABELS,
  CONNECTOR_CATEGORY_ORDER,
  type ConnectorDefinition,
  type ConnectorCategory,
} from "../connector-registry";
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from "../workflow-engine";
import { OperationsPanel } from "../OperationsPanel";
import {
  defaultAutonomousOperationsState,
  type AutonomousOperationsState,
} from "../autonomous-operations";
import { SovereignEmptyFrame, emptyActionBtn } from "../SovereignEmptyFrame";
import { ExecutionConsequenceStrip } from "../ExecutionConsequenceStrip";
import { GovernanceLedgerStrip } from "../GovernanceLedgerStrip";
import { FlowRunStrip } from "../FlowRunStrip";
import { AgentCivilizationStrip } from "../AgentCivilizationStrip";
import { AnalyticsPatternStrip } from "../AnalyticsPatternStrip";
import { KnowledgeGraphStrip } from "../KnowledgeGraphStrip";
import { CollectiveExecutionStrip } from "../CollectiveExecutionStrip";
import { DistributionPresenceStrip } from "../DistributionPresenceStrip";
import { ValueExchangeStrip } from "../ValueExchangeStrip";
import { EcosystemNetworkStrip } from "../EcosystemNetworkStrip";
import { PlatformInfraStrip } from "../PlatformInfraStrip";
import { OrgIntelligenceStrip } from "../OrgIntelligenceStrip";
import { PersonalSovereignOSStrip } from "../PersonalSovereignOSStrip";
import { CompoundNetworkStrip } from "../CompoundNetworkStrip";
import { type AgentCivilization } from "../../dna/multi-agent";
import { type AnalyticsPattern } from "../../dna/intelligence-analytics";
import { type KnowledgeGraph } from "../../dna/living-knowledge";
import { type CollectiveState } from "../../dna/collective-execution";
import { type PresenceManifest } from "../../dna/distribution-presence";
import { type ExchangeLedger } from "../../dna/value-exchange";
import { type EcosystemNetworkState } from "../../dna/ecosystem-network";
import { type PlatformInfraState } from "../../dna/platform-infrastructure";
import { type OrgIntelligenceState } from "../../dna/org-intelligence";
import { type PersonalSovereignOSState } from "../../dna/personal-sovereign-os";
import { type CompoundNetwork } from "../../dna/compound-intelligence";
import { type AuditEntry, type ConsequenceRecord } from "../../dna/trust-governance";
import { type AutonomousFlowState } from "../../dna/autonomous-flow";
import { type SystemModel } from "../../dna/system-awareness";
import { type MissionOperationsState } from "../../dna/autonomous-operations";
import {
  PROVIDER_ADAPTERS,
  SOVEREIGN_MODEL_REGISTRY,
  CHAMBER_SOVEREIGN_DEFAULTS,
  getChamberRuntimeSummary,
  getExecutionTruth,
  TIER_LABEL,
  TIER_COLOR,
  TIER_DESCRIPTION,
  type ProviderAdapter,
  type SovereignModel,
  type RuntimeTier,
} from "../sovereign-runtime";

interface ProfileModeProps {
  messages: Record<Tab, Message[]>;
  profileView: ProfileView;
  onProfileView: (view: ProfileView) => void;
  navigate: NavFn;
  continuity: ContinuityItem[];
  signals: RuntimeSignal[];
  rewards: RewardRecord[];
  connectors: ConnectorState[];
  preferences: PreferenceState;
  aiSettings: AISettingsState;
  plugins: PluginRuntimeState[];
  workspace: WorkspaceKnowledge;
  intelligence: RuntimeFabric["intelligence"];
  objects: RuberraObject[];
  recommendations: ContinuityRecommendation[];
  onTransfer: (continuityId: string, to: Exclude<Tab, "profile">, reason: string) => void;
  onResume: (continuityId: string) => void;
  onToggleConnector: (connectorId: string, enabled: boolean) => void;
  onTogglePlugin: (pluginId: string, enabled: boolean) => void;
  onPreferencePatch: (patch: Partial<PreferenceState>) => void;
  onAISettingsPatch: (patch: Partial<AISettingsState>) => void;
  onWorkspacePatch: (patch: Partial<WorkspaceKnowledge>) => void;
  onExport: (continuityId: string) => void;
  missions: Mission[];
  onMissionUpsert: (m: Mission) => void;
  onMissionActivate: (missionId: string) => void;
  /** Stack 02 — Mission-scoped operations. Present when a mission is active. */
  activeMissionId?: string | null;
  activeMissionOps?: MissionOperationsState | null;
  onMissionOpsSignalDismiss?: (signalId: string) => void;
  onMissionOpsApprovalApprove?: (requestId: string) => void;
  onMissionOpsApprovalReject?: (requestId: string) => void;
  /** Stack 04 — Autonomous Operations state. Optional; defaults to empty state when not yet wired. */
  operations?: AutonomousOperationsState;
  onOperationSignalRead?:    (id: string) => void;
  onOperationSignalResolve?: (id: string) => void;
  onHandoffAccept?:          (id: string) => void;
  onHandoffReject?:          (id: string, reason: string) => void;
  // Stack substrate strips
  civilization?:      AgentCivilization;
  analyticsPatterns?: AnalyticsPattern[];
  knowledgeGraph?:    KnowledgeGraph;
  collectiveState?:   CollectiveState;
  presenceManifest?:  PresenceManifest;
  exchangeLedger?:    ExchangeLedger;
  ecosystemState?:    EcosystemNetworkState;
  platformState?:     PlatformInfraState;
  orgState?:          OrgIntelligenceState;
  personalOS?:        PersonalSovereignOSState;
  compoundNetwork?:   CompoundNetwork;
  governanceEntries?:       AuditEntry[];
  governanceConsequences?:  ConsequenceRecord[];
  flowState?:               AutonomousFlowState;
  systemModel?:             SystemModel;
  distributionLedger?:      Array<{ id: string; continuityId: string; title: string; publishedAt: number; uri: string; checksum: string }>;
}

type WorkStatus = "in_progress" | "paused" | "completed";
interface WorkItem {
  id: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  status: WorkStatus;
  route: { tab: Exclude<Tab, "profile">; view: string; id?: string };
}

const CHAMBER_COLOR: Record<string, string> = {
  lab:      "var(--chamber-lab)",
  school:   "var(--chamber-school)",
  creation: "var(--chamber-creation)",
};

const STATUS_COLOR: Record<WorkStatus, string> = {
  in_progress: "var(--r-ok)",
  paused:      "var(--r-warn)",
  completed:   "var(--r-dim)",
};

function meshTraceAndChamber(
  messages: Record<Tab, Message[]>,
): { trace: MessageExecutionTrace; chamber: Exclude<Tab, "profile"> } | null {
  const chambers: Exclude<Tab, "profile">[] = ["lab", "school", "creation"];
  let best: { msg: Message; chamber: Exclude<Tab, "profile"> } | null = null;
  for (const ch of chambers) {
    const asst = [...messages[ch]].reverse().find((m) => m.role === "assistant" && m.execution_trace);
    if (!asst?.execution_trace) continue;
    if (!best || asst.timestamp > best.msg.timestamp) best = { msg: asst, chamber: ch };
  }
  if (!best) return null;
  return { trace: best.msg.execution_trace!, chamber: best.chamber };
}

function deriveWorkItems(messages: Record<Tab, Message[]>): WorkItem[] {
  const chambers: Exclude<Tab, "profile">[] = ["school", "lab", "creation"];
  const items: WorkItem[] = [];
  for (const chamber of chambers) {
    const chamberMessages = messages[chamber];
    if (!chamberMessages.length) continue;
    const lastUser = [...chamberMessages].reverse().find((m) => m.role === "user");
    const lastAssistant = [...chamberMessages].reverse().find((m) => m.role === "assistant" && m.content.trim().length > 0);
    if (!lastUser) continue;
    items.push({
      id:      lastUser.id,
      title:   lastUser.content.slice(0, 90),
      chamber,
      status:  lastAssistant ? "completed" : "in_progress",
      route:   { tab: chamber, view: chamber === "creation" ? "terminal" : "chat" },
    });
    if (chamberMessages.length > 4) {
      items.push({
        id:     chamber + "-paused",
        title:  "Resume previous " + chamber + " chain",
        chamber,
        status: "paused",
        route:  { tab: chamber, view: "archive" },
      });
    }
  }
  return items;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", padding: "12px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", margin: "0 0 8px", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ fontSize: "20px", margin: 0, color: "var(--r-text)", fontWeight: 600 }}>{value}</p>
    </div>
  );
}

const btn: CSSProperties = {
  border:       "1px solid var(--r-border)",
  background:   "transparent",
  fontSize:     "10px",
  fontFamily:   "'JetBrains Mono', monospace",
  padding:      "3px 10px",
  borderRadius: "4px",
  cursor:       "pointer",
  outline:      "none",
  color:        "var(--r-subtext)",
  letterSpacing:"0.04em",
  transition:   "background 0.1s ease, color 0.1s ease",
};

function SectionBlock({ title, empty, children }: { title: string; empty?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "14px", border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", overflow: "hidden" }}>
      <div style={{ padding: "9px 14px", borderBottom: "1px solid var(--r-border-soft)", background: "var(--r-elevated)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9px", letterSpacing: "0.12em", color: "var(--r-dim)", textTransform: "uppercase" }}>{title}</span>
      </div>
      <div style={{ padding: empty ? "12px 14px" : "0" }}>
        {children}
      </div>
    </div>
  );
}

function WorkRow({ item, navigate, continuity, onTransfer }: {
  item: WorkItem;
  navigate: NavFn;
  continuity?: ContinuityItem[];
  onTransfer?: (id: string, to: Exclude<Tab, "profile">, reason: string) => void;
}) {
  const transfers = continuity && onTransfer
    ? continuity.find((c) => c.id === item.id)?.transferDestinations ?? []
    : [];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid var(--r-border-soft)", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: STATUS_COLOR[item.status], flexShrink: 0, display: "inline-block" }} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.005em" }}>{item.title}</p>
          <p style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            <span style={{ color: CHAMBER_COLOR[item.chamber] }}>{item.chamber}</span> · {item.status.replace("_", " ")}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
        <button onClick={() => navigate(item.route.tab, item.route.view, item.route.id)} style={btn}>Resume</button>
        {transfers.slice(0, 1).map((dest) => (
          <button key={dest} onClick={() => onTransfer!(item.id, dest, "profile_transfer")} style={{ ...btn, color: CHAMBER_COLOR[dest] ?? "var(--r-subtext)" }}>
            → {dest}
          </button>
        ))}
      </div>
    </div>
  );
}

function ConnectorRow({ connector, onToggle }: { connector: ConnectorState; onToggle: (id: string, enabled: boolean) => void }) {
  const statusColor = connector.status === "ready" ? "var(--r-ok)"
    : connector.status === "needs_config" ? "var(--r-warn)"
    : "var(--r-dim)";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ width: "5px", height: "5px", borderRadius: "1px", background: statusColor, flexShrink: 0, display: "inline-block" }} />
        <div>
          <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.005em" }}>{connector.label}</p>
          <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", margin: "2px 0 0", letterSpacing: "0.05em" }}>
            {connector.status} · {connector.completeness}% ready
          </p>
        </div>
      </div>
      <button onClick={() => onToggle(connector.id, !connector.enabled)} style={{ ...btn, color: connector.enabled ? "var(--r-ok)" : "var(--r-subtext)" }}>
        {connector.enabled ? "Active" : "Enable"}
      </button>
    </div>
  );
}

// ─── Connector card (for connector-registry ConnectorDefinition rows) ──────────

const CONNECTOR_STATUS_COLOR: Record<string, string> = {
  connected:    "var(--r-ok)",
  available:    "var(--r-subtext)",
  coming_soon:  "var(--r-dim)",
  disconnected: "var(--r-warn)",
};

function ConnectorCard({ connector }: { connector: ConnectorDefinition }) {
  const statusColor = CONNECTOR_STATUS_COLOR[connector.status] || "var(--r-dim)";
  const accentStr   = connector.accent;
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
      <div style={{ width: "28px", height: "28px", borderRadius: "2px", background: accentStr + "14", border: "1px solid " + accentStr + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "13px", color: accentStr }}>{connector.icon_char}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.005em" }}>{connector.name}</span>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: statusColor, border: "1px solid " + statusColor + "28", borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.07em", textTransform: "uppercase" as const }}>
              {connector.status.replace("_", " ")}
            </span>
          </div>
          <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
            {connector.capabilities.map((cap) => (
              <span key={cap} style={{ fontSize: "7.5px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "2px", padding: "0 4px", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{cap}</span>
            ))}
          </div>
        </div>
        <p style={{ fontSize: "10.5px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: "0 0 5px", lineHeight: "1.5" }}>{connector.description}</p>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {connector.organs.map((o) => (
            <span key={o} style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[o] || "var(--r-dim)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>{o}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Workflow card (from workflow-engine canonical templates) ──────────────────

function WorkflowCard({ template, navigate }: { template: WorkflowTemplate; navigate: NavFn }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "2px", background: "var(--r-surface)", marginBottom: "8px", overflow: "hidden" }}>
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => { if (e.key === "Enter") setExpanded(v => !v); }}
        style={{ padding: "12px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", cursor: "pointer" }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.01em" }}>{template.name}</p>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", color: template.badge_color, background: `${template.badge_color}12`, border: `1px solid ${template.badge_color}28`, borderRadius: "3px", padding: "1px 6px", textTransform: "uppercase" }}>
              {template.badge}
            </span>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: template.estimated_quality === "elite" ? "var(--r-ok)" : "var(--r-subtext)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {template.estimated_quality}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: "1.55" }}>{template.purpose}</p>
        </div>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0, alignItems: "flex-start", flexWrap: "wrap" }}>
          {template.participating_chambers.map((c) => (
            <span key={c} style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[c] ?? "var(--r-dim)", background: `${CHAMBER_COLOR[c] ?? "#888"}12`, border: `1px solid ${CHAMBER_COLOR[c] ?? "#888"}20`, borderRadius: "3px", padding: "2px 5px", letterSpacing: "0.05em" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
      {/* Expanded stage view */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--r-border-soft)", background: "var(--r-elevated)" }}>
          {template.stages.map((stage, i) => (
            <div key={stage.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 14px", borderBottom: i < template.stages.length - 1 ? "1px solid var(--r-border-soft)" : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "3px" }}>
                <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[stage.chamber] ?? "var(--r-dim)", background: `${CHAMBER_COLOR[stage.chamber] ?? "#888"}14`, border: `1px solid ${CHAMBER_COLOR[stage.chamber] ?? "#888"}20`, borderRadius: "2px", padding: "0 4px", letterSpacing: "0.05em", minWidth: "24px", textAlign: "center" }}>
                  {i + 1}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{stage.label}</span>
                  {stage.optional && (
                    <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.06em" }}>optional</span>
                  )}
                </div>
                <p style={{ fontSize: "10.5px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: "1.5" }}>{stage.description}</p>
              </div>
            </div>
          ))}
          <div style={{ padding: "8px 14px", display: "flex", gap: "6px" }}>
            <button onClick={() => navigate(template.home_chamber, "chat")} style={btn}>Start in {template.home_chamber}</button>
            <button onClick={() => navigate(template.home_chamber, "home")} style={btn}>Open {template.home_chamber}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pioneer card ─────────────────────────────────────────────────────────────

function PioneerCard({ pioneer, navigate }: { pioneer: Pioneer; navigate: NavFn }) {
  const [expanded, setExpanded] = useState(false);
  const hostingColor = pioneer.hosting_level === "hosted" ? "var(--r-ok)"
    : pioneer.hosting_level === "wrapped" ? "var(--r-subtext)"
    : "var(--r-warn)";
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "7px", background: "var(--r-surface)", marginBottom: "8px", overflow: "hidden" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => { if (e.key === "Enter") setExpanded(v => !v); }}
        style={{ padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}>{pioneer.name}</span>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: pioneer.accent, background: `${pioneer.accent}10`, border: `1px solid ${pioneer.accent}20`, borderRadius: "3px", padding: "1px 6px", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {pioneer.short_role}
            </span>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: hostingColor, border: `1px solid ${hostingColor}28`, borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {pioneer.hosting_level}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: "1.5" }}>{pioneer.description}</p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[pioneer.home_chamber] ?? "var(--r-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {pioneer.home_chamber}
          </span>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid var(--r-border-soft)", background: "var(--r-elevated)", padding: "10px 14px" }}>
          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 5px" }}>Strengths</p>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {pioneer.strengths.map((s) => (
                <span key={s} style={{ fontSize: "10px", fontFamily: "'Inter', system-ui, sans-serif", color: "var(--r-subtext)", border: "1px solid var(--r-border)", borderRadius: "3px", padding: "1px 7px" }}>{s}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 5px" }}>Triggers</p>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {pioneer.default_triggers.map((t) => (
                <span key={t} style={{ fontSize: "10px", fontFamily: "'Inter', system-ui, sans-serif", color: "var(--r-subtext)", border: "1px solid var(--r-border)", borderRadius: "3px", padding: "1px 7px" }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 5px" }}>Model Family</p>
            <span style={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-subtext)" }}>{pioneer.model_family}</span>
          </div>
          {pioneer.selectable && (
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--r-border-soft)" }}>
              <button onClick={() => navigate(pioneer.home_chamber, "chat")} style={btn}>Open {pioneer.home_chamber} Chat</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export function ProfileMode({
  messages, profileView, onProfileView, navigate, continuity, signals, rewards, connectors, preferences, aiSettings, plugins, workspace, intelligence: _intelligence, objects, recommendations, onTransfer, onResume, onToggleConnector, onTogglePlugin, onPreferencePatch, onAISettingsPatch, onWorkspacePatch, onExport, missions, onMissionUpsert, onMissionActivate,
  activeMissionId,
  activeMissionOps,
  onMissionOpsSignalDismiss,
  onMissionOpsApprovalApprove,
  onMissionOpsApprovalReject,
  operations: operationsProp,
  onOperationSignalRead,
  onOperationSignalResolve,
  onHandoffAccept,
  onHandoffReject,
  civilization,
  analyticsPatterns,
  knowledgeGraph,
  collectiveState,
  presenceManifest,
  exchangeLedger,
  ecosystemState,
  platformState,
  orgState,
  personalOS,
  compoundNetwork,
  governanceEntries,
  governanceConsequences,
  flowState,
  systemModel,
  distributionLedger,
}: ProfileModeProps) {
  const operations = operationsProp ?? defaultAutonomousOperationsState();
  const derivedWork = deriveWorkItems(messages);
  const continuityWork: WorkItem[] = continuity.map((item) => ({
    id:      item.id,
    title:   item.title,
    chamber: item.chamber,
    status:  item.status === "paused" ? "paused" : item.status === "completed" || item.status === "exported" ? "completed" : "in_progress",
    route:   item.route,
  }));
  const workItems = [...continuityWork, ...derivedWork.filter((w) => !continuityWork.some((c) => c.id === w.id))];
  const active    = workItems.filter((w) => w.status === "in_progress");
  const paused    = workItems.filter((w) => w.status === "paused");
  const completed = workItems.filter((w) => w.status === "completed");
  const exportables = continuity.filter((c) => c.status === "completed" || c.status === "validated");
  const exported    = continuity.filter((c) => c.status === "exported");
  const memoryItems = mergeObjectsByRecency(
    objects,
    listObjectsForChamber("school"),
    listObjectsForChamber("lab"),
    listObjectsForChamber("creation"),
  ).slice(0, 24);
  const meshMeta = meshTraceAndChamber(messages);
  const meshTrace = meshMeta?.trace ?? null;
  const meshChamber = meshMeta?.chamber;
  const meshAccent = meshChamber ? CHAMBER_COLOR[meshChamber] : "var(--r-accent-soft)";
  const meshTruth = meshChamber ? getExecutionTruth(meshChamber) : null;
  const meshLeadShort =
    meshTrace?.leadPioneerId != null
      ? getPioneerFromRuntimeId(meshTrace.leadPioneerId)?.short_role ?? meshTrace.leadPioneerId
      : undefined;
  const ledgerRows = continuity.filter((c) => c.lastRunDigest);

  const NAV_VIEWS: ProfileView[] = ["overview", "projects", "pioneers", "workflows", "connectors", "operations", "memory", "settings", "exports"];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--r-bg)" }} className="hide-scrollbar">

      {/* Profile header */}
      <div style={{ borderBottom: "1px solid var(--r-border)", background: "var(--r-surface)", padding: "12px 24px 0", flexShrink: 0 }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "2px",
                  background: "linear-gradient(145deg, color-mix(in srgb, var(--r-subtext) 35%, var(--r-surface)) 0%, color-mix(in srgb, var(--r-dim) 40%, var(--r-surface)) 100%)",
                  border: "1px solid var(--r-border-soft)",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.01em" }}>
                  {workspace.owner}
                </p>
                <p style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0", letterSpacing: "0.05em" }}>
                  {workspace.activeProject} · {preferences.preferredChamber} first
                </p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", alignItems: "center", justifyContent: "flex-end" }}>
              {([
                { label: "Active",   value: active.length,                            color: "var(--r-ok)"   },
                { label: "Paused",   value: paused.length,                            color: "var(--r-warn)" },
                { label: "Signals",  value: signals.filter(s => !s.read).length,      color: "var(--r-accent)" },
                { label: "Memory",   value: memoryItems.length,                       color: "var(--r-dim)"  },
              ]).map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "4px 8px",
                    minWidth: "52px",
                    border: "1px solid var(--r-border-soft)",
                    borderRadius: "2px",
                    background: "var(--r-elevated)",
                  }}
                >
                  <p style={{ fontSize: "13px", fontWeight: 600, color: stat.color, margin: 0, lineHeight: 1, fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.02em" }}>{stat.value}</p>
                  <p style={{ fontSize: "7px", color: "var(--r-dim)", margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {meshTrace && meshChamber && (
            <div style={{ maxWidth: "880px", margin: "0 auto 10px", padding: "0 2px" }}>
              <p style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.11em", textTransform: "uppercase", color: "var(--r-dim)", margin: "0 0 6px" }}>
                Neural mesh · last execution · <span style={{ color: meshAccent }}>{meshChamber}</span>
              </p>
              <ExecutionConsequenceStrip
                trace={meshTrace}
                accent={meshAccent}
                compact
                showResultDepth={4}
                leadPioneerShort={meshLeadShort}
                giName={meshTrace.giLabel ?? meshTrace.giId}
                tierLabel={meshTruth ? TIER_LABEL[meshTruth.tier] : undefined}
                tierColor={meshTruth ? TIER_COLOR[meshTruth.tier] : undefined}
                modelTruthLabel={meshTruth?.tier_label}
              />
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0" }}>
            {NAV_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => onProfileView(v)}
                style={{
                  padding: "7px 14px",
                  border: "none",
                  borderBottom: profileView === v ? "2px solid color-mix(in srgb, var(--r-subtext) 45%, var(--r-border))" : "2px solid transparent",
                  background: "transparent",
                  fontSize: "11px",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: profileView === v ? 500 : 400,
                  color: profileView === v ? "var(--r-text)" : "var(--r-subtext)",
                  cursor: "pointer",
                  outline: "none",
                  letterSpacing: "-0.005em",
                  transition: "color 0.12s ease",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "20px 30px 48px" }}>

        {/* ── OVERVIEW ── */}
        {profileView === "overview" && (
          <>
            {active.length > 0 && (
              <SectionBlock title="Active Work">
                {active.map((item) => <WorkRow key={item.id} item={item} navigate={navigate} continuity={continuity} onTransfer={onTransfer} />)}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {paused.length > 0 && (
              <SectionBlock title="Paused Work">
                {paused.map((item) => <WorkRow key={item.id} item={item} navigate={navigate} />)}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {active.length === 0 && paused.length === 0 && (
              <SectionBlock title="Work Queue" empty>
                <div style={{ padding: "4px 0 8px" }}>
                  <SovereignEmptyFrame
                    align="left"
                    accentVar="var(--r-accent-soft)"
                    kicker="Profile · orchestration ledger"
                    title="No active work threads"
                    body="The ledger stays empty until Lab, School, or Creation carries a live user message chain. Continuity and signals will populate here as you operate the shell."
                    actions={emptyActionBtn(() => navigate("lab", "chat"), "Open Lab", "var(--r-accent-soft)")}
                  />
                </div>
              </SectionBlock>
            )}
            {ledgerRows.length > 0 && (
              <SectionBlock title="Run ledger — continuity consequence">
                {ledgerRows.slice(0, 8).map((row) => (
                  <div key={row.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)", gap: "10px" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.005em" }}>{row.title}</p>
                      <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", margin: "3px 0 0", letterSpacing: "0.04em" }}>
                        <span style={{ color: CHAMBER_COLOR[row.chamber] }}>{row.chamber}</span>
                        {row.lastExecutionState && (
                          <>
                            {" "}
                            · <span style={{ color: "var(--r-subtext)" }}>{row.lastExecutionState}</span>
                          </>
                        )}
                        {row.lastModelId && ` · ${row.lastModelId}`}
                      </p>
                      {row.lastRunDigest && (
                        <p style={{ fontSize: "9px", color: "var(--r-subtext)", fontFamily: "'JetBrains Mono', monospace", margin: "4px 0 0", lineHeight: 1.4 }}>{row.lastRunDigest}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => navigate(row.route.tab, row.route.view, row.route.id)} style={btn}>Open</button>
                  </div>
                ))}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {recommendations.length > 0 && (
              <SectionBlock title="Continuity Recommendations">
                {recommendations.slice(0, 6).map((item) => (
                  <div key={`${item.continuityId}-${item.action}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)", gap: "10px" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.005em" }}>{item.title}</p>
                      <p style={{ fontSize: "10px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", margin: "2px 0 0" }}>{item.reason}</p>
                    </div>
                    <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                      {item.action === "resume"   && <button onClick={() => onResume(item.continuityId)}                                                                                                   style={btn}>Resume</button>}
                      {item.action === "export"   && <button onClick={() => onExport(item.continuityId)}                                                                                                   style={btn}>Export</button>}
                      {item.action === "transfer" && item.destination.tab !== "profile" && <button onClick={() => onTransfer(item.continuityId, item.destination.tab as Exclude<Tab, "profile">, "profile_recommendation")} style={btn}>Transfer</button>}
                      <button onClick={() => navigate(item.destination.tab, item.destination.view, item.destination.id)} style={btn}>Open</button>
                    </div>
                  </div>
                ))}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {signals.filter(s => !s.read).length > 0 && (
              <SectionBlock title="Signals">
                {signals.filter(s => !s.read).slice(0, 5).map((signal) => (
                  <div key={signal.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: signal.severity === "critical" ? "var(--r-err)" : signal.severity === "warn" ? "var(--r-warn)" : "var(--r-ok)", display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{signal.label}</span>
                    </div>
                    <button onClick={() => navigate(signal.destination.tab, signal.destination.view, signal.destination.id)} style={btn}>Open</button>
                  </div>
                ))}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {rewards.length > 0 && (
              <SectionBlock title="Milestones">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "10px 14px" }}>
                  {rewards.slice(0, 6).map((r) => (
                    <div key={r.id} style={{ border: "1px solid var(--r-border)", borderRadius: "5px", padding: "6px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{r.kind}</span>
                      <span style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{r.title}</span>
                      <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-ok)" }}>+{r.points}</span>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            )}
            {analyticsPatterns && analyticsPatterns.length > 0 && (
              <SectionBlock title="Intelligence Analytics">
                <div style={{ padding: "10px 14px" }}>
                  <AnalyticsPatternStrip patterns={analyticsPatterns} />
                </div>
              </SectionBlock>
            )}
            {orgState && (
              <SectionBlock title="Org Intelligence">
                <div style={{ padding: "10px 14px" }}>
                  <OrgIntelligenceStrip org={orgState} />
                </div>
              </SectionBlock>
            )}
            {platformState && (
              <SectionBlock title="Platform Infrastructure">
                <div style={{ padding: "10px 14px" }}>
                  <PlatformInfraStrip platform={platformState} />
                </div>
              </SectionBlock>
            )}
            {/* Stack 08 — System Awareness: health inspection surface */}
            {systemModel && (
              <SectionBlock title={`System Health · ${systemModel.health}`}>
                <div style={{ padding: "10px 14px" }}>
                  {systemModel.anomalies.filter(a => !a.resolved).length === 0 ? (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
                      no active anomalies
                    </span>
                  ) : (
                    systemModel.anomalies.filter(a => !a.resolved).map(a => (
                      <div key={a.id} style={{ padding: "4px 0", borderBottom: "1px solid var(--r-border-soft)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: a.severity === "high" ? "var(--r-err)" : "var(--r-warn)", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0, paddingTop: "1px" }}>
                          {a.severity}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "8px", color: "var(--r-subtext)", letterSpacing: "0.03em", lineHeight: 1.4 }}>
                          {a.description}
                        </span>
                      </div>
                    ))
                  )}
                  <div style={{ paddingTop: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: "7.5px", color: "var(--r-dim)", letterSpacing: "0.04em" }}>
                    snapshot · {new Date(systemModel.snapshot.at).toLocaleTimeString()}
                  </div>
                </div>
              </SectionBlock>
            )}
          </>
        )}

        {/* ── PROJECTS ── */}
        {profileView === "projects" && (
          <>
            <MissionRepository missions={missions} onUpsert={onMissionUpsert} onActivate={onMissionActivate} navigate={navigate} />
            <SectionBlock title="Workflow Templates — Orchestration">
              {WORKFLOW_TEMPLATES.map((t) => <WorkflowCard key={t.id} template={t} navigate={navigate} />)}
            </SectionBlock>
            <SectionBlock title="All Work">
              {workItems.length === 0 ? (
                <div style={{ padding: "6px 14px 12px" }}>
                  <SovereignEmptyFrame
                    align="left"
                    accentVar="var(--r-accent-soft)"
                    kicker="Projects · work graph"
                    title="No indexed work items"
                    body="Cross-chamber threads appear after you send prompts in Lab, School, or Creation. This list is derived from real sessions — not seeded filler."
                    actions={emptyActionBtn(() => navigate("school", "home"), "Enter School", "var(--r-accent-soft)")}
                  />
                </div>
              ) : workItems.map((item) => <WorkRow key={item.id} item={item} navigate={navigate} continuity={continuity} onTransfer={onTransfer} />)}
              <div style={{ height: "1px" }} />
            </SectionBlock>
            <SectionBlock title="Connectors">
              {connectors.length === 0 ? (
                <div style={{ padding: "6px 14px 12px" }}>
                  <SovereignEmptyFrame
                    align="left"
                    accentVar="var(--r-accent-soft)"
                    kicker="Connectors"
                    title="No connector rows in fabric"
                    body="Runtime fabric ships with connector slots; enable them from this row when present. Until then, the control surface stays explicit about the gap."
                    actions={emptyActionBtn(() => navigate("profile", "settings"), "Open settings", "var(--r-accent-soft)")}
                  />
                </div>
              ) : connectors.map((c) => <ConnectorRow key={c.id} connector={c} onToggle={onToggleConnector} />)}
              <div style={{ height: "1px" }} />
            </SectionBlock>
          </>
        )}

        {/* ── MEMORY ── */}
        {profileView === "memory" && (
          <>
          <SectionBlock title={`Memory — ${memoryItems.length} Objects`}>
            {memoryItems.length === 0 ? (
              <div style={{ padding: "6px 14px 12px" }}>
                <SovereignEmptyFrame
                  align="left"
                  accentVar="var(--r-accent-soft)"
                  kicker="Memory · object fabric"
                  title="Memory field is pristine"
                  body="Objects from domains, tracks, blueprints, and chats accumulate into this fabric. Nothing is invented — navigate any chamber and return when artifacts exist."
                  actions={emptyActionBtn(() => navigate("lab", "home"), "Browse Lab", "var(--r-accent-soft)")}
                />
              </div>
            ) : memoryItems.map((item) => (
              <div key={item.id} style={{ padding: "10px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.005em" }}>{item.title}</p>
                      <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[item.chamber] ?? "var(--r-dim)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{item.chamber}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: "1.5" }}>{item.summary}</p>
                  </div>
                  <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                    <button onClick={() => openObject(navigate, item)} style={btn}>Open</button>
                    {item.related_items.slice(0, 1).map((id) => {
                      const rel = findObject(id);
                      return rel ? <button key={id} onClick={() => openObject(navigate, rel)} style={btn}>Related</button> : null;
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ height: "1px" }} />
          </SectionBlock>
          {knowledgeGraph && knowledgeGraph.nodes.length > 0 && (
            <SectionBlock title="Knowledge Graph">
              <div style={{ padding: "10px 14px" }}>
                <KnowledgeGraphStrip graph={knowledgeGraph} />
              </div>
            </SectionBlock>
          )}
          </>
        )}

        {/* ── SETTINGS ── */}
        {profileView === "settings" && (
          <>
            <SectionBlock title="AI Policy">
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Model policy",       value: aiSettings.modelPolicy,        action: () => onAISettingsPatch({ modelPolicy: aiSettings.modelPolicy === "balanced" ? "quality_first" : aiSettings.modelPolicy === "quality_first" ? "speed_first" : "balanced" }) },
                  { label: "Safety mode",        value: aiSettings.safetyMode,         action: () => onAISettingsPatch({ safetyMode: aiSettings.safetyMode === "standard" ? "strict" : "standard" }) },
                  { label: "Fallback routing",   value: aiSettings.allowFallbackRouting ? "on" : "off", action: () => onAISettingsPatch({ allowFallbackRouting: !aiSettings.allowFallbackRouting }) },
                  { label: "Output style",       value: preferences.outputStyle,       action: () => onPreferencePatch({ outputStyle: preferences.outputStyle === "structured" ? "mixed" : "structured" }) },
                  { label: "Auto-transfer hints", value: preferences.autoTransferHints ? "on" : "off", action: () => onPreferencePatch({ autoTransferHints: !preferences.autoTransferHints }) },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{item.label}</span>
                    <button onClick={item.action} style={{ ...btn, minWidth: "90px", textAlign: "center" as const }}>{item.value}</button>
                  </div>
                ))}
              </div>
            </SectionBlock>
            <SectionBlock title="Workspace">
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>Active project</span>
                  <button onClick={() => onWorkspacePatch({ activeProject: workspace.activeProject === "Ruberra Generation Next" ? "Ruberra Runtime Closure" : "Ruberra Generation Next" })} style={{ ...btn, minWidth: "160px", textAlign: "center" as const }}>{workspace.activeProject}</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>Preferred chamber</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {(["school", "lab", "creation"] as const).map((c) => (
                      <button key={c} onClick={() => onPreferencePatch({ preferredChamber: c })} style={{ ...btn, color: preferences.preferredChamber === c ? CHAMBER_COLOR[c] : "var(--r-subtext)", borderColor: preferences.preferredChamber === c ? CHAMBER_COLOR[c] : "var(--r-border)" }}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </SectionBlock>
            <SectionBlock title="Plugins">
              {plugins.length === 0 ? (
                <div style={{ padding: "6px 14px 12px" }}>
                  <SovereignEmptyFrame
                    align="left"
                    accentVar="var(--r-accent-soft)"
                    kicker="Plugins"
                    title="No plugin registrations"
                    body="Extensions attach here when the runtime exposes them. The shell does not pretend fake marketplace rows."
                    actions={emptyActionBtn(() => navigate("profile", "overview"), "Back to overview", "var(--r-accent-soft)")}
                  />
                </div>
              ) : plugins.map((plugin) => (
                <div key={plugin.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>{plugin.label}</p>
                    <p style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0", letterSpacing: "0.05em" }}>{plugin.scope} · {plugin.status}</p>
                  </div>
                  <button onClick={() => onTogglePlugin(plugin.id, !plugin.enabled)} style={{ ...btn, color: plugin.enabled ? "var(--r-ok)" : "var(--r-subtext)" }}>
                    {plugin.enabled ? "Active" : "Enable"}
                  </button>
                </div>
              ))}
              <div style={{ height: "1px" }} />
            </SectionBlock>
            {personalOS && (
              <SectionBlock title="Personal Sovereign OS">
                <div style={{ padding: "10px 14px" }}>
                  <PersonalSovereignOSStrip os={personalOS} />
                </div>
              </SectionBlock>
            )}
          </>
        )}

        {/* ── EXPORTS ── */}
        {profileView === "exports" && (
          <>
            <SectionBlock title="Export Routes">
              <div style={{ padding: "10px 14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => navigate("creation", "archive")} style={btn}>Artifact Archive →</button>
                <button onClick={() => navigate("school", "archive")} style={btn}>Study Archive →</button>
                <button onClick={() => navigate("lab", "archive")} style={btn}>Analysis Archive →</button>
              </div>
            </SectionBlock>
            <SectionBlock title="Ready to Export">
              {exportables.length === 0 ? (
                <div style={{ padding: "6px 14px 12px" }}>
                  <SovereignEmptyFrame
                    align="left"
                    accentVar="var(--r-accent-soft)"
                    kicker="Exports · continuity"
                    title="Nothing queued for export"
                    body="Completed continuity items you mark ready will list here. The export rail stays quiet until the ledger has exportable work."
                    actions={emptyActionBtn(() => navigate("profile", "overview"), "Return to overview", "var(--r-accent-soft)")}
                  />
                </div>
              ) : exportables.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0" }}>{item.chamber} · {item.status}</p>
                  </div>
                  <button onClick={() => onExport(item.id)} style={btn}>Export</button>
                </div>
              ))}
              <div style={{ height: "1px" }} />
            </SectionBlock>
            {exported.length > 0 && (
              <SectionBlock title="Exported">
                {exported.slice(0, 6).map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                    <span style={{ fontSize: "12px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif" }}>{item.title}</span>
                    <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-ok)" }}>exported</span>
                  </div>
                ))}
                <div style={{ height: "1px" }} />
              </SectionBlock>
            )}
            {distributionLedger && distributionLedger.length > 0 && (
              <SectionBlock title="Distribution Ledger — Artifact Lineage">
                <div style={{ padding: "0" }}>
                  {distributionLedger.map((art) => (
                    <div key={art.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--r-border-soft)", gap: "10px" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--r-text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                        <p style={{ fontSize: "8.5px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", margin: "3px 0 0", letterSpacing: "0.02em" }}>
                           {art.id} · {art.checksum} · {new Date(art.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => window.open(art.uri, "_blank")} style={btn}>URI</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            )}
            {presenceManifest && (
              <SectionBlock title="Distribution & Presence">
                <div style={{ padding: "10px 14px" }}>
                  <DistributionPresenceStrip manifest={presenceManifest} />
                </div>
              </SectionBlock>
            )}
            {exchangeLedger && (
              <SectionBlock title="Value Exchange Ledger">
                <div style={{ padding: "10px 14px" }}>
                  <ValueExchangeStrip ledger={exchangeLedger} />
                </div>
              </SectionBlock>
            )}
          </>
        )}

        {/* ── PIONEERS ── */}
        {profileView === "pioneers" && (
          <>
            <SectionBlock title={`Pioneer Registry — ${PIONEER_REGISTRY.length} Pioneers`}>
              <div style={{ padding: "6px 0 0" }}>
                {getVisiblePioneers().map((pioneer) => (
                  <PioneerCard key={pioneer.id} pioneer={pioneer} navigate={navigate} />
                ))}
              </div>
            </SectionBlock>
            <SectionBlock title="Advanced Pioneers" empty>
              <div style={{ padding: "4px 0 8px" }}>
                <SovereignEmptyFrame
                  align="left"
                  accentVar="var(--r-accent-soft)"
                  kicker="Pioneers · advanced tier"
                  title={`${PIONEER_REGISTRY.filter((p) => p.visibility === "advanced").length} advanced intelligences`}
                  body="Advanced pioneers stay out of the default grid by design. Invoke them through routing contracts, palette navigation, or workflows — not as filler tiles."
                  actions={emptyActionBtn(() => navigate("profile", "workflows"), "View workflows", "var(--r-accent-soft)")}
                />
              </div>
            </SectionBlock>
            {civilization && (
              <SectionBlock title="Agent Civilization">
                <div style={{ padding: "10px 14px" }}>
                  <AgentCivilizationStrip civilization={civilization} />
                </div>
              </SectionBlock>
            )}
            {compoundNetwork && (
              <SectionBlock title="Compound Intelligence Network">
                <div style={{ padding: "10px 14px" }}>
                  <CompoundNetworkStrip network={compoundNetwork} />
                </div>
              </SectionBlock>
            )}
          </>
        )}

        {/* ── OPERATIONS (Stack 04) ── */}
        {profileView === "operations" && (
          <>
          {/* Mission-scoped operations — shown when a mission is active (Stack 02) */}
          {activeMissionId && activeMissionOps && (
            <SectionBlock title="Mission Operations">
              <div style={{ padding: "10px 14px" }}>
                <MissionOperationsPanel
                  missionId={activeMissionId}
                  ops={activeMissionOps}
                  onSignalDismiss={(id) => onMissionOpsSignalDismiss?.(id)}
                  onApprovalApprove={(id) => onMissionOpsApprovalApprove?.(id)}
                  onApprovalReject={(id) => onMissionOpsApprovalReject?.(id)}
                />
              </div>
            </SectionBlock>
          )}
          <OperationsPanel
            tasks={operations.tasks}
            reviews={operations.reviews}
            approvals={operations.approvals}
            handoffs={operations.handoffs}
            flows={operations.flows}
            signals={operations.signals}
            governance={operations.governance}
            navigate={navigate}
            onSignalRead={(id) => onOperationSignalRead?.(id)}
            onSignalResolve={(id) => onOperationSignalResolve?.(id)}
            onHandoffAccept={(id) => onHandoffAccept?.(id)}
            onHandoffReject={(id, reason) => onHandoffReject?.(id, reason)}
          />
          {collectiveState && (
            <SectionBlock title="Collective Execution">
              <div style={{ padding: "10px 14px" }}>
                <CollectiveExecutionStrip collective={collectiveState} />
              </div>
            </SectionBlock>
          )}
          {governanceEntries && governanceEntries.length > 0 && (
            <SectionBlock title="Governance Audit Trail">
              <div style={{ padding: "10px 14px" }}>
                <GovernanceLedgerStrip entries={governanceEntries} consequences={governanceConsequences} />
              </div>
            </SectionBlock>
          )}
          </>
        )}

        {/* ── WORKFLOWS ── */}
        {profileView === "workflows" && (
          <>
          <SectionBlock title={`Workflow Templates — ${WORKFLOW_TEMPLATES.length} Canonical Workflows`}>
            <div style={{ padding: "6px 0 0" }}>
              {WORKFLOW_TEMPLATES.map((template) => (
                <WorkflowCard key={template.id} template={template} navigate={navigate} />
              ))}
            </div>
          </SectionBlock>
          {flowState && Object.values(flowState.runs).length > 0 && (() => {
            const activeRun = Object.values(flowState.runs).find(r => r.state === "running" || r.state === "pending");
            const def = activeRun ? flowState.defs[activeRun.defId] : null;
            return activeRun && def ? (
              <SectionBlock title="Active Flow Run">
                <div style={{ padding: "10px 14px" }}>
                  <FlowRunStrip run={activeRun} def={def} />
                </div>
              </SectionBlock>
            ) : null;
          })()}
          </>
        )}

        {/* ── CONNECTORS ── */}
        {profileView === "connectors" && (
          <>
            {/* AI Runtime section — sovereign stack first */}
            <SectionBlock title="AI Runtime — Sovereign Stack">
              {/* Tier legend */}
              <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid var(--r-border-soft)" }}>
                <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>Execution Tier Legend</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {(["A", "B", "C"] as RuntimeTier[]).map((tier) => (
                    <div key={tier} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: TIER_COLOR[tier], border: `1px solid ${TIER_COLOR[tier]}28`, borderRadius: "3px", padding: "1px 5px", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                        {TIER_LABEL[tier]}
                      </span>
                      <span style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif" }}>{TIER_DESCRIPTION[tier]}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Per-chamber defaults */}
              <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--r-border-soft)" }}>
                <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>Chamber Sovereign Defaults</p>
                {(["lab", "school", "creation"] as const).map((chamber) => {
                  const { primaryModel, fallback, fast, resolution } = getChamberRuntimeSummary(chamber);
                  const chamberColor = { lab: "#52796A", school: "#4A6B84", creation: "#8A6238" }[chamber];
                  return (
                    <div key={chamber} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "6px 0", borderBottom: chamber !== "creation" ? "1px solid var(--r-border-soft)" : "none", gap: "10px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: chamberColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{chamber}</span>
                          <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: TIER_COLOR[resolution.tier], border: `1px solid ${TIER_COLOR[resolution.tier]}28`, borderRadius: "3px", padding: "0 4px", letterSpacing: "0.06em" }}>
                            Tier {resolution.tier}
                          </span>
                        </div>
                        <p style={{ fontSize: "10.5px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>
                          {primaryModel?.label ?? "—"}
                        </p>
                        <p style={{ fontSize: "9.5px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0" }}>
                          fallback: {fallback?.label ?? "—"} · fast: {fast?.label ?? "—"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: resolution.is_available ? "var(--r-ok)" : "var(--r-warn)", letterSpacing: "0.06em" }}>
                          {resolution.is_available ? "active" : "not configured"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Provider adapters */}
              <div style={{ padding: "8px 14px" }}>
                <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>Provider Adapters</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {PROVIDER_ADAPTERS.map((adapter) => (
                    <div key={adapter.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif" }}>{adapter.label}</span>
                          <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: TIER_COLOR[adapter.tier], border: `1px solid ${TIER_COLOR[adapter.tier]}28`, borderRadius: "3px", padding: "0 4px", letterSpacing: "0.06em" }}>
                            Tier {adapter.tier}
                          </span>
                          {adapter.requires_key && (
                            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.05em" }}>key required</span>
                          )}
                        </div>
                        <p style={{ fontSize: "10px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "0 0 1px", letterSpacing: "0.03em" }}>{adapter.base_url || "—"}</p>
                        <p style={{ fontSize: "10px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>{adapter.notes}</p>
                      </div>
                      <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: adapter.available ? "var(--r-ok)" : "var(--r-warn)", flexShrink: 0, letterSpacing: "0.06em" }}>
                        {adapter.available ? "live" : "offline"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Open-weight model list */}
              <div style={{ borderTop: "1px solid var(--r-border-soft)", padding: "8px 14px" }}>
                <p style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px" }}>Open-Weight Model Registry — {SOVEREIGN_MODEL_REGISTRY.length} Models</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {SOVEREIGN_MODEL_REGISTRY.map((model) => (
                    <div key={model.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                        <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", color: TIER_COLOR[model.tier], border: `1px solid ${TIER_COLOR[model.tier]}20`, borderRadius: "3px", padding: "0 4px", letterSpacing: "0.05em", flexShrink: 0 }}>
                          {model.tier === "A" ? "local" : "wrap"}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{model.label}</span>
                        <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{model.parameters}</span>
                      </div>
                      <span style={{ fontSize: "9px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, letterSpacing: "0.04em" }}>
                        {model.model_class}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBlock>

            {/* Other connector categories */}
            {CONNECTOR_CATEGORY_ORDER.filter((cat) =>
              CONNECTOR_REGISTRY.some((c) => c.category === cat)
            ).map((cat) => {
              const items = CONNECTOR_REGISTRY.filter((c) => c.category === cat);
              return (
                <SectionBlock key={cat} title={`${CONNECTOR_CATEGORY_LABELS[cat]} — ${items.filter(c => c.status === "connected").length} connected`}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 14px" }}>
                    {items.map((connector) => (
                      <ConnectorCard key={connector.id} connector={connector} />
                    ))}
                  </div>
                </SectionBlock>
              );
            })}
            {ecosystemState && (
              <SectionBlock title="Ecosystem Network">
                <div style={{ padding: "10px 14px" }}>
                  <EcosystemNetworkStrip ecosystem={ecosystemState} />
                </div>
              </SectionBlock>
            )}
          </>
        )}

      </div>
    </div>
  );
}
