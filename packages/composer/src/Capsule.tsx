// Capsule — Gauntlet's flagship cursor surface.
//
// Doctrine for this file:
//   * Cursor never leaves the page. Capsule floats, dismissable on Esc.
//   * Glass + serif headline + mono labels. One ember accent for life.
//   * One input. One button. One response. The backend decides whether
//     the response is a text answer or a list of DOM actions — the
//     user never has to choose between "Compor" and "Acionar".

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ComposerClient } from './composer-client';
import {
  DEFAULT_COMPOSER_SETTINGS,
  type ComposerSettings,
  type ContextCaptureRequest,
  type DomPlanResult,
  type ExecutedActionRecord,
  type ExecutionReportRequest,
  type ExecutionStatus,
  type SelectionRect,
  type SelectionSnapshot,
  type ToolManifest,
} from './types';
import { Markdown } from './markdown';
import {
  isVoiceSupported,
  startVoice,
  type VoiceSession,
} from './voice';
import {
  assessDanger,
  assessSequenceDanger,
  type DangerAssessment,
  type DomAction,
  type DomActionResult,
} from './dom-actions';
import { type Ambient } from './ambient';
import {
  createPillPrefs,
  DEFAULT_CAPSULE_THEME,
  type CapsuleTheme,
  type PillPrefs,
} from './pill-prefs';

