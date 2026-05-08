// useStreamingPlan — owns the agent send/receive lifecycle.
//
// This hook consolidates what was sitting in three useCallbacks on the
// Capsule (requestPlan, executePlan, reportExecution) plus the state +
// refs they all drove (phase, plan, planResults, partialCompose,
// tokensStreamed, error, copied, dangerConfirmed; abortRef,
// streamAbortRef, streamBufferRef, executionReportedRef). It also
// computes the danger-gate guards via usePlanGuards so the Capsule
// gets a single object back instead of stitching three hooks together.
//
// Doctrine:
//   * One streaming submit at a time. Each submit aborts the previous
//     stream + the previous fetch.
//   * An action plan that was never executed/rejected gets a "rejected"
//     ledger row before the next plan replaces it. handleDismiss does
//     the same on capsule teardown.
//   * Streaming endpoint is the primary path; transient SSE failures
//     fall back to /composer/dom_plan_request once before surfacing
//     the error to the operator.
//   * Compose-only plans (plan.actions.length === 0) skip ledger
//     reporting — the contract is about DOM-action outcomes.

import { useCallback, useEffect, useRef, useState } from 'react';
import { type Ambient } from './ambient';
import { type ComposerClient } from './composer-client';
import { type DomAction, type DomActionResult } from './dom-actions';
import { buildCapture, extractPartialCompose } from './helpers';
import { type PillPrefs } from './pill-prefs';
import { type UsePlanGuardsResult, usePlanGuards } from './usePlanGuards';
import {
  type Attachment,
  type ComposerSettings,
  type DomPlanResult,
  type ExecutedActionRecord,
  type ExecutionReportRequest,
  type ExecutionStatus,
  type SelectionSnapshot,
} from './types';

export type Phase =
  | 'idle'
  | 'planning'
  | 'streaming'
  | 'plan_ready'
  | 'executing'
  | 'executed'
  | 'error';

export interface UseStreamingPlanArgs {
  client: ComposerClient;
  ambient: Ambient;
  prefs: PillPrefs;
  snapshot: SelectionSnapshot;
  screenshot: string | null;
  attachments: Attachment[];
  userInput: string;
  settings: ComposerSettings;
  composeUserInput: (raw: string) => string;
  dispatchPlan: (actions: DomAction[]) => Promise<DomActionResult[]>;
  // Hook a side-effect into every submit (e.g. TTS cancel) without
  // baking it into the hook itself.
  onSubmit?: () => void;
}

export interface UseStreamingPlanResult extends UsePlanGuardsResult {
  // Streaming state
  phase: Phase;
  plan: DomPlanResult | null;
  planResults: DomActionResult[] | null;
  partialCompose: string;
  tokensStreamed: number;
  error: string | null;
  copied: boolean;
  dangerConfirmed: boolean;
  // Setters the caller may need (compose copy flash, danger gate)
  setCopied: (b: boolean) => void;
  setDangerConfirmed: (b: boolean) => void;
  setError: (e: string | null) => void;
  // Lifecycle actions
  submit: () => Promise<void>;
  executePlan: () => Promise<void>;
  // Called by handleDismiss when there's a pending action plan that
  // was never executed/rejected. Fire-and-forget.
  reportRejection: () => void;
}

