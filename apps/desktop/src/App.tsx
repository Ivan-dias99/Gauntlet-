// Desktop App shell.
//
// One window. The cápsula is always present visually but the global
// shortcut shows / hides the window itself (handled in main.rs via the
// global-shortcut plugin and the JS adapter).
//
// Doctrine: one Composer. We mount the same Capsule the browser
// extension mounts, only with a DesktopAmbient that adapts transport
// (direct fetch), selection (clipboard + window title), and storage
// (localStorage) to the Tauri runtime. The look + behaviour are
// identical; capabilities decide which buttons render.

import { useCallback, useEffect, useMemo } from "react";
import { Capsule, CAPSULE_CSS } from "@gauntlet/composer";
import { createDesktopAmbient } from "./ambient";
import {
  bindGlobalShortcut,
  DEFAULT_DESKTOP_SHORTCUT,
  toggleCapsuleWindow,
} from "./adapters/tauri";

// Inject the shared Capsule CSS once. styles.css carries the desktop-
// specific html/body shell + the "fill the window" override; the rest
// of the cápsula identity comes from the package so both shells share
// one source of truth for typography, glass, motion, phase glow, etc.
function injectCapsuleStyles() {
  if (document.getElementById("gauntlet-capsule-css")) return;
  const style = document.createElement("style");
  style.id = "gauntlet-capsule-css";
  style.textContent = CAPSULE_CSS;
  document.head.appendChild(style);
}

export function App() {
  const ambient = useMemo(() => createDesktopAmbient(), []);

  useEffect(() => {
    injectCapsuleStyles();
    // Mirror the persisted theme onto html/body so the Tauri window's
    // background matches the cápsula's resolved theme on first paint.
    // Without this the window flashes whatever default styles.css has
    // (cream) before the cápsula renders its dark-themed surface, or
    // vice-versa.
    void ambient.storage.get<string>("gauntlet:theme").then((t) => {
      const theme = t === "dark" || t === "light" ? t : "light";
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
    });
  }, [ambient]);

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

  return (
    <Capsule
      ambient={ambient}
      initialSnapshot={ambient.selection.read()}
      onDismiss={dismiss}
    />
  );
}
