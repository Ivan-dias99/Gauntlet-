import React from "react";
import ReactDOM from "react-dom/client";
import { CAPSULE_CSS } from "@gauntlet/composer";
import { App } from "./App";
import "./styles.css";

// Inject the Composer's stylesheet exactly once. Same source of truth as
// the browser extension — the Capsule's visual identity is owned by the
// package, not by either shell.
const style = document.createElement("style");
style.textContent = CAPSULE_CSS;
document.head.appendChild(style);

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
