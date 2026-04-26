// Mission shape validator — Task 2 (Claude Code list).
//
// Stops nonsense like "jhjhjj," from becoming an active mission.
// Cheap, deterministic, locale-agnostic. Pure additive on canon —
// no canonical file is modified by this module's existence.
//
// Rules:
//   1. Trim length must be >= MIN_LEN.
//   2. Must contain at least one alphabetic character.
//   3. Repeated-character ratio must stay below MAX_REPEAT_RATIO
//      (defends against jhjhjj, asdfasdf,, kkkkkk).
//   4. Must contain at least one vowel (Latin set).
//   5. Distinct-letter floor — for >=6-char strings, < 4 distinct
//      letters means mash, not intent.

export type MissionRejectionReason =
  | "too_short"
  | "no_letters"
  | "no_vowels"
  | "low_alphabet_diversity"
  | "high_repeat_ratio"
  | "punctuation_only";

export interface MissionVerdict {
  ok: boolean;
  reason: MissionRejectionReason | null;
}

const MIN_LEN = 6;
const MAX_REPEAT_RATIO = 0.55;
const MIN_DISTINCT_LETTERS = 4;

const VOWELS = new Set([
  "a", "e", "i", "o", "u",
  "á", "é", "í", "ó", "ú",
  "à", "è", "ì", "ò", "ù",
  "â", "ê", "î", "ô", "û",
  "ã", "õ", "ä", "ë", "ï", "ö", "ü", "ç",
]);

function letterRun(s: string): string[] {
  return Array.from(s).filter((c) => /\p{L}/u.test(c));
}

export function validateMissionTitle(raw: string): MissionVerdict {
  const trimmed = (raw ?? "").trim();
  if (trimmed.length < MIN_LEN) return { ok: false, reason: "too_short" };

  const letters = letterRun(trimmed);
  if (letters.length === 0) return { ok: false, reason: "no_letters" };

  if (!/\p{L}|\p{N}/u.test(trimmed)) {
    return { ok: false, reason: "punctuation_only" };
  }

  const counts = new Map<string, number>();
  for (const ch of letters) {
    const k = ch.toLocaleLowerCase("pt-BR");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const maxCount = Math.max(...counts.values());
  if (maxCount / letters.length > MAX_REPEAT_RATIO) {
    return { ok: false, reason: "high_repeat_ratio" };
  }

  if (letters.length >= MIN_LEN && counts.size < MIN_DISTINCT_LETTERS) {
    return { ok: false, reason: "low_alphabet_diversity" };
  }

  const lower = trimmed.toLocaleLowerCase("pt-BR");
  let hasVowel = false;
  for (const ch of lower) {
    if (VOWELS.has(ch)) {
      hasVowel = true;
      break;
    }
  }
  if (!hasVowel) return { ok: false, reason: "no_vowels" };

  return { ok: true, reason: null };
}

export function explainMissionRejection(
  reason: MissionRejectionReason,
): string {
  switch (reason) {
    case "too_short":
      return "missão demasiado curta — declara um objectivo real";
    case "no_letters":
      return "missão precisa de letras, não só símbolos";
    case "no_vowels":
      return "parece teclado batido — sem vogais reais";
    case "low_alphabet_diversity":
      return "poucas letras distintas — declara o objecto da missão";
    case "high_repeat_ratio":
      return "demasiada repetição — não é uma intenção";
    case "punctuation_only":
      return "só pontuação — declara o objectivo em palavras";
  }
}
