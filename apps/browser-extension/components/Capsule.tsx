// Capsule — Gauntlet's flagship cursor surface.
//
// Doctrine for this file:
//   * Cursor never leaves the page. Capsule floats, dismissable on Esc.
//   * Glass + serif headline + mono labels. One ember accent for life.
//   * One input. One button. One response. The backend decides whether
//     the response is a text answer or a list of DOM actions — the
//     user never has to choose between "Compor" and "Acionar".

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ComposerClient,
  DEFAULT_COMPOSER_SETTINGS,
  type ComposerSettings,
  type ContextCaptureRequest,
  type DomPlanResult,
  type ExecutedActionRecord,
  type ExecutionReportRequest,
  type ExecutionStatus,
} from '../lib/composer-client';
import {
  Markdown,
  isVoiceSupported,
  startVoice,
  type VoiceSession,
  assessDanger,
  assessSequenceDanger,
  type DangerAssessment,
  type DomAction,
  type DomActionResult,
} from '@gauntlet/composer';
import {
  readDismissedDomains,
  readScreenshotEnabled,
  restoreDomain,
  writeScreenshotEnabled,
} from '../lib/pill-prefs';
import {
  readSelectionSnapshot,
  type SelectionRect,
  type SelectionSnapshot,
} from '../lib/selection';

export interface CapsuleProps {
  client: ComposerClient;
  initialSnapshot: SelectionSnapshot;
  onDismiss: () => void;
  // Provided by the in-page content script. When undefined (popup
  // window fallback) the "Acionar" button hides — the popup has no
  // page to actuate against.
  executor?: (actions: DomAction[]) => Promise<DomActionResult[]>;
  // Last known cursor position, in viewport coordinates. Used as the
  // anchor when there is no text selection — without it we'd fall
  // back to the bottom-of-screen strip, which is the opposite of
  // "ponta do cursor". When both bbox and cursor are absent (rare:
  // hotkey before any pointer activity), the strip still serves as
  // the orientation fallback.
  cursorAnchor?: { x: number; y: number } | null;
}

type Phase =
  | 'idle'
  | 'planning'    // request sent, no deltas yet → skeleton showing
  | 'streaming'   // first delta arrived → partial compose rendering
  | 'plan_ready'  // `done` event received → final plan/compose visible
  | 'executing'
  | 'executed'
  | 'error';

