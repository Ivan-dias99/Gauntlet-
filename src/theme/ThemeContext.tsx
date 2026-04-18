import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light" | "sepia";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

const VALID: Theme[] = ["dark", "light", "sepia"];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  root.setAttribute("data-theme", theme);
  setTimeout(() => root.classList.remove("theme-transitioning"), 300);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem("ruberra:theme") as Theme | null;
      return stored && VALID.includes(stored) ? stored : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("ruberra:theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () =>
    setThemeState((t) => (t === "dark" ? "light" : t === "light" ? "sepia" : "dark"));

  return (
    <Ctx.Provider value={{ theme, toggle, setTheme: setThemeState }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
