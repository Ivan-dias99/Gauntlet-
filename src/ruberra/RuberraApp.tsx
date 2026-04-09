// Ruberra — Root. Hydrates the event log, then mounts the shell.
// Safe mode boot: if hydration fails catastrophically, minimal surface.
// Returning users see system state acknowledgment before re-entry.

import { useEffect, useState } from "react";
import { bootSpine, useProjection } from "./spine/store";
import { project } from "./spine/projections";
import { all } from "./spine/eventLog";
import { Shell } from "./shell/Shell";
import { RitualEntry } from "./shell/RitualEntry";
import { ErrorBoundary } from "./trust/ErrorBoundary";
import { RuledPromptHost } from "./trust/RuledPrompt";
import "./styles.css";
import "./reforge-imports.css";

type BootState =
  | { phase: "booting" }
  | { phase: "ready"; returning: boolean }
  | { phase: "fatal"; error: Error };

function Inner({ returning }: { returning: boolean }) {
  const p = useProjection();
  const [entered, setEntered] = useState<boolean>(false);

  // If the user has already entered this session, stay entered.
  // The returning flag gates whether we show recognition or initiation.
  if (entered) {
    return <Shell />;
  }

  return (
    <RitualEntry
      onEnter={() => setEntered(true)}
      returning={returning && !!p.activeRepo}
    />
  );
}

export default function RuberraApp() {
  const [boot, setBoot] = useState<BootState>({ phase: "booting" });

  useEffect(() => {
    bootSpine()
      .then(() => {
        // After hydration, snapshot the projection to detect returning user.
        const p = project(all());
        setBoot({ phase: "ready", returning: !!p.activeRepo });
      })
      .catch((err) => setBoot({ phase: "fatal", error: err as Error }));
  }, []);

  if (boot.phase === "booting") {
    return (
      <div className="rb-ritual">
        <div className="inner">
          <h1>
            RUB<span>E</span>RRA
          </h1>
          <p>hydrating spine…</p>
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
      <Inner returning={boot.returning} />
    </ErrorBoundary>
  );
}
