// Wave 2-4 — shared compose flow as a hook so each canvas (Compose,
// Code, Apply) reuses the context → intent → preview → apply pipeline
// without duplicating state machinery. Wave 1's ComposeCanvas inlined
// this; this hook lifts it out.
//
// Usage:
//   const { state, compose, apply, reset } = useComposeFlow();
//   compose(userInput);                  // runs context+intent+preview
//   apply(true);                          // approve; apply(false) rejects
//
// The hook owns the ComposeState machine. Renderers decide how to
// surface intent/preview/apply differently — Code renders artifacts as
// diff, Apply renders files_impacted as a tree, Compose renders raw text.

import { useCallback, useState } from "react";
import { runCompose, applyPreview } from "./composerClient";
import type { ComposeState, ContextSource } from "./types";
import { isBackendUnreachable } from "../lib/signalApi";

export interface UseComposeFlow {
  state: ComposeState;
  compose: (userInput: string, source?: ContextSource) => Promise<void>;
  apply: (approved: boolean) => Promise<void>;
  reset: () => void;
}

export function useComposeFlow(): UseComposeFlow {
  const [state, setState] = useState<ComposeState>({ kind: "idle" });

  const compose = useCallback(
    async (userInput: string, source: ContextSource = "control_center") => {
      const trimmed = userInput.trim();
      if (!trimmed) return;
      setState({ kind: "submitting" });
      try {
        const { intent, preview } = await runCompose({ userInput: trimmed, source });
        setState({ kind: "preview_ready", intent, preview });
      } catch (err) {
        if (isBackendUnreachable(err)) {
          setState({ kind: "error", message: err.message, reason: err.reason });
        } else {
          setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
        }
      }
    },
    [],
  );

  const apply = useCallback(async (approved: boolean) => {
    setState((prev) => {
      if (prev.kind !== "preview_ready") return prev;
      // Defer the network call to the next microtask so we still see the
      // submitting state during the apply round-trip.
      const previewSnapshot = prev.preview;
      const intentSnapshot = prev.intent;
      void applyPreview({
        preview_id: previewSnapshot.preview_id,
        approved,
        approval_reason: approved ? "operator_approved" : "operator_rejected",
      })
        .then((res) => {
          setState(
            approved
              ? { kind: "applied", preview: previewSnapshot, apply: res }
              : { kind: "intent_ready", intent: intentSnapshot },
          );
        })
        .catch((err: unknown) => {
          setState({ kind: "error", message: err instanceof Error ? err.message : String(err) });
        });
      return { kind: "submitting" };
    });
  }, []);

  const reset = useCallback(() => setState({ kind: "idle" }), []);

  return { state, compose, apply, reset };
}
