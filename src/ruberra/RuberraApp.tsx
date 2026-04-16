// Root. Hydrates the event log, then mounts the shell.
// If hydration fails, renders a minimal safe-mode surface.

import { useEffect, useState } from "react";
import { bootSpine, useProjection } from "./spine/store";
import { project } from "./spine/projections";
import { all } from "./spine/eventLog";
import { Shell } from "./shell/Shell";
import { RitualEntry } from "./shell/RitualEntry";
import { ErrorBoundary } from "./trust/ErrorBoundary";
import { RuledPromptHost } from "./trust/RuledPrompt";
import "./styles.css";
import "./harvest.css";
import "./flagship.css";
import "./flagship-wave2.css";
import "./reforge-imports.css";
import "./embodiment.css";
import "./workstation.css";

type BootState =
  | { phase: "booting" }
  | { phase: "ready"; returning: boolean }
  | { phase: "fatal"; error: Error };

type ThemeMode = "dark" | "light";

function readInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("rb-theme");
  return stored === "light" ? "light" : "dark";
}

function Inner({
  returning,
  theme,
  onToggleTheme,
}: {
  returning: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const p = useProjection();
  const [entered, setEntered] = useState<boolean>(false);

  if (entered) {
    return <Shell theme={theme} onToggleTheme={onToggleTheme} />;
  }

  return (
    <RitualEntry
      onEnter={() => setEntered(true)}
      returning={returning && !!p.activeRepo}
      theme={theme}
      onToggleTheme={onToggleTheme}
    />
  );
}

export default function RuberraApp() {
  const [boot, setBoot] = useState<BootState>({ phase: "booting" });
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useEffect(() => {
    bootSpine()
      .then(() => {
        const p = project(all());
        setBoot({ phase: "ready", returning: !!p.activeRepo });
      })
      .catch((err) => setBoot({ phase: "fatal", error: err as Error }));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.rbTheme = theme;
    window.localStorage.setItem("rb-theme", theme);
  }, [theme]);

  if (boot.phase === "booting") {
    return (
      <div className="rb-ritual">
        <div className="inner">
          <h1>
            RUB<span>E</span>RRA
          </h1>
          <p>loading…</p>
        </div>
      </div>
    );
  }

  if (boot.phase === "fatal") {
    return (
      <div className="rb-fatal">
        <h2>Safe Mode</h2>
        <p>
          The event log could not be hydrated. The shell is running in minimal
          mode. No fake surfaces are shown.
        </p>
        <pre>{boot.error.message}</pre>
      </div>
    );
  }

  return (
    <ErrorBoundary label="Ruberra shell">
      <RuledPromptHost />
      <Inner
        returning={boot.returning}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
    </ErrorBoundary>
  );
}
