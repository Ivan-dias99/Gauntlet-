import { describe, expect, it } from "vitest";
import {
  parseBackendError,
  BackendError,
  isBackendError,
  isBackendUnreachable,
  BackendUnreachableError,
  apiUrl,
  UNREACHABLE_HEADER,
  UNREACHABLE_VALUE,
} from "../lib/signalApi";

function res(body: unknown, init: ResponseInit = {}) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), init);
}

describe("apiUrl", () => {
  it("prefixes paths with the base", () => {
    expect(apiUrl("/health")).toBe("/api/signal/health");
    expect(apiUrl("health")).toBe("/api/signal/health");
  });
});

describe("parseBackendError", () => {
  it("unwraps FastAPI detail envelope", async () => {
    const r = res({ detail: { error: "engine_error", reason: "Boom", message: "oh" } }, { status: 500 });
    const env = await parseBackendError(r);
    expect(env).toEqual({ error: "engine_error", reason: "Boom", message: "oh" });
  });

  it("accepts inline envelope (e.g. from stream frames)", async () => {
    const r = res({ error: "stream_truncated", reason: "NoTerminalEvent", message: "x" });
    const env = await parseBackendError(r);
    expect(env?.error).toBe("stream_truncated");
  });

  it("returns null for empty body", async () => {
    const env = await parseBackendError(res(""));
    expect(env).toBeNull();
  });

  it("returns null for non-JSON body", async () => {
    const env = await parseBackendError(res("not json"));
    expect(env).toBeNull();
  });
});

describe("BackendError", () => {
  it("is identifiable via guard", () => {
    const env = { error: "x", reason: "y", message: "z" };
    const e = new BackendError(500, env, "fallback");
    expect(isBackendError(e)).toBe(true);
    expect(e.envelope).toBe(env);
    expect(e.status).toBe(500);
  });

  it("uses fallback message when envelope missing", () => {
    const e = new BackendError(500, null, "fallback msg");
    expect(e.message).toBe("fallback msg");
  });
});

describe("BackendUnreachableError", () => {
  it("is identifiable via guard", () => {
    const e = new BackendUnreachableError("network_error");
    expect(isBackendUnreachable(e)).toBe(true);
    expect(e.kind).toBe("backend_unreachable");
    expect(e.reason).toBe("network_error");
  });
});

describe("unreachable header constants", () => {
  it("matches the contract emitted by api/_forwarder.ts", () => {
    expect(UNREACHABLE_HEADER).toBe("x-signal-backend");
    expect(UNREACHABLE_VALUE).toBe("unreachable");
  });
});
