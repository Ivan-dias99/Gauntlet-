import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/aesthetic.css";
import { injectCssVariables } from "./design/css-vars";

// Boot-time theme application — must run before any token-driven render.
// The default in index.html is dark (so the page never flashes light on
// first visit), but if the operator picked a different theme we must
// honour it on every route, not just /control/settings.
function applyPersistedTheme(): void {
  try {
    const saved =
      window.localStorage.getItem("gauntlet:theme") ??
      window.localStorage.getItem("signal:theme") ??
      window.localStorage.getItem("ruberra:theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch {
    // Storage may be blocked (private mode, embedded contexts) — fall
    // back to whatever data-theme index.html declared. The theme switch
    // in /control/settings still works for the session.
  }
}

applyPersistedTheme();

// Wave P-33 — Materialise the typed token graph (control-center/design/*)
// into CSS custom properties on :root before React mounts.
injectCssVariables();

createRoot(document.getElementById("root")!).render(<App />);
