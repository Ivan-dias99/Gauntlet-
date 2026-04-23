import { useState, useRef, useEffect } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useSignal, RouteEvent } from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { Note } from "../../spine/types";
import ChamberHead from "../../shell/ChamberHead";
import ErrorPanel from "../../shell/ErrorPanel";
import DormantPanel from "../../shell/DormantPanel";
import EmptyState from "../../shell/EmptyState";
import { useCopy } from "../../i18n/copy";
import Thread from "./Thread";
import Composer from "./Composer";
import VerdictBadge from "./VerdictBadge";
import {
  EMPTY_LIVE,
  extractAnswer,
  inferPath,
  reduceEvent,
  type LiveState,
  type TriadResult,
  type VerdictState,
} from "./helpers";

// Insight — conversation-first. Chamber head + empty state or Thread +
// live streaming indicator + verdict badge + composer. Primitives are
// extracted (Thread, Composer, VerdictBadge, helpers); this aggregator
// wires state, submit, handoff, and streaming reduction. Chamber-DNA
// cascades from data-chamber="insight" on the shell.

export default function Insight() {
  const {
    activeMission, addNoteToMission, addTask, createMission,
    principles, logDoctrineApplied,
  } = useSpine();
  const { streamRoute, pending, error, unreachable, errorEnvelope } = useSignal();
  const backend = useBackendStatus();
  const copy = useCopy();

  const [input, setInput] = useState("");
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [lastConfidence, setLastConfidence] = useState<string | null>(null);
  const [lastVerdict, setLastVerdict] = useState<VerdictState | null>(null);
  const [promoteId, setPromoteId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Esc closes any pending handoff confirm.
  useEffect(() => {
    if (!promoteId) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setPromoteId(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [promoteId]);

  // Scroll to bottom on new activity.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, pending, live.lastEventLabel]);

  function confirmPromote(note: Note) {
    const raw = note.text.trim();
    const title = raw.length > 120 ? raw.slice(0, 117).trimEnd() + "…" : raw;
    addTask(title, "lab");
    if (activeMission) {
      const preview = raw.length > 80 ? raw.slice(0, 77).trimEnd() + "…" : raw;
      addNoteToMission(activeMission.id, `↪ handoff → terminal: ${preview}`, "ai");
    }
    setPromoteId(null);
    window.dispatchEvent(new CustomEvent("signal:chamber", { detail: "terminal" }));
    window.dispatchEvent(new CustomEvent("ruberra:chamber", { detail: "terminal" }));
  }

  // Refs capture streaming metadata without stale-closure issues.
  const capturedJudge = useRef<{
    confidence: string; shouldRefuse: boolean; reasoning: string; divergenceCount: number;
  } | null>(null);
  const capturedTriad = useRef<{ priorFailure: boolean }>({ priorFailure: false });
  const capturedAgent = useRef<{ iter: number; toolCount: number }>({ iter: 0, toolCount: 0 });

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    // First-send creates mission implicitly (Wave-2). createMission returns
    // the new id synchronously so we can thread mission_id into the request
    // without waiting for setState to expose activeMission.id.
    let targetMissionId = activeMission?.id;
    if (!targetMissionId) {
      const title = v.length > 64 ? v.slice(0, 61).trimEnd() + "…" : v;
      targetMissionId = createMission(title, "insight");
    }

    addNoteToMission(targetMissionId, v, "user");
    if (principles.length > 0) logDoctrineApplied(principles.length);
    setInput("");
    setLive({ ...EMPTY_LIVE });
    setLastConfidence(null);
    setLastVerdict(null);
    capturedJudge.current = null;
    capturedTriad.current = { priorFailure: false };
    capturedAgent.current = { iter: 0, toolCount: 0 };

    // Context + principles clamps — SignalQuery caps at 5000 / 64.
    const priorNotes = (activeMission?.notes ?? [])
      .slice(0, 8)
      .map((n) => `${n.role === "ai" ? "AI" : "User"}: ${n.text}`)
      .reverse()
      .join("\n");
    const clampedContext = priorNotes.length > 5000 ? priorNotes.slice(-5000) : priorNotes;
    const clampedPrinciples = principles.length > 64
      ? principles.slice(-64).map((p) => p.text)
      : principles.map((p) => p.text);

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    let capturedPath: "agent" | "triad" | null = null;

    await streamRoute(
      {
        question: v,
        context: clampedContext || undefined,
        mission_id: targetMissionId,
        principles: clampedPrinciples.length ? clampedPrinciples : undefined,
        chamber: "insight",
      },
      (ev: RouteEvent) => {
        if (ev.type === "route") capturedPath = ev.path;
        if (ev.type === "triad_start") {
          capturedTriad.current = { priorFailure: ev.has_prior_failure };
        }
        if (ev.type === "judge_done") {
          capturedJudge.current = {
            confidence: ev.confidence,
            shouldRefuse: ev.should_refuse,
            reasoning: ev.reasoning,
            divergenceCount: ev.divergence_count,
          };
        }
        if (ev.type === "iteration") capturedAgent.current.iter = ev.n;
        if (ev.type === "tool_use") capturedAgent.current.toolCount++;

        setLive((prev) => reduceEvent(prev, ev));

        if (ev.type === "done") {
          const path = capturedPath ?? inferPath(ev);
          const answer = extractAnswer(path, ev.result);
          if (answer) addNoteToMission(targetMissionId, answer.trim(), "ai");

          const r = ev.result as TriadResult;
          const refused = !!r.refused;
          const priorFail = !!r.matched_prior_failure;
          const conf = r.confidence;
          if (conf) setLastConfidence(conf);

          setLastVerdict({
            routePath: path,
            confidence: capturedJudge.current?.confidence ?? conf ?? null,
            refused,
            reasoning: capturedJudge.current?.reasoning ?? r.judge_reasoning ?? "",
            divergenceCount: capturedJudge.current?.divergenceCount ?? 0,
            priorFailure: capturedTriad.current.priorFailure || priorFail,
            agentIter: capturedAgent.current.iter,
            agentToolCount: capturedAgent.current.toolCount,
            question: v,
          });
        }
      },
      ac.signal,
    );
  }

  const rightSlot = (() => {
    if (pending) {
      return (
        <span
          style={{
            fontSize: "var(--t-micro)",
            color: "var(--cc-info)",
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            className="breathe"
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }}
          />
          {live.routePath ? live.routePath : "analisando"}
        </span>
      );
    }
    if (live.routePath && lastConfidence) {
      const refused = !!lastVerdict?.refused;
      const chipColor = refused
        ? "var(--cc-err)"
        : lastConfidence === "high"
        ? "var(--cc-ok)"
        : lastConfidence === "low"
        ? "var(--cc-warn)"
        : "var(--text-ghost)";
      return (
        <span
          style={{
            fontSize: "var(--t-micro)",
            color: chipColor,
            fontFamily: "var(--mono)",
            letterSpacing: "var(--track-label)",
            textTransform: "uppercase",
          }}
        >
          {live.routePath} · {refused ? "recusado" : lastConfidence}
        </span>
      );
    }
    return null;
  })();

  const isEmpty = notes.length === 0 && !pending && !error;

  return (
    <div className="chamber-shell" data-chamber="insight">
      <ChamberHead
        kicker={copy.labKicker}
        tagline={copy.labTagline}
        mock={backend.mode === "mock"}
        principlesCount={principles.length}
        right={rightSlot}
      />

      {/* Body — thread, live indicator, verdict. Scrollable. */}
      <div
        className="chamber-body"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          ...(isEmpty ? { justifyContent: "center", alignItems: "center" } : null),
        }}
      >
        {isEmpty ? (
          <EmptyState
            glyph="※"
            kicker={activeMission ? copy.labEmptyActiveKicker : copy.labEmptyNoMissionKicker}
            body={activeMission ? copy.labEmpty : copy.labEmptyNoMissionBody}
            hint={activeMission ? copy.labEmptyActiveHint : copy.labEmptyNoMissionHint}
          />
        ) : (
          <>
            <Thread
              notes={notes}
              promoteId={promoteId}
              onPromoteRequest={(id) => setPromoteId(id)}
              onPromoteConfirm={confirmPromote}
              onPromoteCancel={() => setPromoteId(null)}
            />

            {pending && (
              <div
                data-insight-live
                className="toolRise"
                style={{
                  alignSelf: "stretch",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: "var(--bg-input)",
                  border: "1px dashed color-mix(in oklab, var(--cc-info) 30%, var(--border-soft))",
                  borderRadius: "var(--radius-control)",
                  fontFamily: "var(--mono)",
                  fontSize: "var(--t-micro)",
                  letterSpacing: "var(--track-meta)",
                  color: "var(--text-muted)",
                }}
              >
                <span
                  className="breathe"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--cc-info)",
                    boxShadow: "0 0 0 3px color-mix(in oklab, var(--cc-info) 22%, transparent)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {live.lastEventLabel}
                </span>
              </div>
            )}

            {lastVerdict && !pending && <VerdictBadge verdict={lastVerdict} />}
          </>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error / dormant — anchored above the composer, consistent
          location across all chambers' failure surfaces. */}
      {error && !pending && (
        <div style={{ padding: "0 clamp(20px, 5vw, 64px) var(--space-2)" }}>
          {unreachable ? (
            <DormantPanel detail={copy.dormantLab} />
          ) : (
            <ErrorPanel
              severity={
                errorEnvelope?.error === "engine_not_initialized" ||
                errorEnvelope?.error === "mock_mode"
                  ? "warn"
                  : "critical"
              }
              title={copy.labErrorTitle}
              message={error}
            />
          )}
        </div>
      )}

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={submit}
        pending={pending}
        voiceLabel={copy.labInputVoice}
        placeholder={
          pending ? copy.labPlaceholderPending :
          lastVerdict?.refused ? copy.labPlaceholderRefused :
          !activeMission ? copy.labPlaceholderNoMission :
          copy.labPlaceholder
        }
      />
    </div>
  );
}