export interface CapsuleProps {
  // Single seam to the host shell — provides transport, storage,
  // selection, optional domActions/screenshot/debug. The cápsula reads
  // ambient.capabilities to decide what UI to render.
  ambient: Ambient;
  initialSnapshot: SelectionSnapshot;
  onDismiss: () => void;
  // Last known cursor position, in viewport coordinates. Used as the
  // anchor when there is no text selection. When both bbox and cursor
  // are absent (rare: hotkey before any pointer activity), the cápsula
  // opens as a centered floating capsule.
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
  ambient,
  initialSnapshot,
  onDismiss,
  cursorAnchor,
}: CapsuleProps) {
  // Construct the client + prefs once per cápsula mount. Ambient is a
  // stable singleton built by the host shell's createXAmbient(); we
  // don't re-instantiate on every render.
  const client = useMemo(() => new ComposerClient(ambient), [ambient]);
  const prefs: PillPrefs = useMemo(
    () => createPillPrefs(ambient.storage),
    [ambient],
  );
  // Executor mirror — desktop ambient has no domActions; the "Acionar"
  // button hides via ambient.capabilities.domExecution.
  const executor = ambient.domActions?.execute;
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
  // Flagship theme — light by default ("surface flagship"); dark stays
  // available via the settings drawer toggle. Persisted in
  // ambient.storage so the choice survives across sessions/tabs/shells.
  const [theme, setTheme] = useState<CapsuleTheme>(DEFAULT_CAPSULE_THEME);
  // Tool manifests — fetched once on mount via GET /tools/manifests so
  // the command palette can list every tool the agent CAN call (with
  // mode + risk + version), not just the ad-hoc UI shortcuts. Operator
  // sees what's actually available; doctrine is "tudo à mão".
  const [toolManifests, setToolManifests] = useState<ToolManifest[]>([]);
  const [paletteRecent, setPaletteRecent] = useState<string[]>([]);
  // Ripple counter — incremented on each submit so React keys the
  // ripple element fresh, replaying the keyframe even when the user
  // submits twice in quick succession.
  const [submitRipple, setSubmitRipple] = useState(0);
  // Context-pop pulse — fires once when the page selection transitions
  // from empty → non-empty. The chip pops to confirm "context locked
  // in" before the operator even looks at the meta strip. Cleared by
  // a timer so the chip returns to rest.
  const [contextJustArrived, setContextJustArrived] = useState(false);
  const prevHadContextRef = useRef(false);
  // TTS — when enabled in settings, the cápsula speaks the compose
  // response as soon as plan_ready fires. Persisted via prefs;
  // synthesizer instance lives on the window.speechSynthesis singleton
  // so we cancel any in-flight utterance when the operator submits a
  // new request or dismisses the cápsula.
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const lastSpokenRef = useRef<string>('');
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

  // Tool manifests — load on mount; failure leaves the list empty so
  // the palette still shows the built-in actions. Recently-used tool
  // ids load in parallel so the palette renders ordered from the start.
  useEffect(() => {
    let cancelled = false;
    void client
      .getToolManifests()
      .then((tools) => {
        if (!cancelled) setToolManifests(tools);
      })
      .catch(() => {
        // Manifests endpoint unreachable — keep palette working with
        // built-in actions only.
      });
    void prefs.readPaletteRecent().then((recent) => {
      if (!cancelled) setPaletteRecent(recent);
    });
    return () => {
      cancelled = true;
    };
  }, [client, prefs]);

  // Context-pop watcher — when snapshot.text flips empty → non-empty
  // (e.g. iframe-harvest enriched the snapshot, or refreshSnapshot
  // pulled in a fresh selection), pulse the source chip so the
  // operator's eye catches the new context. One-shot, no infinite
  // pulse loop.
  useEffect(() => {
    const has = !!snapshot.text;
    if (has && !prevHadContextRef.current) {
      setContextJustArrived(true);
      const t = window.setTimeout(() => setContextJustArrived(false), 700);
      prevHadContextRef.current = true;
      return () => window.clearTimeout(t);
    }
    prevHadContextRef.current = has;
  }, [snapshot.text]);

  // TTS — load persisted toggle. Speak when plan_ready arrives with a
  // compose answer. The Web Speech API is feature-detected at speak
  // time; an unsupported browser silently does nothing.
  useEffect(() => {
    let cancelled = false;
    void prefs.readTtsEnabled().then((enabled) => {
      if (!cancelled) setTtsEnabled(enabled);
    });
    // Live sync — the settings drawer broadcasts gauntlet:tts when the
    // operator flips the toggle. Without this listener the cápsula's
    // own state would stay stale and continue speaking after the
    // operator turned TTS off.
    function onTts(ev: Event) {
      const detail = (ev as CustomEvent<{ enabled?: boolean }>).detail;
      if (typeof detail?.enabled === 'boolean') setTtsEnabled(detail.enabled);
    }
    window.addEventListener('gauntlet:tts', onTts);
    return () => {
      cancelled = true;
      window.removeEventListener('gauntlet:tts', onTts);
    };
  }, [prefs]);

  useEffect(() => {
    if (!ttsEnabled) return;
    if (phase !== 'plan_ready') return;
    const text = plan?.compose;
    if (!text) return;
    if (text === lastSpokenRef.current) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.05;
      utt.pitch = 1;
      window.speechSynthesis.speak(utt);
      lastSpokenRef.current = text;
    } catch {
      // SpeechSynthesisUtterance constructor or .speak can throw on
      // hostile shadow contexts; swallow — TTS is a bonus, not core.
    }
  }, [ttsEnabled, phase, plan?.compose]);

  // Cancel any in-flight utterance when the cápsula unmounts so the
  // voice doesn't keep reading after dismiss.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore
      }
    };
  }, []);

  // Theme — load persisted choice once at mount. While the storage
  // round-trip resolves the cápsula renders the default flagship light,
  // so there's no flash for the most common path.
  useEffect(() => {
    let cancelled = false;
    void prefs.readTheme().then((t) => {
      if (!cancelled) setTheme(t);
    });
    return () => {
      cancelled = true;
    };
  }, [prefs]);

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
    // Skip when the host shell can't capture (desktop default, browser
    // popup window) — both screenshot capability and a working
    // screenshot adapter must be present.
    if (!ambient.capabilities.screenshot || !ambient.screenshot) return;
    let cancelled = false;
    void prefs.readScreenshotEnabled().then((enabledLocal) => {
      // The local pref defaults to false in pill-prefs. If the
      // operator-side default is true, we honor it as the boot value
      // unless the user already toggled it locally. To avoid a third
      // tri-state pref we treat "local was never set" the same as
      // "local is false" — operator default only applies when local is
      // false. That biases toward minimal screenshot capture (privacy
      // wins on draws).
      const enabled = enabledLocal || settings.screenshot_default;
      if (cancelled || !enabled) return;
      void ambient
        .screenshot!.capture()
        .then((dataUrl) => {
          if (cancelled || !dataUrl) return;
          setScreenshot(dataUrl);
        })
        .catch(() => {
          // Silent — screenshot is opt-in and best-effort.
        });
    });
    return () => {
      cancelled = true;
    };
  }, [ambient, prefs, settings.screenshot_default]);

  const refreshSnapshot = useCallback(() => {
    setSnapshot(ambient.selection.read());
  }, [ambient]);

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
      // Goes through ambient.transport so the request originates from
      // the right origin in each shell (chrome-extension:// proxied
      // through the service worker; direct fetch on desktop).
      await ambient.transport.fetchJson(
        'POST',
        `${client.backendUrl}/memory/records`,
        { topic, body, kind: 'note', scope: 'user' },
      );
      flashSaved('saved');
    } catch (err) {
      setError(
        err instanceof Error ? `memória: ${err.message}` : 'memória: falhou',
      );
    }
  }, [ambient, client, plan, snapshot, userInput, flashSaved]);

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
    const screenshotEnabled = await prefs.readScreenshotEnabled();
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
      // Trigger the submit ripple — visual confirmation that the
      // gesture landed even before the network round-trip starts.
      // Cleared by the keyframe's animationend listener below.
      setSubmitRipple((n) => n + 1);
      // Cancel any in-flight TTS utterance from the previous response
      // so the operator's new submit doesn't compete with stale audio.
      // The settings drawer's description promises "cancela ao submeter
      // outro pedido" — this is the cancel hook. Also reset the spoken
      // ref so the next plan_ready (even if it produces the same text)
      // gets read again.
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // ignore — TTS is a bonus, not core
      }
      lastSpokenRef.current = '';
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
      data-theme={theme}
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
              showScreenshot={ambient.capabilities.screenshot}
              showDismissedDomains={ambient.capabilities.dismissDomain}
              showPillMode={ambient.capabilities.pillSurface}
              prefs={prefs}
              theme={theme}
              onChangeTheme={(t) => {
                setTheme(t);
                void prefs.writeTheme(t);
              }}
            />
          )}

          <section className="gauntlet-capsule__context">
            <div className="gauntlet-capsule__context-meta">
              <span
                className={`gauntlet-capsule__source${
                  contextJustArrived ? ' gauntlet-capsule__source--popped' : ''
                }`}
              >
                browser
              </span>
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
                {/* Ripple — keyed on submitRipple so each submit
                    replays the keyframe even if the previous ripple
                    is still mid-animation. Pointer-events none so
                    the underlying button still takes clicks. */}
                {submitRipple > 0 && (
                  <span
                    key={submitRipple}
                    className="gauntlet-capsule__compose-ripple"
                    aria-hidden
                  />
                )}
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
          recentIds={paletteRecent}
          actions={(() => {
            const noteUse = (id: string) => {
              setPaletteRecent((prev) => {
                const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
                return next;
              });
              void prefs.notePaletteUse(id);
            };
            const insertToolPrefix = (toolName: string) => {
              setUserInput((prev) => {
                const trimmed = prev.trimEnd();
                const head = `usa a tool ${toolName} para `;
                if (trimmed.startsWith('usa a tool ')) return head;
                return trimmed ? `${head}${trimmed}` : head;
              });
              window.setTimeout(() => {
                const el = inputRef.current;
                if (!el) return;
                el.focus();
                el.setSelectionRange(el.value.length, el.value.length);
              }, 0);
            };
            const builtIns: PaletteAction[] = [
              {
                id: 'focus',
                label: 'Focar input',
                shortcut: '↵',
                group: 'action',
                run: () => {
                  noteUse('focus');
                  setPaletteOpen(false);
                  window.setTimeout(() => inputRef.current?.focus(), 0);
                },
              },
              {
                id: 'copy',
                label: 'Copiar resposta',
                shortcut: '⌘C',
                group: 'action',
                disabled: !plan?.compose,
                run: () => {
                  noteUse('copy');
                  setPaletteOpen(false);
                  void onCopyCompose();
                },
              },
              {
                id: 'save',
                label: 'Guardar em memória',
                shortcut: 'S',
                group: 'action',
                disabled: !plan?.compose && !snapshot.text && !userInput.trim(),
                run: () => {
                  noteUse('save');
                  setPaletteOpen(false);
                  void saveToMemory();
                },
              },
              {
                id: 'reread',
                label: 'Re-ler contexto',
                shortcut: 'R',
                group: 'action',
                run: () => {
                  noteUse('reread');
                  setPaletteOpen(false);
                  refreshSnapshot();
                },
              },
              {
                id: 'clear',
                label: 'Limpar input',
                shortcut: 'X',
                group: 'action',
                disabled: !userInput,
                run: () => {
                  noteUse('clear');
                  setPaletteOpen(false);
                  setUserInput('');
                  inputRef.current?.focus();
                },
              },
              {
                id: 'dismiss',
                label: 'Fechar cápsula',
                shortcut: 'Esc',
                group: 'action',
                run: () => {
                  noteUse('dismiss');
                  setPaletteOpen(false);
                  handleDismiss();
                },
              },
            ];
            const allowedTools = toolManifests.filter((t) => {
              const policy = settings.tool_policies?.[t.name];
              return !policy || policy.allowed !== false;
            });
            const toolEntries: PaletteAction[] = allowedTools.map((t) => ({
              id: `tool:${t.name}`,
              label: t.name,
              description: t.description,
              shortcut: '',
              group: 'tool',
              mode: t.mode,
              risk: t.risk,
              requiresApproval:
                settings.tool_policies?.[t.name]?.require_approval === true,
              run: () => {
                noteUse(`tool:${t.name}`);
                setPaletteOpen(false);
                insertToolPrefix(t.name);
              },
            }));
            return [...builtIns, ...toolEntries];
          })()}
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
  // Optional metadata for tool entries — drives the badges + description
  // line below the label. Action entries leave these undefined.
  description?: string;
  group?: 'action' | 'tool';
  mode?: string;
  risk?: string;
  requiresApproval?: boolean;
  run: () => void;
}