export function useStreamingPlan(args: UseStreamingPlanArgs): UseStreamingPlanResult {
  const {
    client,
    ambient,
    prefs,
    snapshot,
    screenshot,
    attachments,
    userInput,
    settings,
    composeUserInput,
    dispatchPlan,
    onSubmit,
  } = args;

  const [phase, setPhase] = useState<Phase>('idle');
  const [plan, setPlan] = useState<DomPlanResult | null>(null);
  const [planResults, setPlanResults] = useState<DomActionResult[] | null>(null);
  const [partialCompose, setPartialCompose] = useState<string>('');
  const [tokensStreamed, setTokensStreamed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dangerConfirmed, setDangerConfirmed] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const streamAbortRef = useRef<(() => void) | null>(null);
  const streamBufferRef = useRef<string>('');
  // Sprint 3 — every action plan ends in exactly one execution row in
  // the backend ledger (executed | rejected | failed). This ref guards
  // against double-reporting when the user dismisses the cápsula after
  // already executing.
  const executionReportedRef = useRef<boolean>(false);

  const guards = usePlanGuards({ plan, ambient, url: snapshot.url, settings });
  const { dangers, sequenceDanger, policyForcesAck, hasDanger, canDispatchAnyAction } =
    guards;

  // Cleanup on unmount — abort any in-flight stream/fetch so the
  // capsule never tries to setState into a torn-down tree.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      streamAbortRef.current?.();
    };
  }, []);

  // Sprint 3 — execution contract. Fire-and-forget reporting after
  // executeDomActions resolves (executed/failed) or when the user
  // dismisses the cápsula with an action plan still pending (rejected).
  // Compose-only plans (plan.actions.length === 0) are NOT reported —
  // the contract is about DOM-action outcomes, not about every cápsula
  // interaction. Failure of the report itself never propagates.
  const reportExecution = useCallback(
    async (
      status: ExecutionStatus,
      results: DomActionResult[] = [],
      errorMsg?: string,
    ) => {
      if (!plan || plan.actions.length === 0) return;
      executionReportedRef.current = true;
      const records: ExecutedActionRecord[] = plan.actions.map((action, i) => {
        const r = results[i];
        const d = dangers[i];
        return {
          action,
          ok: r ? r.ok : false,
          error: r?.error ?? null,
          danger: d?.danger ?? false,
          danger_reason: d?.reason ?? null,
        };
      });
      const payload: ExecutionReportRequest = {
        plan_id: plan.plan_id || null,
        context_id: plan.context_id || null,
        url: snapshot.url || null,
        page_title: snapshot.pageTitle || null,
        status,
        results: records,
        has_danger: hasDanger,
        sequence_danger_reason: sequenceDanger.danger
          ? sequenceDanger.reason ?? null
          : null,
        danger_acknowledged: dangerConfirmed,
        error: errorMsg ?? null,
        model_used: plan.model_used || null,
        plan_latency_ms: plan.latency_ms || null,
        user_input: userInput.trim() || null,
      };
      // Sprint 4 — when execution_reporting_required is true, the
      // operator declared the ledger row part of the contract. We
      // await + surface failure inline. When it's false, fire-and-
      // forget keeps Sprint 3 ergonomics: the action already happened
      // on the page; reporting is best-effort.
      if (settings.execution_reporting_required) {
        try {
          await client.reportExecution(payload);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(`policy: execution report rejected — ${msg}`);
          setPhase('error');
        }
      } else {
        void client.reportExecution(payload).catch(() => {
          // Best-effort; ledger fidelity comes second to UX.
        });
      }
    },
    [
      client,
      plan,
      snapshot,
      dangers,
      hasDanger,
      sequenceDanger,
      dangerConfirmed,
      userInput,
      settings.execution_reporting_required,
    ],
  );

  // The single send path, streaming. Backend's /composer/dom_plan_stream
  // emits delta chunks and a final `done` event with the parsed result.
  // We progressively extract a partial `compose` value from the JSON
  // buffer so the user sees text appear token-by-token instead of
  // staring at a spinner. Action plans still arrive in batch on `done`
  // (parsing partial action arrays is not worth the complexity yet).
  const submit = useCallback(async () => {
    if (
      !userInput.trim() ||
      phase === 'planning' ||
      phase === 'streaming' ||
      phase === 'executing'
    ) {
      return;
    }
    onSubmit?.();
    // If the previous plan had actions and was never executed/rejected,
    // record it as rejected before the new plan replaces it. Without
    // this the ledger would show a planned set of actions that just
    // vanishes when the user submits a new prompt.
    if (plan && plan.actions.length > 0 && !executionReportedRef.current) {
      // Implicit rejection — fire-and-forget. New plan is already on
      // the way; we don't await the ledger row.
      void reportExecution('rejected');
    }
    abortRef.current?.abort();
    streamAbortRef.current?.();
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase('planning');
    setError(null);
    setPlan(null);
    setPlanResults(null);
    setDangerConfirmed(false);
    setCopied(false);
    setPartialCompose('');
    setTokensStreamed(0);
    streamBufferRef.current = '';
    executionReportedRef.current = false;
    // Re-read the screenshot pref at submit time. The user may have
    // toggled it off in the settings drawer between mount and submit;
    // the captured data URL is in our state but should not be sent
    // when the toggle is currently off.
    const screenshotEnabled = await prefs.readScreenshotEnabled();
    const capture = buildCapture(
      snapshot,
      screenshotEnabled ? screenshot : null,
      attachments,
      ambient.shell,
    );
    try {
      const ctx = await client.captureContext(capture, ac.signal);
      if (ac.signal.aborted) return;
      const inputForAgent = composeUserInput(userInput.trim());
      streamAbortRef.current = client.requestDomPlanStream(
        ctx.context_id,
        inputForAgent,
        {
          onDelta: (text) => {
            if (ac.signal.aborted) return;
            streamBufferRef.current += text;
            // Token tick — sensação de avanço real. We bump per delta
            // chunk; precise token counting is the gateway's job, this
            // is operator-facing UX, not billing.
            setTokensStreamed((n) => n + 1);
            const partial = extractPartialCompose(streamBufferRef.current);
            if (partial !== null) {
              setPartialCompose(partial);
              setPhase((p) => (p === 'planning' ? 'streaming' : p));
            } else {
              // No compose yet — could be an action plan being built.
              // Just transition out of skeleton on first delta so the
              // user knows we're alive.
              setPhase((p) => (p === 'planning' ? 'streaming' : p));
            }
          },
          onDone: (planResult) => {
            if (ac.signal.aborted) return;
            setPlan(planResult);
            setPhase('plan_ready');
            setPartialCompose('');
            streamBufferRef.current = '';
          },
          onError: (err) => {
            if (ac.signal.aborted) return;
            // The streaming endpoint can fail for transient reasons
            // (provider doesn't support .messages.stream, e.g.
            // Groq/Gemini adapters; CORS preflight hiccup; SSE proxy
            // buffering). Fall back to the non-streaming endpoint
            // once before surfacing the failure — the user gets a
            // slower but complete response instead of an error toast.
            void (async () => {
              try {
                const planResult = await client.requestDomPlan(
                  ctx.context_id,
                  inputForAgent,
                  ac.signal,
                );
                if (ac.signal.aborted) return;
                setPlan(planResult);
                setPhase('plan_ready');
                setPartialCompose('');
                streamBufferRef.current = '';
              } catch (fallbackErr: unknown) {
                if (ac.signal.aborted) return;
                const fbMsg =
                  fallbackErr instanceof Error
                    ? fallbackErr.message
                    : String(fallbackErr);
                // Surface the original streaming error too so the
                // operator can see both paths failed.
                setError(`stream: ${err} · fallback: ${fbMsg}`);
                setPhase('error');
                setPartialCompose('');
                streamBufferRef.current = '';
              }
            })();
          },
        },
      );
    } catch (err: unknown) {
      if (ac.signal.aborted) return;
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  }, [
    client,
    snapshot,
    screenshot,
    userInput,
    phase,
    plan,
    reportExecution,
    composeUserInput,
    prefs,
    onSubmit,
    ambient,
    attachments,
  ]);

  const executePlan = useCallback(async () => {
    // The dispatcher handles missing adapters per-action — desktop has
    // no DOM but has shell/fs; browser has DOM but no shell/fs. Any
    // unsupported action becomes a typed `ok: false` result. We only
    // bail when there's literally nothing to dispatch.
    if (!plan || plan.actions.length === 0) return;
    // Belt-and-braces: the button is disabled when danger is unconfirmed,
    // but a stale render or an injected event could still fire onClick.
    // Refuse to execute here too so the gate isn't only UI-deep.
    if (hasDanger && !dangerConfirmed) return;
    setPhase('executing');
    setError(null);
    try {
      const results = await dispatchPlan(plan.actions);
      setPlanResults(results);
      setPhase('executed');
      // Ambient feedback for the pill (rendered by App after the
      // capsule closes). All steps OK → green pulse; any fail →
      // red shake. The user gets confirmation even if they Esc out
      // before reading the per-step status.
      const allOk = results.every((r) => r.ok);
      window.dispatchEvent(
        new CustomEvent('gauntlet:execute-result', { detail: { ok: allOk } }),
      );
      // A4 — OS notification. Only fires on shells that wired the
      // capability (desktop today). The cápsula always shows its own
      // executed banner; this is the "operator switched windows" path.
      void ambient.notifications?.notify(
        allOk ? 'Gauntlet — plano executado' : 'Gauntlet — plano com falhas',
        allOk
          ? `${results.length} ${results.length === 1 ? 'acção' : 'acções'} OK`
          : `${results.filter((r) => !r.ok).length}/${results.length} falharam — revê na cápsula`,
      );
      // Sprint 3 — execution row in the ledger. Per-action ok/error is
      // in `results`; status="executed" only means the executor ran,
      // not that every action succeeded. Sprint 4 — when
      // execution_reporting_required is true, await + surface failure.
      await reportExecution('executed', results);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(errMsg);
      setPhase('error');
      window.dispatchEvent(
        new CustomEvent('gauntlet:execute-result', { detail: { ok: false } }),
      );
      await reportExecution('failed', [], errMsg);
    }
  }, [plan, hasDanger, dangerConfirmed, dispatchPlan, reportExecution, ambient]);

  // Used by handleDismiss when there's a pending action plan that was
  // never executed/rejected. Rejection is housekeeping — fire-and-
  // forget regardless of the execution_reporting_required flag.
  const reportRejection = useCallback(() => {
    if (plan && plan.actions.length > 0 && !executionReportedRef.current) {
      void reportExecution('rejected');
    }
  }, [plan, reportExecution]);

  return {
    phase,
    plan,
    planResults,
    partialCompose,
    tokensStreamed,
    error,
    copied,
    dangerConfirmed,
    dangers,
    sequenceDanger,
    policyForcesAck,
    hasDanger,
    canDispatchAnyAction,
    setCopied,
    setDangerConfirmed,
    setError,
    submit,
    executePlan,
    reportRejection,
  };
}
