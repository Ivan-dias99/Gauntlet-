// Composer V0 — router.
//
// One destination: /composer/*. The studio absorbs every operator
// surface that previously lived under /control/* (Models, Permissions,
// Memory, Ledger, Settings, Overview). The legacy /control/* routes
// redirect to their /composer/* equivalents so old bookmarks still
// land somewhere honest.

import { Navigate, Route, Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import ModelsPage from "./pages/ModelsPage";
import PermissionsPage from "./pages/PermissionsPage";
import MemoryPage from "./pages/MemoryPage";
import LedgerPage from "./pages/LedgerPage";
import ComposerLayout from "./composer/ComposerLayout";
import StudioHome from "./composer/shell/StudioHome";
import StudioStub from "./composer/shell/StudioStub";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/composer" replace />} />

      <Route path="/composer" element={<ComposerLayout />}>
        {/* Workspace */}
        <Route index element={<StudioHome />} />

        {/* Sidebar stubs — wiring lands in later fases. */}
        <Route path="context"  element={<StudioStub />} />
        <Route path="compose"  element={<StudioStub />} />
        <Route path="code"     element={<StudioStub />} />
        <Route path="design"   element={<StudioStub />} />
        <Route path="analysis" element={<StudioStub />} />
        <Route path="route"    element={<StudioStub />} />

        {/* Sidebar live — Memory + Settings absorbed from legacy /control/*. */}
        <Route path="memory"      element={<MemoryPage />} />
        <Route path="settings"    element={<SettingsPage />} />

        {/* Off-sidebar live — accessible via right-rail link or
            Settings sub-navigation; absorbed from legacy /control/*. */}
        <Route path="models"      element={<ModelsPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="ledger"      element={<LedgerPage />} />
        <Route path="overview"    element={<OverviewPage />} />
      </Route>

      {/* Legacy /control/* — redirect each old path to its /composer/*
          equivalent. The bare /control redirects to the studio root. */}
      <Route path="/control"             element={<Navigate to="/composer"             replace />} />
      <Route path="/control/settings"    element={<Navigate to="/composer/settings"    replace />} />
      <Route path="/control/models"      element={<Navigate to="/composer/models"      replace />} />
      <Route path="/control/permissions" element={<Navigate to="/composer/permissions" replace />} />
      <Route path="/control/memory"      element={<Navigate to="/composer/memory"      replace />} />
      <Route path="/control/ledger"      element={<Navigate to="/composer/ledger"      replace />} />

      <Route path="*" element={<Navigate to="/composer" replace />} />
    </Routes>
  );
}