// Fuzzy scorer — substring match wins; otherwise score by how cheaply
// the query characters can be found in order in the candidate. Higher
// score = better match. Returns -1 when no order-preserving match
// exists, which the caller filters out.
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1000 - t.indexOf(q);
  let qi = 0;
  let runs = 0;
  let lastMatch = -2;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (i !== lastMatch + 1) runs++;
      lastMatch = i;
      qi++;
    }
  }
  if (qi < q.length) return -1;
  // Fewer "runs" = chars came in sequence, which we prefer.
  return 500 - runs * 10 - (t.length - q.length);
}

function CommandPalette({
  actions,
  onClose,
  recentIds,
}: {
  actions: PaletteAction[];
  onClose: () => void;
  recentIds: string[];
}) {
  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Score + sort: empty filter promotes recents to the top of each
  // group; non-empty filter ranks by fuzzy match across all entries.
  const visible = useMemo(() => {
    if (!filter) {
      const recentRank = new Map(recentIds.map((id, i) => [id, i]));
      const score = (a: PaletteAction) => {
        const r = recentRank.get(a.id);
        return r === undefined ? recentIds.length : r;
      };
      const sorted = [...actions].sort((a, b) => {
        const sa = score(a);
        const sb = score(b);
        if (sa !== sb) return sa - sb;
        // Stable-ish secondary sort: actions before tools, then label.
        const groupOrder = (g?: string) => (g === 'tool' ? 1 : 0);
        const ga = groupOrder(a.group);
        const gb = groupOrder(b.group);
        if (ga !== gb) return ga - gb;
        return a.label.localeCompare(b.label);
      });
      return sorted;
    }
    const scored = actions
      .map((a) => {
        const haystack = `${a.label} ${a.id} ${a.description ?? ''}`;
        return { a, score: fuzzyScore(filter, haystack) };
      })
      .filter((x) => x.score >= 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);
    return scored;
  }, [actions, filter, recentIds]);

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
          placeholder="comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)"
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
        />
        <ul className="gauntlet-capsule__palette-list" role="listbox">
          {visible.length === 0 ? (
            <li className="gauntlet-capsule__palette-empty">sem resultados</li>
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
                }${a.disabled ? ' gauntlet-capsule__palette-item--disabled' : ''}${
                  a.group === 'tool' ? ' gauntlet-capsule__palette-item--tool' : ''
                }`}
              >
                <div className="gauntlet-capsule__palette-main">
                  <span className="gauntlet-capsule__palette-label">{a.label}</span>
                  {a.description && (
                    <span className="gauntlet-capsule__palette-desc">{a.description}</span>
                  )}
                </div>
                <div className="gauntlet-capsule__palette-meta">
                  {a.mode && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${a.mode}`}
                      title={`mode: ${a.mode}`}
                    >
                      {a.mode}
                    </span>
                  )}
                  {a.risk && a.risk !== 'low' && (
                    <span
                      className={`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${a.risk}`}
                      title={`risk: ${a.risk}`}
                    >
                      {a.risk}
                    </span>
                  )}
                  {a.requiresApproval && (
                    <span
                      className="gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval"
                      title="requires explicit approval before running"
                    >
                      approval
                    </span>
                  )}
                  {a.shortcut && (
                    <span className="gauntlet-capsule__palette-shortcut">{a.shortcut}</span>
                  )}
                </div>
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
  prefs,
  showDismissedDomains,
  theme,
  onChangeTheme,
  showPillMode,
}: {
  onClose: () => void;
  // Only the in-page surface has a real tab to screenshot. The popup
  // window would capture itself, which is useless and visually
  // recursive — hide the toggle there.
  showScreenshot: boolean;
  prefs: PillPrefs;
  // Browser shows the per-domain hide list; desktop hides this whole
  // section because there are no domains.
  showDismissedDomains: boolean;
  theme: CapsuleTheme;
  onChangeTheme: (theme: CapsuleTheme) => void;
  // Show the pill-mode toggle only on shells that actually render a pill.
  showPillMode: boolean;
}) {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenshotEnabled, setScreenshotEnabled] = useState(false);
  const [pillMode, setPillModeState] = useState<'corner' | 'cursor'>('corner');
  const [ttsEnabledLocal, setTtsEnabledLocal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (showDismissedDomains) {
      void prefs.readDismissedDomains().then((list) => {
        if (cancelled) return;
        setDomains(list);
      });
    }
    void prefs.readScreenshotEnabled().then((enabled) => {
      if (cancelled) return;
      setScreenshotEnabled(enabled);
      setLoading(false);
    });
    void prefs.readPillMode().then((m) => {
      if (!cancelled) setPillModeState(m);
    });
    void prefs.readTtsEnabled().then((b) => {
      if (!cancelled) setTtsEnabledLocal(b);
    });
    return () => {
      cancelled = true;
    };
  }, [prefs, showDismissedDomains]);

  const togglePillMode = useCallback(
    async (next: 'corner' | 'cursor') => {
      setPillModeState(next);
      await prefs.writePillMode(next);
      // Live broadcast so App.tsx flips the pill without a reload.
      window.dispatchEvent(
        new CustomEvent('gauntlet:pill-mode', { detail: { mode: next } }),
      );
    },
    [prefs],
  );

  const toggleTts = useCallback(
    async (enabled: boolean) => {
      setTtsEnabledLocal(enabled);
      await prefs.writeTtsEnabled(enabled);
      // Cancel any speaking voice when the operator turns TTS off mid-read.
      if (!enabled) {
        try {
          window.speechSynthesis?.cancel();
        } catch {
          // ignore
        }
      }
      window.dispatchEvent(
        new CustomEvent('gauntlet:tts', { detail: { enabled } }),
      );
    },
    [prefs],
  );

  const restore = useCallback(
    async (host: string) => {
      await prefs.restoreDomain(host);
      setDomains((prev) => prev.filter((h) => h !== host));
    },
    [prefs],
  );

  const toggleScreenshot = useCallback(
    async (enabled: boolean) => {
      setScreenshotEnabled(enabled);
      await prefs.writeScreenshotEnabled(enabled);
    },
    [prefs],
  );

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

      <div className="gauntlet-capsule__settings-section">
        <span className="gauntlet-capsule__settings-subtitle">aparência</span>
        <div className="gauntlet-capsule__theme-switch" role="radiogroup" aria-label="tema">
          <button
            type="button"
            className={`gauntlet-capsule__theme-option${
              theme === 'light' ? ' gauntlet-capsule__theme-option--active' : ''
            }`}
            onClick={() => onChangeTheme('light')}
            role="radio"
            aria-checked={theme === 'light'}
          >
            <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light" aria-hidden />
            <span>flagship light</span>
          </button>
          <button
            type="button"
            className={`gauntlet-capsule__theme-option${
              theme === 'dark' ? ' gauntlet-capsule__theme-option--active' : ''
            }`}
            onClick={() => onChangeTheme('dark')}
            role="radio"
            aria-checked={theme === 'dark'}
          >
            <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark" aria-hidden />
            <span>night premium</span>
          </button>
        </div>
      </div>

      {showPillMode && (
        <div className="gauntlet-capsule__settings-section">
          <span className="gauntlet-capsule__settings-subtitle">pill</span>
          <div className="gauntlet-capsule__theme-switch" role="radiogroup" aria-label="pill mode">
            <button
              type="button"
              className={`gauntlet-capsule__theme-option${
                pillMode === 'corner' ? ' gauntlet-capsule__theme-option--active' : ''
              }`}
              onClick={() => void togglePillMode('corner')}
              role="radio"
              aria-checked={pillMode === 'corner'}
            >
              <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner" aria-hidden />
              <span>resting corner</span>
            </button>
            <button
              type="button"
              className={`gauntlet-capsule__theme-option${
                pillMode === 'cursor' ? ' gauntlet-capsule__theme-option--active' : ''
              }`}
              onClick={() => void togglePillMode('cursor')}
              role="radio"
              aria-checked={pillMode === 'cursor'}
            >
              <span className="gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor" aria-hidden />
              <span>cursor pill</span>
            </button>
          </div>
        </div>
      )}

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
        <label className="gauntlet-capsule__settings-toggle">
          <input
            type="checkbox"
            checked={ttsEnabledLocal}
            onChange={(ev) => void toggleTts(ev.target.checked)}
          />
          <span className="gauntlet-capsule__settings-toggle-label">
            <strong>ler resposta em voz alta</strong>
            <small>
              quando o modelo termina, a cápsula fala a resposta via Web Speech.
              cancela ao submeter outro pedido ou fechar a cápsula.
            </small>
          </span>
        </label>
      </div>

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
  0%   { transform: translate3d(-12%, -8%, 0) rotate(0deg) scale(1); }
  33%  { transform: translate3d(6%,   -4%, 0) rotate(120deg) scale(1.06); }
  66%  { transform: translate3d(8%,    6%, 0) rotate(240deg) scale(0.96); }
  100% { transform: translate3d(-12%, -8%, 0) rotate(360deg) scale(1); }
}
/* Capsule enter — layered choreography: the shell rises with a soft
   spring (~360ms cubic), the aurora drifts in slightly later (200ms
   delay), and the content panels stagger by 60ms each so the eye
   reads the cápsula assembling itself instead of materialising as a
   single slab. Doutrina: a cápsula respira ao chegar, não aparece. */
