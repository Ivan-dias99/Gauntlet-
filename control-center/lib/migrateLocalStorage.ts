// Shared legacy-key migration. Reads the canonical key first; falls
// back through `legacyKeys` in order; on a legacy hit, writes the
// value forward to canonical AND deletes every legacy key so the
// next boot does not re-migrate. Quota / private-mode write failures
// are swallowed — we still return the legacy value, just keep
// reading it next boot (strictly worse but never blocks the user).
// Removed in v1.1.0 along with the legacy `signal:*` / `ruberra:*`
// readers across the repo.

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
