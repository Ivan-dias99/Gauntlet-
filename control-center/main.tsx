import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import { injectCssVariables } from "./design/css-vars";

// Wave P-33 — Materialise the typed token graph (src/design/*) into CSS
// custom properties on :root before React mounts.
injectCssVariables();

// Composer V0 — the preview-agent runtime moved to _legacy/ alongside
// the Surface chamber that consumed it (Op 3). When the Control Center
// (Op 4) ships a preview surface, this is where a fresh agent gets
// re-introduced.

createRoot(document.getElementById("root")!).render(<App />);
