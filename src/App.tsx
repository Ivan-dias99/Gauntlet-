// Composer V0 — app root.
//
// Two surfaces share this app:
//   /composer/*  — the studio (Idle Hero, sidebar, status bar — Fase 1+).
//   /control/*   — the legacy operator console, kept addressable while
//                  Fase 2 absorbs Models / Permissions / Memory / Ledger
//                  into the studio.
//
// The cursor capsule (apps/browser-extension) remains the primary
// product surface. The studio is the secondary surface — depth and
// inspection — and consumes the same backend as the capsule.

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
