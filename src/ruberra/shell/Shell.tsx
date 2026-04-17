// Ruberra — minimal shell. Single chamber (Creation). No rails, no chamber
// picker, no legacy rail surfaces. Connected to the canonical Python backend
// via the Creation chamber's submit handler.

import { useProjection } from "../spine/store";
import { nextMove } from "../spine/projections";
import { getRuntimeConfig } from "../spine/runtime-fabric";
import { CreationChamber } from "../chambers/Creation";
import { ErrorBoundary } from "../trust/ErrorBoundary";

type ThemeMode = "dark" | "light";

export function Shell({
  theme = "dark",
  onToggleTheme = () => {},
}: {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
} = {}) {
  const p = useProjection();
  const runtimeConfig = getRuntimeConfig();
  const move = nextMove(p);

  return (
    <div className="rb-root">
      <header className="rb-topbar">
        <div className="rb-brand-block">
          <div className="rb-brand">
            RUB<span>E</span>RRA
          </div>
          <div className="rb-brand-tagline">Architect Creation System</div>
        </div>

        <div className="rb-authority">
          <div className="rb-repo">{p.activeRepo ?? "unbound"}</div>
          <div className="rb-spine-indicators">
            <div className="rb-spine-cell" title="Operational state">
              <span className="rb-spine-label">state</span>
              <span className="rb-spine-value">{move}</span>
            </div>
          </div>
        </div>

        <div className="rb-shell-actions">
          <div
            className="rb-shell-runtime-chip"
            title={
              runtimeConfig
                ? `${runtimeConfig.provider} · ${runtimeConfig.model}`
                : "simulation mode"
            }
          >
            {runtimeConfig ? runtimeConfig.provider : "sim"}
          </div>
          <button
            className="rb-theme-toggle"
            onClick={onToggleTheme}
            type="button"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="rb-main">
        <div className="rb-main-col rb-main-col--stage">
          <div className="rb-workstage">
            <ErrorBoundary label="Creation chamber">
              <CreationChamber />
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}
