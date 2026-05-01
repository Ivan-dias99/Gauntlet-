import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "light" | "sepia";
export type Mono = "jetbrains" | "ibm";
export type Sans = "inter" | "plex" | "system";
// Wave P-37 — Density renamed cosy/comfortable/compact and now drives a
// container-aware --density-scale (1.0 / 0.875 / 0.75) on
// :root[data-density]. The legacy --density multiplier is still emitted
// for back-compat with chamber padding rules authored against it; new
// rules should use --density-scale instead.
export type Density = "cosy" | "comfortable" | "compact";
export type AccentKey = "bone" | "ember" | "ox" | "moss" | "gold" | "iris";
export type Lang = "pt" | "en";

export interface Tweaks {
  theme: Theme;
  mono: Mono;
  sans: Sans;
  density: Density;
  accent: AccentKey;
  lang: Lang;
}

const DEFAULTS: Tweaks = {
  theme: "dark",
  mono: "jetbrains",
  sans: "inter",
  density: "comfortable",
  accent: "bone",
  lang: "pt",
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

// Wave P-37 — Two scales side by side.
//   DENS         legacy multiplier (old comfortable=1 baseline). Kept so
//                CSS rules already using calc(... * var(--density, 1))
//                still resolve to the same visual result. cosy maps to
//                the old "spacious" coefficient so existing designs that
//                read fine at spacious also read fine at cosy.
//   DENS_SCALE   new --density-scale per the wave spec
//                (cosy 1.0, comfortable 0.875, compact 0.75). Authored
//                so the *new* rules in tokens.css can scale typography
//                and container padding via --density-scale without
//                disturbing existing margins.
const DENS: Record<Density, number> = { cosy: 1.14, comfortable: 1, compact: 0.88 };
const DENS_SCALE: Record<Density, number> = { cosy: 1.0, comfortable: 0.875, compact: 0.75 };

// Wave P-37 — Cycle order for the ribbon density toggle:
//   cosy → comfortable → compact → cosy.
export const DENSITY_CYCLE: Density[] = ["cosy", "comfortable", "compact"];

// Plain-language label per density. Used by the ribbon button's aria-label
// and title attributes; UI segmenteds in Core/System.tsx ship their own
// label list because they can be longer.
export const DENSITY_LABEL: Record<Density, string> = {
  cosy: "cosy",
  comfortable: "comfortable",
  compact: "compact",
};

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
  // Wave P-37 — One-tap density cycling for the ribbon icon button.
  cycleDensity: () => void;
  reset: () => void;
}

const Ctx = createContext<TweaksCtx>({
  values: DEFAULTS,
  set: () => {},
  setMany: () => {},
  cycleTheme: () => {},
  cycleDensity: () => {},
  reset: () => {},
});

// Wave-0 rename: signal:tweaks is canonical; ruberra:tweaks is read as a
// silent legacy fallback so existing users keep their theme / density /
// layout preferences across the rename. Writes always target the new key;
// the legacy key is left in place until Wave 8.
const STORAGE_KEY = "signal:tweaks";
const LEGACY_STORAGE_KEY = "ruberra:tweaks";

function load(): Tweaks {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Omit<Tweaks, "density">> & { density?: string };
    // Wave P-37 — migrate legacy density vocabulary (compact/comfortable/
    // spacious) to the new triple (cosy/comfortable/compact). Map
    // spacious → cosy so users don't suddenly see a tighter shell on
    // boot. Unknown values fall back to comfortable (the default),
    // which is the safe middle option.
    let density: Density = DEFAULTS.density;
    const rawDensity = parsed.density;
    if (rawDensity === "spacious") density = "cosy";
    else if (rawDensity === "cosy" || rawDensity === "comfortable" || rawDensity === "compact") {
      density = rawDensity;
    }
    return { ...DEFAULTS, ...parsed, density };
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
  // Wave P-37 — Container-aware scale + attribute selector. The CSS
  // tokens layer reads :root[data-density="..."] so chambers can layer
  // density-specific rules without going through the JS provider, and
  // --density-scale exposes the typography/padding multiplier in the
  // cascade for any new calc() that wants to scale uniformly.
  root.setAttribute("data-density", v.density);
  root.style.setProperty("--density-scale", String(DENS_SCALE[v.density] ?? 1));

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (e) {
      console.warn("[tweaks] localStorage.setItem failed — settings not persisted:", e);
    }
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

  const cycleDensity = () =>
    setValues((prev) => {
      const idx = DENSITY_CYCLE.indexOf(prev.density);
      const next = DENSITY_CYCLE[(idx + 1) % DENSITY_CYCLE.length];
      return { ...prev, density: next };
    });

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("[tweaks] localStorage.removeItem failed:", e);
    }
    setValues(DEFAULTS);
  };

  return (
    <Ctx.Provider value={{ values, set, setMany, cycleTheme, cycleDensity, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTweaks() {
  return useContext(Ctx);
}
