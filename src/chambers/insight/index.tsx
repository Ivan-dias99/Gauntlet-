import { useState, useRef, useEffect } from "react";
import { useSpine } from "../../spine/SpineContext";
import { useSignal, RouteEvent } from "../../hooks/useSignal";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { Note } from "../../spine/types";
import ChamberHead from "../../shell/ChamberHead";
import ErrorPanel from "../../shell/ErrorPanel";
import DormantPanel from "../../shell/DormantPanel";
import { useCopy } from "../../i18n/copy";
import Thread from "./Thread";
import Composer from "./Composer";
import VerdictBadge from "./VerdictBadge";
import InsightLayout from "./InsightLayout";
import ContextStrip from "./ContextStrip";
import {
  EMPTY_LIVE,
  extractAnswer,
  inferPath,
  reduceEvent,
  type LiveState,
  type TriadResult,
  type VerdictState,
} from "./helpers";

// Insight — central conversation chamber. Single column, 780px reading
// width. A thin context strip sits under the chamber head, the
// conversation occupies the middle, the flagship composer anchors the
// bottom. No lateral rail, no stacked support cards: Insight now
// behaves as the chamber for talking to the main intelligence of
// Signal, not as a dashboard with side furniture.

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
  const [verdictTrail, setVerdictTrail] = useState<VerdictState[]>([]);
  const [promoteId, setPromoteId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVerdictTrail([]);
  }, [activeMission?.id]);

  // Esc closes a pending handoff confirm; during a streaming call it
  // aborts the in-flight request. Promote-confirm wins when both are
  // open simultaneously — it is the more recent user intent.
  useEffect(() => {
    if (!promoteId && !pending) return;
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (promoteId) { setPromoteId(null); return; }
      if (pending) abortRef.current?.abort();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [promoteId, pending]);

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

  const capturedJudge = useRef<{
    confidence: string; shouldRefuse: boolean; reasoning: string; divergenceCount: number;
  } | null>(null);
  const capturedTriad = useRef<{ priorFailure: boolean }>({ priorFailure: false });
  const capturedAgent = useRef<{ iter: number; toolCount: number }>({ iter: 0, toolCount: 0 });

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

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

          const verdict: VerdictState = {
            routePath: path,
            confidence: capturedJudge.current?.confidence ?? conf ?? null,
            refused,
            reasoning: capturedJudge.current?.reasoning ?? r.judge_reasoning ?? "",
            divergenceCount: capturedJudge.current?.divergenceCount ?? 0,
            priorFailure: capturedTriad.current.priorFailure || priorFail,
            agentIter: capturedAgent.current.iter,
            agentToolCount: capturedAgent.current.toolCount,
            question: v,
          };
          setLastVerdict(verdict);
          setVerdictTrail((prev) => [...prev, verdict].slice(-12));
        }
      },
      ac.signal,
    );
  }

  const isEmpty = notes.length === 0 && !pending && !error;
  const priorTurnsInContext = Math.min(activeMission?.notes?.length ?? 0, 8);

  const strip = (
    <ContextStrip
      mission={activeMission}
      principles={principles}
      trail={verdictTrail}
      live={live}
      pending={pending}
      lastConfidence={lastConfidence}
      lastVerdictRefused={!!lastVerdict?.refused}
      onAbort={() => abortRef.current?.abort()}
    />
  );

  // Scrolling content: the ready cue (when empty) or the thread +
  // verdict badge. Nothing else lives here. Error/dormant and the
  // composer land on the floor below so they stay pinned.
  const scroll = isEmpty ? (
    <ReadyCue
      activeMission={!!activeMission}
      copy={copy}
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
      {lastVerdict && !pending && <VerdictBadge verdict={lastVerdict} />}
      <div ref={bottomRef} />
    </>
  );

  const floor = (
    <>
      {error && !pending && (
        <div data-insight-failure-slot>
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
        principlesCount={principles.length}
        priorTurns={priorTurnsInContext}
        mockMode={backend.mode === "mock"}
        routeHint={lastVerdict?.routePath}
      />
    </>
  );

  return (
    <div className="chamber-shell" data-chamber="insight">
      {/* Principles count lives in the context strip below — the head
          does not duplicate it. Mock flag stays because it's chamber-
          agnostic and readers expect it where the chamber identity is. */}
      <ChamberHead
        kicker={copy.labKicker}
        tagline={copy.labTagline}
        mock={backend.mode === "mock"}
      />
      <InsightLayout strip={strip} scroll={scroll} floor={floor} />
    </div>
  );
}

// ——— Ready cue ———
//
// One calm invitation when the session is empty. The composer itself
// is the loud anchor; this cue only sets the tone.

function ReadyCue({
  activeMission, copy,
}: {
  activeMission: boolean;
  copy: ReturnType<typeof useCopy>;
}) {
  return (
    <div className="insight-ready" data-insight-ready>
      <span className="insight-ready-kicker">
        {copy.labThreadEmptyKicker}
      </span>
      <span className="insight-ready-body">
        {activeMission ? copy.labThreadEmptyActiveBody : copy.labThreadEmptyIdleBody}
      </span>
    </div>
  );
}
