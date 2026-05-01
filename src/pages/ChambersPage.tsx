// Wave P-39a — chambers page = thin wrapper around the existing Shell.
//
// In P-39c, Shell.tsx will be split: chamber routing/ribbon/drawer move
// here as ChambersPage internals; Shell.tsx will become a context-only
// provider mounted in App.tsx around the router. For now we keep the
// behaviour byte-identical by rendering Shell as-is.
//
// The `/chambers/:tab?` URL parameter is passed-through via a custom
// event so Shell's existing `signal:chamber` handler picks it up. This
// is a deliberate stopgap — P-39c removes it.

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Shell from "../shell/Shell";

const CHAMBER_KEYS = ["insight", "surface", "terminal", "archive", "core", "surface-final"] as const;
type ChamberKey = typeof CHAMBER_KEYS[number];

function isChamberKey(value: string | undefined): value is ChamberKey {
  return typeof value === "string" && (CHAMBER_KEYS as readonly string[]).includes(value);
}

export default function ChambersPage() {
  const { tab } = useParams<{ tab?: string }>();

  useEffect(() => {
    if (!isChamberKey(tab)) return;
    // Defer to next tick so Shell is mounted and listening.
    const id = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("signal:chamber", { detail: tab }));
    }, 0);
    return () => window.clearTimeout(id);
  }, [tab]);

  return <Shell />;
}
