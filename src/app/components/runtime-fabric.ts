import { RUBERRA_OBJECTS, buildMessageObject, type RuberraObject } from "./object-graph";
import { type Message, type Tab } from "./shell-types";

export type LifecycleStatus =
  | "draft"
  | "in_progress"
  | "paused"
  | "resumed"
  | "blocked"
  | "needs_input"
  | "ready_for_transfer"
  | "transferred"
  | "validated"
  | "completed"
  | "exported"
  | "archived";

export interface ContinuityItem {
  id: string;
  title: string;
  chamber: Exclude<Tab, "profile">;
  status: LifecycleStatus;
  route: { tab: Exclude<Tab, "profile">; view: string; id?: string };
  linkedObjectId?: string;
  transferDestinations: Exclude<Tab, "profile">[];
  updatedAt: number;
}

export type SignalType = "lifecycle" | "transfer" | "connector" | "reward" | "recommendation";
export interface RuntimeSignal {
  id: string;
  type: SignalType;
  label: string;
  severity: "info" | "warn" | "critical";
  sourceChamber: Tab;
  destinationChamber: Tab;
  destination: { tab: Tab; view: string; id?: string };
  linkedObjectId?: string;
  createdAt: number;
  read: boolean;
  resolved: boolean;
}

export interface TransferRecord {
  id: string;
  continuityId: string;
  from: Exclude<Tab, "profile">;
  to: Exclude<Tab, "profile">;
  objectId?: string;
  reason: string;
  createdAt: number;
}

export interface RewardRecord {
  id: string;
  kind: "mastery" | "experiment" | "build" | "transfer" | "export" | "recovery";
  title: string;
  points: number;
  chamber: Tab;
  createdAt: number;
}

export interface ConnectorState {
  id: string;
  label: string;
  chamber: Tab;
  enabled: boolean;
  status: "ready" | "needs_config" | "degraded";
  completeness: number;
  lastUpdated: number;
}

export interface PreferenceState {
  preferredChamber: Exclude<Tab, "profile">;
  preferredObjectType: string;
  outputStyle: "structured" | "mixed";
  autoTransferHints: boolean;
  modelOverrides: Partial<Record<Exclude<Tab, "profile">, string>>;
  lastUpdated: number;
}

export interface RuntimeFabric {
  objects: RuberraObject[];
  continuity: ContinuityItem[];
  signals: RuntimeSignal[];
  transfers: TransferRecord[];
  rewards: RewardRecord[];
  connectors: ConnectorState[];
  preferences: PreferenceState;
}

const STORAGE_KEY = "ruberra_runtime_fabric_v2";

const DEFAULT_CONNECTORS: ConnectorState[] = [
  { id: "knowledge-pack", label: "Knowledge Pack", chamber: "school", enabled: true, status: "ready", completeness: 100, lastUpdated: Date.now() },
  { id: "evidence-bridge", label: "Evidence Bridge", chamber: "lab", enabled: true, status: "ready", completeness: 92, lastUpdated: Date.now() },
  { id: "artifact-export", label: "Artifact Export", chamber: "creation", enabled: true, status: "needs_config", completeness: 68, lastUpdated: Date.now() },
  { id: "profile-ledger", label: "Profile Ledger", chamber: "profile", enabled: true, status: "ready", completeness: 100, lastUpdated: Date.now() },
];

const DEFAULT_PREFERENCES: PreferenceState = {
  preferredChamber: "school",
  preferredObjectType: "lesson",
  outputStyle: "structured",
  autoTransferHints: true,
  modelOverrides: {},
  lastUpdated: Date.now(),
};

function initialFabric(): RuntimeFabric {
  return {
    objects: RUBERRA_OBJECTS,
    continuity: [],
    signals: [],
    transfers: [],
    rewards: [],
    connectors: DEFAULT_CONNECTORS,
    preferences: DEFAULT_PREFERENCES,
  };
}

export function loadRuntimeFabric(): RuntimeFabric {
  if (typeof window === "undefined") return initialFabric();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialFabric();
    const parsed = JSON.parse(raw) as RuntimeFabric;
    return {
      ...initialFabric(),
      ...parsed,
      objects: parsed.objects?.length ? parsed.objects : RUBERRA_OBJECTS,
      connectors: parsed.connectors?.length ? parsed.connectors : DEFAULT_CONNECTORS,
      preferences: parsed.preferences ?? DEFAULT_PREFERENCES,
    };
  } catch {
    return initialFabric();
  }
}

export function saveRuntimeFabric(fabric: RuntimeFabric) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fabric));
  } catch {
    // ignore
  }
}

export function upsertObject(fabric: RuntimeFabric, object: RuberraObject): RuntimeFabric {
  const idx = fabric.objects.findIndex((o) => o.id === object.id);
  if (idx === -1) return { ...fabric, objects: [object, ...fabric.objects] };
  const next = [...fabric.objects];
  next[idx] = { ...next[idx], ...object, updated_at: Date.now() };
  return { ...fabric, objects: next };
}

