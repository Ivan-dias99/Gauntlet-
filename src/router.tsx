// Wave P-39a — central route table.
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="/landing" element={<LandingPage />} />

      <Route path="/chambers" element={<Navigate to="/chambers/insight" replace />} />
      <Route path="/chambers/:tab" element={<ChambersPage />} />

      <Route path="/settings" element={<Navigate to="/settings/preferences" replace />} />
      <Route path="/settings/:section" element={<SettingsPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/connectors" element={<ConnectorsPage />} />
      <Route path="/connectors/:id" element={<ConnectorsPage />} />

      <Route path="/plugins" element={<PluginsPage />} />

      <Route path="/docs" element={<DocsPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
