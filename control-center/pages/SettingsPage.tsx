// Operator Settings — control-center surface for per-operator
// preferences (UI, voice, shortcuts, telemetry, danger zone).
//
// This page is operator-scoped: every preference is a local choice,
// persisted to localStorage so it survives reloads without a backend
// round-trip. The cápsula's own theme/voice/tts prefs are stored under
// the same `gauntlet:*` namespace so they read identically across
// surfaces (browser-extension shadow root + Tauri shell + this
// console).
//
// Composer governance (per-domain action policies, danger acks, page
// caps) used to live here. It moved to /control/governance after the
// scope split — this page is exclusively operator preferences now.

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SurfaceHeader } from "./ControlLayout";
import { gauntletFetch } from "../lib/gauntletApi";

// ── Pref namespace ──────────────────────────────────────────────────────────
// All keys live under `gauntlet:*` so they share the namespace with the
// cápsula's pill-prefs (which uses chrome.storage.local). Values are
// JSON-encoded on write and parsed-with-fallback on read.

const KEY = {
  shortcutSummon:        "gauntlet:shortcut_summon",
  shortcutPushToTalk:    "gauntlet:shortcut_push_to_talk",
  shortcutStop:          "gauntlet:shortcut_stop",
  shortcutApprove:       "gauntlet:shortcut_approve",
  shortcutDeny:          "gauntlet:shortcut_deny",
  shortcutControlCenter: "gauntlet:shortcut_control_center",

  behaviorShowPlan:        "gauntlet:behavior_show_plan",
  behaviorNarrate:         "gauntlet:behavior_narrate",
  behaviorAutoStage:       "gauntlet:behavior_auto_stage",
  behaviorReadAloud:       "gauntlet:tts_enabled",
  behaviorInterruptOnInput:"gauntlet:behavior_interrupt_on_input",
  behaviorDismissOnClickOut:"gauntlet:behavior_dismiss_on_click_out",

  voiceSttProvider:    "gauntlet:voice_stt_provider",
  voiceTtsProvider:    "gauntlet:voice_tts_provider",
  voiceVoiceId:        "gauntlet:voice_id",
  voicePushToTalkOnly: "gauntlet:voice_push_to_talk_only",
  voiceNoiseSuppression:"gauntlet:voice_noise_suppression",

  // Theme is special: gauntlet:theme is consumed by other surfaces as a
  // RAW string ("light"|"dark") — see control-center/main.tsx boot
  // hydration. We store the resolved value there + a separate
  // theme_mode key for the picker's "auto" intent.
  appearanceThemeMode:"gauntlet:theme_mode",
  appearanceTheme:    "gauntlet:theme",
  appearanceAccent:   "gauntlet:accent",
  appearanceDensity:  "gauntlet:density",
  appearanceGridBg:   "gauntlet:grid_bg",
  appearanceAnimations:"gauntlet:animations",

  telemetryCrash:      "gauntlet:telemetry_crash",
  telemetryUsage:      "gauntlet:telemetry_usage",
  telemetryPrompts:    "gauntlet:telemetry_prompts",
  telemetryRedactPii:  "gauntlet:telemetry_redact_pii",
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage quota exceeded / disabled — non-fatal, the next
    // reload will fall back to defaults.
  }
}

// Raw string read/write — used for the keys that other surfaces
// (control-center/main.tsx, cápsula prefs in pill-prefs) expect as
// unquoted tokens, not JSON.stringify'd strings. JSON-encoding "light"
// would persist the literal `"\"light\""` and break their guards.
function readRaw(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // non-fatal
  }
}

// ── Theme + accent + density ────────────────────────────────────────────────
// Themes use the existing data-theme attribute on <html>; accent +
// density set their own attributes which the appearance card's
// inline style block consumes.

// "auto" is a picker intent stored under gauntlet:theme_mode — the
// resolved value (light/dark) is what lands in gauntlet:theme so
// every other reader stays in the strict { light, dark } domain.
type ThemeMode = "light" | "dark" | "auto";
type ResolvedTheme = "light" | "dark";
type Accent = "green" | "cyan" | "plum";
// Density tokens MUST match tokens.css (cosy/comfortable/compact);
// "spacious" was a copy edit slip — the CSS rules don't bind to it.
type Density = "compact" | "comfortable" | "cosy";
type AnimationLevel = "subtle" | "full" | "off";

