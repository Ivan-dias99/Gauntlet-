// Capsule — Gauntlet's flagship cursor surface.
//
// Doctrine for this file:
//   * Cursor never leaves the page. Capsule floats, dismissable on Esc.
//   * Glass + serif headline + mono labels. One ember accent for life.
//   * One input. One button. One response. The backend decides whether
//     the response is a text answer or a list of DOM actions — the
//     user never has to choose between "Compor" and "Acionar".

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ComposerClient } from './composer-client';
import {
  DEFAULT_COMPOSER_SETTINGS,
  type Attachment,
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
import { isRemoteVoiceSupported, isVoiceSupported } from './voice';
import { type DomAction, type DomActionResult } from './dom-actions';
import { type Ambient } from './ambient';
import {
  createPillPrefs,
  DEFAULT_CAPSULE_THEME,
  type CapsuleTheme,
  type PillPrefs,
} from './pill-prefs';
import { buildPaletteActions, CommandPalette } from './CommandPalette';
import { SettingsDrawer } from './SettingsDrawer';
import { CompactContextSummary } from './CompactContextSummary';
import { buildCapture, describeAction, extractPartialCompose, truncate } from './helpers';
import { computeCapsulePosition, estimateCapsuleSize } from './placement';
import { useTTS } from './useTTS';
import { useVoiceCapture } from './useVoiceCapture';
import { useAttachments } from './useAttachments';
import { dispatchPlan as dispatchPlanCore } from './plan-dispatcher';
import { ShellPanel } from './ShellPanel';
import { ComposeResult } from './ComposeResult';
import { PlanRenderer } from './PlanRenderer';
import { AttachmentChips } from './AttachmentChips';
import { buildSlashActions, SlashMenu } from './SlashMenu';
import { LeftPanel } from './LeftPanel';
import { ActionsRow } from './ActionsRow';
import { StreamingState } from './StreamingState';
import { usePlanGuards } from './usePlanGuards';

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
  // Optional overlays (e.g. Onboarding) rendered inside the cápsula
  // root so position:absolute children anchor against the cápsula
  // itself, not the host page. Without this slot, shells were rendering
  // <Capsule/> and <Onboarding/> as siblings — the Onboarding ended up
  // floating against the page body and visually clashed with the
  // cápsula instead of taking it over as an in-cápsula tour.
  children?: ReactNode;
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
  children,
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
  // TTS — owned by useTTS. Hook handles persisted toggle, live sync
  // with SettingsDrawer, the speak-on-plan_ready effect and unmount
  // cleanup. We only need `cancel()` here for the submit path that
  // pre-empts an in-flight utterance.
  // Wired below once `phase` and `plan` are declared.
  // Multimodal: when the user opted in (via SettingsDrawer), capture
  // a viewport screenshot once per cápsula mount. The result is
  // attached to the next request's metadata so the planner can "see"
  // the page. If the request fires before capture finishes, we send
  // without the image — better than blocking the user.
  const [screenshot, setScreenshot] = useState<string | null>(null);
  // Plan dispatcher — agent-emitted actions can target either the page
  // DOM or the host ambient (shell, filesystem). DOM actions go through
  // `ambient.domActions.execute` (browser shell only); ambient actions
  // route to `ambient.shellExec` / `ambient.filesystem` directly. Each
  // returns a typed `DomActionResult` so the existing renderer + ledger
  // are unchanged.
  const dispatchPlan = useCallback(
    (actions: DomAction[]): Promise<DomActionResult[]> => dispatchPlanCore(ambient, actions),
    [ambient],
  );

  // A1 — operator-pinned local files / screen captures. The desktop
  // shell exposes these via `ambient.filesystem` + `screenshot.captureScreen`;
  // the cápsula inlines text content into the prompt and keeps image
  // payloads as chips so the operator can see what they shipped. Empty
  // by default and reset on dismiss/new mount.
  // Attachments — owned by useAttachments. Hook handles the chip list,
  // error message, on-disk-save flash and the operator-driven actions
  // (pickFile / captureScreen / removeAttachment / saveComposeToDisk /
  // composeUserInputWithAttachments).
  const {
    attachments,
    attachError,
    savedToDiskFlash,
    attachLocalFile,
    attachScreenCapture,
    removeAttachment,
    saveComposeToDisk,
    composeUserInputWithAttachments,
  } = useAttachments({ ambient, plan, snapshot });
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
  // Voice input — owned by useVoiceCapture. The hook keeps the
  // VoiceSession ref + active flag inside; we only call start() with
  // baseline-aware callbacks when the operator presses the mic.
  const voice = useVoiceCapture({ client, ambient });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  // B1 — slash commands inline. When the input starts with `/`, surface
  // the same action set as the palette in an inline dropdown above the
  // textarea. Faster than ⌘K for the keyboard-driven flow: type `/an<Enter>`
  // and the file picker opens. State stays trivial — derived from
  // userInput in the render — but slashIndex is its own state so arrow
  // keys can move the highlight without re-running the filter.
  const [slashIndex, setSlashIndex] = useState(0);

  // Danger assessment runs in-page (where document.querySelector resolves
  // against the live DOM) so each action gets per-element classification
  // — submit buttons, password inputs, "Delete" labels. Recomputed only
  // when the plan changes; the result feeds the warning banner and the
  // danger badges in the action list.
  const { dangers, sequenceDanger, policyForcesAck, hasDanger, canDispatchAnyAction } =
    usePlanGuards({ plan, ambient, url: snapshot.url, settings });

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

  const tts = useTTS({
    prefs,
    isPlanReady: phase === 'plan_ready',
    planCompose: plan?.compose,
  });

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
  // becomes the new input. The session itself + active flag + cleanup
  // live in useVoiceCapture; we only build baseline-aware callbacks
  // here so each press starts from the textarea's current contents.
  const startVoiceCapture = useCallback(() => {
    setError(null);
    const baseline = userInput;
    voice.start({
      onPartial: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
      },
      onCommit: (text) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
        // Pull focus back to the textarea so Enter works immediately.
        inputRef.current?.focus();
      },
      onError: (msg) => setError(msg),
    });
  }, [userInput, voice]);

  const stopVoiceCapture = useCallback(() => {
    voice.stop();
  }, [voice]);

  const cancelVoiceCapture = useCallback(() => {
    voice.cancel();
  }, [voice]);

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

  // B1 — slash quick actions. Computed inline in render so they capture
  // current capability flags + handlers; the matched subset renders as
  // a dropdown above the textarea when userInput starts with `/`.

  // A3 — operator-driven shell. Mount control only; the panel itself
  // (input, result, runShellCommand) lives in ShellPanel. The cápsula
  // toggles the mount via shellPanelOpen and only passes the shellExec
  // when the ambient supports it.
  const [shellPanelOpen, setShellPanelOpen] = useState(false);

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
      attachments,
      ambient.shell,
    );
    try {
      const ctx = await client.captureContext(capture, ac.signal);
      if (ac.signal.aborted) return;
      const inputForAgent = composeUserInputWithAttachments(userInput.trim());
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
            // Groq/Gemini adapters; CORS preflight hiccup; SSE
            // proxy buffering). Fall back to the non-streaming
            // endpoint once before surfacing the failure — the user
            // gets a slower but complete response instead of an
            // error toast.
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
  }, [client, snapshot, screenshot, userInput, phase, plan, reportExecution, composeUserInputWithAttachments, prefs]);

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
      // outro pedido" — this is the cancel hook. Also resets the spoken
      // guard so the next plan_ready (even if it produces the same text)
      // gets read again.
      tts.cancel();
      void requestPlan();
    },
    [requestPlan, tts],
  );

  // Slash query: text after the leading `/`. Empty string means the
  // user just typed `/` and hasn't filtered yet. null means no slash
  // mode (input doesn't start with /).
  const slashQuery = useMemo<string | null>(() => {
    if (!userInput.startsWith('/')) return null;
    // Multi-line input with /command on the first line is fine; only
    // the first line is the query.
    const firstLine = userInput.split('\n', 1)[0];
    return firstLine.slice(1).toLowerCase();
  }, [userInput]);

  const slashActions = useMemo(
    () =>
      buildSlashActions({
        ambient,
        plan,
        shellPanelOpen,
        attachLocalFile: () => void attachLocalFile(),
        attachScreenCapture: () => void attachScreenCapture(),
        saveComposeToDisk: () => void saveComposeToDisk(),
        toggleShellPanel: () => setShellPanelOpen((v) => !v),
        clearInput: () => {
          setUserInput('');
          inputRef.current?.focus();
        },
        dismiss: () => handleDismiss(),
        openPalette: () => {
          setUserInput('');
          setPaletteOpen(true);
        },
      }),
    [
      ambient,
      attachLocalFile,
      attachScreenCapture,
      handleDismiss,
      plan,
      saveComposeToDisk,
      shellPanelOpen,
    ],
  );

  const slashMatches = useMemo(() => {
    if (slashQuery === null) return [];
    if (slashQuery === '') return slashActions;
    return slashActions.filter((a) => a.id.startsWith(slashQuery) || a.label.includes(slashQuery));
  }, [slashActions, slashQuery]);

  // Reset highlight when the filter changes so the cursor never points
  // past the end of the visible list.
  useEffect(() => {
    setSlashIndex(0);
  }, [slashQuery]);

  const runSlashAt = useCallback(
    (idx: number) => {
      const a = slashMatches[idx];
      if (!a) return;
      setUserInput('');
      setSlashIndex(0);
      a.run();
    },
    [slashMatches],
  );

  // Plain Enter submits. Shift+Enter inserts a newline. Cmd/Ctrl+Enter
  // also submits as a back-compat habit. When the slash menu is open,
  // arrow keys / Enter drive the menu instead.
  const onTextareaKey = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (slashQuery !== null && slashMatches.length > 0) {
        if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          setSlashIndex((i) => (i + 1) % slashMatches.length);
          return;
        }
        if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          setSlashIndex((i) => (i - 1 + slashMatches.length) % slashMatches.length);
          return;
        }
        if (ev.key === 'Enter' && !ev.shiftKey) {
          ev.preventDefault();
          runSlashAt(slashIndex);
          return;
        }
        if (ev.key === 'Escape') {
          ev.preventDefault();
          setUserInput('');
          return;
        }
      }
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return;
      ev.preventDefault();
      void requestPlan();
    },
    [requestPlan, runSlashAt, slashIndex, slashMatches, slashQuery],
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
        <LeftPanel
          snapshot={snapshot}
          modelUsed={plan?.model_used}
          latencyMs={plan?.latency_ms}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((v) => !v)}
          onDismiss={handleDismiss}
          settingsDrawer={
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
          }
          screenshotEnabled={screenshot !== null}
          onRefreshSnapshot={refreshSnapshot}
        />

        {/* Right panel: input + results */}
        <div className="gauntlet-capsule__panel gauntlet-capsule__panel--right">
          <form className="gauntlet-capsule__form" onSubmit={onSubmit}>
            <AttachmentChips attachments={attachments} onRemove={removeAttachment} />
            {attachError && (
              <div className="gauntlet-capsule__attach-error" role="alert">
                {attachError}
              </div>
            )}
            {shellPanelOpen && ambient.shellExec && (
              <ShellPanel shellExec={ambient.shellExec} />
            )}
            {slashQuery !== null && (
              <SlashMenu
                matches={slashMatches}
                activeIndex={slashIndex}
                onHover={setSlashIndex}
                onPick={runSlashAt}
              />
            )}
            <textarea
              ref={inputRef}
              className="gauntlet-capsule__input"
              placeholder="O que queres? / abre comandos · Enter envia · Shift+Enter nova linha"
              value={userInput}
              onChange={(ev) => setUserInput(ev.target.value)}
              onKeyDown={onTextareaKey}
              rows={2}
              disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
            />
            <ActionsRow
              busy={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
              canSubmit={!(phase === 'planning' || phase === 'streaming' || phase === 'executing') && !!userInput.trim()}
              submitRipple={submitRipple}
              submitLabel={
                phase === 'planning' ? 'thinking' : phase === 'streaming' ? 'streaming' : 'idle'
              }
              showAttachFile={!!(ambient.capabilities.filesystemRead && ambient.filesystem)}
              showAttachScreen={!!(ambient.capabilities.screenCapture && ambient.screenshot?.captureScreen)}
              showVoice={
                isVoiceSupported() ||
                (ambient.capabilities.remoteVoice && isRemoteVoiceSupported())
              }
              voiceActive={voice.active}
              onAttachFile={() => void attachLocalFile()}
              onAttachScreen={() => void attachScreenCapture()}
              onVoiceStart={startVoiceCapture}
              onVoiceStop={stopVoiceCapture}
            />
          </form>

          {phase === 'streaming' && partialCompose && (
            <StreamingState
              mode="streaming-compose"
              partialCompose={partialCompose}
              tokensStreamed={tokensStreamed}
            />
          )}

          {(phase === 'planning' || (phase === 'streaming' && !partialCompose)) && (
            <StreamingState mode="skeleton" />
          )}

          {plan?.compose && phase === 'plan_ready' && (
            <ComposeResult
              compose={plan.compose}
              modelUsed={plan.model_used}
              latencyMs={plan.latency_ms}
              copied={copied}
              savedFlash={savedFlash}
              savedToDiskFlash={savedToDiskFlash}
              onCopy={() => void onCopyCompose()}
              onSaveMemory={() => void saveToMemory()}
              onSaveDisk={
                ambient.capabilities.filesystemWrite &&
                ambient.filesystem?.writeTextFile
                  ? () => void saveComposeToDisk()
                  : undefined
              }
              onCopyBlock={() => flashSaved('code copied')}
            />
          )}

          {plan && (phase === 'plan_ready' || phase === 'executing' || phase === 'executed') && (
            <PlanRenderer
              plan={plan}
              planResults={planResults}
              phase={phase}
              dangers={dangers}
              hasDanger={hasDanger}
              sequenceDanger={sequenceDanger}
              policyForcesAck={policyForcesAck}
              dangerConfirmed={dangerConfirmed}
              onConfirmDanger={setDangerConfirmed}
              canDispatchAnyAction={canDispatchAnyAction}
              onExecute={() => void executePlan()}
            />
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
          actions={buildPaletteActions({
            ambient,
            plan,
            snapshot,
            userInput,
            settings,
            toolManifests,
            shellPanelOpen,
            noteUse: (id) => {
              setPaletteRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
              void prefs.notePaletteUse(id);
            },
            closePalette: () => setPaletteOpen(false),
            insertToolPrefix: (toolName) => {
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
            },
            focusInput: () => window.setTimeout(() => inputRef.current?.focus(), 0),
            copyCompose: () => void onCopyCompose(),
            saveToMemory: () => void saveToMemory(),
            attachLocalFile: () => void attachLocalFile(),
            attachScreenCapture: () => void attachScreenCapture(),
            toggleShellPanel: () => setShellPanelOpen((v) => !v),
            saveComposeToDisk: () => void saveComposeToDisk(),
            refreshSnapshot,
            clearInput: () => {
              setUserInput('');
              inputRef.current?.focus();
            },
            dismiss: handleDismiss,
          })}
        />
      )}

      {savedFlash && (
        <div className="gauntlet-capsule__flash" role="status" aria-live="polite">
          {savedFlash}
        </div>
      )}

      {/* Overlays (Onboarding, etc) injected by the host shell. Rendered
          inside the cápsula root so position:absolute children anchor
          against the cápsula instead of the host page. */}
      {children}
    </div>
  );
}


