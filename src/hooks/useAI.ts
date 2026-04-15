import { useState, useCallback } from "react";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAI() {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (
    systemPrompt: string,
    messages: AIMessage[],
    onChunk: (text: string) => void,
    onDone: () => void,
  ) => {
    setStreaming(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, messages }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`API ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            onDone();
            setStreaming(false);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) onChunk(parsed.text);
          } catch (e) {
            if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
              throw e;
            }
          }
        }
      }

      onDone();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(msg);
      onDone();
    } finally {
      setStreaming(false);
    }
  }, []);

  return { send, streaming, error };
}
