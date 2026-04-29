import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";

// Wave P-5 — Preview iframe-side runtime is loaded conditionally so a
// normal session never installs the postMessage listeners. The chamber
// (Surface Final) renders the preview inside an iframe with the query
// param `?previewAgent=1`; on boot the agent registers the typed RPC
// handlers (ping, list_components, select_element, navigate). Errors
// during dynamic import don't block the React app from booting — the
// chamber will just see RPC timeouts.
if (new URLSearchParams(location.search).has("previewAgent")) {
  import("./preview-agent").catch(() => {
    // ignore — agent boot failure leaves the React app alone
  });
}

createRoot(document.getElementById("root")!).render(<App />);