export function createOrUpdateContinuity(
  fabric: RuntimeFabric,
  payload: Omit<ContinuityItem, "updatedAt" | "transferDestinations"> & { transferDestinations?: Exclude<Tab, "profile">[] },
): RuntimeFabric {
  const idx = fabric.continuity.findIndex((w) => w.id === payload.id);
  const item: ContinuityItem = {
    ...payload,
    transferDestinations: payload.transferDestinations ?? transferDefaults(payload.chamber),
    updatedAt: Date.now(),
  };
  if (idx === -1) return { ...fabric, continuity: [item, ...fabric.continuity] };
  const next = [...fabric.continuity];
  next[idx] = item;
  return { ...fabric, continuity: next };
}

function transferDefaults(chamber: Exclude<Tab, "profile">): Exclude<Tab, "profile">[] {
  if (chamber === "school") return ["lab", "creation"];
  if (chamber === "lab") return ["school", "creation"];
  return ["lab", "school"];
}

export function transitionContinuity(fabric: RuntimeFabric, id: string, status: LifecycleStatus): RuntimeFabric {
  return {
    ...fabric,
    continuity: fabric.continuity.map((item) => (item.id === id ? { ...item, status, updatedAt: Date.now() } : item)),
  };
}

export function transferContinuity(
  fabric: RuntimeFabric,
  continuityId: string,
  to: Exclude<Tab, "profile">,
  reason: string,
): RuntimeFabric {
  const current = fabric.continuity.find((item) => item.id === continuityId);
  if (!current) return fabric;
  const transfer: TransferRecord = {
    id: crypto.randomUUID(),
    continuityId,
    from: current.chamber,
    to,
    objectId: current.linkedObjectId,
    reason,
    createdAt: Date.now(),
  };
  const updated = fabric.continuity.map((item) =>
    item.id === continuityId ? { ...item, status: "transferred", chamber: to, route: { tab: to, view: to === "creation" ? "terminal" : "chat" }, updatedAt: Date.now() } : item,
  );
  return { ...fabric, continuity: updated, transfers: [transfer, ...fabric.transfers] };
}

export function pushSignal(fabric: RuntimeFabric, signal: Omit<RuntimeSignal, "id" | "createdAt" | "read" | "resolved">): RuntimeFabric {
  const item: RuntimeSignal = {
    ...signal,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    read: false,
    resolved: false,
  };
  return { ...fabric, signals: [item, ...fabric.signals].slice(0, 120) };
}

export function markSignalRead(fabric: RuntimeFabric, id: string): RuntimeFabric {
  return { ...fabric, signals: fabric.signals.map((signal) => (signal.id === id ? { ...signal, read: true } : signal)) };
}

export function resolveSignal(fabric: RuntimeFabric, id: string): RuntimeFabric {
  return { ...fabric, signals: fabric.signals.map((signal) => (signal.id === id ? { ...signal, read: true, resolved: true } : signal)) };
}

export function recordRuntimeMessageObject(fabric: RuntimeFabric, message: Message): RuntimeFabric {
  return upsertObject(fabric, buildMessageObject(message));
}

export function awardProgress(
  fabric: RuntimeFabric,
  reward: Omit<RewardRecord, "id" | "createdAt">,
): RuntimeFabric {
  const item: RewardRecord = { ...reward, id: crypto.randomUUID(), createdAt: Date.now() };
  return { ...fabric, rewards: [item, ...fabric.rewards].slice(0, 80) };
}

export function upsertConnector(
  fabric: RuntimeFabric,
  connectorId: string,
  patch: Partial<ConnectorState>,
): RuntimeFabric {
  return {
    ...fabric,
    connectors: fabric.connectors.map((connector) =>
      connector.id === connectorId ? { ...connector, ...patch, lastUpdated: Date.now() } : connector,
    ),
  };
}

export function updatePreferences(fabric: RuntimeFabric, patch: Partial<PreferenceState>): RuntimeFabric {
  return {
    ...fabric,
    preferences: { ...fabric.preferences, ...patch, lastUpdated: Date.now() },
  };
}

export function exportContinuity(fabric: RuntimeFabric, continuityId: string): RuntimeFabric {
  const item = fabric.continuity.find((c) => c.id === continuityId);
  if (!item) return fabric;
  let next = transitionContinuity(fabric, continuityId, "exported");
  next = awardProgress(next, {
    kind: "export",
    title: `${item.chamber} export`,
    points: 30,
    chamber: "profile",
  });
  next = pushSignal(next, {
    type: "reward",
    label: `${item.title.slice(0, 48)} exported to profile ledger`,
    severity: "info",
    sourceChamber: item.chamber,
    destinationChamber: "profile",
    destination: { tab: "profile", view: "exports" },
    linkedObjectId: item.linkedObjectId,
  });
  return next;
}
