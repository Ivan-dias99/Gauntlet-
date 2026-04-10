// Ruberra — Seeds
// The primordial DNA of the organism.
// Harvested from legacy Vision DNA to ensure continuity of identity.

export interface SeedCanon {
  text: string;
  scope: string;
}

export const MOTHER_LAW_SEEDS: SeedCanon[] = [
  { text: "Ruberra is one sovereign mission operating system.", scope: "mother-law" },
  { text: "The spine is a single neural event log — no disconnected sub-products.", scope: "mother-law" },
  { text: "Mission is the atomic unit — not feature, not task, not notification.", scope: "mother-law" },
  { text: "Surface law: everything visible must produce consequence or be removed.", scope: "mother-law" },
  { text: "Memory law: the system remembers — it does not reset between sessions.", scope: "mother-law" },
  { text: "Premium law: the interface is a workstation, not a consumer app.", scope: "mother-law" },
  { text: "Calm law: mineral and warm stone aesthetics — never neon, never clutter.", scope: "mother-law" },
];

export const IDENTITY_SEEDS: SeedCanon[] = [
  { text: "Ruberra IS: sovereign mission operating system, one neural spine.", scope: "identity" },
  { text: "Ruberra IS: consequence-driven, memory-bearing, anti-fragmentation.", scope: "identity" },
  { text: "Ruberra IS NOT: SaaS dashboard, generic AI wrapper, clone of task managers.", scope: "identity" },
  { text: "Ruberra CANNOT BECOME: product dependent on external tools for core intelligence.", scope: "identity" },
  { text: "Ruberra CANNOT BECOME: product that fragments operator attention.", scope: "identity" },
];

export const STACK_SEEDS: SeedCanon[] = [
  { text: "Stack 01: Canon + Sovereignty — self-validating constitutional kernel.", scope: "stack-01" },
  { text: "Stack 02: Mission Substrate — mission is the atomic unit of execution.", scope: "stack-02" },
  { text: "Stack 03: Sovereign Intelligence — model-agnostic intelligence routing.", scope: "stack-03" },
  { text: "Stack 04: Autonomous Operations — self-scheduling operational cadence.", scope: "stack-04" },
  { text: "Stack 05: Adaptive Experience — living environment reconfigures to mission phase.", scope: "stack-05" },
  { text: "Stack 07: Trust + Governance — full provenance chain for every system action.", scope: "stack-07" },
  { text: "Stack 11: Living Knowledge — living graph surfaces relevant intelligence.", scope: "stack-11" },
  { text: "Stack 20: Compound Intelligence — intelligence compounds across time and missions.", scope: "stack-20" },
];

export const ALL_SEEDS = [...MOTHER_LAW_SEEDS, ...IDENTITY_SEEDS, ...STACK_SEEDS];
