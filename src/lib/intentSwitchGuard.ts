// Wave B — Intent Switch Guard v1.
//
// Heuristic-only classifier. Decides whether a new prompt belongs to
// the active mission, is a refinement, a new project, brainstorm, a
// contradiction, or unclear. The chamber composers consult this on
// submit; when classification crosses a threshold of risk (new
// project, contradiction, low confidence) the chamber prompts the
// user explicitly before the message reaches the model.
//
// Per V3.1 Default 2: heuristic word-overlap on tokens of
// `Project Contract.concept` (or mission.title fallback) vs the
// inbound prompt. Token-anchors ("novo projeto", "outra ideia",
// "muda tudo") force `new_project` regardless of overlap. LLM
// classification deferred to v2 if the heuristic shows real friction.

import type { Mission } from "../spine/types";

export type IntentClassification =
  | "same_project"
  | "project_refinement"
  | "new_project"
  | "brainstorm"
  | "contradiction"
  | "unclear";

export interface IntentVerdict {
  classification: IntentClassification;
  /** 0–1: how confident the heuristic is. Below 0.5 collapses to `unclear`. */
  confidence: number;
  /** Whether the chamber should prompt the user before consuming the input. */
  requiresPrompt: boolean;
  /** Human-readable rationale for the prompt UI. */
  reason: string;
  /** Tokens that drove the decision (debug + UI evidence). */
  matchedTokens: string[];
  /** Tokens that didn't match (drift signal). */
  driftTokens: string[];
}

const NEW_PROJECT_ANCHORS = [
  "novo projeto", "novo projecto", "outra ideia", "outro projeto",
  "outro projecto", "muda tudo", "começar do zero", "nova app",
  "new project", "another idea", "different project", "start over",
  "fresh start",
];

const BRAINSTORM_ANCHORS = [
  "brainstorm", "rascunho", "ideia solta", "só a pensar", "só pensar",
  "estou a pensar", "loose idea", "just thinking", "what if",
];

const CONTRADICTION_ANCHORS = [
  "esquece", "esqueçe", "ignora", "cancela", "afinal não",
  "afinal nao", "muda de direção", "muda de direcao",
  "forget that", "ignore that", "scrap that", "actually no",
];

// Stop tokens stripped before overlap is computed — they are not
// signal in either direction.
const STOPWORDS = new Set([
  "a","o","os","as","e","ou","de","do","da","dos","das","em","no","na",
  "nos","nas","um","uma","uns","umas","para","por","que","com","sem",
  "the","of","and","or","to","in","on","at","is","it","this","that",
  "for","with","without","but","yes","no",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function containsAnchor(haystack: string, needles: string[]): boolean {
  const h = haystack.toLowerCase();
  return needles.some((n) => h.includes(n));
}

/**
 * Classify an inbound prompt against the active mission's project
 * concept. Heuristic-only (Wave 6b/V3.1 Default 2).
 */
export function classifyIntent(
  prompt: string,
  activeMission: Mission | null,
): IntentVerdict {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      classification: "unclear",
      confidence: 1,
      requiresPrompt: false,
      reason: "input vazio",
      matchedTokens: [],
      driftTokens: [],
    };
  }

  // Fresh session, no active mission — anything starts a new project.
  if (!activeMission) {
    return {
      classification: "new_project",
      confidence: 1,
      requiresPrompt: false,
      reason: "sem missão activa — input cria novo projecto",
      matchedTokens: [],
      driftTokens: [],
    };
  }

  // Anchor checks — explicit user intent overrides similarity.
  if (containsAnchor(trimmed, CONTRADICTION_ANCHORS)) {
    return {
      classification: "contradiction",
      confidence: 0.9,
      requiresPrompt: true,
      reason: "Detectei expressão de contradição — confirma se queres reverter decisão anterior.",
      matchedTokens: CONTRADICTION_ANCHORS.filter((a) => trimmed.toLowerCase().includes(a)),
      driftTokens: [],
    };
  }
  if (containsAnchor(trimmed, NEW_PROJECT_ANCHORS)) {
    return {
      classification: "new_project",
      confidence: 0.9,
      requiresPrompt: true,
      reason: "Detectei expressão de novo projecto — confirma antes de pausar o actual.",
      matchedTokens: NEW_PROJECT_ANCHORS.filter((a) => trimmed.toLowerCase().includes(a)),
      driftTokens: [],
    };
  }
  if (containsAnchor(trimmed, BRAINSTORM_ANCHORS)) {
    return {
      classification: "brainstorm",
      confidence: 0.85,
      requiresPrompt: true,
      reason: "Pareces estar em brainstorm — guardo isto sem afectar o projecto activo?",
      matchedTokens: BRAINSTORM_ANCHORS.filter((a) => trimmed.toLowerCase().includes(a)),
      driftTokens: [],
    };
  }

  // Word-overlap against project concept.
  const concept =
    activeMission.projectContract?.concept?.trim() ||
    activeMission.title.trim();
  if (!concept) {
    return {
      classification: "unclear",
      confidence: 0.4,
      requiresPrompt: true,
      reason: "Missão activa sem conceito definido — não sei comparar.",
      matchedTokens: [],
      driftTokens: [],
    };
  }

  const promptTokens = new Set(tokenize(trimmed));
  const conceptTokens = new Set(tokenize(concept));
  if (promptTokens.size === 0 || conceptTokens.size === 0) {
    return {
      classification: "unclear",
      confidence: 0.3,
      requiresPrompt: true,
      reason: "Material insuficiente para classificar.",
      matchedTokens: [],
      driftTokens: [],
    };
  }

  const intersection = new Set<string>();
  for (const t of promptTokens) if (conceptTokens.has(t)) intersection.add(t);
  const drift = new Set<string>();
  for (const t of promptTokens) if (!conceptTokens.has(t)) drift.add(t);

  const overlap = intersection.size / promptTokens.size;
  const matchedTokens = [...intersection];
  const driftTokens = [...drift].slice(0, 8);

  if (overlap >= 0.7) {
    return {
      classification: "project_refinement",
      confidence: overlap,
      requiresPrompt: false,
      reason: "alinhamento alto com o conceito — refinamento",
      matchedTokens,
      driftTokens,
    };
  }
  if (overlap >= 0.3) {
    return {
      classification: "same_project",
      confidence: overlap,
      requiresPrompt: false,
      reason: "alinhamento médio — continua no projecto",
      matchedTokens,
      driftTokens,
    };
  }
  // Below 0.3 → unclear; force prompt.
  return {
    classification: "unclear",
    confidence: 1 - overlap,
    requiresPrompt: true,
    reason: "Pouca sobreposição com o conceito actual — confirmar antes de avançar.",
    matchedTokens,
    driftTokens,
  };
}
