export type ChamberAccentKey = "lab" | "school" | "creation" | "profile";

export const CHAMBER_ACCENT: Record<ChamberAccentKey, string> = {
  lab: "var(--chamber-lab)",
  school: "var(--chamber-school)",
  creation: "var(--chamber-creation)",
  profile: "var(--r-pulse)",
};

export const CHAMBER_ACCENT_LIGHT: Record<ChamberAccentKey, string> = {
  lab: "var(--chamber-lab-light)",
  school: "var(--chamber-school-light)",
  creation: "var(--chamber-creation-light)",
  profile: "var(--r-rail)",
};

export const CHAMBER_LABEL: Record<ChamberAccentKey, string> = {
  lab: "Research Lab",
  school: "Technical School",
  creation: "Creation Forge",
  profile: "Sovereign Profile",
};

export const MISSION_CHAMBER_ACCENT: Record<Exclude<ChamberAccentKey, "profile">, string> = {
  lab: CHAMBER_ACCENT.lab,
  school: CHAMBER_ACCENT.school,
  creation: CHAMBER_ACCENT.creation,
};
