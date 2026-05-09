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

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Capsule,
  CAPSULE_CSS,
  COMPUTER_USE_GATE_CSS,
  Onboarding,
  ONBOARDING_CSS,
  createPillPrefs,
} from "@gauntlet/composer";
import { createDesktopAmbient } from "./ambient";
import {
  bindGlobalShortcut,
  DEFAULT_DESKTOP_SHORTCUT,
  toggleCapsuleWindow,
} from "./adapters/tauri";

// Inject the shared Capsule + Onboarding CSS once. styles.css carries the
// desktop-specific html/body shell; the rest of the cápsula identity
// comes from the package so both shells share one source of truth for
// typography, glass, motion, phase glow, etc.
function injectCapsuleStyles() {
  if (document.getElementById("gauntlet-capsule-css")) return;
  const style = document.createElement("style");
  style.id = "gauntlet-capsule-css";
  style.textContent = CAPSULE_CSS + ONBOARDING_CSS + COMPUTER_USE_GATE_CSS;
  document.head.appendChild(style);
}

export function App() {
  const ambient = useMemo(() => createDesktopAmbient(), []);
  const prefs = useMemo(() => createPillPrefs(ambient.storage), [ambient]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    injectCapsuleStyles();
    // Mirror the persisted theme onto html/body so the Tauri window
    // honours the operator's choice on first paint instead of flashing
    // whatever default the OS gives us.
    void ambient.storage
      .get<string>("gauntlet:theme")
      .then((t) => {
        const theme = t === "dark" || t === "light" ? t : "light";
        document.documentElement.setAttribute("data-theme", theme);
        document.body.setAttribute("data-theme", theme);
      })
      .catch(() => {
        // Storage unreachable — stay on the default theme attribute
        // already set by the index.html's pre-React script.
      });
    void prefs
      .readOnboardingDone()
      .then((done) => {
        if (!done) setShowOnboarding(true);
      })
      .catch(() => {
        // First-run guard fails closed — skip onboarding rather than
        // re-showing it on every load when the storage is broken.
      });
  }, [ambient, prefs]);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    void prefs.markOnboardingDone();
  }, [prefs]);

  const dismiss = useCallback(() => {
    void toggleCapsuleWindow();
  }, []);

  useEffect(() => {
    let unbind: (() => Promise<void>) | null = null;
    void bindGlobalShortcut(DEFAULT_DESKTOP_SHORTCUT, () => {
      void toggleCapsuleWindow();
    })
      .then((u) => {
        unbind = u;
      })
      .catch(() => {
        // Shortcut bind already swallows internally; this catch is
        // belt-and-suspenders so a hot-reload scenario where the
        // returned promise rejects doesn't crash React's effect.
      });
    return () => {
      if (unbind) void unbind();
    };
  }, []);

  return (
    <>
      <Capsule
        ambient={ambient}
        initialSnapshot={ambient.selection.read()}
        onDismiss={dismiss}
      >
        {showOnboarding && <Onboarding onDone={dismissOnboarding} />}
      </Capsule>
    </>
  );
}
