import { describe, expect, it } from "vitest";
import { validateMissionTitle } from "../spine/validation";

describe("validateMissionTitle", () => {
  it("rejects screenshot regression: 'jhjhjj,'", () => {
    const v = validateMissionTitle("jhjhjj,");
    expect(v.ok).toBe(false);
    // Either reason locks the input out; just lock the rejection class.
    expect([
      "low_alphabet_diversity",
      "high_repeat_ratio",
      "no_vowels",
    ]).toContain(v.reason);
  });

  it("rejects too-short titles", () => {
    expect(validateMissionTitle("a").reason).toBe("too_short");
    expect(validateMissionTitle("abc").reason).toBe("too_short");
  });

  it("rejects punctuation-only", () => {
    expect(validateMissionTitle("...,,,").reason).toBe("no_letters");
  });

  it("rejects mash with high repeat ratio", () => {
    expect(validateMissionTitle("aaaaaab").reason).toBe("high_repeat_ratio");
  });

  it("rejects no-vowel keyboard mash", () => {
    const v = validateMissionTitle("kbjklq");
    expect(v.ok).toBe(false);
    // Either no_vowels or low_alphabet_diversity is acceptable; both
    // reject the input. Lock the test to the more specific one.
    expect(["no_vowels", "low_alphabet_diversity"]).toContain(v.reason);
  });

  it("accepts a real-looking objective", () => {
    expect(validateMissionTitle("escrever endpoint webhooks").ok).toBe(true);
    expect(validateMissionTitle("redesenhar fluxo de onboarding").ok).toBe(true);
  });
});
