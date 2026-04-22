import { useState, useRef, useEffect } from "react";
import { useSpine } from "../spine/SpineContext";
import { useRuberra, RouteEvent } from "../hooks/useRuberra";
import { useBackendStatus } from "../hooks/useBackendStatus";
import { Note } from "../spine/types";
import ErrorPanel from "../shell/ErrorPanel";
import DormantPanel from "../shell/DormantPanel";
import EmptyState from "../shell/EmptyState";
import { useCopy } from "../i18n/copy";

interface TriadResult {
  answer?: string | null;
  refused?: boolean;
  refusal_message?: string | null;
  confidence?: string;
  judge_reasoning?: string;
  triad_agreement?: string;
  matched_prior_failure?: boolean;
}
interface AgentResult {
  answer?: string;
  tool_calls?: Array<{ name: string; ok: boolean }>;
  iterations?: number;
  terminated_early?: boolean;
  termination_reason?: string | null;
}

function extractAnswer(
  routePath: "agent" | "triad" | null,
  result: Record<string, unknown>,
): string {
  if (routePath === "triad") {
    const r = result as TriadResult;
    if (r.refused) return r.refusal_message ?? "(refusal sem mensagem)";
    return r.answer ?? "(sem resposta)";
  }
  return (result as AgentResult).answer ?? "(sem resposta)";
}

interface VerdictState {
  routePath: "agent" | "triad";
  confidence: string | null;
  refused: boolean;
  reasoning: string;
  divergenceCount: number;
  priorFailure: boolean;
  agentIter: number;
  agentToolCount: number;
  question: string;
}

interface LiveState {
  routePath: "agent" | "triad" | null;
  triadCompleted: number;
  triadTotal: number;
  judgeState: "pending" | "evaluating" | "done" | null;
  judgeConfidence: string | null;
  agentIter: number;
  agentToolCount: number;
  lastEventLabel: string;
}

const EMPTY_LIVE: LiveState = {
  routePath: null,
  triadCompleted: 0,
  triadTotal: 0,
  judgeState: null,
  judgeConfidence: null,
  agentIter: 0,
  agentToolCount: 0,
  lastEventLabel: "a rotear...",
};