@keyframes gauntlet-cap-rise {
  0%   { opacity: 0; transform: translateY(10px) scale(0.97); filter: blur(2px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0)   scale(1); filter: blur(0); }
}
@keyframes gauntlet-cap-rise-centered {
  0%   { opacity: 0; transform: translate(-50%, calc(-50% + 10px)) scale(0.97); filter: blur(2px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translate(-50%, -50%)              scale(1); filter: blur(0); }
}
@keyframes gauntlet-cap-aurora-fade-in {
  0%   { opacity: 0; }
  100% { opacity: 0.6; }
}
@keyframes gauntlet-cap-stagger-in {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes gauntlet-cap-spin {
  to { transform: rotate(360deg); }
}
/* Phase ring morph — when the active phase changes, the ring picks up
   the new colour over 600ms with an easing curve so the operator
   reads the transition as a state change, not a flicker. */
@keyframes gauntlet-cap-phase-morph {
  0%   { box-shadow: 0 0 0 1px transparent, 0 0 12px transparent; }
  50%  { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 36px var(--gx-phase, transparent); }
  100% { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 24px var(--gx-phase, transparent); }
}

.gauntlet-capsule {
  /* Flagship light is the new default surface. The cápsula is premium
     daylight: cream paper, ink fg, ember accent. Dark stays available
     as an alternative behind data-theme="dark"; existing operators
     who prefer the night surface flip via the settings drawer. */
  --gx-ember: #d07a5a;
  --gx-ember-soft: rgba(208, 122, 90, 0.14);
  --gx-bg: #f7f3e8;
  --gx-bg-solid: #fbf7ee;
  --gx-surface: rgba(255, 255, 255, 0.78);
  --gx-surface-strong: #ffffff;
  --gx-border: rgba(15, 17, 22, 0.08);
  --gx-border-mid: rgba(15, 17, 22, 0.16);
  --gx-fg: #1a1d24;
  --gx-fg-dim: #4a4f5b;
  --gx-fg-muted: #7a808d;
  --gx-tint-soft: rgba(15, 17, 22, 0.04);
  --gx-tint-strong: rgba(15, 17, 22, 0.08);
  --gx-sunken: rgba(15, 17, 22, 0.04);
  --gx-scrim: rgba(15, 17, 22, 0.32);
  --gx-shadow-rgb: 32, 24, 18;
  /* Semantic ink — text on tinted accent backgrounds. Light needs
     deeper hues to stay readable; dark uses paler hues. Each pairs
     with its own --gx-{accent,success,danger}-bg tint above. */
  --gx-accent-text: #b3501f;
  --gx-success-text: #2f6e44;
  --gx-danger-text: #9b2c2c;
  /* Code block ink — purple keywords, rust strings, slate comments.
     Mirrors the Codex/Claude-Code premium-light reference the operator
     pinned for the flagship surface. */
  --gx-code-bg: #f3edde;
  --gx-code-fg: #2a2218;
  --gx-code-keyword: #6e3aa8;
  --gx-code-string: #b3501f;
  --gx-code-number: #8c5a00;
  --gx-code-comment: #8a8470;
  --gx-code-fn: #2563a8;
  --gx-code-meta-bg: rgba(15, 17, 22, 0.04);
}

/* Dark variant — premium night surface. Same ember accent, glass
   mood, deep ink. Toggled via data-theme="dark" on the capsule root. */
.gauntlet-capsule[data-theme="dark"] {
  --gx-bg: rgba(14, 16, 22, 0.92);
  --gx-bg-solid: #0e1016;
  --gx-surface: rgba(28, 30, 38, 0.70);
  --gx-surface-strong: #1a1d26;
  --gx-border: rgba(255, 255, 255, 0.08);
  --gx-border-mid: rgba(255, 255, 255, 0.14);
  --gx-fg: #f0f2f7;
  --gx-fg-dim: #aab0bd;
  --gx-fg-muted: #6a7080;
  --gx-tint-soft: rgba(255, 255, 255, 0.04);
  --gx-tint-strong: rgba(255, 255, 255, 0.08);
  --gx-sunken: rgba(8, 9, 13, 0.55);
  --gx-scrim: rgba(8, 9, 13, 0.55);
  --gx-shadow-rgb: 0, 0, 0;
  --gx-accent-text: #f4c4ad;
  --gx-success-text: #cfe8d3;
  --gx-danger-text: #f1a4ad;
  --gx-code-bg: rgba(8, 9, 13, 0.7);
  --gx-code-fg: #e6e8ee;
  --gx-code-keyword: #c4a8ff;
  --gx-code-string: #f4c4ad;
  --gx-code-number: #f4d4c0;
  --gx-code-comment: #6a7080;
  --gx-code-fn: #a8c8ff;
  --gx-code-meta-bg: rgba(255, 255, 255, 0.02);
}

.gauntlet-capsule {
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
  backdrop-filter: saturate(1.2) blur(20px);
  -webkit-backdrop-filter: saturate(1.2) blur(20px);
  box-shadow:
    0 0 0 1px var(--gx-tint-soft),
    0 24px 60px rgba(var(--gx-shadow-rgb), 0.18),
    0 8px 24px rgba(var(--gx-shadow-rgb), 0.10);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 0;
  isolation: isolate;
  pointer-events: auto;
  /* Spring-shaped curve — slightly past the target, settles back. The
     overshoot is ≤2px so the operator reads it as confidence, not
     bounce. 360ms gives the layered stagger room to breathe. */
  animation: gauntlet-cap-rise 360ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
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
  animation: gauntlet-cap-rise-centered 360ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
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
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  /* Aurora fades in after the shell rise (200ms delay), then drifts
     forever at a 28s loop. Two-layer animation = mount fade + ambient
     drift; the comma syntax stacks them. */
  animation:
    gauntlet-cap-aurora-fade-in 600ms 200ms cubic-bezier(0.2, 0, 0, 1) forwards,
    gauntlet-cap-aurora 28s linear infinite;
}
/* Layered staggered entrance — each panel rises ~60ms after the one
   before it so the cápsula reads as composed, not stamped. */
.gauntlet-capsule__panel--left {
  animation: gauntlet-cap-stagger-in 320ms 120ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__panel--right {
  animation: gauntlet-cap-stagger-in 320ms 200ms cubic-bezier(0.2, 0, 0, 1) both;
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
  background: var(--gx-tint-soft);
}

/* ── Context ── */
.gauntlet-capsule__context {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
/* Context chips — pill row above the input. Source / page-title /
   re-read read as chips, like the reference flagship surface. Not a
   metadata strip; a deliberate chip row that frames the cápsula's
   ambient awareness. */
.gauntlet-capsule__context-meta {
  display: flex; gap: 6px; align-items: center;
  font-size: 11px;
  color: var(--gx-fg-dim);
  margin-bottom: 8px;
  font-family: "Inter", system-ui, sans-serif;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.gauntlet-capsule__source {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border-mid);
  background: var(--gx-surface-strong, var(--gx-tint-soft));
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms ease, box-shadow 200ms ease;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}
.gauntlet-capsule__source::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gx-ember);
  box-shadow: 0 0 6px rgba(208, 122, 90, 0.65);
  flex-shrink: 0;
}
/* Context pop — fires once when a fresh selection lands. The chip
   bumps to 1.06 with an ember halo, settles back. The dot inside also
   flashes brighter for the same window. */
@keyframes gauntlet-cap-chip-pop {
  0%   { transform: translateY(0)    scale(1);    box-shadow: 0 0 0 0 rgba(208, 122, 90, 0); }
  35%  { transform: translateY(-2px) scale(1.06); box-shadow: 0 0 0 6px rgba(208, 122, 90, 0.18); }
  70%  { transform: translateY(-1px) scale(1.02); box-shadow: 0 0 0 3px rgba(208, 122, 90, 0.10); }
  100% { transform: translateY(0)    scale(1);    box-shadow: 0 0 0 0 rgba(208, 122, 90, 0); }
}
.gauntlet-capsule__source--popped {
  animation: gauntlet-cap-chip-pop 700ms cubic-bezier(0.16, 1.05, 0.34, 1);
}
.gauntlet-capsule__source--popped::before {
  background: #ffd2b6;
  box-shadow: 0 0 12px rgba(208, 122, 90, 0.95);
}
.gauntlet-capsule__url {
  flex: 1;
  min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--gx-border);
  background: var(--gx-surface-strong, transparent);
  color: var(--gx-fg-dim);
  font-family: "Inter", system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 0;
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms ease, color 160ms ease;
}
/* Chip lift on hover — every context chip gets a 1px lift + ember
   border kiss so the operator senses the chip row is alive. Compose
   button gets its own pressed-state below. */
.gauntlet-capsule__source:hover,
.gauntlet-capsule__url:hover {
  transform: translateY(-1px);
  border-color: rgba(208, 122, 90, 0.45);
  color: var(--gx-fg);
}
.gauntlet-capsule__refresh {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 180ms cubic-bezier(0.2, 0, 0, 1);
  flex-shrink: 0;
}
.gauntlet-capsule__refresh:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  transform: translateY(-1px);
  background: var(--gx-tint-soft);
}
.gauntlet-capsule__selection {
  background: var(--gx-sunken);
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
  background: var(--gx-surface-strong, var(--gx-sunken));
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 14px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 14.5px;
  resize: none;
  min-height: 64px;
  box-sizing: border-box;
  line-height: 1.55;
  transition: border-color 160ms ease, box-shadow 200ms ease, background 160ms ease;
  caret-color: var(--gx-ember);
}
.gauntlet-capsule__input::placeholder {
  color: var(--gx-fg-muted);
  font-style: normal;
}
.gauntlet-capsule__input:focus {
  outline: none;
  border-color: rgba(208, 122, 90, 0.55);
  box-shadow:
    0 0 0 3px rgba(208, 122, 90, 0.14),
    0 0 32px rgba(208, 122, 90, 0.10);
}
.gauntlet-capsule__actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 10px;
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
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-size: 10px;
}
/* Submit ripple — radiates from the compose button on every submit so
   the operator's gesture has visible weight. Pure CSS animation, lives
   inside the button (overflow stays clipped to the pill shape so the
   ripple looks like an inner pulse expanding outward). */