const DEFAULT_PREFS = {
  shortcutSummon:        "Cmd+K",
  shortcutPushToTalk:    "Cmd+Shift+M",
  shortcutStop:          "Cmd+.",
  shortcutApprove:       "Cmd+Enter",
  shortcutDeny:          "Cmd+Backspace",
  shortcutControlCenter: "Cmd+Shift+C",

  behaviorShowPlan:        true,
  behaviorNarrate:         true,
  behaviorAutoStage:       true,
  behaviorReadAloud:       false,
  behaviorInterruptOnInput:true,
  behaviorDismissOnClickOut:true,

  voiceSttProvider:    "whisper-large-v3",
  voiceTtsProvider:    "elevenlabs · turbo",
  voiceVoiceId:        "soft · feminine · pt-pt",
  voicePushToTalkOnly: true,
  voiceNoiseSuppression:true,

  appearanceThemeMode: "light" as ThemeMode,
  appearanceAccent:    "green" as Accent,
  appearanceDensity:   "comfortable" as Density,
  appearanceGridBg:    true,
  appearanceAnimations:"full" as AnimationLevel,

  telemetryCrash:      true,
  telemetryUsage:      false,
  telemetryPrompts:    false,
  telemetryRedactPii:  true,
};

// Resolve a theme mode (light/dark/auto) to the concrete light|dark
// the rest of the app understands. Auto follows the OS via
// prefers-color-scheme; missing matchMedia (very old browsers) falls
// back to light.
function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "auto") {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

// Apply visual prefs to the document so the choice is visible
// immediately. Theme uses data-theme on html+body. Accent / density /
// grid / animations set their own attributes for component CSS hooks.
// IMPORTANT: this also persists the resolved theme to gauntlet:theme
// (raw, not JSON) so control-center/main.tsx's boot hydration picks
// it up on the next reload.
function applyAppearance(prefs: {
  themeMode: ThemeMode;
  accent: Accent;
  density: Density;
  gridBg: boolean;
  animations: AnimationLevel;
}): void {
  const html = document.documentElement;
  const body = document.body;
  const resolved = resolveTheme(prefs.themeMode);
  html.setAttribute("data-theme", resolved);
  body.setAttribute("data-theme", resolved);
  html.setAttribute("data-accent", prefs.accent);
  html.setAttribute("data-density", prefs.density);
  html.setAttribute("data-grid", prefs.gridBg ? "on" : "off");
  html.setAttribute("data-animations", prefs.animations);
  // Persist the resolved theme as raw so the boot hydrator (which
  // does `localStorage.getItem("gauntlet:theme")` and a strict
  // `=== "light" | "dark"` guard) can rehydrate after a reload.
  writeRaw(KEY.appearanceTheme, resolved);
}

// ── Subprimitives ───────────────────────────────────────────────────────────

function Card({
  label,
  hint,
  children,
  tone,
}: {
  label: string;
  hint: string;
  children: ReactNode;
  tone?: "danger";
}) {
  return (
    <section
      className="gx-card"
      data-tone={tone === "danger" ? "danger" : undefined}
      style={{
        padding: "20px 22px 22px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: tone === "danger"
          ? "1px solid color-mix(in oklab, var(--cc-err) 35%, transparent)"
          : "var(--border-soft)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <header style={{ marginBottom: 14 }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "var(--track-meta)",
            textTransform: "lowercase",
            color: tone === "danger" ? "var(--cc-err)" : "var(--text-primary)",
          }}
        >
          / {label}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "var(--track-meta)",
            color: "var(--text-muted)",
            marginLeft: 8,
          }}
        >
          {hint}
        </span>
      </header>
      <div
        style={{
          borderTop: "1px dashed var(--border-color-soft)",
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  control,
}: {
  label: string;
  control: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px dashed var(--border-color-soft)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--sans)",
          fontSize: 13,
          color: "var(--text-secondary)",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </span>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {control}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 38,
        height: 22,
        borderRadius: 999,
        border: "1px solid var(--border-color-mid)",
        background: checked
          ? "var(--accent-green)"
          : "var(--bg-sunken)",
        cursor: "pointer",
        transition:
          "background 200ms var(--ease-swift), border-color 160ms ease",
        padding: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          transition: "left 200ms var(--ease-swift)",
        }}
      />
    </button>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 22,
        height: 22,
        padding: "0 6px",
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--text-secondary)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-color-mid)",
        borderRadius: 5,
        boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </span>
  );
}