export default function Lab() {
  const {
    activeMission, addNoteToMission, addTask, createMission,
    principles, logDoctrineApplied,
  } = useSpine();
  const { streamRoute, pending, error, unreachable, errorEnvelope } = useRuberra();
  const backend = useBackendStatus();
  const copy = useCopy();
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [live, setLive] = useState<LiveState>(EMPTY_LIVE);
  const [lastConfidence, setLastConfidence] = useState<string | null>(null);
  const [lastVerdict, setLastVerdict] = useState<VerdictState | null>(null);
  const [promoteId, setPromoteId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Esc closes any pending handoff confirm.
  useEffect(() => {
    if (!promoteId) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setPromoteId(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [promoteId]);

  function confirmPromote(note: Note) {
    const raw = note.text.trim();
    const title = raw.length > 120 ? raw.slice(0, 117).trimEnd() + "…" : raw;
    addTask(title, "lab");
    setPromoteId(null);
    // Dispatch both the new and the legacy event name during the Wave-0 →
    // Wave-8 compatibility window so any listener wired to either key
    // keeps firing. Shell.tsx listens to both; tests or external listeners
    // written against the old name are not silently broken.
    //
    // Detail value flipped to the Wave-1 canonical key "terminal". The
    // legacy event dispatch keeps the new detail value — Shell's listener
    // normalizes through the Chamber type either way, and no external
    // listener in this repo reads the detail expecting the old string.
    window.dispatchEvent(new CustomEvent("signal:chamber", { detail: "terminal" }));
    window.dispatchEvent(new CustomEvent("ruberra:chamber", { detail: "terminal" }));
  }

  // Refs capture streaming metadata without stale closure issues
  const capturedJudge = useRef<{
    confidence: string; shouldRefuse: boolean; reasoning: string; divergenceCount: number;
  } | null>(null);
  const capturedTriad = useRef<{ priorFailure: boolean }>({ priorFailure: false });
  const capturedAgent = useRef<{ iter: number; toolCount: number }>({ iter: 0, toolCount: 0 });

  const notes: Note[] = [...(activeMission?.notes ?? [])].reverse();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMission?.notes.length, pending, live.lastEventLabel]);

  useEffect(() => {
    if (!pending) inputRef.current?.focus();
  }, [pending]);

  async function submit() {
    const v = input.trim();
    if (!v || pending) return;

    // Wave-2 inline new-thread: when there is no active mission, the first
    // send creates one implicitly. Title is derived from the question (≤64
    // chars so the mission pill stays clean). The new id is known
    // synchronously because createMission returns it — we do not wait for
    // the setState round-trip to expose activeMission.id.
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
    // Backend caps `context` at 5000 chars (RuberraQuery in models.py). Truncate
    // at the char boundary so a long-running mission never generates a silent
    // 422 the user cannot see.
    const clampedContext =
      priorNotes.length > 5000 ? priorNotes.slice(-5000) : priorNotes;
    // Backend caps `principles` at 64 entries. A School user may have more;
    // keep the newest ones — those are the ones the user most recently chose
    // to enforce.
    const clampedPrinciples =
      principles.length > 64
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
        if (ev.type === "iteration") {
          capturedAgent.current.iter = ev.n;
        }
        if (ev.type === "tool_use") {
          capturedAgent.current.toolCount++;
        }

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

  return (
    <div className="chamber-shell">

      {/* Header */}
      <div className="chamber-head" style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "var(--text-ghost)", fontFamily: "var(--mono)" }}>
          {copy.labKicker}
        </span>
        <span style={{ fontSize: "var(--t-body-sec)", color: "var(--text-muted)" }}>
          {copy.labTagline}
        </span>
        {backend.mode === "mock" && (
          <span
            data-backend-mode="mock"
            title="Backend em modo simulado — respostas são canned, não Anthropic real"
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--cc-warn)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--cc-warn) 36%, transparent)",
              borderRadius: "var(--radius-pill)",
              lineHeight: 1.4,
            }}
          >
            mock
          </span>
        )}
        {principles.length > 0 && (
          <span
            data-principles-in-context
            title={`${principles.length} princípio${principles.length !== 1 ? "s" : ""} da doutrina presente nesta câmara`}
            style={{
              fontSize: "var(--t-micro)",
              letterSpacing: "var(--track-label)",
              color: "var(--accent)",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
              padding: "2px 8px",
              border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
              borderRadius: "var(--radius-pill)",
              lineHeight: 1.4,
            }}
          >
            sob § {principles.length}
          </span>
        )}
        {pending && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--cc-info)", fontFamily: "var(--mono)", letterSpacing: 2, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="breathe" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cc-info)" }} />
            {live.routePath ? live.routePath.toUpperCase() : "ANALISANDO"}
          </span>
        )}
        {!pending && live.routePath && lastConfidence && (() => {
          const refused = !!lastVerdict?.refused;
          const chipColor = refused
            ? "var(--cc-err)"
            : lastConfidence === "high"
            ? "var(--cc-ok)"
            : lastConfidence === "low"
            ? "var(--cc-warn)"
            : "var(--text-ghost)";
          return (
            <span style={{ marginLeft: "auto", fontSize: 10, color: chipColor, fontFamily: "var(--mono)", letterSpacing: 1 }}>
              {live.routePath.toUpperCase()} · {refused ? "recusado" : lastConfidence}
            </span>
          );
        })()}
      </div>

      {/* Message thread */}
      <div className="chamber-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {notes.length === 0 && !pending && !error && (
          activeMission ? (
            <EmptyState
              glyph="※"
              kicker={copy.labEmptyActiveKicker}
              body={copy.labEmpty}
              hint={copy.labEmptyActiveHint}
              style={{ marginTop: "12vh" }}
            />
          ) : (
            <EmptyState
              glyph="◌"
              kicker={copy.labEmptyNoMissionKicker}
              body={copy.labEmptyNoMissionBody}
              hint={copy.labEmptyNoMissionHint}
              tone="warn"
              style={{ marginTop: "12vh" }}
            />
          )
        )}

        {notes.map((n) => (
          <LabTurnRow
            key={n.id}
            note={n}
            promoting={promoteId === n.id}
            onPromoteRequest={() => setPromoteId(n.id)}
            onPromoteConfirm={() => confirmPromote(n)}
            onPromoteCancel={() => setPromoteId(null)}
          />
        ))}

        {pending && (
          <div className="toolRise" style={{ alignSelf: "flex-start", maxWidth: 520, minWidth: 260, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-input)", border: "1px dashed var(--border)", borderRadius: 12, fontFamily: "var(--mono)", fontSize: 11, color: "var(--cc-dim)", letterSpacing: ".04em" }}>
            <span className="breathe" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cc-info)", boxShadow: "0 0 0 4px color-mix(in oklab, var(--cc-info) 22%, transparent)" }} />
            <span>{live.lastEventLabel}</span>
            <div className="scanbar" style={{ flex: 1, height: 2, background: "var(--border-soft)", borderRadius: 2 }} />
          </div>
        )}

        {error && !pending && (unreachable ? (
          <DormantPanel detail={copy.dormantLab} />
        ) : (
          // Severity hierarchy: a typed engine_not_initialized / mock_mode is
          // a transient warning, not a critical failure. Critical is reserved
          // for engine_error and unknown shapes that surprise the chamber.
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
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Verdict panel — appears after each query, clears on next submit */}
      {lastVerdict && !pending && (
        <VerdictPanel verdict={lastVerdict} />
      )}

      {/* Input */}
      <div
        data-architect-input="directiva"
        data-architect-input-state={inputFocused ? "focused" : "idle"}
        style={{ margin: "0 clamp(20px, 5vw, 64px) 18px" }}
      >
        <div
          data-architect-voice
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: inputFocused ? "var(--accent)" : "var(--text-ghost)",
            marginBottom: 8,
            paddingLeft: 4,
            transition: "color 0.15s",
          }}
        >
          {copy.labInputVoice}
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, opacity: activeMission ? 1 : 0.7 }}>
        <span
          className={pending ? "breathe" : ""}
          style={{ width: 8, height: 8, borderRadius: "50%", background: pending ? "var(--cc-info)" : activeMission ? "var(--cc-prompt)" : "var(--border)", boxShadow: `0 0 0 4px color-mix(in oklab, ${pending ? "var(--cc-info)" : activeMission ? "var(--cc-prompt)" : "var(--border)"} 22%, transparent)`, flexShrink: 0 }}
        />
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder={
            !activeMission ? copy.labPlaceholderNoMission :
            pending ? copy.labPlaceholderPending :
            lastVerdict?.refused ? copy.labPlaceholderRefused :
            copy.labPlaceholder
          }
          disabled={pending || !activeMission}
          style={{ flex: 1, fontSize: 14, color: "var(--text-primary)", fontFamily: "var(--sans)", opacity: pending || !activeMission ? 0.55 : 1, padding: "6px 0", cursor: !activeMission ? "not-allowed" : undefined }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-ghost)", letterSpacing: ".2em", textTransform: "uppercase" }}>
          {input.length > 0 ? `${input.length}` : ""}
        </span>
        {input.trim() && !pending && activeMission && (
          <button
            onClick={submit}
            className="fadeIn"
            style={{ background: "none", border: "1px solid var(--accent-dim)", color: "var(--accent)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", padding: "7px 14px", borderRadius: 999, fontFamily: "var(--mono)", transition: "all .2s var(--ease-swift)", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-glow)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Enter ↵
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

function VerdictPanel({ verdict }: { verdict: VerdictState }) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const isAgent = verdict.routePath === "agent";
  const isHigh = verdict.confidence === "high";
  const isRefused = verdict.refused;

  const routeColor = isRefused
    ? "var(--cc-err)"
    : isAgent
    ? "var(--cc-warn)"
    : "var(--accent)";
  const leftAccent = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "var(--accent-dim)";
  const confidenceColor = isRefused
    ? "var(--cc-err)"
    : isHigh
    ? "var(--cc-ok)"
    : "var(--cc-warn)";
  const kickerColor = isRefused ? "var(--cc-err)" : "var(--text-ghost)";

  const shortQ = verdict.question.length > 90
    ? verdict.question.slice(0, 90).trimEnd() + "…"
    : verdict.question;

  return (
    <div
      className="fadeUp"
      style={{
        margin: "0 clamp(20px, 5vw, 64px) 8px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-soft)",
        borderLeft: `2px solid ${leftAccent}`,
        borderRadius: 10,
        padding: "10px 14px 12px",
        fontFamily: "var(--mono)",
      }}
    >
      {/* Kicker: anchors the panel as the lineage of the preceding AI turn */}
      <div style={{
        fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase",
        color: kickerColor, marginBottom: 4,
      }}>
        — VERDITO
      </div>

      {/* Citation: the question this verdict judges */}
      {verdict.question && (
        <div style={{
          fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--sans)",
          fontStyle: "italic", marginBottom: 8, lineHeight: 1.45,
        }}>
          sobre: «{shortQ}»
        </div>
      )}

      {/* Provenance trail: route · stages · outcome */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: routeColor }}>
          {verdict.routePath}
        </span>
        {!isAgent && verdict.confidence && (
          <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: confidenceColor }}>
            {verdict.confidence}
          </span>
        )}
        {isAgent && (
          <span style={{ fontSize: 10, color: "var(--text-ghost)" }}>
            {verdict.agentIter} iter · {verdict.agentToolCount} tools
          </span>
        )}
        {verdict.divergenceCount > 0 && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)", letterSpacing: 1 }}>
            ⊘ {verdict.divergenceCount} divergência{verdict.divergenceCount !== 1 ? "s" : ""}
          </span>
        )}
        {verdict.priorFailure && (
          <span style={{ fontSize: 10, color: "var(--cc-warn)" }}>⚠ falha prévia</span>
        )}
        {isRefused && (
          <span style={{ fontSize: 10, letterSpacing: 2, color: "var(--cc-err)", textTransform: "uppercase", marginLeft: "auto" }}>
            recusado
          </span>
        )}
      </div>

      {/* Judge reasoning — expandable when long */}
      {verdict.reasoning && (() => {
        const overflows = verdict.reasoning.length > 200;
        const displayed = !overflows || reasoningExpanded
          ? verdict.reasoning
          : verdict.reasoning.slice(0, 200) + "…";
        return (
          <div style={{ marginTop: 5, fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "var(--sans)" }}>
            {displayed}
            {overflows && (
              <button
                onClick={() => setReasoningExpanded((v) => !v)}
                style={{
                  marginLeft: 8, background: "none", border: "none", padding: 0,
                  color: "var(--accent)", fontFamily: "var(--mono)", fontSize: 10,
                  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                }}
              >
                {reasoningExpanded ? "menos" : "mais"}
              </button>
            )}
          </div>
        );
      })()}

      {/* Pressure hint — tailored to the dominant pressure signal */}
      {(() => {
        const isLowConfidence = verdict.confidence === "low" && !isAgent;
        const hasPressureSignal =
          isRefused ||
          verdict.divergenceCount > 0 ||
          isLowConfidence ||
          verdict.priorFailure;
        if (!hasPressureSignal) return null;
        const hint = isRefused
          ? "→ reformula · fractura a questão · adiciona contexto específico"
          : verdict.divergenceCount > 0
          ? "→ pressiona onde divergiu · pede clarificação · verifica a premissa"
          : isLowConfidence
          ? "→ confiança baixa · exige evidência · fractura a questão"
          : "→ falha prévia registada · muda o ângulo · evita a mesma premissa";
        return (
          <div style={{ marginTop: 6, fontSize: 10, color: "var(--text-ghost)", letterSpacing: 0.5 }}>
            {hint}
          </div>
        );
      })()}
    </div>
  );
}

