import { useEffect, useState } from "react";
import { SIGNAL_API_BASE, SIGNAL_API_KEY_PRESENT } from "../lib/signalApi";
import { Kv, Panel, SurfaceHeader } from "./ControlLayout";
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
      window.localStorage.setItem("ruberra:theme", theme);
    } catch {
      // localStorage may be blocked; theme still applies for the session.
    }
  }, [theme]);

  return (
    <>
      <SurfaceHeader
        title="Settings"
        subtitle="Build-time API config + per-session theme. Mutating server-side keys lands in Wave 1."
      />

      <Panel title="Backend client" hint="from control-center/lib/signalApi.ts (Vite-inlined env)">
        <Kv
          rows={[
            ["base url", <code style={{ fontFamily: "var(--mono)" }}>{SIGNAL_API_BASE}</code>],
            [
              "api key",
              SIGNAL_API_KEY_PRESENT
                ? <Pill tone="ok">present</Pill>
                : <Pill tone="ghost">none (open backend)</Pill>,
            ],
            [
              "set via",
              <code style={{ fontFamily: "var(--mono)" }}>VITE_GAUNTLET_API_BASE</code>,
            ],
          ]}
        />
      </Panel>

      <Panel title="Theme" hint="local to this browser; persists in localStorage">
        <div style={{ display: "flex", gap: 8 }}>
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-sm, 4px)",
                border: theme === t
                  ? "1px solid var(--text-primary)"
                  : "var(--border-soft)",
                background: theme === t ? "var(--bg-elevated)" : "transparent",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontFamily: "var(--mono)",
                fontSize: 12,
                letterSpacing: "var(--track-meta)",
                textTransform: "uppercase",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Composer hotkey" hint="lives in the browser extension manifest">
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
          Change in <code style={{ fontFamily: "var(--mono)" }}>apps/browser-extension/wxt.config.ts</code>{" "}
          under <code style={{ fontFamily: "var(--mono)" }}>commands.summon-capsule.suggested_key</code>.{" "}
          Re-run <code style={{ fontFamily: "var(--mono)" }}>npm run build</code> after editing.
        </p>
      </Panel>
    </>
  );
}