function ShortcutDisplay({ combo }: { combo: string }) {
  // Splits "Cmd+K" → ["Cmd","K"] → renders one Kbd per token.
  const parts = combo.split("+");
  return (
    <div style={{ display: "inline-flex", gap: 4 }}>
      {parts.map((p, i) => (
        <Kbd key={`${p}-${i}`}>{symbolize(p)}</Kbd>
      ))}
    </div>
  );
}

function symbolize(token: string): string {
  // Operator-friendly glyphs. Strict mapping; unknowns fall through.
  const map: Record<string, string> = {
    Cmd: "⌘",
    Ctrl: "⌃",
    Shift: "⇧",
    Alt: "⌥",
    Option: "⌥",
    Enter: "↵",
    Backspace: "⌫",
    Tab: "⇥",
    Esc: "esc",
    ".": ".",
    K: "K",
    M: "M",
    C: "C",
  };
  return map[token] ?? token;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      style={{
        display: "inline-flex",
        padding: 2,
        borderRadius: 999,
        background: "var(--bg-sunken)",
        border: "1px solid var(--border-color-mid)",
      }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              background: active ? "var(--text-primary)" : "transparent",
              color: active ? "var(--bg-surface)" : "var(--text-secondary)",
              fontFamily: "var(--sans)",
              fontSize: 11,
              letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "background 160ms ease, color 160ms ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function AccentDot({
  accent,
  active,
  onClick,
}: {
  accent: Accent;
  active: boolean;
  onClick: () => void;
}) {
  const colour =
    accent === "green"
      ? "var(--accent-green)"
      : accent === "cyan"
        ? "var(--accent-cyan)"
        : "var(--accent-plum)";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`accent ${accent}`}
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: active
          ? "2px solid var(--text-primary)"
          : "1px solid var(--border-color-mid)",
        padding: 0,
        background: colour,
        cursor: "pointer",
        transition: "transform 160ms ease, border-color 160ms ease",
        transform: active ? "scale(1.08)" : "scale(1)",
      }}
    />
  );
}

function StaticValue({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text-secondary)",
        letterSpacing: "0.04em",
      }}
    >
      {children}
    </span>
  );
}

