// Desktop App shell (Sprint 6).
//
// One window. The cápsula is always present visually but the global
// shortcut shows / hides the window itself (handled in main.rs via the
// global-shortcut plugin and the JS adapter). Sprint 7 will add the
// tray icon + menu surface so the cápsula is summonable without a
// keypress on systems where the shortcut is bound by another app.

import { useCallback, useEffect } from "react";
import { Capsule } from "./Capsule";
import {
  bindGlobalShortcut,
  DEFAULT_DESKTOP_SHORTCUT,
  toggleCapsuleWindow,
} from "./adapters/tauri";

export function App() {
  const dismiss = useCallback(() => {
    void toggleCapsuleWindow();
  }, []);

  useEffect(() => {
    let unbind: (() => Promise<void>) | null = null;
    void bindGlobalShortcut(DEFAULT_DESKTOP_SHORTCUT, () => {
      void toggleCapsuleWindow();
    }).then((u) => {
      unbind = u;
    });
    return () => {
      if (unbind) void unbind();
    };
  }, []);

  return <Capsule onDismiss={dismiss} />;
}
