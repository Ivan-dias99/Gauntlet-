// Composer V0 — router (Operação 4).
//
// Replaces the legacy chamber/page table with the Control Center
// surfaces. The Composer surface itself lives outside this app
// (apps/browser-extension); this router is the operator console.

import { Navigate, Route, Routes } from "react-router-dom";
import ControlLayout from "./pages/ControlLayout";
import OverviewPage from "./pages/OverviewPage";
import SettingsPage from "./pages/SettingsPage";
import ModelsPage from "./pages/ModelsPage";
import PermissionsPage from "./pages/PermissionsPage";
import MemoryPage from "./pages/MemoryPage";
import LedgerPage from "./pages/LedgerPage";
import ComposerPage from "./pages/ComposerPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/control" replace />} />
      <Route path="/composer" element={<ComposerPage />} />
      <Route path="/control" element={<ControlLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="models" element={<ModelsPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="memory" element={<MemoryPage />} />
        <Route path="ledger" element={<LedgerPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/control" replace />} />
    </Routes>
  );
}