@keyframes gauntlet-cap-ripple {
  0%   { opacity: 0.45; transform: translate(-50%, -50%) scale(0.2); }
  60%  { opacity: 0.20; }
  100% { opacity: 0;    transform: translate(-50%, -50%) scale(2.6); }
}
.gauntlet-capsule__compose {
  position: relative;
  overflow: hidden;
}
.gauntlet-capsule__compose-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.65) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  pointer-events: none;
  animation: gauntlet-cap-ripple 520ms cubic-bezier(0.2, 0, 0, 1) forwards;
  z-index: 0;
}
.gauntlet-capsule__compose > *:not(.gauntlet-capsule__compose-ripple) {
  position: relative;
  z-index: 1;
}
.gauntlet-capsule__compose {
  position: relative;
  border: none;
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(180deg, #d6855e 0%, #b65d3f 100%);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.45),
    0 6px 18px rgba(208, 122, 90, 0.35);
  transition: transform 120ms ease, box-shadow 160ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__compose:hover:not(:disabled) {
  transform: translateY(-1.5px);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.55),
    0 12px 28px rgba(208, 122, 90, 0.55),
    0 0 0 4px rgba(208, 122, 90, 0.10);
}
/* Press feedback — micro-spring inward when the operator commits.
   Slightly past flat (0.5px down) reads like a real button settling. */
.gauntlet-capsule__compose:active:not(:disabled) {
  transform: translateY(0.5px) scale(0.985);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.55),
    0 4px 12px rgba(208, 122, 90, 0.40);
  transition-duration: 60ms;
}
.gauntlet-capsule__compose:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
  box-shadow: 0 0 0 1px var(--gx-border-mid);
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
  color: var(--gx-danger-text);
  border-radius: 8px;
  font-size: 12px;
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__error-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.25);
  color: var(--gx-danger-text);
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
  background: var(--gx-tint-soft);
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
  background: var(--gx-sunken);
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
  background: var(--gx-tint-soft);
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
  background: var(--gx-tint-soft);
  border-color: rgba(255, 255, 255, 0.22);
}

