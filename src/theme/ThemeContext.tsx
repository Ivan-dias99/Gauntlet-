import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

const DARK: Record<string, string> = {
  "--bg":             "#0b0a09",
  "--bg-surface":     "#141210",
  "--bg-elevated":    "#1c1a18",
  "--bg-input":       "#0f0e0d",
  "--border":         "#252220",
  "--border-subtle":  "#1e1c1a",
  "--text-primary":   "#f0ece6",
  "--text-secondary": "#908070",
  "--text-muted":     "#4a4540",
  "--text-ghost":     "#302d2a",
  "--accent":         "#c4b89a",
  "--accent-dim":     "#7a6e5a",
  "--accent-glow":    "rgba(196,184,154,0.07)",
  "--terminal-ok":    "#5a8a5a",
  "--terminal-warn":  "#c4a840",
  "--shadow-sm":      "0 1px 4px rgba(0,0,0,0.45)",
  "--shadow-md":      "0 6px 24px rgba(0,0,0,0.55)",
  "--radius":         "4px",
  "--mono":           '"JetBrains Mono","Fira Code","Cascadia Code",ui-monospace,monospace',
  "--sans":           'system-ui,-apple-system,sans-serif',
};

const LIGHT: Record<string, string> = {
  "--bg":             "#eeeae2",
  "--bg-surface":     "#f5f2ec",
  "--bg-elevated":    "#fefcf8",
  "--bg-input":       "#f0ede7",
  "--border":         "#d8d3c8",
  "--border-subtle":  "#e5e0d8",
  "--text-primary":   "#1c1a16",
  "--text-secondary": "#6a6258",
  "--text-muted":     "#a09888",
  "--text-ghost":     "#c4bdb2",
  "--accent":         "#7a6e5a",
  "--accent-dim":     "#b0a898",
  "--accent-glow":    "rgba(122,110,90,0.06)",
  "--terminal-ok":    "#2a6a2a",
  "--terminal-warn":  "#8a6a20",
  "--shadow-sm":      "0 1px 4px rgba(0,0,0,0.06)",
  "--shadow-md":      "0 6px 24px rgba(0,0,0,0.10)",
  "--radius":         "4px",
  "--mono":           '"JetBrains Mono","Fira Code","Cascadia Code",ui-monospace,monospace',
  "--sans":           'system-ui,-apple-system,sans-serif',
};

function applyTheme(theme: Theme) {
  const tokens = theme === "dark" ? DARK : LIGHT;
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute("data-theme", theme);
  setTimeout(() => root.classList.remove("theme-transitioning"), 300);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try { return (localStorage.getItem("ruberra:theme") as Theme) ?? "dark"; }
    catch { return "dark"; }
  });

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem("ruberra:theme", theme); } catch {}
  }, [theme]);

  useEffect(() => { applyTheme(theme); }, []);

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() { return useContext(Ctx); }
