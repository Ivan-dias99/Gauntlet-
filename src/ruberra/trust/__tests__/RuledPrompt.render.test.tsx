// @vitest-environment happy-dom
// Ruberra — RuledPrompt render tests
//
// Proves the sovereign modal renders correctly:
//   - Host mounts without crash
//   - ask() produces a dialog with input
//   - confirm() produces a dialog with confirmation button
//   - Destructive confirm shows severity indicator
//   - Cancel resolves to null/false
//   - Confirm returns true on confirm click

import "@testing-library/jest-dom";
import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { RuledPrompt, RuledPromptHost } from "../RuledPrompt";

function renderHost() {
  return render(<RuledPromptHost />);
}

describe("RuledPromptHost — idle state", () => {
  it("mounts without crash and shows no dialog", () => {
    renderHost();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("RuledPrompt.ask()", () => {
  it("opens a dialog with the question text", async () => {
    renderHost();
    let promise: Promise<string | null>;
    act(() => {
      promise = RuledPrompt.ask("What is the scope?");
    });
    await waitFor(() => expect(screen.getByText("What is the scope?")).toBeInTheDocument());
    // Dismiss via cancel
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    });
    expect(await promise!).toBeNull();
  });

  it("Submit button is disabled when input is empty", async () => {
    renderHost();
    act(() => { RuledPrompt.ask("Enter reason:"); });
    await waitFor(() => screen.getByText("Enter reason:"));
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    });
  });

  it("returns entered text on Submit", async () => {
    renderHost();
    let promise: Promise<string | null>;
    act(() => {
      promise = RuledPrompt.ask("Reason:", { label: "reason" });
    });
    await waitFor(() => screen.getByPlaceholderText("reason"));
    await act(async () => {
      const input = screen.getByPlaceholderText("reason");
      fireEvent.change(input, { target: { value: "test reason" } });
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    });
    expect(await promise!).toBe("test reason");
  });
});

describe("RuledPrompt.confirm()", () => {
  it("opens a dialog with confirm button", async () => {
    renderHost();
    let promise: Promise<boolean>;
    act(() => { promise = RuledPrompt.confirm("Are you sure?"); });
    await waitFor(() => screen.getByText("Are you sure?"));
    const confirmBtn = screen.getByRole("button", { name: /^confirm$/i });
    expect(confirmBtn).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    });
    expect(await promise!).toBe(false);
  });

  it("destructive confirm shows severity marker and destructive button text", async () => {
    renderHost();
    let promise: Promise<boolean>;
    act(() => { promise = RuledPrompt.confirm("Delete everything?", { severity: "destructive" }); });
    await waitFor(() => screen.getByText("Delete everything?"));
    // Severity label (the marker div, not the button)
    expect(screen.getByText(/destructive · confirmation required/i)).toBeInTheDocument();
    // Confirm button says "Confirm destructive"
    expect(screen.getByRole("button", { name: /confirm destructive/i })).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    });
    expect(await promise!).toBe(false);
  });

  it("confirm returns true on confirm click", async () => {
    renderHost();
    let promise: Promise<boolean>;
    act(() => { promise = RuledPrompt.confirm("Proceed?"); });
    await waitFor(() => screen.getByText("Proceed?"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^confirm$/i }));
    });
    expect(await promise!).toBe(true);
  });
});
