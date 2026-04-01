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
  type RuntimeFabric,
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
}

type WorkStatus = "in_progress" | "paused" | "completed";
interface WorkItem {
  id: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  status: WorkStatus;
  route: { tab: Exclude<Tab, "profile">; view: string; id?: string };
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
      id: lastUser.id,
      title: lastUser.content.slice(0, 90),
      chamber,
      status: lastAssistant ? "completed" : "in_progress",
      route: { tab: chamber, view: chamber === "creation" ? "terminal" : "chat" },
    });
    if (chamberMessages.length > 4) {
      items.push({
        id: `${chamber}-paused`,
        title: `Resume previous ${chamber} chain`,
        chamber,
        status: "paused",
        route: { tab: chamber, view: "archive" },
      });
    }
  }
  return items;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ border: "1px solid var(--r-border)", borderRadius: "8px", background: "var(--r-surface)", padding: "12px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--r-dim)", margin: "0 0 8px", letterSpacing: "0.08em" }}>{label}</p>
      <p style={{ fontSize: "20px", margin: 0, color: "var(--r-text)", fontWeight: 600 }}>{value}</p>
    </div>
  );
}

export function ProfileMode({
  messages, profileView, onProfileView, navigate, continuity, signals, rewards, connectors, preferences, aiSettings, plugins, workspace, intelligence, objects, recommendations, onTransfer, onResume, onToggleConnector, onTogglePlugin, onPreferencePatch, onAISettingsPatch, onWorkspacePatch, onExport,
}: ProfileModeProps) {
  const derivedWork = deriveWorkItems(messages);
  const continuityWork: WorkItem[] = continuity.map((item) => ({
    id: item.id,
    title: item.title,
    chamber: item.chamber,
    status: item.status === "paused" ? "paused" : item.status === "completed" || item.status === "exported" ? "completed" : "in_progress",
    route: item.route,
  }));
  const workItems = [...continuityWork, ...derivedWork.filter((w) => !continuityWork.some((c) => c.id === w.id))];
  const active = workItems.filter((w) => w.status === "in_progress");
  const paused = workItems.filter((w) => w.status === "paused");
  const completed = workItems.filter((w) => w.status === "completed");
  const exportables = continuity.filter((c) => c.status === "completed" || c.status === "validated");
  const exported = continuity.filter((c) => c.status === "exported");
  const memoryItems = mergeObjectsByRecency(
    objects,
    listObjectsForChamber("school"),
    listObjectsForChamber("lab"),
    listObjectsForChamber("creation"),
  ).slice(0, 24);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--r-bg)", padding: "24px 30px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, margin: 0 }}>Profile Ledger</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(["overview", "projects", "memory", "settings", "exports"] as ProfileView[]).map((view) => (
              <button key={view} onClick={() => onProfileView(view)} style={{ border: "1px solid var(--r-border)", background: profileView === view ? "var(--r-elevated)" : "transparent", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontFamily: "monospace", cursor: "pointer" }}>{view}</button>
            ))}
          </div>
        </div>

        {profileView === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "8px", marginBottom: "12px" }}>
              <StatCard label="ACTIVE" value={active.length} />
              <StatCard label="PAUSED" value={paused.length} />
              <StatCard label="COMPLETED" value={completed.length} />
              <StatCard label="MEMORY" value={memoryItems.length} />
            </div>
            <Section title="Active Work" items={active} navigate={navigate} continuity={continuity} onTransfer={onTransfer} />
            <Section title="Paused Work" items={paused} navigate={navigate} />
            <Section title="Completed Runs" items={completed} navigate={navigate} />
            <RecommendationSection recommendations={recommendations} onResume={onResume} onExport={onExport} onTransfer={onTransfer} navigate={navigate} />
            <SignalSection signals={signals} navigate={navigate} />
            <RewardSection rewards={rewards} />
          </>
        )}

        {profileView === "memory" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {memoryItems.map((item) => (
              <div key={item.id} style={{ border: "1px solid var(--r-border)", borderRadius: "7px", padding: "10px 12px", background: "var(--r-surface)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{item.title}</span>
                  <span style={{ fontSize: "9px", fontFamily: "monospace", color: "var(--r-dim)" }}>{item.chamber}/{item.type}</span>
                </div>
                <p style={{ fontSize: "11px", color: "var(--r-subtext)", margin: "0 0 6px" }}>{item.summary}</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => openObject(navigate, item)} style={btn}>Open</button>
                  {item.related_items.slice(0, 1).map((id) => {
                    const related = findObject(id);
                    if (!related) return null;
                    return <button key={id} onClick={() => openObject(navigate, related)} style={btn}>Related</button>;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {profileView === "settings" && (
          <div style={{ border: "1px solid var(--r-border)", borderRadius: "8px", background: "var(--r-surface)", padding: "12px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px" }}>Workspace + AI Settings are now canonicalized to one profile surface.</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("school", "chat")} style={btn}>Study Preferences</button>
              <button onClick={() => navigate("lab", "code")} style={btn}>Execution Preferences</button>
              <button onClick={() => navigate("creation", "terminal")} style={btn}>Build Preferences</button>
            </div>
            <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button onClick={() => onPreferencePatch({ preferredChamber: "school" })} style={btn}>Prefer School</button>
              <button onClick={() => onPreferencePatch({ preferredChamber: "lab" })} style={btn}>Prefer Lab</button>
              <button onClick={() => onPreferencePatch({ outputStyle: preferences.outputStyle === "structured" ? "mixed" : "structured" })} style={btn}>Output: {preferences.outputStyle}</button>
              <button onClick={() => onPreferencePatch({ autoTransferHints: !preferences.autoTransferHints })} style={btn}>Hints: {preferences.autoTransferHints ? "on" : "off"}</button>
              <button onClick={() => onAISettingsPatch({ modelPolicy: aiSettings.modelPolicy === "balanced" ? "quality_first" : aiSettings.modelPolicy === "quality_first" ? "speed_first" : "balanced" })} style={btn}>Model policy: {aiSettings.modelPolicy}</button>
              <button onClick={() => onAISettingsPatch({ safetyMode: aiSettings.safetyMode === "standard" ? "strict" : "standard" })} style={btn}>Safety: {aiSettings.safetyMode}</button>
              <button onClick={() => onAISettingsPatch({ allowFallbackRouting: !aiSettings.allowFallbackRouting })} style={btn}>Fallback routing: {aiSettings.allowFallbackRouting ? "on" : "off"}</button>
              <button onClick={() => onWorkspacePatch({ activeProject: workspace.activeProject === "Ruberra Generation Next" ? "Ruberra Runtime Closure" : "Ruberra Generation Next" })} style={btn}>Project: {workspace.activeProject}</button>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: "10px", color: "var(--r-dim)" }}>Preferred chamber: {preferences.preferredChamber} · owner: {workspace.owner}</p>
            <div style={{ marginTop: "12px", borderTop: "1px solid var(--r-border-soft)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ margin: 0, fontSize: "10px", fontFamily: "monospace", color: "var(--r-dim)" }}>Plugins / Runtime Connectors</p>
              {plugins.map((plugin) => (
                <div key={plugin.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11px" }}>{plugin.label} · {plugin.scope}</span>
                  <button onClick={() => onTogglePlugin(plugin.id, !plugin.enabled)} style={btn}>{plugin.enabled ? "Disable" : "Enable"} ({plugin.status})</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileView === "exports" && (
          <div style={{ border: "1px solid var(--r-border)", borderRadius: "8px", background: "var(--r-surface)", padding: "12px" }}>
            <p style={{ margin: "0 0 8px", fontSize: "12px" }}>Export hub routes to chamber archives for packaged outputs.</p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => navigate("creation", "archive")} style={btn}>Artifact Exports</button>
              <button onClick={() => navigate("school", "archive")} style={btn}>Study Exports</button>
              <button onClick={() => navigate("lab", "archive")} style={btn}>Analysis Exports</button>
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {exportables.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--r-border-soft)", paddingTop: "6px" }}>
                  <span style={{ fontSize: "11px" }}>{item.title}</span>
                  <button onClick={() => onExport(item.id)} style={btn}>Export</button>
                </div>
              ))}
              {exported.slice(0, 4).map((item) => (
                <div key={`done-${item.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--r-border-soft)", paddingTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--r-dim)" }}>{item.title}</span>
                  <span style={{ fontSize: "10px", fontFamily: "monospace", color: "var(--r-ok)" }}>exported</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileView === "projects" && (
          <>
            <Section title="Projects" items={workItems} navigate={navigate} />
            <ConnectorSection connectors={connectors} onToggle={onToggleConnector} />
            <RegistrySection
              pioneers={intelligence.pioneers}
              workflows={intelligence.workflowTemplates}
              pairings={intelligence.workflowPairings}
            />
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, items, navigate, continuity, onTransfer }: { title: string; items: WorkItem[]; navigate: NavFn; continuity?: ContinuityItem[]; onTransfer?: (continuityId: string, to: Exclude<Tab, "profile">, reason: string) => void }) {
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>{title.toUpperCase()}</p>
      {items.length === 0 ? <p style={{ margin: 0, fontSize: "11px", color: "var(--r-dim)" }}>None</p> : items.map((item) => (
        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <span style={{ fontSize: "12px" }}>{item.title}</span>
          <div style={{ display: "flex", gap: "5px" }}>
            <button onClick={() => navigate(item.route.tab, item.route.view, item.route.id)} style={btn}>Resume</button>
            {continuity && onTransfer && continuity.find((c) => c.id === item.id)?.transferDestinations.slice(0, 1).map((dest) => (
              <button key={dest} onClick={() => onTransfer(item.id, dest, "profile_transfer")} style={btn}>Transfer→{dest}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendationSection({
  recommendations,
  onResume,
  onExport,
  onTransfer,
  navigate,
}: {
  recommendations: ContinuityRecommendation[];
  onResume: (continuityId: string) => void;
  onExport: (continuityId: string) => void;
  onTransfer: (continuityId: string, to: Exclude<Tab, "profile">, reason: string) => void;
  navigate: NavFn;
}) {
  const items = recommendations.slice(0, 8);
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>RECOMMENDATIONS</p>
      {items.length === 0 ? <p style={{ margin: 0, fontSize: "11px", color: "var(--r-dim)" }}>No continuity recommendations</p> : items.map((item) => (
        <div key={`${item.continuityId}-${item.action}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", padding: "6px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <div>
            <p style={{ margin: 0, fontSize: "11px" }}>{item.title}</p>
            <p style={{ margin: 0, fontSize: "10px", color: "var(--r-dim)" }}>{item.reason}</p>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            {item.action === "resume" && <button onClick={() => onResume(item.continuityId)} style={btn}>Resume</button>}
            {item.action === "export" && <button onClick={() => onExport(item.continuityId)} style={btn}>Export</button>}
            {item.action === "transfer" && item.destination.tab !== "profile" && (
              <button onClick={() => onTransfer(item.continuityId, item.destination.tab as Exclude<Tab, "profile">, "profile_recommendation")} style={btn}>Transfer</button>
            )}
            <button onClick={() => navigate(item.destination.tab, item.destination.view, item.destination.id)} style={btn}>Open</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RewardSection({ rewards }: { rewards: RewardRecord[] }) {
  const items = rewards.slice(0, 6);
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>REWARDS</p>
      {items.length === 0 ? <p style={{ margin: 0, fontSize: "11px", color: "var(--r-dim)" }}>No milestones yet</p> : items.map((reward) => (
        <div key={reward.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <span style={{ fontSize: "11px" }}>{reward.kind} · {reward.title}</span>
          <span style={{ fontSize: "10px", fontFamily: "monospace" }}>+{reward.points}</span>
        </div>
      ))}
    </div>
  );
}

function ConnectorSection({ connectors, onToggle }: { connectors: ConnectorState[]; onToggle: (id: string, enabled: boolean) => void }) {
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>CONNECTORS / PLUGINS</p>
      {connectors.map((connector) => (
        <div key={connector.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <div>
            <span style={{ fontSize: "11px" }}>{connector.label}</span>
            <span style={{ fontSize: "10px", color: "var(--r-dim)", marginLeft: "6px" }}>{connector.status} · {connector.completeness}%</span>
          </div>
          <button onClick={() => onToggle(connector.id, !connector.enabled)} style={btn}>{connector.enabled ? "Disable" : "Enable"}</button>
        </div>
      ))}
    </div>
  );
}

function SignalSection({ signals, navigate }: { signals: RuntimeSignal[]; navigate: NavFn }) {
  const items = signals.slice(0, 6);
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>SIGNALS</p>
      {items.length === 0 ? <p style={{ margin: 0, fontSize: "11px", color: "var(--r-dim)" }}>No pending signals</p> : items.map((signal) => (
        <div key={signal.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <span style={{ fontSize: "11px" }}>{signal.label}</span>
          <button onClick={() => navigate(signal.destination.tab, signal.destination.view, signal.destination.id)} style={btn}>Open</button>
        </div>
      ))}
    </div>
  );
}

function RegistrySection({
  pioneers,
  workflows,
  pairings,
}: {
  pioneers: RuntimeFabric["intelligence"]["pioneers"];
  workflows: RuntimeFabric["intelligence"]["workflowTemplates"];
  pairings: RuntimeFabric["intelligence"]["workflowPairings"];
}) {
  return (
    <div style={{ marginBottom: "10px", border: "1px solid var(--r-border)", borderRadius: "8px", padding: "10px", background: "var(--r-surface)" }}>
      <p style={{ margin: "0 0 8px", fontSize: "11px", fontFamily: "monospace", color: "var(--r-dim)", letterSpacing: "0.08em" }}>PIONEERS · WORKFLOWS</p>
      {pioneers.slice(0, 6).map((pioneer) => (
        <div key={pioneer.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <span style={{ fontSize: "11px" }}>{pioneer.name}</span>
          <span style={{ fontSize: "10px", fontFamily: "monospace", color: "var(--r-dim)" }}>{pioneer.hostingLevel}</span>
        </div>
      ))}
      {workflows.slice(0, 4).map((workflow) => (
        <div key={workflow.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid var(--r-border-soft)" }}>
          <span style={{ fontSize: "11px" }}>{workflow.label}</span>
          <span style={{ fontSize: "10px", fontFamily: "monospace", color: "var(--r-dim)" }}>v{workflow.version}</span>
        </div>
      ))}
      {pairings.slice(0, 3).map((pairing) => (
        <div key={pairing.id} style={{ padding: "5px 0", borderTop: "1px solid var(--r-border-soft)", fontSize: "10px", color: "var(--r-dim)" }}>
          {pairing.label} · {pairing.reason}
        </div>
      ))}
    </div>
  );
}

const btn: CSSProperties = {
  border: "1px solid var(--r-border)",
  background: "transparent",
  fontSize: "10px",
  fontFamily: "monospace",
  padding: "3px 8px",
  borderRadius: "4px",
  cursor: "pointer",
};
