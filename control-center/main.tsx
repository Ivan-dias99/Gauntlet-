import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/aesthetic.css";
import { injectCssVariables } from "./design/css-vars";

// Wave P-33 — Materialise the typed token graph (control-center/design/*)
// into CSS custom properties on :root before React mounts.
injectCssVariables();

createRoot(document.getElementById("root")!).render(<App />);
