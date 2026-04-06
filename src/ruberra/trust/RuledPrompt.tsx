// Ruberra — RuledPrompt
// Sovereign replacement for native prompt() / confirm().
// Imperative async API. No auto-dismiss. User action required.
// Uses @radix-ui/react-dialog (already in deps).

import * as Dialog from "@radix-ui/react-dialog";
import { createContext, useContext, useState, useCallback, useRef } from "react";

type PromptKind = "ask" | "confirm";
type Severity = "normal" | "destructive";

interface PendingPrompt {
  id: string;
  kind: PromptKind;
  question: string;
  label?: string;
  severity?: Severity;
  resolve: (value: string | null | boolean) => void;
}

interface RuledPromptContextValue {
  enqueue: (p: Omit<PendingPrompt, "id">) => void;
}

const RuledPromptContext = createContext<RuledPromptContextValue | null>(null);

let _enqueue: ((p: Omit<PendingPrompt, "id">) => void) | null = null;

function imperativeAsk(
  question: string,
  opts: { label?: string } = {},
): Promise<string | null> {
  if (!_enqueue) throw new Error("RuledPromptHost not mounted");
  return new Promise((resolve) => {
    _enqueue!({ kind: "ask", question, label: opts.label, resolve });
  });
}

function imperativeConfirm(
  question: string,
  opts: { severity?: Severity } = {},
): Promise<boolean> {
  if (!_enqueue) throw new Error("RuledPromptHost not mounted");
  return new Promise((resolve) => {
    _enqueue!({
      kind: "confirm",
      question,
      severity: opts.severity ?? "normal",
      resolve,
    });
  });
}

// Exported imperative API — use instead of prompt() / confirm()
export const RuledPrompt = {
  ask: imperativeAsk,
  confirm: imperativeConfirm,
};

// Render this once in RuberraApp root
export function RuledPromptHost() {
  const [queue, setQueue] = useState<PendingPrompt[]>([]);
  const [inputValue, setInputValue] = useState("");
  const counterRef = useRef(0);

  const enqueue = useCallback((p: Omit<PendingPrompt, "id">) => {
    const id = `rp-${++counterRef.current}`;
    setQueue((q) => [...q, { ...p, id }]);
    setInputValue("");
  }, []);

  // Wire imperative API to this host
  _enqueue = enqueue;

  const current = queue[0] ?? null;

  function resolve(value: string | null | boolean) {
    current?.resolve(value);
    setQueue((q) => q.slice(1));
    setInputValue("");
  }

  function handleConfirm() {
    if (!current) return;
    if (current.kind === "ask") {
      resolve(inputValue.trim() || null);
    } else {
      resolve(true);
    }
  }

  function handleCancel() {
    if (!current) return;
    resolve(current.kind === "ask" ? null : false);
  }

  const isDestructive = current?.severity === "destructive";

  return (
    <RuledPromptContext.Provider value={{ enqueue }}>
      <Dialog.Root open={!!current}>
        <Dialog.Portal>
          <Dialog.Overlay
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
            }}
          />
          <Dialog.Content
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 201,
              background: "var(--rb-bg-elev)",
              border: `1px solid ${isDestructive ? "var(--rb-bad)" : "var(--rb-line-strong)"}`,
              padding: "28px 32px",
              width: 420,
              maxWidth: "calc(100vw - 40px)",
              outline: "none",
            }}
            onEscapeKeyDown={handleCancel}
            onInteractOutside={(e) => e.preventDefault()}
          >
            {isDestructive && (
              <div
                style={{
                  fontFamily: "var(--rb-mono)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--rb-bad)",
                  marginBottom: 10,
                }}
              >
                destructive · confirmation required
              </div>
            )}
            <Dialog.Title
              style={{
                fontFamily: "var(--rb-serif)",
                fontSize: 18,
                fontWeight: 400,
                color: "var(--rb-ink)",
                margin: "0 0 16px 0",
                letterSpacing: "0.04em",
              }}
            >
              {current?.question}
            </Dialog.Title>

            {current?.kind === "ask" && (
              <input
                className="rb-input"
                autoFocus
                placeholder={current.label ?? "enter response…"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirm();
                  // Escape is handled by Dialog.Content onEscapeKeyDown — no duplicate here
                }}
                style={{ marginBottom: 16 }}
              />
            )}

            <div className="rb-row" style={{ justifyContent: "flex-end", gap: 8 }}>
              <button className="rb-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className={`rb-btn ${isDestructive ? "" : "primary"}`}
                style={
                  isDestructive
                    ? {
                        borderColor: "var(--rb-bad)",
                        color: "var(--rb-bad)",
                      }
                    : {}
                }
                onClick={handleConfirm}
                disabled={current?.kind === "ask" && !inputValue.trim()}
              >
                {current?.kind === "confirm"
                  ? isDestructive
                    ? "Confirm destructive"
                    : "Confirm"
                  : "Submit"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </RuledPromptContext.Provider>
  );
}
