// Intent Switch Guard — smoke coverage.
//
// Standalone executable evidence for PT-BR diacritic-stripping +
// negation-prefix handling in `containsAnchor` / `findAnchorMatches`.
// The project doesn't carry vitest/jest, so this file is the
// reproducible record of the scenarios the heuristic must survive.
//
// Run:  npm run check:intent
// Exits non-zero on any failed assertion.

import { classifyIntent, type IntentClassification } from "./intentSwitchGuard";
import type { Mission } from "../spine/types";

const mission = {
  id: "m1",
  title: "App de chat em tempo real",
  projectContract: { concept: "App de chat em tempo real para equipas" },
} as unknown as Mission;

interface Case {
  label: string;
  prompt: string;
  // Exact classification expectation (anchor cases must hit a specific kind).
  expect?: IntentClassification;
  // Negation cases assert "anchor must NOT fire" — downstream classification
  // depends on overlap with the project concept and isn't guaranteed.
  expectNot?: IntentClassification;
}

const CASES: Case[] = [
  // ── Diacritic stripping (PT) — anchor must fire either way ───────────
  { label: "PT diacritic — accented 'começar do zero' triggers new_project",
    prompt: "Quero começar do zero noutra direção",
    expect: "new_project" },
  { label: "PT diacritic — unaccented 'comecar do zero' triggers new_project",
    prompt: "Quero comecar do zero noutra direcao",
    expect: "new_project" },
  { label: "PT diacritic — 'só a pensar' triggers brainstorm",
    prompt: "Estou só a pensar",
    expect: "brainstorm" },
  { label: "PT diacritic — 'so a pensar' (unaccented) triggers brainstorm",
    prompt: "Estou so a pensar",
    expect: "brainstorm" },
  { label: "PT diacritic — 'esqueçe' (cedilla typo) triggers contradiction",
    prompt: "Esqueçe isso",
    expect: "contradiction" },
  { label: "PT diacritic — 'esquece' (no cedilla) triggers contradiction",
    prompt: "Esquece isso",
    expect: "contradiction" },
  { label: "PT diacritic — 'afinal não' triggers contradiction",
    prompt: "Afinal não quero seguir esse caminho",
    expect: "contradiction" },
  { label: "PT diacritic — 'afinal nao' (no accent) triggers contradiction",
    prompt: "Afinal nao quero seguir esse caminho",
    expect: "contradiction" },

  // ── Negation prefixes — anchor must NOT fire ─────────────────────────
  { label: "PT negation — 'não esquece' suppresses contradiction",
    prompt: "Por favor não esquece os requisitos do chat",
    expectNot: "contradiction" },
  { label: "PT negation — 'nao esquece' (unaccented) suppresses contradiction",
    prompt: "Por favor nao esquece os requisitos do chat",
    expectNot: "contradiction" },
  { label: "PT negation — 'nunca ignora' suppresses contradiction",
    prompt: "Lembra-te: nunca ignora os requisitos",
    expectNot: "contradiction" },
  { label: "EN negation — \"don't ignore that\" suppresses contradiction",
    prompt: "Please don't ignore that user feedback on the chat",
    expectNot: "contradiction" },
  { label: "EN negation — \"do not forget that\" suppresses contradiction",
    prompt: "Do not forget that the chat must be real-time",
    expectNot: "contradiction" },
  { label: "EN negation — \"didn't ignore\" suppresses contradiction",
    prompt: "We didn't ignore that feedback on the chat",
    expectNot: "contradiction" },
  { label: "EN negation — curly apostrophe \"don’t ignore that\" suppresses contradiction",
    prompt: "Please don’t ignore that requirement for the chat",
    expectNot: "contradiction" },
  { label: "Mid-sentence — 'mas don't ignore that' negation still wins",
    prompt: "Aceito a mudança mas don't ignore that detail",
    expectNot: "contradiction" },

  // ── Plain anchors — must still fire without negation ─────────────────
  { label: "Plain — 'ignore that' triggers contradiction",
    prompt: "Ignore that previous decision",
    expect: "contradiction" },
  { label: "Plain — 'forget that' triggers contradiction",
    prompt: "Forget that approach, let's redo",
    expect: "contradiction" },
  { label: "Plain — 'novo projeto' triggers new_project",
    prompt: "Quero abrir um novo projeto",
    expect: "new_project" },
  { label: "Plain — 'brainstorm' triggers brainstorm",
    prompt: "Brainstorm: e se fosse uma rede social?",
    expect: "brainstorm" },
];

let failures = 0;
for (const c of CASES) {
  const v = classifyIntent(c.prompt, mission);
  let ok = true;
  let why = "";
  if (c.expect !== undefined && v.classification !== c.expect) {
    ok = false;
    why = `got ${v.classification}, expected ${c.expect}`;
  } else if (c.expectNot !== undefined && v.classification === c.expectNot) {
    ok = false;
    why = `got forbidden classification ${c.expectNot}`;
  }
  const tag = ok ? "ok " : "FAIL";
  console.log(`[${tag}] ${c.label}`);
  if (!ok) {
    failures += 1;
    console.log(`       prompt:  ${c.prompt}`);
    console.log(`       ${why}`);
    console.log(`       matched: ${JSON.stringify(v.matchedTokens)}`);
    console.log(`       reason:  ${v.reason}`);
  }
}

console.log(`\n${CASES.length - failures}/${CASES.length} cases passed`);
if (failures > 0) {
  // Throw so node exits non-zero without needing @types/node here.
  throw new Error(`${failures} of ${CASES.length} cases failed`);
}
