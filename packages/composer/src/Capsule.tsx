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
  type ComposerSettings,
  type SelectionRect,
  type SelectionSnapshot,
  type ToolManifest,
} from './types';
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
import { computeCapsulePosition, estimateCapsuleSize } from './placement';
import { useTTS } from './useTTS';
import { useVoiceCapture } from './useVoiceCapture';
import { useAttachments } from './useAttachments';
import { dispatchPlan as dispatchPlanCore } from './plan-dispatcher';
import { ShellPanel } from './ShellPanel';
import { AnswerPanel } from './AnswerPanel';
import { PlanRenderer } from './PlanRenderer';
import { AttachmentChips } from './AttachmentChips';
import { buildSlashActions, SlashMenu } from './SlashMenu';
import { ComputerUseGate, useComputerUseGate } from './ComputerUseGate';
import { LeftPanel } from './LeftPanel';
import { ActionsRow } from './ActionsRow';
import { StreamingState } from './StreamingState';
import { useStreamingPlan } from './useStreamingPlan';
import { useCapsuleScreenshot } from './useCapsuleScreenshot';
import { useCapsuleKeyboard } from './useCapsuleKeyboard';

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
  // ambient.domActions?.execute is consulted indirectly via
  // canDispatchAnyAction inside useStreamingPlan; no local mirror needed.
  const [snapshot, setSnapshot] = useState<SelectionSnapshot>(initialSnapshot);
  const [userInput, setUserInput] = useState('');
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
  // a viewport screenshot once per cápsula mount. Hook owns the state
  // + effect; we only consume the value here (passed to the streaming
  // hook + read for the screenshotEnabled prop on LeftPanel). Pref
  // source order + capability gating live in useCapsuleScreenshot.
  // Wired below once `settings` is declared (the operator-side default
  // comes from there; passing a primitive boolean keeps the effect
  // dep narrow).
  // Computer-use consent gate — hook owns the queue state + executor;
  // capsule just renders its props. Doctrine: gate is the single shape
  // that survives a future MCP migration; adapter primitives never run
  // until the operator approves.
  const cuGate = useComputerUseGate(ambient.computerUse);
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
  } = useAttachments({ ambient, snapshot });
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
  // Refining pass — tick counter for streaming sit inside useStreamingPlan
  // alongside the rest of the request lifecycle (phase, plan, partialCompose,
  // abortRef, streamAbortRef, executionReportedRef). The hook also wraps
  // the plan-guards memo so the Capsule sees a single object.
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

  // Danger assessment + streaming submit/execute lifecycle live in
  // Streaming submit/execute lifecycle + plan-guard memos live in
  // useStreamingPlan. TTS pre-emption hooks in via a ref so the
  // streaming hook can cancel speech without taking useTTS as a
  // dependency (which would create a cycle: tts needs phase, phase
  // is owned by streaming).
  const ttsRef = useRef<{ cancel: () => void } | null>(null);
  const stream = useStreamingPlan({
    client,
    ambient,
    prefs,
    snapshot,
    screenshot,
    attachments,
    userInput,
    settings,
    composeUserInput: composeUserInputWithAttachments,
    dispatchPlan,
    onSubmit: () => ttsRef.current?.cancel(),
  });
  const {
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
    submit: requestPlan,
    executePlan,
    reportRejection,
  } = stream;
  const tts = useTTS({
    prefs,
    isPlanReady: phase === 'plan_ready',
    planCompose: plan?.compose ?? undefined,
  });
  ttsRef.current = tts;

  useEffect(() => {
    inputRef.current?.focus();
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

  const screenshot = useCapsuleScreenshot({
    ambient,
    prefs,
    screenshotDefault: settings.screenshot_default,
  });

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
  // Wrap onDismiss so a pending action plan that was never executed
  // gets recorded as rejected before the cápsula tears down. Used by
  // every dismiss surface (close button, Esc keypress, dismissThisDomain
  // through the parent App). The streaming hook owns the dedup ref so
  // a "rejected" row is filed at most once per plan.
  const handleDismiss = useCallback(() => {
    reportRejection();
    onDismiss();
  }, [onDismiss, reportRejection]);

  useCapsuleKeyboard({
    paletteOpen,
    setPaletteOpen,
    voiceActive: voice.active,
    cancelVoiceCapture,
    handleDismiss,
  });

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

  // requestPlan + executePlan + reportRejection live in useStreamingPlan.

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
        saveComposeToDisk: () => void saveComposeToDisk(plan?.compose),
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
        enqueueComputerUseAction: ambient.computerUse
          ? cuGate.enqueue
          : undefined,
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

  // executePlan also lives in useStreamingPlan now.

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
            <AnswerPanel
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
                  ? () => void saveComposeToDisk(plan?.compose)
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
            saveComposeToDisk: () => void saveComposeToDisk(plan?.compose),
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

      {ambient.computerUse && <ComputerUseGate {...cuGate.gateProps} />}

      {/* Overlays (Onboarding, etc) injected by the host shell. Rendered
          inside the cápsula root so position:absolute children anchor
          against the cápsula instead of the host page. */}
      {children}
    </div>
  );
}