.gauntlet-capsule__refusal {
  padding: 12px;
  background: rgba(208, 122, 90, 0.07);
  border: 1px solid rgba(208, 122, 90, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: var(--gx-accent-text);
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
  color: var(--gx-accent-text);
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
  color: var(--gx-accent-text);
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
  background: var(--gx-tint-soft);
}
@keyframes gauntlet-cap-drawer-flip {
  0%   { opacity: 0; transform: translateY(-4px) scaleY(0.92); transform-origin: top; }
  60%  { opacity: 1; transform: translateY(1px)  scaleY(1.02); }
  100% { opacity: 1; transform: translateY(0)    scaleY(1); }
}
.gauntlet-capsule__settings {
  margin: 8px 0;
  padding: 10px 12px;
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border-mid);
  border-radius: 10px;
  /* Flip-spring open — the drawer scaleY-overshoots slightly so it
     reads like a real surface unfolding from under the header. */
  animation: gauntlet-cap-drawer-flip 280ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
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
  background: var(--gx-tint-soft);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}

/* Theme switch — flagship light vs night premium. Two pill buttons,
   the active one carries the ember accent. The swatch previews the
   destination so the operator picks visually, not by label alone. */
.gauntlet-capsule__theme-switch {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.gauntlet-capsule__theme-option {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
}
.gauntlet-capsule__theme-option:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
}
.gauntlet-capsule__theme-option--active {
  border-color: rgba(208, 122, 90, 0.55);
  background: var(--gx-ember-soft, rgba(208, 122, 90, 0.12));
  color: var(--gx-fg);
}
.gauntlet-capsule__theme-swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid var(--gx-border-mid);
  flex-shrink: 0;
}
.gauntlet-capsule__theme-swatch--light {
  background: linear-gradient(135deg, #fbf7ee 0%, #f3edde 100%);
}
.gauntlet-capsule__theme-swatch--dark {
  background: linear-gradient(135deg, #1a1d26 0%, #0e1016 100%);
}
/* Pill-mode swatches — visual hint for the toggle: corner shows a
   resting dot in the bottom-right; cursor shows a small dot at the
   centre to suggest "follows pointer". */
.gauntlet-capsule__pill-mode-swatch--corner {
  background: var(--gx-surface-strong, #ffffff);
  position: relative;
}
.gauntlet-capsule__pill-mode-swatch--corner::after {
  content: '';
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gx-ember);
  box-shadow: 0 0 4px rgba(208, 122, 90, 0.55);
}
.gauntlet-capsule__pill-mode-swatch--cursor {
  background: var(--gx-surface-strong, #ffffff);
  position: relative;
}
.gauntlet-capsule__pill-mode-swatch--cursor::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: var(--gx-ember);
  box-shadow: 0 0 6px rgba(208, 122, 90, 0.65);
}
.gauntlet-capsule__settings-host {
  flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gauntlet-capsule__settings-restore {
  background: rgba(208, 122, 90, 0.12);
  color: var(--gx-accent-text);
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
  background: var(--gx-sunken);
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
/* Wave-coordinated skeleton — three lines start the shimmer offset by
   140ms each so the eye reads a cohesive wave moving down, not three
   loose lines flickering independently. */
.gauntlet-capsule__skeleton-line--w90 { width: 90%; animation-delay: 0ms; }
.gauntlet-capsule__skeleton-line--w75 { width: 75%; animation-delay: 140ms; }
.gauntlet-capsule__skeleton-line--w55 { width: 55%; animation-delay: 280ms; }

/* ── Compose response (inline text answer) ── */
.gauntlet-capsule__compose-result {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--gx-sunken);
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
  color: var(--gx-accent-text);
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
  background: var(--gx-sunken);
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
  color: var(--gx-accent-text);
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
  background: var(--gx-tint-soft);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
  border: 1px solid transparent;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__plan-item--ok {
  background: rgba(122, 180, 138, 0.10);
  border-color: rgba(122, 180, 138, 0.35);
  color: var(--gx-success-text);
}
.gauntlet-capsule__plan-item--fail {
  background: rgba(212, 96, 60, 0.10);
  border-color: rgba(212, 96, 60, 0.35);
  color: var(--gx-danger-text);
}
.gauntlet-capsule__plan-step {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--gx-tint-soft);
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
  color: var(--gx-danger-text);
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
  color: var(--gx-danger-text);
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
  color: var(--gx-danger-text);
}
.gauntlet-capsule__danger-list {
  margin: 0 0 8px 0; padding: 0 0 0 24px;
  font-size: 11px;
  color: var(--gx-danger-text);
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
  /* Both opacity AND box-shadow fade so a phase swap (planning → streaming
     → done) reads as a colour morph, not a flicker. The cubic curve gives
     a slight lead-in before the colour settles. */
  transition:
    opacity 320ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 480ms cubic-bezier(0.4, 0, 0.2, 1);
}
.gauntlet-capsule--phase-planning::before,
.gauntlet-capsule--phase-streaming::before,
.gauntlet-capsule--phase-plan_ready::before,
.gauntlet-capsule--phase-executing::before,
.gauntlet-capsule--phase-executed::before,
.gauntlet-capsule--phase-error::before {
  opacity: 1;
}
/* Heartbeat pulse on long-running phases (planning + streaming +
   executing) so the operator senses the cápsula "still thinking" even
   when no text is changing. Softer + slower than a loading spinner. */
@keyframes gauntlet-cap-phase-heartbeat {
  0%, 100% { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 18px var(--gx-phase, transparent); }
  50%      { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 36px var(--gx-phase, transparent); }
}
.gauntlet-capsule--phase-planning::before,
.gauntlet-capsule--phase-streaming::before,
.gauntlet-capsule--phase-executing::before {
  animation: gauntlet-cap-phase-heartbeat 2.4s ease-in-out infinite;
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
  background: var(--gx-tint-soft);
}

/* ── Voice button (press-and-hold) ──────────────────────────────────────── */
/* Resonant waves — three concentric rings ride out as the operator
   speaks. Visual mic feedback without reading volume meters; reads as
   "the cápsula is listening" at a glance. */
@keyframes gauntlet-cap-listen {
  0%, 100% {
    box-shadow:
      0 0 0 0 rgba(212, 96, 60, 0.45),
      0 0 0 0 rgba(212, 96, 60, 0.30),
      0 0 0 0 rgba(212, 96, 60, 0.18);
  }
  50% {
    box-shadow:
      0 0 0 4px rgba(212, 96, 60, 0.10),
      0 0 0 8px rgba(212, 96, 60, 0.05),
      0 0 0 12px rgba(212, 96, 60, 0);
  }
}
.gauntlet-capsule__voice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
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
  background: var(--gx-tint-soft);
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
  /* Distinct scrim token — sunken is too soft for a meaningful dim on
     light theme (it's 4% black there for inset surfaces). The scrim
     needs to actually darken the background so the palette panel
     reads as a focused layer above. */
  background: var(--gx-scrim);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: gauntlet-cap-rise 160ms ease-out both;
}
.gauntlet-capsule__palette-panel {
  position: relative;
  width: min(420px, calc(100% - 36px));
  /* Theme-aware surface — was hardcoded rgba(20, 22, 30, 0.96) which
     showed as a dark slab over the cream flagship. Use the cápsula's
     own surface tokens so the palette inherits the active theme. */
  background: var(--gx-surface-strong, var(--gx-bg-solid));
  border: 1px solid var(--gx-border-mid);
  border-radius: 12px;
  box-shadow:
    0 0 0 1px var(--gx-tint-soft),
    0 24px 48px rgba(var(--gx-shadow-rgb), 0.30);
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
  position: relative;
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
  overflow: hidden;
  transition: color 140ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1);
}
/* Slide-in hover — instead of a static fade-in background, an ember
   wash slides in from the left to the active item. The eye reads
   movement, not just a colour swap. */
.gauntlet-capsule__palette-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(208, 122, 90, 0.18) 0%,
    rgba(208, 122, 90, 0.10) 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 220ms cubic-bezier(0.2, 0, 0, 1);
  z-index: 0;
}
.gauntlet-capsule__palette-item > * {
  position: relative;
  z-index: 1;
}
.gauntlet-capsule__palette-item--active {
  color: var(--gx-fg);
}
.gauntlet-capsule__palette-item--active::before {
  transform: translateX(0);
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

/* Palette item — dual layout: label + description on the left, badges
   and shortcut on the right. Tools carry mode/risk/approval pills. */
.gauntlet-capsule__palette-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.gauntlet-capsule__palette-desc {
  font-family: "Inter", sans-serif;
  font-size: 11px;
  line-height: 1.35;
  color: var(--gx-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.gauntlet-capsule__palette-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.gauntlet-capsule__palette-item--tool .gauntlet-capsule__palette-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--gx-code-keyword);
}
.gauntlet-capsule__palette-item--tool.gauntlet-capsule__palette-item--active
  .gauntlet-capsule__palette-label {
  color: var(--gx-code-keyword);
}
.gauntlet-capsule__palette-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 999px;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__palette-badge--mode-read {
  border-color: rgba(98, 130, 200, 0.30);
  background: rgba(98, 130, 200, 0.10);
  color: #4f6fb0;
}
.gauntlet-capsule__palette-badge--mode-write {
  border-color: rgba(208, 122, 90, 0.40);
  background: rgba(208, 122, 90, 0.12);
  color: #b3501f;
}
.gauntlet-capsule__palette-badge--risk-medium {
  border-color: rgba(212, 150, 60, 0.45);
  background: rgba(212, 150, 60, 0.12);
  color: #b3791f;
}
.gauntlet-capsule__palette-badge--risk-high {
  border-color: rgba(212, 96, 60, 0.55);
  background: rgba(212, 96, 60, 0.14);
  color: #b3401f;
}
.gauntlet-capsule__palette-badge--approval {
  border-color: rgba(212, 96, 60, 0.40);
  background: rgba(212, 96, 60, 0.10);
  color: #b3401f;
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
  color: var(--gx-success-text);
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
.gauntlet-md__strong { font-weight: 600; color: var(--gx-fg); }
.gauntlet-md__em { font-style: italic; color: var(--gx-fg-dim); }
.gauntlet-md__inline-code {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11.5px;
  background: var(--gx-ember-soft, rgba(208, 122, 90, 0.10));
  color: var(--gx-code-keyword);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(208, 122, 90, 0.20);
}
.gauntlet-md__link {
  color: var(--gx-ember);
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
  border-radius: 10px;
  background: var(--gx-code-bg);
  overflow: hidden;
}
.gauntlet-md__code-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--gx-border);
  background: var(--gx-code-meta-bg);
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
  padding: 12px 14px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--gx-code-fg);
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
/* Syntax tokens — keywords/strings/numbers/comments/fns picked by the
   in-house tokenizer in markdown.tsx. Each kind binds to a --gx-code-*
   custom property so the light flagship + night premium themes stay
   in lockstep without forking the markdown.tsx logic. */
.gauntlet-md__tok--k { color: var(--gx-code-keyword); font-weight: 500; }
.gauntlet-md__tok--s { color: var(--gx-code-string); }
.gauntlet-md__tok--n { color: var(--gx-code-number); }
.gauntlet-md__tok--c { color: var(--gx-code-comment); font-style: italic; }
.gauntlet-md__tok--f { color: var(--gx-code-fn); }
.gauntlet-md__tok--p { color: inherit; }
`;
