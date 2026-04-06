// Ruberra — Root. Hydrates the event log, then mounts the shell.
// Safe mode boot: if hydration fails catastrophically, minimal surface.

import { useEffect, useState } from "react";
import { bootSpine } from "./spine/store";
import { useProjection } from "./spine/store";
import { Shell } from "./shell/Shell";
import { RitualEntry } from "./shell/RitualEntry";
import { ErrorBoundary } from "./trust/ErrorBoundary";
import "./styles.css";

type BootState =
  | { phase: "booting" }
  | { phase: "ready" }
  | { phase: "fatal"; error: Error };

function Inner() {
  const p = useProjection();
  const [entered, setEntered] = useState<boolean>(!!p.activeRepo);

  // If hydration reveals an existing repo, skip ritual.
  useEffect(() => {
    if (p.activeRepo) setEntered(true);
  }, [p.activeRepo]);

  if (!entered || !p.activeRepo) {
    return <RitualEntry onEnter={() => setEntered(true)} />;
  }
  return <Shell />;
}

export default function RuberraApp() {
  const [boot, setBoot] = useState<BootState>({ phase: "booting" });

  useEffect(() => {
    bootSpine()
      .then(() => setBoot({ phase: "ready" }))
      .catch((err) => setBoot({ phase: "fatal", error: err as Error }));
  }, []);

  if (boot.phase === "booting") {
    return (
      <div className="rb-ritual">
        <div className="inner">
          <h1>
            RUB<span>E</span>RRA
          </h1>
          <p>hydrating event log…</p>
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
      <Inner />
    </ErrorBoundary>
  );
}
