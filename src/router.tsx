// Composer V0 — router.
//
// Two destinations, distinct roles:
//
//   /composer/*   — the studio (src/composer/ComposerLayout). Where
//                   Composer operations are inspected, configured,
//                   audited, and operated standalone. Fase 1 ships
//                   the Home (Idle) surface; the rest of the sidebar
//                   routes to honest StudioStub entries.
//
//   /control/*    — the legacy operator console. Kept addressable
//                   during the studio migration so operators can still
//                   reach Models / Permissions / Memory / Ledger pages
//                   while Fase 2 absorbs them into the studio.
//
// Both share the same backend and the same brain.

import { Navigate, Route, Routes } from "react-router-dom";
import ControlLayout from "./pages/ControlLayout";
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
        <Route index element={<StudioHome />} />
        <Route path="compose" element={<StudioStub />} />
        <Route path="code" element={<StudioStub />} />
        <Route path="design" element={<StudioStub />} />
        <Route path="analysis" element={<StudioStub />} />
        <Route path="memory" element={<StudioStub />} />
        <Route path="models" element={<StudioStub />} />
        <Route path="permissions" element={<StudioStub />} />
        <Route path="ledger" element={<StudioStub />} />
        <Route path="settings" element={<StudioStub />} />
      </Route>

      <Route path="/control" element={<ControlLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="models" element={<ModelsPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="memory" element={<MemoryPage />} />
        <Route path="ledger" element={<LedgerPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/composer" replace />} />
    </Routes>
  );
}
