// Desktop App shell.
//
// One window. The cápsula is always present visually but the global
// shortcut shows / hides the window itself (handled in main.rs via the
// global-shortcut plugin and the JS adapter).
//
// The Capsule itself lives in @gauntlet/composer — same component the
// browser extension mounts. Only the Ambient differs (clipboard +
// active window instead of page selection + DOM exec).

import { useCallback, useEffect, useMemo, useState } from "react";
import { Capsule, type ContextSnapshot } from "@gauntlet/composer";
import { buildDesktopAmbient } from "./ambient/desktop";
import {
  bindGlobalShortcut,
  DEFAULT_DESKTOP_SHORTCUT,
  toggleCapsuleWindow,
} from "./adapters/tauri";

const EMPTY_SNAPSHOT: ContextSnapshot = {
  source: "desktop",
  text: "",
  url: "desktop://gauntlet",
  pageTitle: "",
  pageText: "",
  domSkeleton: "",
  bbox: null,
};

export function App() {
  const ambient = useMemo(() => buildDesktopAmbient(), []);
  const [snapshot, setSnapshot] = useState<ContextSnapshot>(EMPTY_SNAPSHOT);

  const dismiss = useCallback(() => {
    void toggleCapsuleWindow();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve(ambient.captureContext()).then((snap) => {
      if (!cancelled) setSnapshot(snap);
    });
    return () => {
      cancelled = true;
    };
  }, [ambient]);

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

  return <Capsule ambient={ambient} initialSnapshot={snapshot} onDismiss={dismiss} />;
}
