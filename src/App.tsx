// Composer V0 — app root.
//
// One destination: /composer/* — the studio. Sidebar nav, Idle hero,
// real-data tiles, plus the Memory / Models / Permissions / Ledger /
// Settings surfaces absorbed from the deleted /control/* layout.
// Legacy /control/* paths redirect to their /composer/* equivalents
// so old bookmarks land somewhere honest.
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
