import { type Message, type NavFn, type Tab, type ProfileView } from "../shell-types";
import { findObject, listObjectsForChamber, mergeObjectsByRecency, openObject, type RuberraObject } from "../object-graph";
import { type CSSProperties } from "react";
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
} from "../runtime-fabric";

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
  lab:      "#52796A",
  school:   "#4A6B84",
  creation: "#8A6238",
};

const STATUS_COLOR: Record<WorkStatus, string> = {
  in_progress: "var(--r-ok)",
  paused:      "var(--r-warn)",
  completed:   "var(--r-dim)",
};

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
        id:     `${chamber}-paused`,
        title:  `Resume previous ${chamber} chain`,
        chamber,
        status: "paused",
        route:  { tab: chamber, view: "archive" },
      });
    }
  }
  return items;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

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
    <div style={{ marginBottom: "14px", border: "1px solid var(--r-border)", borderRadius: "8px", background: "var(--r-surface)", overflow: "hidden" }}>
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

// ─── Workflow templates ────────────────────────────────────────────────────────

const WORKFLOW_TEMPLATES = [
  {
    id: "maximum-quality",
    title: "Maximum Quality Pipeline",
    description: "School first principles → Lab validation → Creation execution. Podium-grade output.",
    sequence: ["School", "Lab", "Creation"],
    steps: ["School: First-principles grounding", "Lab: Evidence + audit", "Creation: Build + export"],
    badge: "Canonical",
  },
  {
    id: "rapid-build",
    title: "Rapid Build Flow",
    description: "Direct directive to Creation terminal. Iterate fast, validate later.",
    sequence: ["Creation", "Lab"],
    steps: ["Creation: Directive execution", "Lab: Audit pass", "Creation: Refinement"],
    badge: "Speed",
  },
  {
    id: "deep-research",
    title: "Deep Research + Synthesis",
    description: "Lab investigation → School structuring → Creation publication.",
    sequence: ["Lab", "School", "Creation"],
    steps: ["Lab: Research + findings", "School: Curriculum structuring", "Creation: Final synthesis"],
    badge: "Research",
  },
  {
    id: "study-apply",
    title: "Study → Apply Cycle",
    description: "Learn in School, experiment in Lab, build in Creation.",
    sequence: ["School", "Lab", "Creation"],
    steps: ["School: Core concept acquisition", "Lab: Hypothesis testing", "Creation: Applied build"],
    badge: "Learning",
  },
];