export function Capsule({
  client,
  initialSnapshot,
  onDismiss,
  executor,
  cursorAnchor,
}: CapsuleProps) {
  const [snapshot, setSnapshot] = useState<SelectionSnapshot>(initialSnapshot);
  const [userInput, setUserInput] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState<DomPlanResult | null>(null);
  const [planResults, setPlanResults] = useState<DomActionResult[] | null>(null);
  const [dangerConfirmed, setDangerConfirmed] = useState(false);
  // partialCompose holds whatever text we've extracted from the
  // streaming JSON buffer so far. It's only visible in phase 'streaming';
  // once the `done` event fires, the full plan.compose replaces it.
  const [partialCompose, setPartialCompose] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Multimodal: when the user opted in (via SettingsDrawer), capture
  // a viewport screenshot once per cápsula mount. The result is
  // attached to the next request's metadata so the planner can "see"
  // the page. If the request fires before capture finishes, we send
  // without the image — better than blocking the user.
  const [screenshot, setScreenshot] = useState<string | null>(null);
  // Sprint 4 — governance lock. Fetched once on mount; missing fields
  // fall through to DEFAULT_COMPOSER_SETTINGS. The cápsula honors
  // screenshot_default (when the local pref is unset), per-domain
  // require_danger_ack (force the danger gate even on neutral plans),
  // and execution_reporting_required (await the ledger row instead of
  // fire-and-forget).
  const [settings, setSettings] = useState<ComposerSettings>(
    DEFAULT_COMPOSER_SETTINGS,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamAbortRef = useRef<(() => void) | null>(null);
  const streamBufferRef = useRef<string>('');
  // Sprint 3 — every action plan ends in exactly one execution row in
  // the backend ledger (executed | rejected | failed). This ref guards
  // against double-reporting when the user dismisses the cápsula after
  // already executing.
  const executionReportedRef = useRef<boolean>(false);
  // Refining pass — tick counter for streaming. Refreshed on every
  // delta so the operator sees the response materialise as a number,
  // not just a wall of text. Resets at submit time.
  const [tokensStreamed, setTokensStreamed] = useState(0);
  // Voice input session (Web Speech API). Press-and-hold the mic
  // button — feature-detected; the button just hides if the API isn't
  // there. Kept as a ref so blur/release handlers reach the live
  // session, not a stale closure.
  const voiceRef = useRef<VoiceSession | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  // Danger assessment runs in-page (where document.querySelector resolves
  // against the live DOM) so each action gets per-element classification
  // — submit buttons, password inputs, "Delete" labels. Recomputed only
  // when the plan changes; the result feeds the warning banner and the
  // danger badges in the action list.
  const dangers = useMemo<DangerAssessment[]>(
    () => (plan ? plan.actions.map(assessDanger) : []),
    [plan],
  );
  const sequenceDanger = useMemo<DangerAssessment>(
    () => (plan ? assessSequenceDanger(plan.actions) : { danger: false }),
    [plan],
  );
  // Sprint 4 — policy-forced ack. When the active domain policy or any
  // action's type policy carries require_danger_ack=true, force the
  // danger gate even on plans that look benign. Lets the operator
  // tighten beyond the heuristic-driven flagging.
  const policyForcesAck = useMemo<{ forced: boolean; reason: string | null }>(
    () => {
      if (!plan || plan.actions.length === 0) {
        return { forced: false, reason: null };
      }
      let host = '';
      try {
        host = new URL(snapshot.url).hostname.toLowerCase();
      } catch {
        // Invalid URL on a hostile page — fall through to defaults.
      }
      const domainPolicy = settings.domains[host] ?? settings.default_domain_policy;
      if (domainPolicy.require_danger_ack) {
        return {
          forced: true,
          reason: host
            ? `policy: domain '${host}' requires explicit confirmation`
            : 'policy: default domain policy requires explicit confirmation',
        };
      }
      for (const a of plan.actions) {
        const policy = settings.actions[a.type] ?? settings.default_action_policy;
        if (policy.require_danger_ack) {
          return {
            forced: true,
            reason: `policy: action type '${a.type}' requires explicit confirmation`,
          };
        }
      }
      return { forced: false, reason: null };
    },
    [plan, snapshot.url, settings],
  );
  const hasDanger =
    dangers.some((d) => d.danger) ||
    sequenceDanger.danger ||
    policyForcesAck.forced;

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      abortRef.current?.abort();
      streamAbortRef.current?.();
    };
  }, []);

  // App may upgrade initialSnapshot after mount (iframe selection
  // harvest finishes ~50ms in). Sync into local state so buildCapture
  // sees the upgraded snapshot at submit time. The user's own
  // refreshSnapshot button still wins because it runs after this
  // effect on every render.
  useEffect(() => {
    setSnapshot(initialSnapshot);
  }, [initialSnapshot]);

  // Sprint 4 — fetch governance settings once at mount. Failure leaves
  // the defaults in place (open, generous caps) so a backend that's
  // slow or down doesn't block the cápsula from working. The screenshot
  // pref effect below depends on this so it lives upstream.
  useEffect(() => {
    let cancelled = false;
    void client
      .getSettings()
      .then((s) => {
        if (cancelled) return;
        setSettings(s);
      })
      .catch(() => {
        // Settings unreachable — keep defaults.
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  // Fire-and-forget screenshot capture on mount when the pref is on.
  // Pref source order:
  //   1. Local toggle (chrome.storage.local) — explicit user choice wins.
  //   2. Backend settings.screenshot_default — operator-set default.
  // Skipped in popup mode (no executor) — capturing there returns a
  // screenshot of the popup window itself, which is useless and
  // visually recursive.
  useEffect(() => {
    if (!executor) return;
    let cancelled = false;
    void readScreenshotEnabled().then((enabledLocal) => {
      // The local pref defaults to false in pill-prefs.ts. If the
      // operator-side default is true, we honor it as the boot value
      // unless the user already toggled it locally. To avoid a third
      // tri-state pref we treat "local was never set" the same as
      // "local is false" — operator default only applies when local is
      // false. That biases toward minimal screenshot capture (privacy
      // wins on draws).
      const enabled = enabledLocal || settings.screenshot_default;
      if (cancelled || !enabled) return;
      if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) return;
      void chrome.runtime
        .sendMessage({ type: 'gauntlet:capture_screenshot' })
        .then((reply: { ok?: boolean; dataUrl?: string } | undefined) => {
          if (cancelled || !reply?.ok || !reply.dataUrl) return;
          setScreenshot(reply.dataUrl);
        })
        .catch(() => {
          // Silent — screenshot is opt-in and best-effort.
        });
    });
    return () => {
      cancelled = true;
    };
  }, [executor, settings.screenshot_default]);

  const refreshSnapshot = useCallback(() => {
    setSnapshot(readSelectionSnapshot());
  }, []);

  // Voice — press-and-hold the mic button. We start a session on
  // pointerdown and stop on pointerup/pointerleave. Partial transcripts
  // overwrite the input live; on commit the recogniser's final text
  // becomes the new input. Feature-detected: the button only renders
  // when the API exists so the cápsula stays slim on Firefox / Safari
  // where SpeechRecognition is missing.
  const startVoiceCapture = useCallback(() => {
    if (voiceRef.current) return;
    setError(null);
    const baseline = userInput;
    const session = startVoice({
      onPartial: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
      },
      onCommit: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
        setVoiceActive(false);
        voiceRef.current = null;
        // Pull focus back to the textarea so Enter works immediately.
        inputRef.current?.focus();
      },
      onError: (msg) => {
        setError(msg);
        setVoiceActive(false);
        voiceRef.current = null;
      },
    });
    if (session) {
      voiceRef.current = session;
      setVoiceActive(true);
    }
  }, [userInput]);

  const stopVoiceCapture = useCallback(() => {
    voiceRef.current?.stop();
  }, []);

  const cancelVoiceCapture = useCallback(() => {
    voiceRef.current?.abort();
    voiceRef.current = null;
    setVoiceActive(false);
  }, []);

  // Cleanup on unmount — releases mic permission promptly on dismiss.
  useEffect(() => {
    return () => {
      voiceRef.current?.abort();
    };
  }, []);

  // Command palette — Cmd+K (mac) / Ctrl+K (everyone else). Opens an
  // overlay with operator-grade quick actions. Pure keyboard surface;
  // no fixture-grade focus traps yet — Esc closes, arrow nav comes in
  // a follow-up if the operator asks for it.
  useEffect(() => {
    function onPaletteKey(ev: KeyboardEvent) {
      const isModK =
        (ev.metaKey || ev.ctrlKey) && (ev.key === 'k' || ev.key === 'K');
      if (isModK) {
        ev.preventDefault();
        ev.stopPropagation();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onPaletteKey, true);
    return () => window.removeEventListener('keydown', onPaletteKey, true);
  }, []);

  const flashSaved = useCallback((label: string) => {
    setSavedFlash(label);
    window.setTimeout(() => setSavedFlash(null), 1400);
  }, []);

  // Save the current compose response (or selection if no compose) to
  // memory_records as a `note`. Backend writes through /memory/records;
  // any failure becomes an inline error. Keeps the operator inside
  // the cápsula — no need to switch to the Control Center.
  const saveToMemory = useCallback(async () => {
    const body = plan?.compose || snapshot.text || userInput.trim();
    if (!body) {
      setError('Nada para guardar — escreve um pedido ou recebe uma resposta.');
      return;
    }
    const topic =
      (userInput.trim() || snapshot.pageTitle || 'cápsula note').slice(0, 200);
    try {
      const url = `${client.backendUrl}/memory/records`;
      // Reuse the background fetch path so we go through the
      // chrome-extension origin and bypass page CORS.
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        const reply = (await chrome.runtime.sendMessage({
          type: 'gauntlet:fetch',
          url,
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            topic,
            body,
            kind: 'note',
            scope: 'user',
          }),
        })) as { ok?: boolean; status?: number; error?: string } | undefined;
        if (!reply?.ok || (reply.status ?? 0) >= 300) {
          throw new Error(reply?.error ?? `HTTP ${reply?.status ?? '?'}`);
        }
      } else {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            topic,
            body,
            kind: 'note',
            scope: 'user',
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }
      flashSaved('saved');
    } catch (err) {
      setError(
        err instanceof Error ? `memória: ${err.message}` : 'memória: falhou',
      );
    }
  }, [client, plan, snapshot, userInput, flashSaved]);

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

  // Wrap onDismiss so a pending action plan that was never executed
  // gets recorded as rejected before the cápsula tears down. Used by
  // every dismiss surface (close button, Esc keypress, dismissThisDomain
  // through the parent App).
  const handleDismiss = useCallback(() => {
    if (
      plan &&
      plan.actions.length > 0 &&
      !executionReportedRef.current
    ) {
      // Rejection is housekeeping — fire-and-forget regardless of the
      // execution_reporting_required flag. The user is already gone;
      // no UI to surface a failure to.
      void reportExecution('rejected');
    }
    onDismiss();
  }, [plan, onDismiss, reportExecution]);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        // Layered escape: palette first, voice next, then dismiss.
        // Lets the operator close the overlay without losing the
        // cápsula entirely — the same gesture for related concerns.
        if (paletteOpen) {
          setPaletteOpen(false);
          return;
        }
        if (voiceRef.current) {
          cancelVoiceCapture();
          return;
        }
        handleDismiss();
      }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [handleDismiss, paletteOpen, cancelVoiceCapture]);

  // The single send path, streaming. Backend's /composer/dom_plan_stream
  // emits delta chunks and a final `done` event with the parsed result.
  // We progressively extract a partial `compose` value from the JSON
  // buffer so the user sees text appear token-by-token instead of
  // staring at a spinner. Action plans still arrive in batch on `done`
  // (parsing partial action arrays is not worth the complexity yet).
  const requestPlan = useCallback(async () => {
    if (!userInput.trim() || phase === 'planning' || phase === 'streaming' || phase === 'executing') {
      return;
    }
    // If the previous plan had actions and was never executed/rejected,
    // record it as rejected before the new plan replaces it. Without
    // this the ledger would show a planned set of actions that just
    // vanishes when the user submits a new prompt.
    if (
      plan &&
      plan.actions.length > 0 &&
      !executionReportedRef.current
    ) {
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
    const screenshotEnabled = await readScreenshotEnabled();
    const capture = buildCapture(
      snapshot,
      screenshotEnabled ? screenshot : null,
    );
    try {
      const ctx = await client.captureContext(capture, ac.signal);
      if (ac.signal.aborted) return;
      streamAbortRef.current = client.requestDomPlanStream(
        ctx.context_id,
        userInput.trim(),
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
            // Groq/Gemini adapters; CORS preflight hiccup; SSE
            // proxy buffering). Fall back to the non-streaming
            // endpoint once before surfacing the failure — the user
            // gets a slower but complete response instead of an
            // error toast.
            void (async () => {
              try {
                const planResult = await client.requestDomPlan(
                  ctx.context_id,
                  userInput.trim(),
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
  }, [client, snapshot, screenshot, userInput, phase, plan, reportExecution]);

  const onSubmit = useCallback(
    (ev: React.FormEvent) => {
      ev.preventDefault();
      void requestPlan();
    },
    [requestPlan],
  );

  // Plain Enter submits. Shift+Enter inserts a newline. Cmd/Ctrl+Enter
  // also submits as a back-compat habit. Matches conventional chat UX.
  const onTextareaKey = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return;
      ev.preventDefault();
      void requestPlan();
    },
    [requestPlan],
  );

  const onCopyCompose = useCallback(async () => {
    if (!plan?.compose) return;
    try {
      await navigator.clipboard.writeText(plan.compose);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Clipboard write blocked. Select the text and copy manually.');
    }
  }, [plan]);

  const executePlan = useCallback(async () => {
    if (!executor || !plan || plan.actions.length === 0) return;
    // Belt-and-braces: the button is disabled when danger is unconfirmed,
    // but a stale render or an injected event could still fire onClick.
    // Refuse to execute here too so the gate isn't only UI-deep.
    if (hasDanger && !dangerConfirmed) return;
    setPhase('executing');
    setError(null);
    try {
      const results = await executor(plan.actions);
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
  }, [executor, plan, hasDanger, dangerConfirmed, reportExecution]);

  // Where to anchor the capsule, in priority order:
  //   1. Selection bbox — the user is pointing at specific text.
  //   2. Cursor position — no selection, but we know where the mouse
  //      was last seen on the page; treat that as a zero-size rect so
  //      computeCapsulePosition's flip + clamp logic keeps working.
  //   3. Null — open compact centered capsule (NOT a bottom strip).
  const anchor = useMemo<SelectionRect | null>(() => {
    if (snapshot.bbox) return snapshot.bbox;
    if (cursorAnchor) {
      return {
        x: cursorAnchor.x,
        y: cursorAnchor.y,
        width: 0,
        height: 0,
      };
    }
    return null;
  }, [snapshot.bbox, cursorAnchor]);
  const placedStyle = useMemo<React.CSSProperties | undefined>(() => {
    // Centered mode is positioned purely via CSS (translate(-50%,-50%))
    // — returning undefined here keeps inline style out of the way.
    if (!anchor) return undefined;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const size = estimateCapsuleSize(vw, vh);
    const pos = computeCapsulePosition(anchor, { width: vw, height: vh }, size);
    return {
      top: `${pos.top}px`,
      left: `${pos.left}px`,
    };
  }, [anchor]);
  // Phase-aware semantic class — drives the ambient glow color so the
  // cápsula visually reflects what the model is doing (and makes the
  // pill carry the same color via the gauntlet:phase event below).
  const phaseClass = `gauntlet-capsule--phase-${phase}`;
  const className = [
    'gauntlet-capsule',
    'gauntlet-capsule--floating',
    anchor ? 'gauntlet-capsule--anchored' : 'gauntlet-capsule--centered',
    snapshot.text ? null : 'gauntlet-capsule--no-selection',
    phaseClass,
  ].filter(Boolean).join(' ');

  // Broadcast the phase so the pill (rendered by App after dismiss)
  // can mirror it. App listens to gauntlet:phase events and tints the
  // pill accordingly.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('gauntlet:phase', { detail: { phase } }),
    );
  }, [phase]);

  return (
    <div
      className={className}
      role="dialog"
      aria-label="Gauntlet"
      style={placedStyle}
    >
      <div className="gauntlet-capsule__aurora" aria-hidden />

      <div className="gauntlet-capsule__layout">
        {/* Left panel: brand + context */}
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--left">
          <header className="gauntlet-capsule__header">
            <div className="gauntlet-capsule__brand-block">
              <span className="gauntlet-capsule__mark" aria-hidden>
                <span className="gauntlet-capsule__mark-dot" />
              </span>
              <div className="gauntlet-capsule__brand-text">
                <span className="gauntlet-capsule__brand">GAUNTLET</span>
                <span className="gauntlet-capsule__tagline">cursor · capsule</span>
              </div>
            </div>
            <div className="gauntlet-capsule__header-actions">
              <button
                type="button"
                className="gauntlet-capsule__settings-btn"
                onClick={() => setSettingsOpen((v) => !v)}
                aria-label="Definições"
                aria-expanded={settingsOpen}
                title="Definições"
              >
                <span aria-hidden>···</span>
              </button>
              <button
                type="button"
                className="gauntlet-capsule__close"
                onClick={handleDismiss}
                aria-label="Dismiss capsule (Esc)"
              >
                <span aria-hidden>esc</span>
              </button>
            </div>
          </header>

          {settingsOpen && (
            <SettingsDrawer
              onClose={() => setSettingsOpen(false)}
              showScreenshot={!!executor}
            />
          )}

          <section className="gauntlet-capsule__context">
            <div className="gauntlet-capsule__context-meta">
              <span className="gauntlet-capsule__source">browser</span>
              <span className="gauntlet-capsule__url" title={snapshot.url}>
                {snapshot.pageTitle || snapshot.url}
              </span>
              <button
                type="button"
                className="gauntlet-capsule__refresh"
                onClick={refreshSnapshot}
                title="Re-read current selection"
              >
                re-read
              </button>
            </div>
            {snapshot.text ? (
              <pre className="gauntlet-capsule__selection">{truncate(snapshot.text, 600)}</pre>
            ) : (
              <CompactContextSummary
                snapshot={snapshot}
                screenshotEnabled={screenshot !== null}
              />
            )}
          </section>
        </div>

        {/* Right panel: input + results */}
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--right">
          <form className="gauntlet-capsule__form" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              className="gauntlet-capsule__input"
              placeholder="O que queres? — Enter para enviar, Shift+Enter nova linha"
              value={userInput}
              onChange={(ev) => setUserInput(ev.target.value)}
              onKeyDown={onTextareaKey}
              rows={2}
              disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
            />
            <div className="gauntlet-capsule__actions">
              <span className="gauntlet-capsule__hint" aria-hidden>
                <span className="gauntlet-capsule__kbd">↵</span>
                <span className="gauntlet-capsule__kbd-sep">·</span>
                <span className="gauntlet-capsule__kbd">⌘K</span>
              </span>
              {isVoiceSupported() && (
                <button
                  type="button"
                  className={`gauntlet-capsule__voice${
                    voiceActive ? ' gauntlet-capsule__voice--active' : ''
                  }`}
                  onPointerDown={(ev) => {
                    ev.preventDefault();
                    startVoiceCapture();
                  }}
                  onPointerUp={() => stopVoiceCapture()}
                  onPointerLeave={() => {
                    if (voiceActive) stopVoiceCapture();
                  }}
                  aria-label={voiceActive ? 'A ouvir — solta para enviar' : 'Premer e falar'}
                  title="Premir e falar"
                  disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                    <path
                      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"
                      fill="currentColor"
                    />
                    <path
                      d="M19 11a7 7 0 0 1-14 0M12 18v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="gauntlet-capsule__voice-label">
                    {voiceActive ? 'a ouvir' : 'voz'}
                  </span>
                </button>
              )}
              <button
                type="submit"
                className="gauntlet-capsule__compose"
                disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing' || !userInput.trim()}
              >
                {phase === 'planning' || phase === 'streaming' ? (
                  <>
                    <span className="gauntlet-capsule__compose-spinner" aria-hidden />
                    <span>{phase === 'planning' ? 'a pensar' : 'a escrever'}</span>
                  </>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
          </form>

          {phase === 'streaming' && partialCompose && (
            <section className="gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming">
              <header className="gauntlet-capsule__compose-meta">
                <span className="gauntlet-capsule__compose-tag">resposta</span>
                <span className="gauntlet-capsule__compose-meta-text">
                  <span className="gauntlet-capsule__token-counter" aria-live="polite">
                    {tokensStreamed} chunks
                  </span>
                  <span aria-hidden>·</span>
                  <span>a escrever…</span>
                </span>
              </header>
              <div className="gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming">
                {partialCompose}
                <span className="gauntlet-capsule__compose-caret" aria-hidden>▍</span>
              </div>
            </section>
          )}

          {(phase === 'planning' || (phase === 'streaming' && !partialCompose)) && (
            <section
              className="gauntlet-capsule__skeleton"
              role="status"
              aria-live="polite"
              aria-label="A pensar..."
            >
              <header className="gauntlet-capsule__skeleton-header">
                <span className="gauntlet-capsule__skeleton-tag" />
                <span className="gauntlet-capsule__skeleton-meta" />
              </header>
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90" />
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75" />
              <div className="gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55" />
            </section>
          )}

          {plan?.compose && phase === 'plan_ready' && (
            <section className="gauntlet-capsule__compose-result">
              <header className="gauntlet-capsule__compose-meta">
                <span className="gauntlet-capsule__compose-tag">resposta</span>
                <span className="gauntlet-capsule__compose-meta-text">
                  {plan.model_used}
                  {' · '}
                  {plan.latency_ms} ms
                </span>
              </header>
              <div className="gauntlet-capsule__compose-text">
                <Markdown
                  source={plan.compose}
                  onCopyBlock={() => flashSaved('code copied')}
                />
              </div>
              <div className="gauntlet-capsule__compose-actions">
                <button
                  type="button"
                  className="gauntlet-capsule__copy"
                  onClick={() => void onCopyCompose()}
                >
                  {copied ? 'copiado ✓' : 'Copy'}
                </button>
                <button
                  type="button"
                  className="gauntlet-capsule__copy gauntlet-capsule__copy--ghost"
                  onClick={() => void saveToMemory()}
                >
                  {savedFlash === 'saved' ? 'guardado ✓' : 'Save'}
                </button>
              </div>
            </section>
          )}

          {plan && plan.actions.length === 0 && !plan.compose && phase === 'plan_ready' && (
            <section className="gauntlet-capsule__plan">
              <p className="gauntlet-capsule__plan-empty">
                {plan.reason ?? 'Modelo não conseguiu planear.'}
              </p>
            </section>
          )}

          {plan && plan.actions.length > 0 && (phase === 'plan_ready' || phase === 'executing' || phase === 'executed') && (
            <section className="gauntlet-capsule__plan">
              <header className="gauntlet-capsule__plan-header">
                <span className="gauntlet-capsule__plan-title">plano</span>
                <span className="gauntlet-capsule__plan-meta">
                  {plan.actions.length} action{plan.actions.length === 1 ? '' : 's'}
                  {' · '}
                  {plan.model_used}
                  {' · '}
                  {plan.latency_ms} ms
                </span>
              </header>
              <ol className="gauntlet-capsule__plan-list">
                  {plan.actions.map((a, i) => {
                    const r = planResults?.[i];
                    const status = r ? (r.ok ? 'ok' : 'fail') : 'pending';
                    const danger = dangers[i];
                    return (
                      <li
                        key={`${i}-${a.type}-${a.selector}`}
                        className={`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${status}${
                          danger?.danger ? ' gauntlet-capsule__plan-item--danger' : ''
                        }`}
                      >
                        <span className="gauntlet-capsule__plan-step">{i + 1}</span>
                        <span className="gauntlet-capsule__plan-desc">{describeAction(a)}</span>
                        {danger?.danger && (
                          <span
                            className="gauntlet-capsule__plan-danger"
                            title={danger.reason}
                          >
                            sensível
                          </span>
                        )}
                        {r && !r.ok && (
                          <span className="gauntlet-capsule__plan-err" title={r.error}>
                            {r.error}
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ol>
              {phase !== 'executed' && hasDanger && (
                <div className="gauntlet-capsule__danger-gate" role="alert">
                  <header className="gauntlet-capsule__danger-header">
                    <span className="gauntlet-capsule__danger-mark" aria-hidden>!</span>
                    <span className="gauntlet-capsule__danger-title">
                      Acções sensíveis no plano
                    </span>
                  </header>
                  <ul className="gauntlet-capsule__danger-list">
                    {policyForcesAck.forced && policyForcesAck.reason && (
                      <li key="danger-policy">
                        <strong>governança:</strong> {policyForcesAck.reason}
                      </li>
                    )}
                    {sequenceDanger.danger && (
                      <li key="danger-sequence">
                        <strong>cadeia:</strong> {sequenceDanger.reason ?? 'flagged'}
                      </li>
                    )}
                    {dangers.map((d, i) =>
                      d.danger ? (
                        <li key={`danger-${i}`}>
                          <strong>step {i + 1}:</strong> {d.reason ?? 'flagged'}
                        </li>
                      ) : null,
                    )}
                  </ul>
                  <label className="gauntlet-capsule__danger-confirm">
                    <input
                      type="checkbox"
                      checked={dangerConfirmed}
                      onChange={(ev) => setDangerConfirmed(ev.target.checked)}
                      disabled={phase === 'executing'}
                    />
                    <span>Confirmo, executar mesmo assim.</span>
                  </label>
                </div>
              )}
              {phase !== 'executed' && executor && (
                <div className="gauntlet-capsule__plan-actions">
                  <button
                    type="button"
                    className={`gauntlet-capsule__execute${
                      hasDanger ? ' gauntlet-capsule__execute--danger' : ''
                    }`}
                    onClick={() => void executePlan()}
                    disabled={
                      phase === 'executing' || (hasDanger && !dangerConfirmed)
                    }
                  >
                    {phase === 'executing'
                      ? 'executando…'
                      : hasDanger
                        ? 'Executar com cuidado'
                        : 'Executar'}
                  </button>
                </div>
              )}
              {phase !== 'executed' && !executor && (
                <p className="gauntlet-capsule__plan-empty">
                  esta superfície não tem acesso a uma página viva — abre o
                  Gauntlet num separador para executar acções.
                </p>
              )}
            </section>
          )}

          {phase === 'error' && error && (
            <div className="gauntlet-capsule__error" role="alert">
              <span className="gauntlet-capsule__error-icon" aria-hidden>!</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          actions={[
            {
              id: 'focus',
              label: 'Focar input',
              shortcut: '↵',
              run: () => {
                setPaletteOpen(false);
                window.setTimeout(() => inputRef.current?.focus(), 0);
              },
            },
            {
              id: 'copy',
              label: 'Copiar resposta',
              shortcut: '⌘C',
              disabled: !plan?.compose,
              run: () => {
                setPaletteOpen(false);
                void onCopyCompose();
              },
            },
            {
              id: 'save',
              label: 'Guardar em memória',
              shortcut: 'S',
              disabled: !plan?.compose && !snapshot.text && !userInput.trim(),
              run: () => {
                setPaletteOpen(false);
                void saveToMemory();
              },
            },
            {
              id: 'reread',
              label: 'Re-ler contexto',
              shortcut: 'R',
              run: () => {
                setPaletteOpen(false);
                refreshSnapshot();
              },
            },
            {
              id: 'clear',
              label: 'Limpar input',
              shortcut: 'X',
              disabled: !userInput,
              run: () => {
                setPaletteOpen(false);
                setUserInput('');
                inputRef.current?.focus();
              },
            },
            {
              id: 'dismiss',
              label: 'Fechar cápsula',
              shortcut: 'Esc',
              run: () => {
                setPaletteOpen(false);
                handleDismiss();
              },
            },
          ]}
        />
      )}

      {savedFlash && (
        <div className="gauntlet-capsule__flash" role="status" aria-live="polite">
          {savedFlash}
        </div>
      )}
    </div>
  );
}

interface PaletteAction {
  id: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
  run: () => void;
}

function CommandPalette({
  actions,
  onClose,
}: {
  actions: PaletteAction[];
  onClose: () => void;
}) {
  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const visible = useMemo(
    () =>
      actions.filter((a) =>
        a.label.toLowerCase().includes(filter.toLowerCase()),
      ),
    [actions, filter],
  );

  useEffect(() => {
    if (cursor >= visible.length) setCursor(0);
  }, [visible.length, cursor]);

  const onKey = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        setCursor((c) => Math.min(c + 1, visible.length - 1));
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        const action = visible[cursor];
        if (action && !action.disabled) action.run();
      }
    },
    [visible, cursor],
  );

  return (
    <div className="gauntlet-capsule__palette" role="dialog" aria-label="Command palette">
      <div className="gauntlet-capsule__palette-scrim" onClick={onClose} />
      <div className="gauntlet-capsule__palette-panel" onKeyDown={onKey}>
        <input
          ref={inputRef}
          className="gauntlet-capsule__palette-input"
          type="text"
          placeholder="comandos…  (↑↓ para navegar, ↵ para correr, esc para fechar)"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
        />
        <ul className="gauntlet-capsule__palette-list" role="listbox">
          {visible.length === 0 ? (
            <li className="gauntlet-capsule__palette-empty">sem comandos</li>
          ) : (
            visible.map((a, i) => (
              <li
                key={a.id}
                role="option"
                aria-selected={i === cursor}
                aria-disabled={a.disabled}
                onMouseEnter={() => setCursor(i)}
                onClick={() => {
                  if (!a.disabled) a.run();
                }}
                className={`gauntlet-capsule__palette-item${
                  i === cursor ? ' gauntlet-capsule__palette-item--active' : ''
                }${a.disabled ? ' gauntlet-capsule__palette-item--disabled' : ''}`}
              >
                <span className="gauntlet-capsule__palette-label">{a.label}</span>
                <span className="gauntlet-capsule__palette-shortcut">{a.shortcut}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '…';
}

// Compact context summary for the no-selection state. Replaces a giant
// empty-selection block with a tight bulleted readout — context still
// visible, but it doesn't dominate the layout.
function CompactContextSummary({
  snapshot,
  screenshotEnabled,
}: {
  snapshot: SelectionSnapshot;
  screenshotEnabled: boolean;
}) {
  const domCount = (() => {
    if (!snapshot.domSkeleton) return 0;
    try {
      const parsed = JSON.parse(snapshot.domSkeleton);
      if (Array.isArray(parsed)) return parsed.length;
    } catch {
      // domSkeleton arrived as plain text — fall through to 0.
    }
    return 0;
  })();
  const pageCaptured = !!snapshot.pageText;
  return (
    <ul className="gauntlet-capsule__context-summary" aria-label="context">
      <li>
        <span className="gauntlet-capsule__context-key">selection</span>
        <span className="gauntlet-capsule__context-val gauntlet-capsule__context-val--muted">
          none
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">page captured</span>
        <span className="gauntlet-capsule__context-val">
          {pageCaptured ? 'yes' : 'no'}
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">DOM captured</span>
        <span className="gauntlet-capsule__context-val">
          {domCount > 0 ? `${domCount} elements` : '—'}
        </span>
      </li>
      <li>
        <span className="gauntlet-capsule__context-key">screenshot</span>
        <span className="gauntlet-capsule__context-val">
          {screenshotEnabled ? 'on' : 'off'}
        </span>
      </li>
    </ul>
  );
}

// Settings drawer — for now, the only knob is "domínios escondidos".
// Reads the current dismiss list from chrome.storage and offers a
// per-domain restore button. Lives inside the cápsula's left panel
// because that's where context already lives; opening it doesn't
// push the user into a separate Control Center surface (doctrine:
// utilizador vive no Composer).
function SettingsDrawer({
  onClose,
  showScreenshot,
}: {
  onClose: () => void;
  // Only the in-page surface has a real tab to screenshot. The popup
  // window would capture itself, which is useless and visually
  // recursive — hide the toggle there.
  showScreenshot: boolean;
}) {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void readDismissedDomains().then((list) => {
      if (cancelled) return;
      setDomains(list);
    });
    void readScreenshotEnabled().then((enabled) => {
      if (cancelled) return;
      setScreenshotEnabled(enabled);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const restore = useCallback(async (host: string) => {
    await restoreDomain(host);
    setDomains((prev) => prev.filter((h) => h !== host));
  }, []);

  const toggleScreenshot = useCallback(async (enabled: boolean) => {
    setScreenshotEnabled(enabled);
    await writeScreenshotEnabled(enabled);
  }, []);

  return (
    <section className="gauntlet-capsule__settings" role="region" aria-label="Definições">
      <header className="gauntlet-capsule__settings-header">
        <span className="gauntlet-capsule__settings-title">definições</span>
        <button
          type="button"
          className="gauntlet-capsule__settings-close"
          onClick={onClose}
          aria-label="Fechar definições"
        >
          ×
        </button>
      </header>

      {showScreenshot && (
        <div className="gauntlet-capsule__settings-section">
          <label className="gauntlet-capsule__settings-toggle">
            <input
              type="checkbox"
              checked={screenshotEnabled}
              onChange={(ev) => void toggleScreenshot(ev.target.checked)}
            />
            <span className="gauntlet-capsule__settings-toggle-label">
              <strong>incluir screenshot</strong>
              <small>
                o modelo vê a página visível. útil para layouts e imagens, exposição
                de senhas/DMs visíveis. opt-in.
              </small>
            </span>
          </label>
        </div>
      )}

      <div className="gauntlet-capsule__settings-section">
        <span className="gauntlet-capsule__settings-subtitle">domínios escondidos</span>
        {loading ? (
          <p className="gauntlet-capsule__settings-empty">a carregar…</p>
        ) : domains.length === 0 ? (
          <p className="gauntlet-capsule__settings-empty">
            nenhum — clica direito no pill em qualquer site para o esconder.
          </p>
        ) : (
          <ul className="gauntlet-capsule__settings-list">
            {domains.map((host) => (
              <li key={host} className="gauntlet-capsule__settings-row">
                <span className="gauntlet-capsule__settings-host">{host}</span>
                <button
                  type="button"
                  className="gauntlet-capsule__settings-restore"
                  onClick={() => void restore(host)}
                >
                  restaurar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// Pull a partial `compose` value out of a streaming JSON buffer.
// Returns null if the response does not look like a compose case
// (e.g., the model started with `{"actions":[…`). Handles the most
// common JSON escape sequences inside the partial string. The buffer
// can end mid-escape (`...He\` waiting for the next char); we drop a
// trailing lone backslash so the rendered text stays clean.
function extractPartialCompose(buffer: string): string | null {
  const match = buffer.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!match) return null;
  let raw = match[1];
  // Drop a dangling backslash that could be the start of the next
  // escape sequence we haven't received yet.
  if (raw.endsWith('\\') && !raw.endsWith('\\\\')) {
    raw = raw.slice(0, -1);
  }
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

// Carry the live page text, DOM skeleton and selection bbox through
// metadata so the backend (and the DOM-action planner in particular)
// has real selectors and live page context to work with. Backwards
// compatible: /composer/context ignores unknown metadata keys.
function buildCapture(
  snapshot: SelectionSnapshot,
  screenshotDataUrl?: string | null,
): ContextCaptureRequest {
  const metadata: Record<string, unknown> = {};
  if (snapshot.pageText) metadata.page_text = snapshot.pageText;
  if (snapshot.domSkeleton) metadata.dom_skeleton = snapshot.domSkeleton;
  if (snapshot.bbox) metadata.selection_bbox = snapshot.bbox;
  if (screenshotDataUrl) metadata.screenshot_data_url = screenshotDataUrl;
  return {
    source: 'browser',
    url: snapshot.url,
    page_title: snapshot.pageTitle,
    selection: snapshot.text || undefined,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

function describeAction(action: DomAction): string {
  switch (action.type) {
    case 'fill':
      return `fill ${action.selector} ← "${truncate(action.value, 80)}"`;
    case 'click':
      return `click ${action.selector}`;
    case 'highlight':
      return `highlight ${action.selector}`;
    case 'scroll_to':
      return `scroll to ${action.selector}`;
  }
}

// Geometry — the capsule is always a floating, viewport-safe shape.
// computeCapsulePosition picks the best side relative to the anchor
// (below/above, right/left) and clamps the final corner so the capsule
// never spills off-screen.
//
// The width/height come from CSS (clamp(560,72vw,820) × clamp(420,72vh,560))
// so we estimate the rendered size from the viewport here. That's good
// enough for placement: the precise final size is set by the browser
// after layout, and the clamp leaves a 16px viewport pad on every side.
const VIEWPORT_PAD = 16;
const ANCHOR_GAP = 12;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface CapsuleSize {
  width: number;
  height: number;
}

export type CapsulePlacement = 'above' | 'below' | 'right' | 'left' | 'center';

export interface CapsulePosition {
  top: number;
  left: number;
  placement: CapsulePlacement;
}

// Mirror of the CSS clamps in CAPSULE_CSS — kept in lockstep so the
// placement maths matches the actually-rendered capsule. If you tweak
// either, tweak both.
export function estimateCapsuleSize(vw: number, vh: number): CapsuleSize {
  const small = vw <= 600;
  if (small) {
    return {
      width: Math.max(0, vw - 24),
      height: Math.max(0, vh - 24),
    };
  }
  const width = clamp(0.72 * vw, 560, 820);
  const height = clamp(0.72 * vh, 420, 560);
  return { width, height };
}

export function computeCapsulePosition(
  anchor: SelectionRect | null,
  viewport: ViewportSize,
  capsule: CapsuleSize,
): CapsulePosition {
  // No anchor → center. Caller should use the centered class instead of
  // the inline style, but we still return a sensible top/left so this
  // function stays usable in tests / popup-window callers.
  if (!anchor) {
    return {
      top: Math.max(VIEWPORT_PAD, Math.floor((viewport.height - capsule.height) / 2)),
      left: Math.max(VIEWPORT_PAD, Math.floor((viewport.width - capsule.width) / 2)),
      placement: 'center',
    };
  }

  // Available space on each side of the anchor, accounting for the
  // viewport padding.
  const roomBelow = viewport.height - (anchor.y + anchor.height) - ANCHOR_GAP - VIEWPORT_PAD;
  const roomAbove = anchor.y - ANCHOR_GAP - VIEWPORT_PAD;
  const roomRight = viewport.width - (anchor.x + anchor.width) - ANCHOR_GAP - VIEWPORT_PAD;
  const roomLeft = anchor.x - ANCHOR_GAP - VIEWPORT_PAD;

  const fitsBelow = roomBelow >= capsule.height;
  const fitsAbove = roomAbove >= capsule.height;
  const fitsRight = roomRight >= capsule.width;
  const fitsLeft = roomLeft >= capsule.width;

  let placement: CapsulePlacement;
  let top: number;
  let left: number;

  if (fitsBelow) {
    placement = 'below';
    top = anchor.y + anchor.height + ANCHOR_GAP;
    // Horizontal: prefer left-aligned with the anchor, but shift left
    // when that would push past the right edge.
    left = anchor.x;
  } else if (fitsAbove) {
    placement = 'above';
    top = anchor.y - ANCHOR_GAP - capsule.height;
    left = anchor.x;
  } else if (fitsRight) {
    placement = 'right';
    left = anchor.x + anchor.width + ANCHOR_GAP;
    // Centre vertically on the anchor so the capsule reads as
    // "next to" rather than "below and to the right of".
    top = Math.floor(anchor.y + anchor.height / 2 - capsule.height / 2);
  } else if (fitsLeft) {
    placement = 'left';
    left = anchor.x - ANCHOR_GAP - capsule.width;
    top = Math.floor(anchor.y + anchor.height / 2 - capsule.height / 2);
  } else {
    // No side fits — center the capsule. This happens on tight viewports
    // or when the anchor sits dead-centre with the capsule larger than
    // any quadrant. Internal scrolling handles the rest.
    placement = 'center';
    top = Math.floor((viewport.height - capsule.height) / 2);
    left = Math.floor((viewport.width - capsule.width) / 2);
  }

  // Final clamp — never let the corner overflow the viewport. The CSS
  // max-height/width keep the rendered size <= the viewport minus the
  // pad, so this is safe even when the chosen side was tight.
  const maxTop = viewport.height - capsule.height - VIEWPORT_PAD;
  const maxLeft = viewport.width - capsule.width - VIEWPORT_PAD;
  top = clamp(top, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, maxTop));
  left = clamp(left, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, maxLeft));

  return { top, left, placement };
}

// CSS colocated — content-script shadow root needs the styles in the bundle.
// Aesthetic: glass morphism, ember accent, mono+serif typography, motion.
export const CAPSULE_CSS = `
@keyframes gauntlet-cap-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.15); }
}
@keyframes gauntlet-cap-aurora {
  0%   { transform: translate3d(-12%, -8%, 0) rotate(0deg); }
  50%  { transform: translate3d(8%,    6%, 0) rotate(180deg); }
  100% { transform: translate3d(-12%, -8%, 0) rotate(360deg); }
}
@keyframes gauntlet-cap-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.985); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}
/* Centered-mode rise — keeps the same opacity + 8px lift motion but
   bakes the centering translate into both keyframes. Without this the
   base rise's end keyframe (transform: translateY(0) scale(1)) with
   fill-mode: both overrides .gauntlet-capsule--centered's
   translate(-50%, -50%), anchoring the capsule by its top-left at
   50%/50% instead of truly centring it. */
@keyframes gauntlet-cap-rise-centered {
  0%   { opacity: 0; transform: translate(-50%, calc(-50% + 8px)) scale(0.985); }
  100% { opacity: 1; transform: translate(-50%, -50%)             scale(1); }
}
@keyframes gauntlet-cap-spin {
  to { transform: rotate(360deg); }
}

.gauntlet-capsule {
  --gx-ember: #d07a5a;
  --gx-bg: rgba(14, 16, 22, 0.92);
  --gx-bg-solid: #0e1016;
  --gx-surface: rgba(28, 30, 38, 0.70);
  --gx-border: rgba(255, 255, 255, 0.08);
  --gx-border-mid: rgba(255, 255, 255, 0.14);
  --gx-fg: #f0f2f7;
  --gx-fg-dim: #aab0bd;
  --gx-fg-muted: #6a7080;

  /* Floating, viewport-safe by default. Doutrina: cápsula leve, discreta,
     sempre presente — never a bottom dock, never a giant standalone
     window. The base shape is the only shape; --anchored / --centered
     just decide where to drop it. */
  position: fixed;
  width: clamp(560px, 72vw, 820px);
  max-width: calc(100vw - 32px);
  max-height: clamp(420px, 72vh, 560px);
  height: auto;
  overflow: hidden;
  background: var(--gx-bg);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 16px;
  backdrop-filter: saturate(1.4) blur(28px);
  -webkit-backdrop-filter: saturate(1.4) blur(28px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 24px 60px rgba(0, 0, 0, 0.55),
    0 8px 24px rgba(0, 0, 0, 0.35);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 0;
  isolation: isolate;
  pointer-events: auto;
  animation: gauntlet-cap-rise 220ms cubic-bezier(0.2, 0, 0, 1) both;
}

/* Tight viewports collapse to a near-fullscreen shape, but still
   floating with margin — never an edge-to-edge dock. */
@media (max-width: 600px), (max-height: 520px) {
  .gauntlet-capsule {
    width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
  }
}

/* Floating marker — every rendered capsule carries this. Composes with
   --anchored / --centered for testability. */
.gauntlet-capsule--floating {
  /* shape inherited from .gauntlet-capsule */
}

/* Centered mode — no selection bbox, no cursor anchor. Pure CSS
   positioning so the component doesn't have to measure itself. The
   animation override is intentional: gauntlet-cap-rise's end keyframe
   resolves transform to translateY(0) scale(1) with fill-mode: both,
   which would otherwise wipe out our centering translate after 220ms.
   The centered variant keeps the same lift motion but ends at
   translate(-50%, -50%) so the capsule stays truly centred. */
.gauntlet-capsule--centered {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: gauntlet-cap-rise-centered 220ms cubic-bezier(0.2, 0, 0, 1) both;
}

/* Anchored mode — top/left set inline via computeCapsulePosition. The
   class is a marker for tests + a hook for any anchored-only tweaks
   (e.g. a small tail/pointer in the future). */
.gauntlet-capsule--anchored {
  /* position set inline by the component */
}

/* Single-column layout — the floating capsule is too narrow for the
   two-pane shape that the old bottom-strip used. Context becomes a
   compact header, input + output own the rest of the height. */
.gauntlet-capsule__layout {
  flex-direction: column;
}
.gauntlet-capsule__panel--left {
  width: 100%;
  max-width: none;
  min-width: 0;
  border-right: none;
  border-bottom: 1px solid var(--gx-border);
  padding: 10px 14px;
  flex-shrink: 0;
}
.gauntlet-capsule__panel--right {
  padding: 12px 14px;
  flex: 1;
  min-height: 0;
  /* Internal scrolling so plan + result + danger banner combos can
     overflow without the capsule itself growing past the viewport. */
  overflow-y: auto;
  overflow-x: hidden;
}
.gauntlet-capsule__selection {
  max-height: 90px;
}

/* No-selection mode — the empty selection block is dead weight; collapse
   the left panel to its meta strip so the input dominates. */
.gauntlet-capsule--no-selection .gauntlet-capsule__selection--empty {
  display: none;
}
.gauntlet-capsule--no-selection .gauntlet-capsule__panel--left {
  padding: 8px 14px;
}
.gauntlet-capsule--no-selection .gauntlet-capsule__context {
  flex: 0 0 auto;
}

.gauntlet-capsule__aurora {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(40% 40% at 30% 30%, rgba(208, 122, 90, 0.18), transparent 60%),
    radial-gradient(40% 40% at 70% 70%, rgba(98, 130, 200, 0.12), transparent 60%);
  filter: blur(40px);
  opacity: 0.6;
  pointer-events: none;
  z-index: -1;
  animation: gauntlet-cap-aurora 28s linear infinite;
}

/* ── Layout — single-column floating capsule ── */
.gauntlet-capsule__layout {
  display: flex;
  flex-direction: column;
  max-height: inherit;
  overflow: hidden;
}

.gauntlet-capsule__panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ── Header ── */
.gauntlet-capsule__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.gauntlet-capsule__brand-block {
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__mark {
  position: relative;
  width: 22px; height: 22px;
  border-radius: 7px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.85), rgba(208, 122, 90, 0.35) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 18px rgba(208, 122, 90, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  display: flex; align-items: center; justify-content: center;
}
.gauntlet-capsule__mark-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 10px rgba(244, 196, 173, 0.85);
  animation: gauntlet-cap-pulse 2.4s ease-in-out infinite;
}
.gauntlet-capsule__brand-text {
  display: flex; flex-direction: column; line-height: 1.05;
}
.gauntlet-capsule__brand {
  /* Doutrina: glass + serif headline + mono labels. The headline is
     the one place a serif earns its keep — distinguishes Gauntlet
     from generic dev-tool aesthetics without bundling a custom font.
     System serifs are surprisingly distinctive on macOS (New York /
     Charter) and Windows (Cambria) and degrade gracefully elsewhere. */
  font-family:
    "Charter", "New York", "Cambria", "Georgia",
    "Iowan Old Style", "Apple Garamond", serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: var(--gx-fg);
  font-feature-settings: "kern" 1, "liga" 1;
}
.gauntlet-capsule__tagline {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--gx-fg-muted);
  margin-top: 2px;
}
.gauntlet-capsule__close {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__close:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.04);
}

/* ── Context ── */
.gauntlet-capsule__context {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.gauntlet-capsule__context-meta {
  display: flex; gap: 8px; align-items: center;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--gx-fg-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  font-family: "JetBrains Mono", monospace;
  flex-shrink: 0;
}
.gauntlet-capsule__source {
  background: rgba(208, 122, 90, 0.14);
  color: #f4c4ad;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(208, 122, 90, 0.28);
  letter-spacing: 0.12em;
}
.gauntlet-capsule__url {
  flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  text-transform: none;
  font-family: "Inter", system-ui, sans-serif;
  letter-spacing: 0;
  color: var(--gx-fg-dim);
  font-size: 11px;
}
.gauntlet-capsule__refresh {
  background: transparent; border: 1px solid var(--gx-border); color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px; padding: 2px 8px; border-radius: 4px; cursor: pointer;
  letter-spacing: 0.12em;
}
.gauntlet-capsule__refresh:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.04);
}
.gauntlet-capsule__selection {
  background: rgba(8, 9, 13, 0.6);
  border: 1px solid var(--gx-border);
  padding: 8px 10px;
  border-radius: 8px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  white-space: pre-wrap; word-break: break-word;
  flex: 1;
  overflow: auto;
  color: var(--gx-fg-dim); margin: 0;
}
.gauntlet-capsule__selection--empty {
  color: var(--gx-fg-muted); font-style: italic;
  font-family: "Inter", sans-serif;
  font-size: 11px;
}

/* Compact context summary — no-selection state. Tight bulleted readout
   so the operator sees what's being sent without giving up vertical
   space the input/output need. */
.gauntlet-capsule__context-summary {
  list-style: none;
  margin: 0;
  padding: 6px 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 4px 14px;
}
.gauntlet-capsule__context-summary li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
}
.gauntlet-capsule__context-key {
  color: var(--gx-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.gauntlet-capsule__context-val {
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__context-val--muted {
  color: var(--gx-fg-muted);
  font-style: italic;
}

/* ── Form ── */
.gauntlet-capsule__form {
  position: relative;
  flex-shrink: 0;
}
.gauntlet-capsule__input {
  width: 100%;
  background: rgba(8, 9, 13, 0.55);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
  min-height: 56px;
  box-sizing: border-box;
  line-height: 1.5;
  transition: border-color 140ms ease, box-shadow 200ms ease;
}
.gauntlet-capsule__input::placeholder { color: var(--gx-fg-muted); }
.gauntlet-capsule__input:focus {
  outline: none;
  border-color: rgba(208, 122, 90, 0.55);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.30),
    0 0 24px rgba(208, 122, 90, 0.18);
}
.gauntlet-capsule__actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 8px;
}
.gauntlet-capsule__hint {
  display: inline-flex; gap: 4px; align-items: center;
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px;
  padding: 0 4px;
  border: 1px solid var(--gx-border-mid);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--gx-fg-dim);
  font-size: 10px;
}
.gauntlet-capsule__compose {
  position: relative;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #0e1016;
  background:
    linear-gradient(180deg, #f0f2f7 0%, #d4d8e0 100%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.20),
    0 6px 18px rgba(208, 122, 90, 0.30);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__compose:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.32),
    0 10px 24px rgba(208, 122, 90, 0.45);
}
.gauntlet-capsule__compose:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.10);
}
.gauntlet-capsule__compose-spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(14, 16, 22, 0.25);
  border-top-color: #0e1016;
  border-radius: 50%;
  animation: gauntlet-cap-spin 0.7s linear infinite;
}

/* ── Error ── */
.gauntlet-capsule__error {
  margin-top: 10px; padding: 8px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.32);
  color: #f1a4ad;
  border-radius: 8px;
  font-size: 12px;
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__error-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.25);
  color: #f1a4ad;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}

/* ── Preview ── */
.gauntlet-capsule__preview {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--gx-border);
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__preview-meta {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 8px;
}
.gauntlet-capsule__preview-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border);
  background: rgba(255, 255, 255, 0.03);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__preview-pill[data-tone="high"] {
  border-color: rgba(122, 180, 138, 0.35);
  background: rgba(122, 180, 138, 0.10);
}
.gauntlet-capsule__preview-pill[data-tone="low"] {
  border-color: rgba(212, 120, 90, 0.35);
  background: rgba(212, 120, 90, 0.10);
}
.gauntlet-capsule__preview-key { color: var(--gx-fg-muted); }
.gauntlet-capsule__preview-val { color: var(--gx-fg); }

.gauntlet-capsule__artifact {
  background: rgba(8, 9, 13, 0.65);
  border: 1px solid var(--gx-border);
  padding: 10px 12px;
  border-radius: 10px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  color: var(--gx-fg);
  white-space: pre-wrap; word-break: break-word;
  margin: 0;
  line-height: 1.55;
}
.gauntlet-capsule__preview-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__copy {
  background: rgba(255, 255, 255, 0.04);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__copy:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
}

.gauntlet-capsule__refusal {
  padding: 12px;
  background: rgba(208, 122, 90, 0.07);
  border: 1px solid rgba(208, 122, 90, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: #e8c8a4;
}
.gauntlet-capsule__refusal header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__refusal-mark {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__refusal-reason {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__refusal p { margin: 0 0 8px; line-height: 1.5; }
.gauntlet-capsule__refusal ul { margin: 8px 0 0; padding-left: 18px; }
.gauntlet-capsule__refusal li { margin: 3px 0; }

/* ── Action-buttons row ── */
.gauntlet-capsule__action-buttons {
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate {
  background: rgba(208, 122, 90, 0.12);
  color: #f4c4ad;
  border: 1px solid rgba(208, 122, 90, 0.45);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate:hover:not(:disabled) {
  background: rgba(208, 122, 90, 0.22);
  transform: translateY(-1px);
}
.gauntlet-capsule__actuate:disabled {
  opacity: 0.45; cursor: not-allowed;
}

/* ── Settings drawer (currently: dismissed-domain list) ── */
.gauntlet-capsule__header-actions {
  display: inline-flex; align-items: center; gap: 6px;
}
.gauntlet-capsule__settings-btn {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0.04em;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__settings-btn:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.04);
}
.gauntlet-capsule__settings {
  margin: 8px 0;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.55);
  border: 1px solid var(--gx-border-mid);
  border-radius: 10px;
  animation: gauntlet-cap-rise 200ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__settings-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.gauntlet-capsule__settings-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__settings-close {
  background: transparent; border: none;
  color: var(--gx-fg-muted);
  cursor: pointer;
  font-size: 16px; line-height: 1; padding: 0 4px;
}
.gauntlet-capsule__settings-close:hover { color: var(--gx-fg); }
.gauntlet-capsule__settings-section {
  margin-bottom: 10px;
}
.gauntlet-capsule__settings-section:last-child { margin-bottom: 0; }
.gauntlet-capsule__settings-subtitle {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gx-fg-muted);
  margin-bottom: 6px;
}
.gauntlet-capsule__settings-toggle {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  padding: 6px 0;
  user-select: none;
}
.gauntlet-capsule__settings-toggle input[type="checkbox"] {
  margin-top: 3px;
  width: 14px; height: 14px;
  accent-color: var(--gx-ember);
  cursor: pointer;
  flex-shrink: 0;
}
.gauntlet-capsule__settings-toggle-label {
  display: flex; flex-direction: column; gap: 2px;
}
.gauntlet-capsule__settings-toggle-label strong {
  font-size: 12px;
  color: var(--gx-fg);
  font-weight: 500;
}
.gauntlet-capsule__settings-toggle-label small {
  font-size: 10px;
  color: var(--gx-fg-muted);
  line-height: 1.4;
}
.gauntlet-capsule__settings-empty {
  margin: 0;
  font-size: 11px;
  color: var(--gx-fg-muted);
  font-style: italic;
}
.gauntlet-capsule__settings-list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 4px;
  max-height: 180px; overflow-y: auto;
}
.gauntlet-capsule__settings-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__settings-host {
  flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gauntlet-capsule__settings-restore {
  background: rgba(208, 122, 90, 0.12);
  color: #f4c4ad;
  border: 1px solid rgba(208, 122, 90, 0.45);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.gauntlet-capsule__settings-restore:hover {
  background: rgba(208, 122, 90, 0.22);
}

/* ── Skeleton (perceived speed during the planning roundtrip) ──
   We can't stream tokens yet (Sprint 1.4-A), but a shimmering
   placeholder turns 1.5–4s of model latency from "spinner silence"
   into "the capsule is thinking". The shimmer reads as activity even
   if nothing else changes on screen. */
@keyframes gauntlet-cap-shimmer {
  0%   { background-position: -240px 0; }
  100% { background-position:  240px 0; }
}
.gauntlet-capsule__skeleton {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 200ms cubic-bezier(0.2, 0, 0, 1) both;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-capsule__skeleton-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 2px;
}
.gauntlet-capsule__skeleton-tag,
.gauntlet-capsule__skeleton-meta,
.gauntlet-capsule__skeleton-line {
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(208, 122, 90, 0.18) 50%,
      rgba(255, 255, 255, 0.04) 100%
    );
  background-size: 240px 100%;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  animation: gauntlet-cap-shimmer 1.4s ease-in-out infinite;
}
.gauntlet-capsule__skeleton-tag   { width: 56px; height: 14px; border-radius: 4px; }
.gauntlet-capsule__skeleton-meta  { width: 140px; height: 10px; border-radius: 3px; }
.gauntlet-capsule__skeleton-line  { height: 11px; border-radius: 3px; }
.gauntlet-capsule__skeleton-line--w90 { width: 90%; animation-delay: 0ms; }
.gauntlet-capsule__skeleton-line--w75 { width: 75%; animation-delay: 120ms; }
.gauntlet-capsule__skeleton-line--w55 { width: 55%; animation-delay: 240ms; }

/* ── Compose response (inline text answer) ── */
.gauntlet-capsule__compose-result {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__compose-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__compose-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__compose-meta-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__compose-text {
  font-size: 13px;
  line-height: 1.55;
  color: var(--gx-fg);
  white-space: pre-wrap;
  word-break: break-word;
  /* At least 220px when output exists; up to 40% of the viewport on
     larger screens so long answers don't get crushed by the form. */
  min-height: 0;
  max-height: clamp(220px, 40vh, 380px);
  overflow-y: auto;
  overflow-x: hidden;
}
.gauntlet-capsule__compose-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
@keyframes gauntlet-cap-caret {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.gauntlet-capsule__compose-caret {
  display: inline-block;
  margin-left: 1px;
  color: var(--gx-ember);
  animation: gauntlet-cap-caret 1s steps(1) infinite;
}
.gauntlet-capsule__compose-result--streaming {
  border-color: rgba(208, 122, 90, 0.35);
}

/* ── Plan section ── */
.gauntlet-capsule__plan {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(8, 9, 13, 0.5);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__plan-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__plan-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f4c4ad;
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__plan-meta {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__plan-empty {
  margin: 0;
  font-size: 12px;
  color: var(--gx-fg-dim);
  font-style: italic;
}
.gauntlet-capsule__plan-list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 4px;
}
.gauntlet-capsule__plan-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
  border: 1px solid transparent;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__plan-item--ok {
  background: rgba(122, 180, 138, 0.10);
  border-color: rgba(122, 180, 138, 0.35);
  color: #cfe8d3;
}
.gauntlet-capsule__plan-item--fail {
  background: rgba(212, 96, 60, 0.10);
  border-color: rgba(212, 96, 60, 0.35);
  color: #f1a4ad;
}
.gauntlet-capsule__plan-step {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: var(--gx-fg);
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}
.gauntlet-capsule__plan-desc {
  flex: 1;
  word-break: break-all;
}
.gauntlet-capsule__plan-err {
  font-size: 10px;
  color: #f1a4ad;
  font-style: italic;
}
.gauntlet-capsule__plan-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__execute {
  background: linear-gradient(180deg, #d07a5a 0%, #b65d3f 100%);
  color: #0e1016;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 6px 18px rgba(208, 122, 90, 0.45);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.gauntlet-capsule__execute:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.25),
    0 10px 24px rgba(208, 122, 90, 0.55);
}
.gauntlet-capsule__execute:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
}
.gauntlet-capsule__execute--danger {
  background: linear-gradient(180deg, #d4603c 0%, #a8401e 100%);
  box-shadow:
    0 0 0 1px rgba(255, 90, 60, 0.35),
    0 6px 18px rgba(212, 96, 60, 0.55);
  color: #fff;
}
.gauntlet-capsule__execute--danger:hover:not(:disabled) {
  box-shadow:
    0 0 0 1px rgba(255, 120, 90, 0.45),
    0 10px 24px rgba(212, 96, 60, 0.65);
}

/* ── Per-item danger badge ── */
.gauntlet-capsule__plan-item--danger {
  background: rgba(212, 96, 60, 0.08);
  border-color: rgba(212, 96, 60, 0.30);
}
.gauntlet-capsule__plan-danger {
  flex-shrink: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #f1a4ad;
  background: rgba(212, 96, 60, 0.18);
  border: 1px solid rgba(212, 96, 60, 0.45);
  border-radius: 4px;
  padding: 2px 6px;
}

/* ── Danger gate — explicit confirmation before destructive execution ── */
.gauntlet-capsule__danger-gate {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.40);
  border-radius: 8px;
  animation: gauntlet-cap-rise 220ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__danger-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.gauntlet-capsule__danger-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.30);
  color: #fff;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}
.gauntlet-capsule__danger-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #f1a4ad;
}
.gauntlet-capsule__danger-list {
  margin: 0 0 8px 0; padding: 0 0 0 24px;
  font-size: 11px;
  color: #f1a4ad;
  line-height: 1.6;
}
.gauntlet-capsule__danger-list li { margin: 0; }
.gauntlet-capsule__danger-list strong {
  color: #fff;
  font-weight: 600;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  margin-right: 4px;
}
.gauntlet-capsule__danger-confirm {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gx-fg);
  user-select: none;
}
.gauntlet-capsule__danger-confirm input[type="checkbox"] {
  width: 14px; height: 14px;
  accent-color: #d4603c;
  cursor: pointer;
}

/* ── Phase-aware semantic colors ──────────────────────────────────────────
   Cores semânticas a representar estados e processo do trabalho.
   The cápsula ambient glow ring shifts hue with the phase so the
   operator senses progress without reading text. The pill (rendered by
   App after dismiss) listens to gauntlet:phase events and mirrors
   the same color. */
.gauntlet-capsule--phase-idle      { --gx-phase: rgba(208, 122, 90, 0.0); }
.gauntlet-capsule--phase-planning  { --gx-phase: rgba(244, 196, 86, 0.55); } /* amber */
.gauntlet-capsule--phase-streaming { --gx-phase: rgba(208, 122, 90, 0.65); } /* ember */
.gauntlet-capsule--phase-plan_ready{ --gx-phase: rgba(208, 122, 90, 0.45); }
.gauntlet-capsule--phase-executing { --gx-phase: rgba(98, 130, 200, 0.55); } /* blue */
.gauntlet-capsule--phase-executed  { --gx-phase: rgba(122, 180, 138, 0.55); } /* green */
.gauntlet-capsule--phase-error     { --gx-phase: rgba(212, 96, 60, 0.65); }  /* red */

.gauntlet-capsule--floating::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 24px var(--gx-phase, transparent);
  opacity: 0;
  transition: opacity 280ms ease;
}
.gauntlet-capsule--phase-planning::before,
.gauntlet-capsule--phase-streaming::before,
.gauntlet-capsule--phase-executing::before,
.gauntlet-capsule--phase-executed::before,
.gauntlet-capsule--phase-error::before {
  opacity: 1;
}

/* Phase mark-dot tint — the brand mark itself communicates state */
.gauntlet-capsule--phase-error .gauntlet-capsule__mark {
  border-color: rgba(212, 96, 60, 0.7);
}
.gauntlet-capsule--phase-executed .gauntlet-capsule__mark {
  border-color: rgba(122, 180, 138, 0.7);
}

/* ── Token tick counter (refining: sensação de avanço) ─────────────────── */
.gauntlet-capsule__token-counter {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: rgba(244, 196, 173, 0.85);
  font-weight: 600;
}
.gauntlet-capsule__compose-text--streaming {
  background: linear-gradient(
    180deg,
    rgba(208, 122, 90, 0.04) 0%,
    transparent 60%
  );
}

/* ── Save (ghost) button — sibling of Copy ──────────────────────────────── */
.gauntlet-capsule__copy--ghost {
  background: transparent;
  border-color: var(--gx-border);
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__copy--ghost:hover {
  border-color: var(--gx-border-mid);
  color: var(--gx-fg);
  background: rgba(255, 255, 255, 0.03);
}

/* ── Voice button (press-and-hold) ──────────────────────────────────────── */
@keyframes gauntlet-cap-listen {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 96, 60, 0.45); }
  50%      { box-shadow: 0 0 0 6px rgba(212, 96, 60, 0); }
}
.gauntlet-capsule__voice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: rgba(255, 255, 255, 0.03);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__voice:hover:not(:disabled) {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: rgba(255, 255, 255, 0.05);
}
.gauntlet-capsule__voice:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gauntlet-capsule__voice--active {
  color: #f4a08a;
  border-color: rgba(208, 122, 90, 0.55);
  background: rgba(208, 122, 90, 0.10);
  animation: gauntlet-cap-listen 1.2s ease-in-out infinite;
}
.gauntlet-capsule__voice-label {
  font-weight: 600;
}
.gauntlet-capsule__kbd-sep {
  margin: 0 4px;
  color: rgba(255,255,255,0.18);
}

/* ── Command palette overlay (Cmd+K) ────────────────────────────────────── */
@keyframes gauntlet-cap-palette-rise {
  from { opacity: 0; transform: translateY(-4px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
.gauntlet-capsule__palette {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: start center;
  padding-top: 30px;
  pointer-events: none;
}
.gauntlet-capsule__palette-scrim {
  position: absolute;
  inset: 0;
  background: rgba(8, 9, 13, 0.55);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: gauntlet-cap-rise 160ms ease-out both;
}
.gauntlet-capsule__palette-panel {
  position: relative;
  width: min(420px, calc(100% - 36px));
  background: rgba(20, 22, 30, 0.96);
  border: 1px solid var(--gx-border-mid);
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 24px 48px rgba(0, 0, 0, 0.55);
  pointer-events: auto;
  animation: gauntlet-cap-palette-rise 180ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__palette-input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: var(--gx-fg);
  font-family: "Inter", sans-serif;
  font-size: 13px;
  outline: none;
  border-bottom: 1px solid var(--gx-border);
}
.gauntlet-capsule__palette-input::placeholder {
  color: var(--gx-fg-muted);
  font-size: 11px;
  letter-spacing: 0.02em;
}
.gauntlet-capsule__palette-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 240px;
  overflow-y: auto;
}
.gauntlet-capsule__palette-empty {
  padding: 14px;
  text-align: center;
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.gauntlet-capsule__palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: var(--gx-fg-dim);
  cursor: pointer;
  transition: background 100ms ease, color 100ms ease;
}
.gauntlet-capsule__palette-item--active {
  background: rgba(208, 122, 90, 0.14);
  color: var(--gx-fg);
}
.gauntlet-capsule__palette-item--disabled {
  opacity: 0.42;
  cursor: not-allowed;
}
.gauntlet-capsule__palette-shortcut {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--gx-fg-muted);
  text-transform: uppercase;
}
.gauntlet-capsule__palette-item--active .gauntlet-capsule__palette-shortcut {
  color: var(--gx-fg-dim);
}

/* ── Toast flash (saved / code copied) ──────────────────────────────────── */
@keyframes gauntlet-cap-flash-rise {
  0%   { opacity: 0; transform: translate(-50%, 8px); }
  20%  { opacity: 1; transform: translate(-50%, 0); }
  80%  { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -4px); }
}
.gauntlet-capsule__flash {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(122, 180, 138, 0.14);
  color: #a8d4b6;
  border: 1px solid rgba(122, 180, 138, 0.32);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 3;
  animation: gauntlet-cap-flash-rise 1400ms ease-out both;
}

/* ── Markdown rendering ─────────────────────────────────────────────────── */
.gauntlet-md {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-md__prose {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-md__p {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 1.62;
  color: var(--gx-fg);
}
.gauntlet-md__h {
  margin: 8px 0 2px;
  font-family: "Charter", "New York", "Cambria", "Georgia", serif;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: var(--gx-fg);
  line-height: 1.25;
}
.gauntlet-md__h1 { font-size: 18px; }
.gauntlet-md__h2 { font-size: 15px; }
.gauntlet-md__h3 { font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--gx-fg-dim); }
.gauntlet-md__strong { font-weight: 600; color: #f4d4c0; }
.gauntlet-md__em { font-style: italic; color: var(--gx-fg-dim); }
.gauntlet-md__inline-code {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11.5px;
  background: rgba(208, 122, 90, 0.10);
  color: #f4c4ad;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(208, 122, 90, 0.18);
}
.gauntlet-md__link {
  color: #f4c4ad;
  text-decoration: underline;
  text-decoration-color: rgba(208, 122, 90, 0.45);
  text-underline-offset: 2px;
}
.gauntlet-md__link:hover { text-decoration-color: var(--gx-ember); }
.gauntlet-md__quote {
  margin: 0;
  padding: 6px 12px;
  border-left: 2px solid rgba(208, 122, 90, 0.55);
  background: rgba(208, 122, 90, 0.04);
  color: var(--gx-fg-dim);
  font-style: italic;
  font-size: 12.5px;
  line-height: 1.6;
  border-radius: 0 6px 6px 0;
}
.gauntlet-md__hr {
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.10),
    transparent
  );
  margin: 4px 0;
}
.gauntlet-md__list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 1.55;
}
.gauntlet-md__li::marker {
  color: rgba(208, 122, 90, 0.55);
}
.gauntlet-md__code {
  margin: 0;
  border: 1px solid var(--gx-border);
  border-radius: 8px;
  background: rgba(8, 9, 13, 0.7);
  overflow: hidden;
}
.gauntlet-md__code-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--gx-border);
  background: rgba(255, 255, 255, 0.02);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.gauntlet-md__code-lang {
  color: var(--gx-fg-muted);
}
.gauntlet-md__code-copy {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-dim);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease;
}
.gauntlet-md__code-copy:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
}
.gauntlet-md__code-body {
  margin: 0;
  padding: 10px 12px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11.5px;
  line-height: 1.55;
  color: #e6e8ee;
  overflow-x: auto;
  white-space: pre;
}
.gauntlet-md__code-body code {
  font-family: inherit;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}
`;
