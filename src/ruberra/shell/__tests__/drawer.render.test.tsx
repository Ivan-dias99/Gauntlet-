// @vitest-environment happy-dom
// Ruberra — Narrow-width drawer seal tests
//
// Proves the Shell drawer/rail behavior that was previously a manual check:
//   - Toggle buttons exist in topbar
//   - Clicking threads toggle opens left rail (rb-rail--open)
//   - Clicking canon toggle opens right rail (rb-rail--open)
//   - Only one rail is open at a time (mutual exclusion)
//   - Clicking the backdrop closes the active rail
//   - Pressing Escape closes any open rail
//   - Backdrop gets active class only when a rail is open

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import type { Projection } from "../../spine/projections";

const boundProjection: Projection = {
  repos: [{ id: "test-repo", name: "test-repo", boundAt: Date.now() }],
  threads: [],
  concepts: [],
  directives: [],
  memory: [],
  executions: [],
  artifacts: [],
  canon: [],
  canonProposals: [],
  contradictions: [],
  syntheses: [],
  drafts: [],
  pioneers: [],
  proposals: [],
  flows: [],
  agents: [],
  assignments: [],
  handoffs: [],
  endorsements: [],
  chamber: "creation",
  missionFramed: true,
  activeRepo: "test-repo",
  activeThread: undefined,
  lastEventId: undefined,
};

vi.mock("../../spine/store", () => ({
  useProjection: () => boundProjection,
  emit: {
    bindRepo: vi.fn(),
    enterChamber: vi.fn(),
    openThread: vi.fn(),
    activateThread: vi.fn(),
    closeThread: vi.fn(),
    archiveThread: vi.fn(),
    acceptDirective: vi.fn(),
    rejectDirective: vi.fn(),
    captureMemory: vi.fn(),
    promoteMemory: vi.fn(),
    elevateMemory: vi.fn(),
    revokeMemory: vi.fn(),
    proposeCanon: vi.fn(),
    hardenCanon: vi.fn(),
    frameMission: vi.fn(),
    revokeCanon: vi.fn(),
    startExecution: vi.fn(),
    succeedExecution: vi.fn(),
    failExecution: vi.fn(),
    retryExecution: vi.fn(),
    generateArtifact: vi.fn(),
    reviewArtifact: vi.fn(),
    commitArtifact: vi.fn(),
    detectContradiction: vi.fn(),
    resolveContradiction: vi.fn(),
    synthesizeKnowledge: vi.fn(),
    draftDirective: vi.fn(),
    assignPioneer: vi.fn(),
    releasePioneer: vi.fn(),
    handoffExecution: vi.fn(),
    endorseCanon: vi.fn(),
    proposeDirective: vi.fn(),
    acceptProposal: vi.fn(),
    dismissProposal: vi.fn(),
    defineFlow: vi.fn(),
    completeFlowStep: vi.fn(),
    completeFlow: vi.fn(),
    registerAgent: vi.fn(),
    assignDirective: vi.fn(),
    progressExecution: vi.fn(),
    assessHealth: vi.fn(),
    detectAnomaly: vi.fn(),
    resolveAnomaly: vi.fn(),
    nullConsequence: vi.fn(),
    raw: vi.fn(),
    seedCanon: vi.fn().mockResolvedValue(undefined),
  },
  bootSpine: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../use-mobile", () => ({
  useIsMobile: () => false,
}));

import { Shell } from "../Shell";

function getBackdrop() {
  return document.querySelector(".rb-rail-backdrop") as HTMLElement;
}
function getLeftRail() {
  // ThreadStrip renders .rb-rail (not .rb-rail-right)
  return document.querySelector(".rb-rail:not(.rb-rail-right)") as HTMLElement;
}
function getRightRail() {
  return document.querySelector(".rb-rail.rb-rail-right") as HTMLElement;
}

describe("Shell — drawer / rail toggle behavior", () => {
  beforeEach(() => {
    render(<Shell />);
  });

  it("renders toggle buttons for both rails", () => {
    expect(screen.getByRole("button", { name: /toggle threads panel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle canon panel/i })).toBeInTheDocument();
  });

  it("backdrop is inactive by default", () => {
    expect(getBackdrop()).not.toHaveClass("active");
  });

  it("left rail does not have rb-rail--open by default", () => {
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
  });

  it("right rail does not have rb-rail--open by default", () => {
    expect(getRightRail()).not.toHaveClass("rb-rail--open");
  });

  it("clicking threads toggle opens left rail and activates backdrop", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    expect(getBackdrop()).toHaveClass("active");
  });

  it("clicking canon toggle opens right rail and activates backdrop", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle canon panel/i }));
    expect(getRightRail()).toHaveClass("rb-rail--open");
    expect(getBackdrop()).toHaveClass("active");
  });

  it("opening threads toggle closes right rail (mutual exclusion)", () => {
    // Open right first
    fireEvent.click(screen.getByRole("button", { name: /toggle canon panel/i }));
    expect(getRightRail()).toHaveClass("rb-rail--open");
    // Open left — right must close
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    expect(getRightRail()).not.toHaveClass("rb-rail--open");
  });

  it("opening canon toggle closes left rail (mutual exclusion)", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    fireEvent.click(screen.getByRole("button", { name: /toggle canon panel/i }));
    expect(getRightRail()).toHaveClass("rb-rail--open");
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
  });

  it("clicking backdrop closes the open rail and deactivates backdrop", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    fireEvent.click(getBackdrop());
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
    expect(getBackdrop()).not.toHaveClass("active");
  });

  it("pressing Escape closes the open rail", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
    expect(getBackdrop()).not.toHaveClass("active");
  });

  it("pressing Escape when no rail is open is a no-op", () => {
    fireEvent.keyDown(window, { key: "Escape" });
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
    expect(getRightRail()).not.toHaveClass("rb-rail--open");
    expect(getBackdrop()).not.toHaveClass("active");
  });

  it("toggling an open rail closed removes rb-rail--open", () => {
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).toHaveClass("rb-rail--open");
    fireEvent.click(screen.getByRole("button", { name: /toggle threads panel/i }));
    expect(getLeftRail()).not.toHaveClass("rb-rail--open");
    expect(getBackdrop()).not.toHaveClass("active");
  });
});
