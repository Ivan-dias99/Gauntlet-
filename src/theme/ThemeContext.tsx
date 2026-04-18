import { ReactNode } from "react";
import { TweaksProvider, useTweaks, Theme } from "../tweaks/TweaksContext";

export type { Theme };

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <TweaksProvider>{children}</TweaksProvider>;
}

export function useTheme() {
  const { values, cycleTheme, set } = useTweaks();
  return {
    theme: values.theme,
    toggle: cycleTheme,
    setTheme: (t: Theme) => set("theme", t),
  };
}
