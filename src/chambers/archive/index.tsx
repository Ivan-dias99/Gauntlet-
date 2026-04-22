import { useCallback, useEffect, useMemo, useState } from "react";
import { useSpine } from "../../spine/SpineContext";
import ErrorPanel from "../../shell/ErrorPanel";
import DormantPanel from "../../shell/DormantPanel";
import {
  ruberraFetch,
  isBackendUnreachable,
  parseBackendError,
  BackendError,
} from "../../lib/ruberraApi";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { useCopy } from "../../i18n/copy";
import ArchiveLayout from "./ArchiveLayout";
import StatsBar from "./StatsBar";
import RunList from "./RunList";
import RunDetail from "./RunDetail";
import {
  computeStats,
  tokenize,
  type RunRecord,
  type RunsResponse,
  type ServerStats,
  type Stats,
} from "./helpers";

// Archive — retrieval-first chamber. Split layout: left column is
// search + ledger, right column is the selected run's detail +
// provenance. Stats sit at the top of the ledger column; no separate
// telemetry slab. Matches the Surface chamber's composition grammar.

export default function Archive() {
  const { activeMission, principles } = useSpine();
  const copy = useCopy();
  const backend = useBackendStatus();
  const missionArtifact = activeMission?.lastArtifact ?? null;
  const doctrineCount = principles.length;

  const [runs, setRuns] = useState<RunRecord[] | null>(null);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const activeTokens = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activeMission) return set;
    for (const n of activeMission.notes ?? []) for (const t of tokenize(n.text)) set.add(t);
    for (const t of activeMission.tasks ?? []) for (const tk of tokenize(t.title)) set.add(tk);
    for (const a of activeMission.artifacts ?? []) for (const tk of tokenize(a.taskTitle)) set.add(tk);
    for (const tk of tokenize(activeMission.title)) set.add(tk);
    return set;
  }, [activeMission]);

  const fallbackStats = useMemo(() => computeStats(runs ?? []), [runs]);
  const stats: Stats = serverStats ? {
    total: serverStats.total,
    refused: serverStats.refused,
    refusalRate: serverStats.refusal_rate,
    avgLatencyMs: serverStats.avg_latency_ms,
    totalInput: serverStats.total_input_tokens,
    totalOutput: serverStats.total_output_tokens,
    toolCalls: serverStats.tool_calls,
    byRoute: serverStats.by_route,
  } : fallbackStats;

  const selectedRun = useMemo(
    () => runs?.find((r) => r.id === selectedId) ?? null,
    [runs, selectedId],
  );

  const loadMissionTelemetry = useCallback((missionId: string, signal: AbortSignal) => {
    setRuns(null);
    setServerStats(null);
    setErr(null);
    setOffline(false);
    const mid = encodeURIComponent(missionId);
    return Promise.allSettled([
      ruberraFetch(`/runs?mission_id=${mid}&limit=100`, { signal })
        .then(async (r) => {
          if (!r.ok) {
            const env = await parseBackendError(r);
            throw new BackendError(r.status, env, `runs ${r.status}`);
          }
          return (await r.json()) as RunsResponse;
        }),
      ruberraFetch(`/runs/stats?mission_id=${mid}`, { signal })
        .then(async (r) => {
          if (!r.ok) {
            const env = await parseBackendError(r);
            throw new BackendError(r.status, env, `stats ${r.status}`);
          }
          return (await r.json()) as ServerStats;
        }),
    ]).then(([runsRes, statsRes]) => {
      const failures = [runsRes, statsRes].flatMap((r) =>
        r.status === "rejected" ? [r.reason] : [],
      );
      const aborted = failures.some(
        (e) => e instanceof DOMException && e.name === "AbortError",
      );
      if (aborted) return;
      const unreachableHit = failures.find(isBackendUnreachable);
      if (unreachableHit) {
        setOffline(true);
        setErr(unreachableHit.message);
        return;
      }
      if (runsRes.status === "fulfilled") {
        setRuns(runsRes.value.records);
        // Auto-select the most recent run so the right pane never
        // starts empty when there is history to show.
        if (runsRes.value.records.length > 0) {
          setSelectedId((prev) => prev ?? runsRes.value.records[0].id);
        }
      } else {
        const e = runsRes.reason as Error;
        setErr(e instanceof Error ? e.message : String(e));
      }
      if (statsRes.status === "fulfilled") {
        setServerStats(statsRes.value);
      }
    });
  }, []);

  useEffect(() => {
    setSelectedId(null);
    if (!activeMission?.id) {
      setRuns([]);
      setServerStats(null);
      return;
    }
    const ac = new AbortController();
    loadMissionTelemetry(activeMission.id, ac.signal);
    return () => ac.abort();
  }, [activeMission?.id, loadMissionTelemetry]);

  function retry() {
    if (!activeMission?.id) return;
    const ac = new AbortController();
    loadMissionTelemetry(activeMission.id, ac.signal);
  }

  // Head — chamber identity + mission + mock pill, matches Surface's
  // composition rule (head above, split below).
  const head = (
    <div className="chamber-head" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span
        style={{
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--text-ghost)",
          fontFamily: "var(--mono)",
        }}
      >
        — ARCHIVE
      </span>
      <span style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)" }}>
        Retenção · proveniência · continuidade
      </span>
      {backend.mode === "mock" && (
        <span
          data-backend-mode="mock"
          title="Backend em modo simulado — runs registadas durante mock são canned"
          style={{
            fontSize: "var(--t-micro)",
            letterSpacing: "var(--track-label)",
            color: "var(--cc-warn)",
            fontFamily: "var(--mono)",
            textTransform: "uppercase",
            padding: "2px 8px",
            border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
            borderRadius: "var(--radius-pill)",
          }}
        >
          mock
        </span>
      )}
      {activeMission && (
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--text-ghost)",
            letterSpacing: "var(--track-meta)",
            textTransform: "uppercase",
          }}
        >
          missão · {activeMission.title}
        </span>
      )}
    </div>
  );

  // Left column: stats on top + list below.
  const left = (() => {
    if (err && offline) {
      return (
        <DormantPanel
          detail={copy.dormantMemory}
          action={
            <button
              onClick={retry}
              data-memory-retry
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 999,
                cursor: "pointer",
              }}
            >
              tentar novamente
            </button>
          }
        />
      );
    }
    if (err) {
      return (
        <ErrorPanel
          severity="critical"
          title={copy.memoryErrorTitle}
          message={`${copy.memoryErrorPrefix} ${err}`}
        />
      );
    }
    if (runs === null) {
      return (
        <div
          data-memory-loading
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "var(--space-3)",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "var(--track-meta)",
            color: "var(--text-ghost)",
          }}
        >
          <span
            className="breathe"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--cc-info)",
            }}
          />
          {copy.memoryLoading}
        </div>
      );
    }
    return (
      <>
        <StatsBar stats={stats} />
        <RunList
          runs={runs}
          selectedId={selectedId}
          onSelect={setSelectedId}
          activeTokens={activeTokens}
        />
      </>
    );
  })();

  return (
    <div className="chamber-shell" data-chamber="archive">
      {head}
      <ArchiveLayout
        left={left}
        right={
          <RunDetail
            run={selectedRun}
            missionArtifact={missionArtifact}
            doctrineCount={doctrineCount}
          />
        }
      />
    </div>
  );
}
