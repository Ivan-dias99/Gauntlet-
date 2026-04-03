/**
 * RUBERRA Sovereign MCP Client
 * Thin async wrapper over the /mcp edge-function endpoint.
 * All calls are fire-and-forget safe — callers must not block on these.
 * Failure is honest: errors are logged, never swallowed silently, never fake.
 */

import { projectId, publicAnonKey } from "@/utils/supabase/info";
import type { Mission, MissionStatus, MissionChamberLead } from "../dna/mission-substrate";

const MCP_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b9f46b68/mcp`;

async function callMcp<T = unknown>(tool: string, params: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ tool, params }),
    });
    if (!res.ok) {
      console.warn(`[Ruberra MCP] ${tool} → HTTP ${res.status}`);
      return null;
    }
    const json = await res.json() as { ok?: boolean } & T;
    if (!json.ok) {
      console.warn(`[Ruberra MCP] ${tool} → error`, json);
      return null;
    }
    return json;
  } catch (err) {
    console.warn(`[Ruberra MCP] ${tool} → fetch failed`, err);
    return null;
  }
}

// ─── mission.create ───────────────────────────────────────────────────────────

export async function mcpMissionCreate(params: {
  name: string;
  chamberLead: MissionChamberLead;
  description?: string;
  outcomeStatement?: string;
  tags?: string[];
}): Promise<{ mission: Mission } | null> {
  return callMcp<{ mission: Mission }>("mission.create", params);
}

// ─── mission.get ──────────────────────────────────────────────────────────────

export async function mcpMissionGet(id: string): Promise<{ mission: Mission } | null> {
  return callMcp<{ mission: Mission }>("mission.get", { id });
}

// ─── mission.list ─────────────────────────────────────────────────────────────

export interface MissionIndexEntry {
  id: string;
  name: string;
  status: MissionStatus;
  chamberLead: MissionChamberLead;
  updatedAt: number;
}

export async function mcpMissionList(status?: MissionStatus): Promise<{ missions: MissionIndexEntry[]; total: number } | null> {
  return callMcp<{ missions: MissionIndexEntry[]; total: number }>("mission.list", status ? { status } : {});
}

// ─── mission.updateState ──────────────────────────────────────────────────────

export async function mcpMissionUpdateState(id: string, state: MissionStatus, reason?: string): Promise<{ from: MissionStatus; to: MissionStatus } | null> {
  return callMcp<{ from: MissionStatus; to: MissionStatus }>("mission.updateState", { id, state, reason: reason ?? "" });
}

// ─── mission.attachContinuity ─────────────────────────────────────────────────

export async function mcpMissionAttachContinuity(id: string, continuityId: string): Promise<{ refs: string[] } | null> {
  return callMcp<{ refs: string[] }>("mission.attachContinuity", { id, continuityId });
}

// ─── mission.buildHandoff ─────────────────────────────────────────────────────

export interface MissionHandoff {
  missionId: string;
  name: string;
  chamberLead: MissionChamberLead;
  currentState: MissionStatus;
  outcomeStatement: string;
  continuityRefs: string[];
  decisions: unknown[];
  lastRunDigest: string | null;
  artifacts: Array<{ id: string; label: string; type: string }>;
  builtAt: number;
  schemaVersion: string;
}

export async function mcpMissionBuildHandoff(id: string): Promise<{ handoff: MissionHandoff } | null> {
  return callMcp<{ handoff: MissionHandoff }>("mission.buildHandoff", { id });
}
