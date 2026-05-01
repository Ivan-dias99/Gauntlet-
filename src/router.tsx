// Wave P-39a — central route table.
// Wave P-39b — wraps non-chamber routes in <PageShell> for the
// consistent TopNav + Footer chrome. /chambers/* keeps its own
// immersive Shell with the CanonRibbon (handled by ChambersPage).
//
// Single source of truth for all client-side routes. Mount once in
// App.tsx. New pages add a single Route entry here.
//
// The `/chambers/:tab?` parameter accepts the canonical chamber keys
// (insight | surface | terminal | archive | core | surface-final) and
// is passed-through to the existing Shell via a CustomEvent (see
// ChambersPage). P-39c collapses that bridge.

import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChambersPage from "./pages/ChambersPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ConnectorsPage from "./pages/ConnectorsPage";
import PluginsPage from "./pages/PluginsPage";
import DocsPage from "./pages/DocsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PageShell from "./shell/PageShell";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route
        path="/landing"
        element={
          <PageShell variant="hero">
            <LandingPage />
          </PageShell>
        }
      />

      {/* /chambers/* keeps its own immersive Shell — no PageShell wrap. */}
      <Route path="/chambers" element={<Navigate to="/chambers/insight" replace />} />
      <Route path="/chambers/:tab" element={<ChambersPage />} />

      <Route path="/settings" element={<Navigate to="/settings/preferences" replace />} />
      <Route
        path="/settings/:section"
        element={
          <PageShell>
            <SettingsPage />
          </PageShell>
        }
      />

      <Route
        path="/profile"
        element={
          <PageShell>
            <ProfilePage />
          </PageShell>
        }
      />

      <Route
        path="/connectors"
        element={
          <PageShell variant="wide">
            <ConnectorsPage />
          </PageShell>
        }
      />
      <Route
        path="/connectors/:id"
        element={
          <PageShell>
            <ConnectorsPage />
          </PageShell>
        }
      />

      <Route
        path="/plugins"
        element={
          <PageShell variant="wide">
            <PluginsPage />
          </PageShell>
        }
      />

      <Route
        path="/docs"
        element={
          <PageShell>
            <DocsPage />
          </PageShell>
        }
      />

      <Route
        path="*"
        element={
          <PageShell>
            <NotFoundPage />
          </PageShell>
        }
      />
    </Routes>
  );
}
