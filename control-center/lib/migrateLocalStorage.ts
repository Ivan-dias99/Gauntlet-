// Shared legacy-key migration for control-center stores. Two
// near-identical loops lived in TweaksContext.tsx and spine/store.ts —
// audit P2 flagged the drift risk (when v1.1.0 deletes the legacy
// reads we'd be touching two files instead of one). Single seam now;
// callers pass the canonical key + the list of legacy keys to try.
//
// Behaviour:
//   1. Read the canonical key. If a value is present, return it.
//   2. Else try each legacy key in order. The first hit wins.
//   3. Hit found → write the value under the canonical key AND
//      delete every legacy key (the next boot does not re-migrate).
//      Quota / private-mode failures during the write are swallowed
//      (we still loaded the legacy value, just keep reading it next
//      boot — strictly worse but never blocks the user).
//   4. No canonical and no legacy hit → return null.

export function readWithLegacyMigration(
  canonicalKey: string,
  legacyKeys: readonly string[],
): string | null {
  try {
    const canonical = localStorage.getItem(canonicalKey);
    if (canonical !== null) return canonical;
    for (const key of legacyKeys) {
      const legacy = localStorage.getItem(key);
      if (legacy !== null) {
        try {
          localStorage.setItem(canonicalKey, legacy);
          for (const k of legacyKeys) localStorage.removeItem(k);
        } catch {
          // Migration write failed (quota, private-mode, blocked) —
          // fine; we still return the legacy value to the caller.
        }
        return legacy;
      }
    }
    return null;
  } catch {
    // localStorage entirely blocked (sandboxed iframe with storage
    // disabled, etc) — caller falls back to its defaults.
    return null;
  }
}