function LabTurnRow({
  note,
  promoting,
  onPromoteRequest,
  onPromoteConfirm,
  onPromoteCancel,
}: {
  note: Note;
  promoting: boolean;
  onPromoteRequest: () => void;
  onPromoteConfirm: () => void;
  onPromoteCancel: () => void;
}) {
  const isAI = note.role === "ai";
  const isRefusal = isAI && (
    note.text.startsWith("Não sei responder") ||
    note.text.startsWith("⚠️ **Ruberra")
  );
  const isWarning = isAI && note.text.startsWith("⚠ Esta pergunta");
  const canPromote = isAI && !isRefusal && !isWarning;

  let label: string;
  let borderColor: string;
  let labelColor: string;
  let dotColor: string;
  if (!isAI) {
    label = "PRESSÃO";
    borderColor = "var(--cc-prompt)";
    labelColor = "var(--text-muted)";
    dotColor = "var(--cc-prompt)";
  } else if (isRefusal) {
    label = "RECUSADO";
    borderColor = "var(--cc-err)";
    labelColor = "var(--cc-err)";
    dotColor = "var(--cc-err)";
  } else if (isWarning) {
    label = "AVISO";
    borderColor = "var(--cc-warn)";
    labelColor = "var(--cc-warn)";
    dotColor = "var(--cc-warn)";
  } else {
    label = "ANÁLISE";
    borderColor = "var(--accent-dim)";
    labelColor = "var(--text-ghost)";
    dotColor = "var(--ember)";
  }

  return (
    <div
      className="fadeUp"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 16px 12px",
        background: isAI ? "var(--bg-input)" : "transparent",
        borderLeft: `2px solid ${borderColor}`,
        borderRadius: "0 10px 10px 0",
        opacity: isRefusal ? 0.92 : 1,
        maxWidth: 780,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase" }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor }} />
        <span style={{ color: labelColor }}>{label}</span>
        <span style={{ color: "var(--text-ghost)", marginLeft: "auto", letterSpacing: 0.5 }}>
          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.65, whiteSpace: "pre-wrap", fontFamily: "var(--sans)" }}>
        {note.text}
      </div>
      {canPromote && !promoting && (
        <button
          onClick={onPromoteRequest}
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--text-ghost)",
            padding: 0,
            marginTop: 2,
            cursor: "pointer",
            transition: "color .16s var(--ease-swift)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-ghost)"; }}
        >
          → construção
        </button>
      )}
      {canPromote && promoting && (
        <div style={{
          marginTop: 6,
          paddingTop: 8,
          borderTop: "1px dashed var(--border-soft)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: 1.3,
          textTransform: "uppercase",
        }}>
          <span style={{ color: "var(--text-muted)" }}>
            — transferir para construção
          </span>
          <button
            onClick={onPromoteConfirm}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "var(--cc-ok)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              padding: 0,
              cursor: "pointer",
            }}
          >
            ↵ confirmar
          </button>
          <button
            onClick={onPromoteCancel}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-ghost)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
              textTransform: "inherit",
              padding: 0,
              cursor: "pointer",
            }}
          >
            esc cancelar
          </button>
        </div>
      )}
    </div>
  );
}