function WorkflowTemplateCard({ template, navigate }: { template: typeof WORKFLOW_TEMPLATES[0]; navigate: NavFn }) {
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "7px", background: "var(--r-surface)", padding: "13px 15px", marginBottom: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "7px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <p style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.01em" }}>{template.title}</p>
            <span style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", color: "var(--r-dim)", border: "1px solid var(--r-border)", borderRadius: "3px", padding: "1px 6px", textTransform: "uppercase" }}>
              {template.badge}
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--r-subtext)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, lineHeight: "1.55" }}>{template.description}</p>
        </div>
        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
          {template.sequence.map((s) => (
            <span key={s} style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: CHAMBER_COLOR[s.toLowerCase()] ?? "var(--r-dim)", background: `${CHAMBER_COLOR[s.toLowerCase()] ?? "#888"}14`, border: `1px solid ${CHAMBER_COLOR[s.toLowerCase()] ?? "#888"}24`, borderRadius: "3px", padding: "2px 6px", letterSpacing: "0.05em" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
        {template.steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", color: "var(--r-dim)", letterSpacing: "0.04em" }}>{i + 1}. {step}</span>
            {i < template.steps.length - 1 && <span style={{ color: "var(--r-dim)", fontSize: "8px" }}>›</span>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--r-border-soft)" }}>
        <button onClick={() => navigate(template.sequence[0].toLowerCase() as Tab, "home")} style={btn}>
          Start in {template.sequence[0]}
        </button>
        <button onClick={() => navigate(template.sequence[0].toLowerCase() as Tab, "chat")} style={btn}>
          Open Chat
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ProfileMode({
  messages, profileView, onProfileView, navigate, continuity, signals, rewards, connectors, preferences, aiSettings, plugins, workspace, objects, recommendations, onTransfer, onResume, onToggleConnector, onTogglePlugin, onPreferencePatch, onAISettingsPatch, onWorkspacePatch, onExport,
}: ProfileModeProps) {
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

  const NAV_VIEWS: ProfileView[] = ["overview", "projects", "memory", "settings", "exports"];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--r-bg)" }} className="hide-scrollbar">

      {/* Profile header */}
      <div style={{ borderBottom: "1px solid var(--r-border)", background: "var(--r-surface)", padding: "16px 30px 0", flexShrink: 0 }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(145deg, #D8D3CC 0%, #B4AFA8 100%)", border: "1px solid var(--r-border)", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--r-text)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0, letterSpacing: "-0.01em" }}>
                  {workspace.owner}
                </p>
                <p style={{ fontSize: "10px", color: "var(--r-dim)", fontFamily: "'JetBrains Mono', monospace", margin: "2px 0 0", letterSpacing: "0.05em" }}>
                  {workspace.activeProject} · {preferences.preferredChamber} first
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {([{ label: "Active", value: active.length, color: "var(--r-ok)" }, { label: "Paused", value: paused.length, color: "var(--r-warn)" }, { label: "Memory", value: memoryItems.length, color: "var(--r-dim)" }]).map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center", padding: "5px 10px", border: "1px solid var(--r-border)", borderRadius: "6px", background: "var(--r-elevated)" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: stat.color, margin: 0, lineHeight: 1, fontFamily: "'Inter', system-ui, sans-serif" }}>{stat.value}</p>
                    <p style={{ fontSize: "8px", color: "var(--r-dim)", margin: "3px 0 0", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0" }}>
            {NAV_VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => onProfileView(v)}
                style={{
                  padding: "7px 14px",
                  border: "none",
                  borderBottom: profileView === v ? "2px solid #7A756D" : "2px solid transparent",
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
                <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", margin: 0 }}>No active work — start a session in any chamber</p>
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
          </>
        )}

        {/* ── PROJECTS ── */}
        {profileView === "projects" && (
          <>
            <SectionBlock title="Workflow Templates — Orchestration">
              {WORKFLOW_TEMPLATES.map((t) => <WorkflowTemplateCard key={t.id} template={t} navigate={navigate} />)}
            </SectionBlock>
            <SectionBlock title="All Work">
              {workItems.length === 0 ? (
                <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", padding: "10px 14px", margin: 0 }}>No work items yet</p>
              ) : workItems.map((item) => <WorkRow key={item.id} item={item} navigate={navigate} continuity={continuity} onTransfer={onTransfer} />)}
              <div style={{ height: "1px" }} />
            </SectionBlock>
            <SectionBlock title="Connectors">
              {connectors.length === 0 ? (
                <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", padding: "10px 14px", margin: 0 }}>No connectors configured</p>
              ) : connectors.map((c) => <ConnectorRow key={c.id} connector={c} onToggle={onToggleConnector} />)}
              <div style={{ height: "1px" }} />
            </SectionBlock>
          </>
        )}

        {/* ── MEMORY ── */}
        {profileView === "memory" && (
          <SectionBlock title={`Memory — ${memoryItems.length} Objects`}>
            {memoryItems.length === 0 ? (
              <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", padding: "10px 14px", margin: 0 }}>Memory builds as you work across chambers</p>
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
                <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", padding: "10px 14px", margin: 0 }}>No plugins registered</p>
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
                <p style={{ fontSize: "11px", color: "var(--r-dim)", fontFamily: "'Inter', system-ui, sans-serif", padding: "10px 14px", margin: 0 }}>No completed runs ready for export</p>
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
          </>
        )}
      </div>
    </div>
  );
}
