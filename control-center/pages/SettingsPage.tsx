import { useEffect, useState } from "react";
import { SIGNAL_API_BASE, SIGNAL_API_KEY_PRESENT } from "../lib/signalApi";
import { Panel, SurfaceHeader } from "./ControlLayout";
import Pill from "../components/atoms/Pill";

const THEMES = ["dark", "light"] as const;
type Theme = typeof THEMES[number];

function readTheme(): Theme {
  const html = document.documentElement;
  const t = html.getAttribute("data-theme");
  return t === "light" ? "light" : "dark";
}

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("gauntlet:theme", theme);
    } catch {
      // localStorage may be blocked; theme still applies for the session.
    }
  }, [theme]);

  return (
    <>
      <SurfaceHeader
        eyebrow="Settings"
        title="Runtime · theme · keys"
        subtitle="Build-time API config + per-session theme. Mutating server-side keys lands in Wave 1."
      />

      <Panel title="Backend client" hint="from control-center/lib/signalApi.ts (Vite-inlined env)">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <ConfigField
            label="base url"
            value={
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--ember)",
                  letterSpacing: 0.02,
                }}
              >
                {SIGNAL_API_BASE}
              </code>
            }
            sub="dev: vite proxy · prod: /api/gauntlet"
          />
          <ConfigField
            label="api key"
            value={
              SIGNAL_API_KEY_PRESENT ? (
                <Pill tone="ok">present</Pill>
              ) : (
                <Pill tone="ghost">none · open</Pill>
              )
            }
            sub="bearer · attached to every call when set"
          />
          <ConfigField
            label="set via"
            value={
              <code
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--text-primary)",
                  background: "var(--bg-elevated)",
                  border: "var(--border-soft)",
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                VITE_GAUNTLET_API_BASE
              </code>
            }
            sub="legacy: VITE_SIGNAL_*, VITE_RUBERRA_*"
          />
        </div>
      </Panel>

      <Panel title="Theme" hint="local to this browser; persists in localStorage">
        <div
          style={{
            display: "flex",
            gap: 10,
            padding: 4,
            background: "var(--bg-elevated)",
            borderRadius: 10,
            border: "var(--border-soft)",
            width: "fit-content",
          }}
        >
          {THEMES.map((t) => {
            const active = theme === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                style={{
                  padding: "8px 22px",
                  borderRadius: 7,
                  border: "none",
                  background: active
                    ? "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg) 100%)"
                    : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  letterSpacing: "var(--track-meta)",
                  textTransform: "uppercase",
                  fontWeight: active ? 600 : 400,
                  boxShadow: active
                    ? "0 0 0 1px var(--border-color-mid), 0 4px 12px rgba(0,0,0,0.15)"
                    : "none",
                  transition: "all 200ms var(--motion-easing-out)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Composer hotkey" hint="lives in the browser extension manifest">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            border: "var(--border-soft)",
            borderRadius: 8,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <Kbd>Alt</Kbd>
            <span style={{ color: "var(--text-muted)" }}>+</span>
            <Kbd>Space</Kbd>
          </span>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
            }}
          >
            Change in{" "}
            <code style={inlineCode}>apps/browser-extension/wxt.config.ts</code> under{" "}
            <code style={inlineCode}>commands.summon-capsule.suggested_key</code>. Re-run{" "}
            <code style={inlineCode}>npm run build</code> after editing.
          </p>
        </div>
      </Panel>
    </>
  );
}

function ConfigField({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "var(--bg-elevated)",
        border: "var(--border-soft)",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <span className="gx-eyebrow">{label}</span>
      <div style={{ minHeight: 22, display: "flex", alignItems: "center" }}>{value}</div>
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "var(--track-meta)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 28,
        height: 26,
        padding: "0 8px",
        fontFamily: "var(--mono)",
        fontSize: 12,
        background: "var(--bg-surface)",
        border: "var(--border-soft)",
        borderRadius: 6,
        color: "var(--text-primary)",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      {children}
    </span>
  );
}

const inlineCode: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 12,
  background: "var(--bg-surface)",
  border: "var(--border-soft)",
  padding: "1px 6px",
  borderRadius: 4,
  color: "var(--text-primary)",
};
