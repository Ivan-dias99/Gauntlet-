// Ruberra — Single chamber IA order for shell, work rail, and ritual entry.
// Prevents silent drift between topbar glyphs and left-rail regimes.

export type ChamberId = "school" | "creation" | "lab" | "memory";

/** Canonical visual / navigation order (topbar, WorkNavRail, entry picker). */
export const CHAMBER_ORDER: readonly ChamberId[] = [
  "school",
  "creation",
  "lab",
  "memory",
];

export const CHAMBER_SHELL: Record<
  ChamberId,
  { label: string; gravity: string; short: string }
> = {
  school: { label: "School", gravity: "truth", short: "School" },
  creation: { label: "Creation", gravity: "forge", short: "Forge" },
  lab: { label: "Lab", gravity: "validation", short: "Lab" },
  memory: { label: "Memory", gravity: "substrate", short: "Memory" },
};

/** Ritual entry: signal line + one-line body (distinct from shell gravity bar). */
export const CHAMBER_ENTRY: Record<ChamberId, { signal: string; body: string }> = {
  school: {
    signal: "truth",
    body: "mission canon, doctrine pressure, hardened law",
  },
  creation: {
    signal: "forge",
    body: "directive composition, blueprint pressure, artifact review",
  },
  lab: {
    signal: "validation",
    body: "execution trace, contradiction field, evidence capture",
  },
  memory: {
    signal: "substrate",
    body: "resonance, retained consequence, organism recall",
  },
};

export function chambersForShell(): Array<{
  id: ChamberId;
  label: string;
  gravity: string;
}> {
  return CHAMBER_ORDER.map((id) => ({
    id,
    label: CHAMBER_SHELL[id].label,
    gravity: CHAMBER_SHELL[id].gravity,
  }));
}

export function chambersForWorkNav(): Array<{
  id: ChamberId;
  label: string;
  short: string;
  gravity: string;
}> {
  return CHAMBER_ORDER.map((id) => ({
    id,
    label: CHAMBER_SHELL[id].label,
    short: CHAMBER_SHELL[id].short,
    gravity: CHAMBER_SHELL[id].gravity,
  }));
}

export function chambersForRitualEntry(): Array<{
  id: ChamberId;
  title: string;
  signal: string;
  body: string;
}> {
  return CHAMBER_ORDER.map((id) => ({
    id,
    title: CHAMBER_SHELL[id].label,
    signal: CHAMBER_ENTRY[id].signal,
    body: CHAMBER_ENTRY[id].body,
  }));
}
