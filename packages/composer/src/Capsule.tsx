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
import {
  isRemoteVoiceSupported,
  isVoiceSupported,
  startVoice,
  startVoiceRemote,
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
  // Context-pop pulse — fires once when the page selection transitions
  // from empty → non-empty. The chip pops to confirm "context locked
  // in" before the operator even looks at the meta strip. Cleared by
  // a timer so the chip returns to rest. The timer lives in a ref so
  // it survives effect re-runs (e.g. iframe-harvest enriches snapshot
  // mid-pop) — without that the cleanup would clear the timer and the
  // re-run path wouldn't re-arm it (prev is already true), leaving
  // contextJustArrived stuck on permanently.
  const [contextJustArrived, setContextJustArrived] = useState(false);
  const prevHadContextRef = useRef(false);
  const contextPopTimerRef = useRef<number | null>(null);
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
  // Plan dispatcher — agent-emitted actions can target either the page
  // DOM or the host ambient (shell, filesystem). DOM actions go through
  // `ambient.domActions.execute` (browser shell only); ambient actions
  // route to `ambient.shellExec` / `ambient.filesystem` directly. Each
  // returns a typed `DomActionResult` so the existing renderer + ledger
  // are unchanged.
  const dispatchPlan = useCallback(
    async (actions: DomAction[]): Promise<DomActionResult[]> => {
      const out: DomActionResult[] = [];
      // Group consecutive DOM actions to preserve the existing batch
      // semantics (executor decides ordering across DOM actions). Mixed
      // sequences just walk one at a time.
      let domBatch: DomAction[] = [];
      const flushDomBatch = async () => {
        if (domBatch.length === 0) return;
        if (!ambient.domActions?.execute) {
          for (const a of domBatch) {
            out.push({
              action: a,
              ok: false,
              error: 'shell does not support DOM actions',
            });
          }
          domBatch = [];
          return;
        }
        const results = await ambient.domActions.execute(domBatch);
        out.push(...results);
        domBatch = [];
      };
      for (const action of actions) {
        if (action.type === 'shell.run') {
          await flushDomBatch();
          if (!ambient.shellExec) {
            out.push({
              action,
              ok: false,
              error: 'shell.run requires a desktop ambient with shellExec',
            });
            continue;
          }
          try {
            const r = await ambient.shellExec.run(action.cmd, action.args, action.cwd);
            out.push({
              action,
              ok: r.exitCode === 0,
              error: r.exitCode === 0 ? undefined : r.stderr || `exit ${r.exitCode}`,
              output: {
                stdout: r.stdout,
                stderr: r.stderr,
                exitCode: r.exitCode,
                durationMs: r.durationMs,
              },
            });
          } catch (err) {
            out.push({
              action,
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        } else if (action.type === 'fs.read') {
          await flushDomBatch();
          if (!ambient.filesystem?.readTextFile) {
            out.push({
              action,
              ok: false,
              error: 'fs.read requires a desktop ambient with filesystem',
            });
            continue;
          }
          try {
            const text = await ambient.filesystem.readTextFile(action.path);
            out.push({
              action,
              ok: true,
              output: { text, bytes: new TextEncoder().encode(text).length },
            });
          } catch (err) {
            out.push({
              action,
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        } else if (action.type === 'fs.write') {
          await flushDomBatch();
          if (!ambient.filesystem?.writeTextFile) {
            out.push({
              action,
              ok: false,
              error: 'fs.write requires a desktop ambient with filesystem',
            });
            continue;
          }
          try {
            const bytes = await ambient.filesystem.writeTextFile(
              action.path,
              action.content,
            );
            out.push({ action, ok: true, output: { bytes } });
          } catch (err) {
            out.push({
              action,
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        } else {
          domBatch.push(action);
        }
      }
      await flushDomBatch();
      return out;
    },
    [ambient],
  );

  // A1 — operator-pinned local files / screen captures. The desktop
  // shell exposes these via `ambient.filesystem` + `screenshot.captureScreen`;
  // the cápsula inlines text content into the prompt and keeps image
  // payloads as chips so the operator can see what they shipped. Empty
  // by default and reset on dismiss/new mount.
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
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
  const dangers = useMemo<DangerAssessment[]>(
    () => (plan ? plan.actions.map(assessDanger) : []),
    [plan],
  );

  // Per-action adapter check — used to gate the Executar button. The
  // dispatcher would surface "no adapter" as a per-row error otherwise,
  // but the operator deserves to see "this shell can't" before they
  // click. True when at least one action in the plan has a working
  // dispatch path in the current ambient.
  const canDispatchAnyAction = useMemo(() => {
    if (!plan || plan.actions.length === 0) return false;
    return plan.actions.some((a) => {
      if (a.type === 'shell.run') return !!ambient.shellExec;
      if (a.type === 'fs.read') return !!ambient.filesystem?.readTextFile;
      if (a.type === 'fs.write') return !!ambient.filesystem?.writeTextFile;
      return !!ambient.domActions?.execute;
    });
  }, [plan, ambient]);
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
  // pulse loop. Timer is held in a ref so subsequent snapshot updates
  // (non-empty → other-non-empty during incremental enrichment) don't
  // tear down the running pop: the effect re-runs, sees prev === true,
  // doesn't re-arm; if the timer were inside the closure cleanup it
  // would die here and the pop would freeze indefinitely (Codex P2).
  useEffect(() => {
    const has = !!snapshot.text;
    if (has && !prevHadContextRef.current) {
      setContextJustArrived(true);
      if (contextPopTimerRef.current !== null) {
        window.clearTimeout(contextPopTimerRef.current);
      }
      contextPopTimerRef.current = window.setTimeout(() => {
        setContextJustArrived(false);
        contextPopTimerRef.current = null;
      }, 700);
    }
    prevHadContextRef.current = has;
  }, [snapshot.text]);

  // Tear down the context-pop timer on unmount only — see comment
  // above for why effect re-runs must NOT clear it.
  useEffect(() => {
    return () => {
      if (contextPopTimerRef.current !== null) {
        window.clearTimeout(contextPopTimerRef.current);
        contextPopTimerRef.current = null;
      }
    };
  }, []);

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
    const callbacks = {
      onPartial: (text: string) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
      },
      onCommit: (text: string) => {
        setUserInput(baseline ? `${baseline} ${text}`.trim() : text);
        setVoiceActive(false);
        voiceRef.current = null;
        // Pull focus back to the textarea so Enter works immediately.
        inputRef.current?.focus();
      },
      onError: (msg: string) => {
        setError(msg);
        setVoiceActive(false);
        voiceRef.current = null;
      },
    };
    // Prefer Groq Whisper via backend when the ambient signals support
    // — better quality, language-agnostic, doesn't depend on Chromium's
    // Web Speech entitlement. Fall back to the local Web Speech API
    // when the backend isn't reachable or the runtime lacks
    // MediaRecorder.
    if (ambient.capabilities.remoteVoice && isRemoteVoiceSupported()) {
      setVoiceActive(true);
      void startVoiceRemote(client, callbacks).then((session) => {
        if (session) {
          voiceRef.current = session;
        } else {
          setVoiceActive(false);
        }
      });
      return;
    }
    const session = startVoice(callbacks);
    if (session) {
      voiceRef.current = session;
      setVoiceActive(true);
    }
  }, [userInput, ambient, client]);

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
  // A1 helpers — operator-driven anexar. The dialog plugin (desktop)
  // is the consent gate; on web `ambient.filesystem` is undefined and
  // these buttons never render in the first place.
  const attachLocalFile = useCallback(async () => {
    const fs = ambient.filesystem;
    if (!fs) return;
    setAttachError(null);
    try {
      const picked = await fs.pickFile();
      if (!picked) return; // operator cancelled
      const lowerName = picked.name.toLowerCase();
      const isImage = /\.(png|jpe?g|gif|webp|svg)$/.test(lowerName);
      if (isImage) {
        const { base64, mime } = await fs.readFileBase64(picked.path);
        const bytes = Math.ceil((base64.length * 3) / 4);
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind: 'image',
            name: picked.name,
            mime,
            bytes,
            base64,
            path: picked.path,
          },
        ]);
      } else {
        const text = await fs.readTextFile(picked.path);
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind: 'text',
            name: picked.name,
            mime: 'text/plain',
            bytes: new TextEncoder().encode(text).length,
            text,
            path: picked.path,
          },
        ]);
      }
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient]);

  const attachScreenCapture = useCallback(async () => {
    const cap = ambient.screenshot?.captureScreen;
    if (!cap) return;
    setAttachError(null);
    try {
      const got = await cap();
      if (!got) {
        setAttachError('Captura de ecrã indisponível neste sistema.');
        return;
      }
      const bytes = Math.ceil((got.base64.length * 3) / 4);
      setAttachments((prev) => [
        ...prev,
        {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          kind: 'image',
          name: `ecrã-${new Date().toISOString().slice(11, 19)}.png`,
          mime: 'image/png',
          bytes,
          base64: got.base64,
          path: got.path,
        },
      ]);
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // B1 — slash quick actions. Computed inline in render so they capture
  // current capability flags + handlers; the matched subset renders as
  // a dropdown above the textarea when userInput starts with `/`.

  // A2 — operator-driven save. The dialog IS the consent gate. We
  // suggest a filename derived from the snapshot title (sanitised) and
  // default the extension to .md since the cápsula's compose tends to
  // be markdown. The operator can change either in the dialog.
  const [savedToDiskFlash, setSavedToDiskFlash] = useState<string | null>(null);

  // A3 — operator-driven shell. Toggle a compact panel below the
  // textarea; operator types one command, hits run, sees output. The
  // backend agent loop doesn't yet emit shell tool calls (A3+); this
  // is the manual surface so the capability is at least exercisable.
  const [shellPanelOpen, setShellPanelOpen] = useState(false);
  const [shellCommand, setShellCommand] = useState('');
  const [shellResult, setShellResult] = useState<{
    cmd: string;
    stdout: string;
    stderr: string;
    exitCode: number | null;
    durationMs: number;
  } | null>(null);
  const [shellRunning, setShellRunning] = useState(false);
  const runShellCommand = useCallback(async () => {
    const sh = ambient.shellExec;
    if (!sh) return;
    const trimmed = shellCommand.trim();
    if (!trimmed) return;
    // Parse first token as binary, rest as args. Quotes are NOT
    // honoured — this is intentionally simple. The Rust side enforces
    // allowlist by basename, so quoted paths wouldn't help anyway.
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    setShellRunning(true);
    setShellResult(null);
    try {
      const r = await sh.run(cmd, args);
      setShellResult({
        cmd: trimmed,
        stdout: r.stdout,
        stderr: r.stderr,
        exitCode: r.exitCode,
        durationMs: r.durationMs,
      });
    } catch (err) {
      setShellResult({
        cmd: trimmed,
        stdout: '',
        stderr: err instanceof Error ? err.message : String(err),
        exitCode: null,
        durationMs: 0,
      });
    } finally {
      setShellRunning(false);
    }
  }, [ambient, shellCommand]);
  const saveComposeToDisk = useCallback(async () => {
    const fs = ambient.filesystem;
    if (!fs?.pickSavePath || !fs.writeTextFile) return;
    const compose = plan?.compose ?? '';
    if (!compose.trim()) return;
    setAttachError(null);
    try {
      const titleSeed = (snapshot.pageTitle || 'gauntlet-compose')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'gauntlet-compose';
      const suggested = `${titleSeed}.md`;
      const path = await fs.pickSavePath(suggested, ['md', 'txt', 'json']);
      if (!path) return; // operator cancelled
      const bytes = await fs.writeTextFile(path, compose);
      setSavedToDiskFlash(
        `${path.split(/[\\/]/).pop() ?? 'ficheiro'} (${
          bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`
        })`,
      );
      window.setTimeout(() => setSavedToDiskFlash(null), 2500);
    } catch (err) {
      setAttachError(err instanceof Error ? err.message : String(err));
    }
  }, [ambient, plan, snapshot.pageTitle]);

  // Compose user_input with attachment blocks. Text files are inlined
  // verbatim inside <file name="..."> tags so the agent can read them
  // without backend changes. Image attachments travel as multimodal
  // content blocks via `metadata.attachments` and DO NOT show up in
  // user_input — the agent literally sees the picture, no placeholder
  // needed (when the provider supports images; on Groq/Gemini the
  // backend logs `images_dropped` and the operator sees the chip).
  const composeUserInputWithAttachments = useCallback(
    (raw: string): string => {
      if (attachments.length === 0) return raw;
      const blocks: string[] = [];
      for (const a of attachments) {
        if (a.kind === 'text' && a.text != null) {
          blocks.push(
            `<file name="${a.name}" path="${a.path ?? ''}">\n${a.text}\n</file>`,
          );
        }
        // image attachments handled via metadata.attachments — see
        // buildCapture + backend's _collect_image_blocks.
      }
      if (blocks.length === 0) return raw;
      return `${blocks.join('\n\n')}\n\n${raw}`;
    },
    [attachments],
  );

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

  const slashActions = useMemo(() => {
    type Action = { id: string; label: string; hint: string; run: () => void };
    const list: Action[] = [];
    if (ambient.capabilities.filesystemRead && ambient.filesystem) {
      list.push({
        id: 'anexar',
        label: '/anexar',
        hint: 'Anexar ficheiro local',
        run: () => void attachLocalFile(),
      });
    }
    if (
      ambient.capabilities.screenCapture &&
      ambient.screenshot?.captureScreen
    ) {
      list.push({
        id: 'ecra',
        label: '/ecrã',
        hint: 'Capturar ecrã inteiro',
        run: () => void attachScreenCapture(),
      });
    }
    if (ambient.capabilities.shellExecute && ambient.shellExec) {
      list.push({
        id: 'shell',
        label: '/shell',
        hint: shellPanelOpen ? 'Fechar shell rápida' : 'Abrir shell rápida',
        run: () => setShellPanelOpen((v) => !v),
      });
    }
    if (
      ambient.capabilities.filesystemWrite &&
      ambient.filesystem?.writeTextFile &&
      plan?.compose
    ) {
      list.push({
        id: 'guardar',
        label: '/guardar',
        hint: 'Guardar resposta para ficheiro',
        run: () => void saveComposeToDisk(),
      });
    }
    list.push({
      id: 'limpar',
      label: '/limpar',
      hint: 'Esvaziar input',
      run: () => {
        setUserInput('');
        inputRef.current?.focus();
      },
    });
    list.push({
      id: 'fechar',
      label: '/fechar',
      hint: 'Dispensar cápsula',
      run: () => handleDismiss(),
    });
    list.push({
      id: 'palette',
      label: '/palette',
      hint: 'Abrir command palette completa (⌘K)',
      run: () => {
        setUserInput('');
        setPaletteOpen(true);
      },
    });
    return list;
  }, [
    ambient,
    attachLocalFile,
    attachScreenCapture,
    handleDismiss,
    plan,
    saveComposeToDisk,
    shellPanelOpen,
  ]);

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
              {/* Shell label removido por doutrina de paridade — o
                  utilizador não deve nunca sentir que está em "dois
                  composers diferentes". Chrome igual em ambos os
                  shells; ambient.shell mantém-se internamente para
                  diagnostics, só não é renderizado.
                  URL placeholder do desktop (`desktop://capsule`,
                  `desktop://unknown`) também não aparece — esconde
                  contexto vazio em vez de o expor como UI. Quando há
                  um app real em foco o pageTitle preenche-se sozinho. */}
              {(() => {
                const isDesktopPlaceholder = snapshot.url.startsWith('desktop://');
                const display = isDesktopPlaceholder
                  ? snapshot.pageTitle?.trim() || ''
                  : snapshot.pageTitle || snapshot.url;
                if (!display) return null;
                return (
                  <span className="gauntlet-capsule__url" title={snapshot.url}>
                    {display}
                  </span>
                );
              })()}
              {plan?.model_used && (
                <span
                  className="gauntlet-capsule__model-chip"
                  title={`Modelo usado · ${plan.latency_ms} ms`}
                >
                  <span className="gauntlet-capsule__model-chip-dot" aria-hidden />
                  {plan.model_used}
                </span>
              )}
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
            {attachments.length > 0 && (
              <div className="gauntlet-capsule__attachments" aria-label="Anexos">
                {attachments.map((a) => (
                  <span
                    key={a.id}
                    className={`gauntlet-capsule__attachment gauntlet-capsule__attachment--${a.kind}`}
                    title={a.path ?? a.name}
                  >
                    <span className="gauntlet-capsule__attachment-icon" aria-hidden>
                      {a.kind === 'image' ? '◫' : '⌥'}
                    </span>
                    <span className="gauntlet-capsule__attachment-name">{a.name}</span>
                    <span className="gauntlet-capsule__attachment-size">
                      {a.bytes < 1024
                        ? `${a.bytes} B`
                        : a.bytes < 1024 * 1024
                          ? `${Math.round(a.bytes / 1024)} KB`
                          : `${(a.bytes / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                    <button
                      type="button"
                      className="gauntlet-capsule__attachment-remove"
                      onClick={() => removeAttachment(a.id)}
                      aria-label={`Remover ${a.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {attachError && (
              <div className="gauntlet-capsule__attach-error" role="alert">
                {attachError}
              </div>
            )}
            {shellPanelOpen && ambient.shellExec && (
              <div className="gauntlet-capsule__shell-panel">
                <div className="gauntlet-capsule__shell-row">
                  <span className="gauntlet-capsule__shell-prompt" aria-hidden>$</span>
                  <input
                    type="text"
                    className="gauntlet-capsule__shell-input"
                    placeholder="git status — comandos da allowlist"
                    value={shellCommand}
                    onChange={(ev) => setShellCommand(ev.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' && !ev.shiftKey) {
                        ev.preventDefault();
                        void runShellCommand();
                      }
                    }}
                    disabled={shellRunning}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="gauntlet-capsule__shell-run"
                    onClick={() => void runShellCommand()}
                    disabled={shellRunning || !shellCommand.trim()}
                  >
                    {shellRunning ? '…' : 'Executar'}
                  </button>
                </div>
                {shellResult && (
                  <div className="gauntlet-capsule__shell-output">
                    <div className="gauntlet-capsule__shell-meta">
                      <span className="gauntlet-capsule__shell-meta-cmd">
                        $ {shellResult.cmd}
                      </span>
                      <span className="gauntlet-capsule__shell-meta-stat">
                        {shellResult.exitCode === null
                          ? 'erro'
                          : `exit ${shellResult.exitCode}`}
                        {' · '}
                        {shellResult.durationMs} ms
                      </span>
                    </div>
                    {shellResult.stdout && (
                      <pre className="gauntlet-capsule__shell-stdout">
                        {shellResult.stdout}
                      </pre>
                    )}
                    {shellResult.stderr && (
                      <pre className="gauntlet-capsule__shell-stderr">
                        {shellResult.stderr}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
            {slashQuery !== null && slashMatches.length > 0 && (
              <div className="gauntlet-capsule__slash" role="listbox">
                {slashMatches.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    role="option"
                    aria-selected={i === slashIndex}
                    className={`gauntlet-capsule__slash-item${
                      i === slashIndex ? ' gauntlet-capsule__slash-item--active' : ''
                    }`}
                    onMouseEnter={() => setSlashIndex(i)}
                    onClick={() => runSlashAt(i)}
                  >
                    <span className="gauntlet-capsule__slash-label">{a.label}</span>
                    <span className="gauntlet-capsule__slash-hint">{a.hint}</span>
                  </button>
                ))}
              </div>
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
            <div className="gauntlet-capsule__actions">
              <span className="gauntlet-capsule__hint" aria-hidden>
                <span className="gauntlet-capsule__kbd">↵</span>
                <span className="gauntlet-capsule__kbd-sep">·</span>
                <span className="gauntlet-capsule__kbd">⌘K</span>
              </span>
              {ambient.capabilities.filesystemRead && ambient.filesystem && (
                <button
                  type="button"
                  className="gauntlet-capsule__attach-btn"
                  onClick={() => void attachLocalFile()}
                  aria-label="Anexar ficheiro local"
                  title="Anexar ficheiro do disco"
                  disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                    <path
                      d="M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z"
                      transform="rotate(45 12 12)"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="gauntlet-capsule__attach-label">anexar</span>
                </button>
              )}
              {ambient.capabilities.screenCapture && ambient.screenshot?.captureScreen && (
                <button
                  type="button"
                  className="gauntlet-capsule__attach-btn"
                  onClick={() => void attachScreenCapture()}
                  aria-label="Capturar ecrã inteiro"
                  title="Capturar ecrã inteiro"
                  disabled={phase === 'planning' || phase === 'streaming' || phase === 'executing'}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                    <rect
                      x="3" y="5" width="18" height="13" rx="2"
                      fill="none" stroke="currentColor" strokeWidth="1.6"
                    />
                    <circle cx="12" cy="11.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <span className="gauntlet-capsule__attach-label">ecrã</span>
                </button>
              )}
              {ambient.capabilities.shellExecute && ambient.shellExec && (
                <button
                  type="button"
                  className={`gauntlet-capsule__attach-btn${
                    shellPanelOpen ? ' gauntlet-capsule__attach-btn--active' : ''
                  }`}
                  onClick={() => setShellPanelOpen((v) => !v)}
                  aria-label="Shell rápida"
                  title="Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)"
                  aria-expanded={shellPanelOpen}
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
                    <path
                      d="M5 7l4 4-4 4M11 16h7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="gauntlet-capsule__attach-label">shell</span>
                </button>
              )}
              {(isVoiceSupported() ||
                (ambient.capabilities.remoteVoice && isRemoteVoiceSupported())) && (
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
                  <span
                    key={tokensStreamed}
                    className="gauntlet-capsule__token-counter gauntlet-capsule__token-counter--pulse"
                    aria-live="polite"
                  >
                    {tokensStreamed} chunks
                  </span>
                  <span aria-hidden>·</span>
                  <span>a escrever…</span>
                </span>
              </header>
              <div
                className="gauntlet-capsule__progress-bar"
                role="progressbar"
                aria-label="A receber resposta"
                aria-valuetext="indeterminate"
              >
                <span className="gauntlet-capsule__progress-bar-track" />
              </div>
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
                {ambient.capabilities.filesystemWrite &&
                  ambient.filesystem?.writeTextFile && (
                    <button
                      type="button"
                      className="gauntlet-capsule__copy gauntlet-capsule__copy--ghost"
                      onClick={() => void saveComposeToDisk()}
                      title="Guardar resposta para um ficheiro"
                    >
                      {savedToDiskFlash ? `→ ${savedToDiskFlash}` : 'Guardar como'}
                    </button>
                  )}
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
                        key={`${i}-${a.type}-${
                          'selector' in a
                            ? a.selector
                            : 'path' in a
                              ? a.path
                              : a.cmd
                        }`}
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
              {phase !== 'executed' && canDispatchAnyAction && (
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
              {phase !== 'executed' && !canDispatchAnyAction && (
                <p className="gauntlet-capsule__plan-empty">
                  esta superfície não tem adapter para nenhuma destas acções
                  — abre o Gauntlet num shell que as suporte.
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
              // A1/A2/A3 — registar as novas capabilities no palette
              // para que ⌘K liste mesmo "tudo à mão". Cada uma é
              // gated pela mesma flag que o botão da toolbar usa.
              ...(ambient.capabilities.filesystemRead && ambient.filesystem
                ? [
                    {
                      id: 'attach-file',
                      label: 'Anexar ficheiro local',
                      description: 'Abre o file picker e anexa o conteúdo ao prompt',
                      shortcut: '',
                      group: 'action' as const,
                      run: () => {
                        noteUse('attach-file');
                        setPaletteOpen(false);
                        void attachLocalFile();
                      },
                    },
                  ]
                : []),
              ...(ambient.capabilities.screenCapture && ambient.screenshot?.captureScreen
                ? [
                    {
                      id: 'attach-screen',
                      label: 'Capturar ecrã inteiro',
                      description: 'Anexa um screenshot do ecrã primário',
                      shortcut: '',
                      group: 'action' as const,
                      run: () => {
                        noteUse('attach-screen');
                        setPaletteOpen(false);
                        void attachScreenCapture();
                      },
                    },
                  ]
                : []),
              ...(ambient.capabilities.shellExecute && ambient.shellExec
                ? [
                    {
                      id: 'shell-toggle',
                      label: shellPanelOpen ? 'Fechar shell rápida' : 'Abrir shell rápida',
                      description: 'Painel inline para correr comandos da allowlist',
                      shortcut: '',
                      group: 'action' as const,
                      run: () => {
                        noteUse('shell-toggle');
                        setPaletteOpen(false);
                        setShellPanelOpen((v) => !v);
                      },
                    },
                  ]
                : []),
              ...(ambient.capabilities.filesystemWrite && ambient.filesystem?.writeTextFile
                ? [
                    {
                      id: 'save-disk',
                      label: 'Guardar resposta em ficheiro',
                      description: 'Save dialog → escreve compose para o disco',
                      shortcut: '',
                      group: 'action' as const,
                      disabled: !plan?.compose,
                      run: () => {
                        noteUse('save-disk');
                        setPaletteOpen(false);
                        void saveComposeToDisk();
                      },
                    },
                  ]
                : []),
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

      {/* Overlays (Onboarding, etc) injected by the host shell. Rendered
          inside the cápsula root so position:absolute children anchor
          against the cápsula instead of the host page. */}
      {children}
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
  screenshotDataUrl: string | null,
  attachments: Attachment[],
  shell: 'browser' | 'desktop',
): ContextCaptureRequest {
  const metadata: Record<string, unknown> = {};
  if (snapshot.pageText) metadata.page_text = snapshot.pageText;
  if (snapshot.domSkeleton) metadata.dom_skeleton = snapshot.domSkeleton;
  if (snapshot.bbox) metadata.selection_bbox = snapshot.bbox;
  if (screenshotDataUrl) metadata.screenshot_data_url = screenshotDataUrl;
  // Multimodal — image attachments ship through metadata so the backend
  // can reconstruct Anthropic content blocks. Text attachments stay
  // inlined into user_input (composeUserInputWithAttachments) since
  // they're already cheap to embed in a single string.
  const imageAttachments = attachments.filter(
    (a) => a.kind === 'image' && a.base64,
  );
  if (imageAttachments.length > 0) {
    metadata.attachments = imageAttachments.map((a) => ({
      name: a.name,
      mime: a.mime,
      base64: a.base64,
      bytes: a.bytes,
    }));
  }
  return {
    source: shell,
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
    case 'shell.run': {
      const argline = (action.args ?? []).join(' ');
      const cwd = action.cwd ? ` (cwd: ${action.cwd})` : '';
      return `shell: ${action.cmd}${argline ? ` ${argline}` : ''}${cwd}`;
    }
    case 'fs.read':
      return `fs.read ${action.path}`;
    case 'fs.write':
      return `fs.write ${action.path} (${action.content.length} chars)`;
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

