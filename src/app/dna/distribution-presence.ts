/**
 * RUBERRA STACK 14 — Distribution + Presence
 * Sovereign presence everywhere operators need to work.
 * Not locked to a browser tab.
 *
 * Presence is not notification. It is context continuity
 * carried across every channel where the operator exists.
 */

import { assertStackOrder } from "./canon-sovereignty";
import { type MissionId } from "./mission-substrate";

const _g = assertStackOrder("distribution", ["experience", "awareness"]);
if (!_g.valid) console.warn("[Ruberra Distribution] Stack order violation:", _g.reason);

// ─── Channels ─────────────────────────────────────────────────────────────────

export type PresenceChannelType = "web" | "desktop" | "mobile" | "api" | "embed" | "cli";

export const CHANNEL_CAPABILITY: Record<PresenceChannelType, string[]> = {
  web:     ["full_ui", "streaming", "file_access", "keyboard"],
  desktop: ["full_ui", "streaming", "file_access", "keyboard", "native_notifications", "offline"],
  mobile:  ["touch_ui", "push_notifications", "camera", "voice"],
  api:     ["programmatic", "streaming", "webhooks"],
  embed:   ["partial_ui", "streaming"],
  cli:     ["terminal", "scripting", "piping"],
} as const;

export interface PresenceChannel {
  id:           string;
  type:         PresenceChannelType;
  active:       boolean;
  lastSeenAt:   number;
  capabilities: string[];
  metadata:     Record<string, string>; // e.g. { version, os, browser }
}

export function createChannel(
  type: PresenceChannelType,
  metadata: Record<string, string> = {}
): PresenceChannel {
  return {
    id:           `ch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    active:       true,
    lastSeenAt:   Date.now(),
    capabilities: [...(CHANNEL_CAPABILITY[type] ?? [])],
    metadata,
  };
}

export function heartbeatChannel(channel: PresenceChannel): PresenceChannel {
  return { ...channel, lastSeenAt: Date.now() };
}

// ─── Sovereign context ────────────────────────────────────────────────────────

/**
 * The sovereign context is the minimal state package carried
 * across channels when an operator moves between surfaces.
 * It ensures the operator arrives with context — not empty-handed.
 */
export interface SovereignContext {
  missionId?:     MissionId;
  activeChamber?: "lab" | "school" | "creation" | "profile";
  operatorId:     string;
  channelId:      string;
  carriedState:   Record<string, unknown>;  // Lightweight carry payload
  builtAt:        number;
}

export function buildContext(
  operatorId: string,
  channelId: string,
  opts?: { missionId?: MissionId; activeChamber?: SovereignContext["activeChamber"]; carriedState?: Record<string, unknown> }
): SovereignContext {
  return {
    missionId:     opts?.missionId,
    activeChamber: opts?.activeChamber,
    operatorId,
    channelId,
    carriedState:  opts?.carriedState ?? {},
    builtAt:       Date.now(),
  };
}

// ─── Presence manifest ────────────────────────────────────────────────────────

export interface PresenceManifest {
  operatorId:     string;
  channels:       PresenceChannel[];
  primaryChannel: string;     // Channel ID of the current primary surface
  context:        SovereignContext;
  lastUpdated:    number;
}

export function defaultPresenceManifest(operatorId: string): PresenceManifest {
  const channel = createChannel("web");
  return {
    operatorId,
    channels:       [channel],
    primaryChannel: channel.id,
    context:        buildContext(operatorId, channel.id),
    lastUpdated:    Date.now(),
  };
}

export function registerChannel(
  manifest: PresenceManifest,
  channel: PresenceChannel
): PresenceManifest {
  const channels = [...manifest.channels.filter((c) => c.id !== channel.id), channel];
  return { ...manifest, channels, lastUpdated: Date.now() };
}

export function setPrimaryChannel(
  manifest: PresenceManifest,
  channelId: string
): PresenceManifest {
  const channel = manifest.channels.find((c) => c.id === channelId);
  if (!channel) return manifest;
  return { ...manifest, primaryChannel: channelId, lastUpdated: Date.now() };
}

export function resolveActiveChannel(manifest: PresenceManifest): PresenceChannel | undefined {
  return manifest.channels.find((c) => c.id === manifest.primaryChannel && c.active)
    ?? manifest.channels.find((c) => c.active);
}

// ─── Broadcast ────────────────────────────────────────────────────────────────

export interface PresenceBroadcast {
  manifestId: string;
  channelId:  string;
  delta:      Record<string, unknown>; // Only changed fields
  at:         number;
}

export function broadcastPresence(
  manifest: PresenceManifest,
  delta: Record<string, unknown>
): PresenceBroadcast {
  return {
    manifestId: `${manifest.operatorId}_manifest`,
    channelId:  manifest.primaryChannel,
    delta,
    at:         Date.now(),
  };
}

// ─── Distribution policy ──────────────────────────────────────────────────────

export interface DistributionPolicy {
  allowedChannels:    PresenceChannelType[];
  syncState:          boolean;      // Whether state syncs across channels
  contextCarryFields: string[];     // Which carriedState fields persist across channels
  offlineCapable:     boolean;
}

export const DEFAULT_DISTRIBUTION_POLICY: DistributionPolicy = {
  allowedChannels:    ["web", "desktop", "api"],
  syncState:          true,
  contextCarryFields: ["missionId", "activeChamber"],
  offlineCapable:     false,
} as const;

// ─── Unified state ────────────────────────────────────────────────────────────

export interface DistributionState {
  manifests:   Record<string, PresenceManifest>; // operatorId → manifest
  policy:      DistributionPolicy;
  lastUpdated: number;
}

export function defaultDistributionState(): DistributionState {
  return {
    manifests:   {},
    policy:      DEFAULT_DISTRIBUTION_POLICY,
    lastUpdated: Date.now(),
  };
}
