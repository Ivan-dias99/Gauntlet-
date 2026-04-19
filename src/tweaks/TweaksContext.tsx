import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "light" | "sepia";
export type Mono = "jetbrains" | "ibm";
export type Sans = "inter" | "plex" | "system";
export type Density = "compact" | "comfortable" | "spacious";
export type AccentKey = "bone" | "ember" | "ox" | "moss" | "gold" | "iris";
export type Lang = "pt" | "en";

export type LabLayout = "chat";
export type CreationLayout = "terminal" | "kanban";
export type MemoryLayout = "log" | "timeline";
export type SchoolLayout = "numbered" | "tablets";

export interface Tweaks {
  theme: Theme;
  mono: Mono;
  sans: Sans;
  density: Density;
  accent: AccentKey;
  lang: Lang;
  labLayout: LabLayout;
  creationLayout: CreationLayout;
  memoryLayout: MemoryLayout;
  schoolLayout: SchoolLayout;
}

const DEFAULTS: Tweaks = {
  theme: "dark",
  mono: "jetbrains",
  sans: "inter",
  density: "comfortable",
  accent: "bone",
  lang: "pt",
  labLayout: "chat",
  creationLayout: "terminal",
  memoryLayout: "log",
  schoolLayout: "numbered",
};

interface AccentTriple {
  dark: string; light: string; sepia: string;
  dim_dark: string; dim_light: string; dim_sepia: string;
}

const ACCENTS: Record<AccentKey, AccentTriple> = {
  bone:  { dark: "#e8c49a", light: "#7a5a3a", sepia: "#e8a860", dim_dark: "#8a7355", dim_light: "#b8a890", dim_sepia: "#8a6030" },
  ember: { dark: "#d48860", light: "#a24820", sepia: "#e88860", dim_dark: "#8a5038", dim_light: "#c08a6a", dim_sepia: "#8a5030" },
  ox:    { dark: "#c45040", light: "#8a2818", sepia: "#d85040", dim_dark: "#7a3028", dim_light: "#b07060", dim_sepia: "#8a3020" },
  moss:  { dark: "#9ab080", light: "#506830", sepia: "#a0b070", dim_dark: "#60704a", dim_light: "#98a888", dim_sepia: "#607040" },
  gold:  { dark: "#e8c060", light: "#8a6818", sepia: "#f0c060", dim_dark: "#8a6a30", dim_light: "#b59858", dim_sepia: "#8a6020" },
  iris:  { dark: "#a0afd0", light: "#3a4c70", sepia: "#a0b0d0", dim_dark: "#60708c", dim_light: "#8a9ac0", dim_sepia: "#506080" },
};

const DENS: Record<Density, number> = { compact: 0.88, comfortable: 1, spacious: 1.14 };

export const ACCENT_SWATCHES: { key: AccentKey; color: string }[] = [
  { key: "bone",  color: "#c4b89a" },
  { key: "ember", color: "#c47a5a" },
  { key: "ox",    color: "#b04a3c" },
  { key: "moss",  color: "#8aa070" },
  { key: "gold",  color: "#e8b050" },
  { key: "iris",  color: "#8a9ac4" },
];

interface TweaksCtx {
  values: Tweaks;
  set: <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => void;
  setMany: (patch: Partial<Tweaks>) => void;
  cycleTheme: () => void;
  reset: () => void;
}

const Ctx = createContext<TweaksCtx>({
  values: DEFAULTS,
  set: () => {},
  setMany: () => {},
  cycleTheme: () => {},
  reset: () => {},
});

const STORAGE_KEY = "ruberra:tweaks";

function load(): Tweaks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Tweaks>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function apply(v: Tweaks) {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  root.setAttribute("data-theme", v.theme);

  const a = ACCENTS[v.accent] ?? ACCENTS.bone;
  const bucket = v.theme;
  const dimKey = ("dim_" + bucket) as "dim_dark" | "dim_light" | "dim_sepia";
  const accent = a[bucket];
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-dim", a[dimKey]);
  root.style.setProperty("--accent-glow", `color-mix(in oklab, ${accent} 10%, transparent)`);
  root.style.setProperty("--density", String(DENS[v.density] ?? 1));

  document.body.className = [
    v.mono === "ibm" ? "mono-ibm" : "",
    v.sans === "plex" ? "sans-plex" : v.sans === "system" ? "sans-sys" : "",
  ].filter(Boolean).join(" ");

  document.documentElement.lang = v.lang === "en" ? "en" : "pt-BR";

  setTimeout(() => root.classList.remove("theme-transitioning"), 300);
}

export function TweaksProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Tweaks>(() => load());

  useEffect(() => {
    apply(values);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch {}
  }, [values]);

  const set = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const setMany = (patch: Partial<Tweaks>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const cycleTheme = () =>
    setValues((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : prev.theme === "light" ? "sepia" : "dark",
    }));

  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setValues(DEFAULTS);
  };

  return <Ctx.Provider value={{ values, set, setMany, cycleTheme, reset }}>{children}</Ctx.Provider>;
}

export function useTweaks() {
  return useContext(Ctx);
}