function reduceEvent(prev: LiveState, ev: RouteEvent): LiveState {
  switch (ev.type) {
    case "route":
      return { ...prev, routePath: ev.path, lastEventLabel: ev.path === "agent" ? "agent · a pensar" : "triad · 3 análises em paralelo" };
    case "triad_start":
      return { ...prev, triadTotal: ev.count, triadCompleted: 0, lastEventLabel: `triad · 0/${ev.count}${ev.has_prior_failure ? " · ⚠ falha prévia" : ""}` };
    case "triad_done":
      return { ...prev, triadCompleted: ev.completed, triadTotal: ev.total, lastEventLabel: `triad · ${ev.completed}/${ev.total} · análise ${ev.index} pronta` };
    case "judge_start":
      return { ...prev, judgeState: "evaluating", lastEventLabel: "judge · a avaliar consistência" };
    case "judge_done":
      return { ...prev, judgeState: "done", judgeConfidence: ev.confidence, lastEventLabel: `judge · ${ev.confidence}${ev.should_refuse ? " · recusar" : ""}${ev.divergence_count > 0 ? ` · ${ev.divergence_count} diverg.` : ""}` };
    case "iteration":
      return { ...prev, agentIter: ev.n, lastEventLabel: `agent · iter ${ev.n}` };
    case "tool_use":
      return { ...prev, agentToolCount: prev.agentToolCount + 1, lastEventLabel: `agent · ${ev.name}` };
    case "tool_result":
      return { ...prev, lastEventLabel: `agent · ${ev.ok ? "✓" : "✗"} ${ev.id.slice(0, 8)}` };
    case "assistant_text":
      return { ...prev, lastEventLabel: "agent · a escrever" };
    case "done":
      return { ...prev, lastEventLabel: "concluído" };
    case "error":
      return { ...prev, lastEventLabel: `erro: ${ev.message.slice(0, 60)}` };
    default:
      return prev;
  }
}

function inferPath(ev: Extract<RouteEvent, { type: "done" }>): "agent" | "triad" {
  const r = ev.result as Record<string, unknown>;
  return "tool_calls" in r || "iterations" in r ? "agent" : "triad";
}
