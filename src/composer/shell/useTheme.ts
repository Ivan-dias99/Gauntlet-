// Sprint 3 — Studio theme controller.
//
// Persists the operator's premium-mode preference in localStorage and
// reflects it as data-theme on <html>. Used by SidebarNav's footer
// toggle. Default is "dark" — matches the canonical studio palette.

import { useEffect, useState } from "react";

export type StudioTheme = "dark" | "light";

const STORAGE_KEY = "ruberra:studio:theme";

function readInitial(): StudioTheme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "dark";
}

function applyTheme(theme: StudioTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme(): {
  theme: StudioTheme;
  setTheme: (t: StudioTheme) => void;
  toggle: () => void;
} {
  const [theme, setThemeState] = useState<StudioTheme>(() => readInitial());

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be blocked; theme still applies for the session.
    }
  }, [theme]);

  return {
    theme,
    setTheme: setThemeState,
    toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
  };
}
