// Composer V0 — Control Center root (Operação 4).
//
// The browser extension at apps/browser-extension is the actual product
// surface. This is the operator console: read the brain's state, debug
// runs, inspect failure memory, see model routing.

import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./trust/ErrorBoundary";
import { TweaksProvider } from "./tweaks/TweaksContext";
import { SpineProvider } from "./spine/SpineContext";
import AppRoutes from "./router";

export default function App() {
  return (
    <ErrorBoundary>
      <TweaksProvider>
        <SpineProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SpineProvider>
      </TweaksProvider>
    </ErrorBoundary>
  );
}