function DangerButton({
  label,
  onClick,
  destructive,
}: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 999,
        border: destructive
          ? "1px solid color-mix(in oklab, var(--cc-err) 65%, transparent)"
          : "1px solid var(--border-color-mid)",
        background: destructive
          ? "color-mix(in oklab, var(--cc-err) 8%, transparent)"
          : "transparent",
        color: destructive ? "var(--cc-err)" : "var(--text-secondary)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "var(--track-meta)",
        textTransform: "lowercase",
        cursor: "pointer",
        transition: "background 160ms ease, border-color 160ms ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // Hydrate from localStorage on mount; defaults match the mockup.
  const [prefs, setPrefs] = useState(() => ({
    shortcutSummon:        readJson(KEY.shortcutSummon,        DEFAULT_PREFS.shortcutSummon),
    shortcutPushToTalk:    readJson(KEY.shortcutPushToTalk,    DEFAULT_PREFS.shortcutPushToTalk),
    shortcutStop:          readJson(KEY.shortcutStop,          DEFAULT_PREFS.shortcutStop),
    shortcutApprove:       readJson(KEY.shortcutApprove,       DEFAULT_PREFS.shortcutApprove),
    shortcutDeny:          readJson(KEY.shortcutDeny,          DEFAULT_PREFS.shortcutDeny),
    shortcutControlCenter: readJson(KEY.shortcutControlCenter, DEFAULT_PREFS.shortcutControlCenter),

    behaviorShowPlan:         readJson(KEY.behaviorShowPlan,         DEFAULT_PREFS.behaviorShowPlan),
    behaviorNarrate:          readJson(KEY.behaviorNarrate,          DEFAULT_PREFS.behaviorNarrate),
    behaviorAutoStage:        readJson(KEY.behaviorAutoStage,        DEFAULT_PREFS.behaviorAutoStage),
    behaviorReadAloud:        readJson(KEY.behaviorReadAloud,        DEFAULT_PREFS.behaviorReadAloud),
    behaviorInterruptOnInput: readJson(KEY.behaviorInterruptOnInput, DEFAULT_PREFS.behaviorInterruptOnInput),
    behaviorDismissOnClickOut:readJson(KEY.behaviorDismissOnClickOut,DEFAULT_PREFS.behaviorDismissOnClickOut),

    voiceSttProvider:     readJson(KEY.voiceSttProvider,     DEFAULT_PREFS.voiceSttProvider),
    voiceTtsProvider:     readJson(KEY.voiceTtsProvider,     DEFAULT_PREFS.voiceTtsProvider),
    voiceVoiceId:         readJson(KEY.voiceVoiceId,         DEFAULT_PREFS.voiceVoiceId),
    voicePushToTalkOnly:  readJson(KEY.voicePushToTalkOnly,  DEFAULT_PREFS.voicePushToTalkOnly),
    voiceNoiseSuppression:readJson(KEY.voiceNoiseSuppression,DEFAULT_PREFS.voiceNoiseSuppression),

    // Theme mode comes from its own raw key; the resolved theme is
    // applied via applyAppearance and persisted to gauntlet:theme.
    appearanceThemeMode: ((): ThemeMode => {
      const raw = readRaw(KEY.appearanceThemeMode, DEFAULT_PREFS.appearanceThemeMode);
      return raw === "light" || raw === "dark" || raw === "auto"
        ? (raw as ThemeMode)
        : DEFAULT_PREFS.appearanceThemeMode;
    })(),
    appearanceAccent:    readJson<Accent>(KEY.appearanceAccent,    DEFAULT_PREFS.appearanceAccent),
    appearanceDensity:   readJson<Density>(KEY.appearanceDensity,   DEFAULT_PREFS.appearanceDensity),
    appearanceGridBg:    readJson(KEY.appearanceGridBg,    DEFAULT_PREFS.appearanceGridBg),
    appearanceAnimations:readJson<AnimationLevel>(KEY.appearanceAnimations,DEFAULT_PREFS.appearanceAnimations),

    telemetryCrash:    readJson(KEY.telemetryCrash,    DEFAULT_PREFS.telemetryCrash),
    telemetryUsage:    readJson(KEY.telemetryUsage,    DEFAULT_PREFS.telemetryUsage),
    telemetryPrompts:  readJson(KEY.telemetryPrompts,  DEFAULT_PREFS.telemetryPrompts),
    telemetryRedactPii:readJson(KEY.telemetryRedactPii,DEFAULT_PREFS.telemetryRedactPii),
  }));

  // One-shot bind: any pref change writes back to its key + applies
  // visual prefs to the document. Centralised so each toggle below is
  // a one-liner.
  const update = useCallback(
    <K extends keyof typeof prefs>(key: K, val: typeof prefs[K], storageKey: string) => {
      setPrefs((p) => ({ ...p, [key]: val }));
      writeJson(storageKey, val);
    },
    [],
  );

  // Apply appearance whenever it changes (mount + on every toggle).
  useEffect(() => {
    applyAppearance({
      themeMode: prefs.appearanceThemeMode,
      accent: prefs.appearanceAccent,
      density: prefs.appearanceDensity,
      gridBg: prefs.appearanceGridBg,
      animations: prefs.appearanceAnimations,
    });
  }, [
    prefs.appearanceThemeMode,
    prefs.appearanceAccent,
    prefs.appearanceDensity,
    prefs.appearanceGridBg,
    prefs.appearanceAnimations,
  ]);

  // When mode is "auto", react to OS theme changes mid-session. When
  // mode is light/dark this listener is a no-op because resolveTheme
  // ignores the media query.
  useEffect(() => {
    if (prefs.appearanceThemeMode !== "auto") return;
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    function onChange() {
      applyAppearance({
        themeMode: "auto",
        accent: prefs.appearanceAccent,
        density: prefs.appearanceDensity,
        gridBg: prefs.appearanceGridBg,
        animations: prefs.appearanceAnimations,
      });
    }
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [
    prefs.appearanceThemeMode,
    prefs.appearanceAccent,
    prefs.appearanceDensity,
    prefs.appearanceGridBg,
    prefs.appearanceAnimations,
  ]);

  // Danger zone — every action POSTs `{confirm: true}` to a backend
  // endpoint that re-checks the flag server-side. The native confirm()
  // is the operator gate; the network call is the irreversible one.
  const onClearLedger = useCallback(async () => {
    if (!window.confirm("Clear ledger entries from the last 24h? This cannot be undone.")) return;
    try {
      const res = await gauntletFetch("/ledger/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true, since_hours: 24 }),
      });
      const body = (await res.json()) as { removed?: number; remaining?: number };
      window.alert(
        res.ok
          ? `Ledger cleared. Removed ${body.removed ?? 0}, kept ${body.remaining ?? 0}.`
          : `Ledger clear failed (${res.status}).`,
      );
    } catch (err) {
      window.alert(`Ledger clear failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);
  const onForgetMemory = useCallback(async () => {
    if (!window.confirm("Forget all memory records? This cannot be undone.")) return;
    try {
      const res = await gauntletFetch("/memory/forget_all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const body = (await res.json()) as { removed?: number };
      window.alert(
        res.ok
          ? `Memory forgotten. Removed ${body.removed ?? 0} records.`
          : `Memory forget failed (${res.status}).`,
      );
    } catch (err) {
      window.alert(`Memory forget failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);
  const onRevokePermissions = useCallback(async () => {
    if (!window.confirm("Revoke all granted permissions? Operator must re-approve next use.")) return;
    try {
      const res = await gauntletFetch("/permissions/revoke_all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      window.alert(
        res.ok ? "Permissions revoked. Operator will re-approve on next use." : `Revoke failed (${res.status}).`,
      );
    } catch (err) {
      window.alert(`Revoke failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);
  const onUninstall = useCallback(() => {
    window.alert(
      "To uninstall: remove the browser extension via your browser's extension manager, " +
      "then run `npm run uninstall` in the desktop folder. The cápsula leaves no system services running.",
    );
  }, []);

  const noteText = useMemo(
    () => "all changes saved automatically",
    [],
  );

  return (
    <div>
      <SurfaceHeader
        eyebrow="/ settings"
        title="Tune the capsule."
        subtitle="behavior, voice, shortcuts, theme, telemetry."
        actions={
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "var(--track-meta)",
              color: "var(--text-muted)",
            }}
          >
            {noteText}
          </span>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 16,
        }}
      >
        {/* ── 1. Shortcuts ─────────────────────────────────────────────── */}
        <Card label="shortcuts" hint="global">
          <Row label="summon capsule"     control={<ShortcutDisplay combo={prefs.shortcutSummon} />} />
          <Row label="push to talk"       control={<ShortcutDisplay combo={prefs.shortcutPushToTalk} />} />
          <Row label="stop / interrupt"   control={<ShortcutDisplay combo={prefs.shortcutStop} />} />
          <Row label="approve gate"       control={<ShortcutDisplay combo={prefs.shortcutApprove} />} />
          <Row label="deny gate"          control={<ShortcutDisplay combo={prefs.shortcutDeny} />} />
          <Row label="open control center" control={<ShortcutDisplay combo={prefs.shortcutControlCenter} />} />
        </Card>

        {/* ── 2. Behavior ──────────────────────────────────────────────── */}
        <Card label="behavior" hint="how it acts">
          <Row label="show plan before execute"
               control={<Toggle checked={prefs.behaviorShowPlan}
                                onChange={(v) => update("behaviorShowPlan", v, KEY.behaviorShowPlan)} />} />
          <Row label="narrate actions inline"
               control={<Toggle checked={prefs.behaviorNarrate}
                                onChange={(v) => update("behaviorNarrate", v, KEY.behaviorNarrate)} />} />
          <Row label="auto-stage diffs to git"
               control={<Toggle checked={prefs.behaviorAutoStage}
                                onChange={(v) => update("behaviorAutoStage", v, KEY.behaviorAutoStage)} />} />
          <Row label="read aloud responses"
               control={<Toggle checked={prefs.behaviorReadAloud}
                                onChange={(v) => update("behaviorReadAloud", v, KEY.behaviorReadAloud)} />} />
          <Row label="interrupt on user input"
               control={<Toggle checked={prefs.behaviorInterruptOnInput}
                                onChange={(v) => update("behaviorInterruptOnInput", v, KEY.behaviorInterruptOnInput)} />} />
          <Row label="dismiss capsule on click-out"
               control={<Toggle checked={prefs.behaviorDismissOnClickOut}
                                onChange={(v) => update("behaviorDismissOnClickOut", v, KEY.behaviorDismissOnClickOut)} />} />
        </Card>

        {/* ── 3. Voice ─────────────────────────────────────────────────── */}
        <Card label="voice" hint="stt + tts">
          <Row label="stt provider"  control={<StaticValue>{prefs.voiceSttProvider}</StaticValue>} />
          <Row label="tts provider"  control={<StaticValue>{prefs.voiceTtsProvider}</StaticValue>} />
          <Row label="voice"         control={<StaticValue>{prefs.voiceVoiceId}</StaticValue>} />
          <Row label="push-to-talk only"
               control={<Toggle checked={prefs.voicePushToTalkOnly}
                                onChange={(v) => update("voicePushToTalkOnly", v, KEY.voicePushToTalkOnly)} />} />
          <Row label="noise suppression"
               control={<Toggle checked={prefs.voiceNoiseSuppression}
                                onChange={(v) => update("voiceNoiseSuppression", v, KEY.voiceNoiseSuppression)} />} />
        </Card>

        {/* ── 4. Appearance ────────────────────────────────────────────── */}
        <Card label="appearance" hint="theme + density">
          <Row label="theme"
               control={
                 <Segmented<ThemeMode>
                   value={prefs.appearanceThemeMode}
                   options={[
                     { value: "light", label: "paper" },
                     { value: "dark",  label: "graphite" },
                     { value: "auto",  label: "auto" },
                   ]}
                   onChange={(v) => {
                     // Mode key holds the operator's intent; the
                     // resolved theme is written by applyAppearance.
                     // Raw write (not JSON-encoded) so other readers
                     // that expect a plain "light"/"dark"/"auto"
                     // string see the value they expect.
                     setPrefs((p) => ({ ...p, appearanceThemeMode: v }));
                     writeRaw(KEY.appearanceThemeMode, v);
                   }}
                 />
               } />
          <Row label="accent"
               control={
                 <div style={{ display: "inline-flex", gap: 8 }}>
                   {(["green", "cyan", "plum"] as Accent[]).map((a) => (
                     <AccentDot
                       key={a}
                       accent={a}
                       active={prefs.appearanceAccent === a}
                       onClick={() => update("appearanceAccent", a, KEY.appearanceAccent)}
                     />
                   ))}
                 </div>
               } />
          <Row label="density"
               control={
                 <Segmented<Density>
                   value={prefs.appearanceDensity}
                   options={[
                     { value: "comfortable", label: "comfortable" },
                     { value: "compact",     label: "compact" },
                     { value: "cosy",        label: "cosy" },
                   ]}
                   onChange={(v) => update("appearanceDensity", v, KEY.appearanceDensity)}
                 />
               } />
          <Row label="show grid background"
               control={<Toggle checked={prefs.appearanceGridBg}
                                onChange={(v) => update("appearanceGridBg", v, KEY.appearanceGridBg)} />} />
          <Row label="animations"
               control={
                 <Segmented<AnimationLevel>
                   value={prefs.appearanceAnimations}
                   options={[
                     { value: "subtle", label: "subtle" },
                     { value: "full",   label: "full" },
                     { value: "off",    label: "off" },
                   ]}
                   onChange={(v) => update("appearanceAnimations", v, KEY.appearanceAnimations)}
                 />
               } />
        </Card>

        {/* ── 5. Telemetry ─────────────────────────────────────────────── */}
        <Card label="telemetry" hint="privacy · opt-in only">
          <Row label="share crash reports"
               control={<Toggle checked={prefs.telemetryCrash}
                                onChange={(v) => update("telemetryCrash", v, KEY.telemetryCrash)} />} />
          <Row label="share anonymous usage"
               control={<Toggle checked={prefs.telemetryUsage}
                                onChange={(v) => update("telemetryUsage", v, KEY.telemetryUsage)} />} />
          <Row label="share prompt examples"
               control={<Toggle checked={prefs.telemetryPrompts}
                                onChange={(v) => update("telemetryPrompts", v, KEY.telemetryPrompts)} />} />
          <Row label="redact pii from ledger"
               control={<Toggle checked={prefs.telemetryRedactPii}
                                onChange={(v) => update("telemetryRedactPii", v, KEY.telemetryRedactPii)} />} />
        </Card>

        {/* ── 6. Danger zone ───────────────────────────────────────────── */}
        <Card label="danger zone" hint="irreversible" tone="danger">
          <Row label="clear ledger (last 24h)"
               control={<DangerButton label="clear" onClick={onClearLedger} />} />
          <Row label="forget all memory"
               control={<DangerButton label="forget" onClick={onForgetMemory} />} />
          <Row label="revoke all permissions"
               control={<DangerButton label="revoke" onClick={onRevokePermissions} />} />
          <Row label="uninstall capsule"
               control={<DangerButton label="uninstall" destructive onClick={onUninstall} />} />
        </Card>
      </div>
    </div>
  );
}

