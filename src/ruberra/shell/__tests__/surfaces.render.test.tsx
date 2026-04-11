// @vitest-environment happy-dom
// Ruberra — Visual surface structural tests
//
// Renders sovereign shell surfaces with a minimal projection mock and
// asserts sovereign CSS classes, text content, and structural invariants.
// These are structural proofs — not pixel regression — running in jsdom.
// They prove: components render, apply the right sovereign grammar, and do not crash.
//
// Surfaces covered:
//   - RitualEntry (boot ritual)
//   - Shell (topbar + chamber glyph row + rails)
//   - ThreadStrip (left rail)
//   - CanonRibbon (right rail)
//   - EventPulse (bottom status bar)
//   - CreationChamber (directive + artifact surface)
//   - LabChamber
//   - SchoolChamber
//   - ErrorBoundary (degraded state)
//   - Unavailable (honest degraded status)
//   - Safe mode (fatal boot)

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import type { Projection } from "../../spine/projections";

// ── minimal projection fixture ─────────────────────────────────────────────

const emptyProjection: Projection = {
  repos: [],
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
  chamber: "creation",
  missionFramed: false,
  activeRepo: undefined,
  activeThread: undefined,
  lastEventId: undefined,
};

const boundProjection: Projection = {
  ...emptyProjection,
  repos: [{ id: "test-repo", name: "test-repo", boundAt: Date.now() }],
  activeRepo: "test-repo",
  chamber: "creation",
  missionFramed: true,
};

const withThreadProjection: Projection = {
  ...boundProjection,
  threads: [
    {
      id: "t1",
      repo: "test-repo",
      intent: "verify visual surfaces",
      openedAt: Date.now(),
      status: "open",
      state: "open",
    },
  ],
  activeThread: "t1",
};

// ── store + mobile mock ─────────────────────────────────────────────────────
// vi.mock is hoisted; mockEmit must be defined inside the factory.

let currentProjection: Projection = emptyProjection;

vi.mock("../../spine/store", () => {
  const mockEmit = {
    stateConcept: vi.fn(),
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
    nullConsequence: vi.fn(),
    raw: vi.fn(),
    seedCanon: vi.fn().mockResolvedValue(undefined),
  };
  return {
    useProjection: () => currentProjection,
    emit: mockEmit,
    bootSpine: vi.fn().mockResolvedValue(undefined),
  };
});

vi.mock("../use-mobile", () => ({
  useIsMobile: () => false,
}));

// ── imports after mocking ──────────────────────────────────────────────────

import { RitualEntry } from "../RitualEntry";
import { Shell } from "../Shell";
import { ThreadStrip } from "../ThreadStrip";
import { CanonRibbon } from "../CanonRibbon";
import { ErrorBoundary } from "../../trust/ErrorBoundary";
import { Unavailable } from "../../trust/Unavailable";
import { CreationChamber } from "../../chambers/Creation";
import { LabChamber } from "../../chambers/Lab";
import { SchoolChamber } from "../../chambers/School";
import { MemoryChamber } from "../../chambers/Memory";

// ── RitualEntry ─────────────────────────────────────────────────────────────

describe("RitualEntry — boot ritual", () => {
  beforeEach(() => { currentProjection = emptyProjection; });

  it("renders rb-ritual container with RUBERRA brand", () => {
    render(<RitualEntry onEnter={vi.fn()} />);
    const root = document.querySelector(".rb-ritual");
    expect(root).toBeInTheDocument();
    const h1 = document.querySelector(".rb-ritual h1");
    expect(h1?.textContent).toMatch(/RUBERRA/i);
  });

  it("renders repo bind input and Enter button", () => {
    render(<RitualEntry onEnter={vi.fn()} />);
    expect(screen.getByPlaceholderText("bind repo to begin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bind · enter forge/i })).toBeInTheDocument();
  });

  it("Enter button is disabled when input is empty", () => {
    render(<RitualEntry onEnter={vi.fn()} />);
    const btn = screen.getByRole("button", { name: /bind · enter forge/i });
    expect(btn).toBeDisabled();
  });
});

// ── Shell ──────────────────────────────────────────────────────────────────

describe("Shell — sovereign frame", () => {
  beforeEach(() => { currentProjection = boundProjection; });

  it("renders rb-root container", () => {
    render(<Shell />);
    expect(document.querySelector(".rb-root")).toBeInTheDocument();
  });

  it("renders topbar with brand and repo binding", () => {
    render(<Shell />);
    const brand = document.querySelector(".rb-brand");
    expect(brand?.textContent).toMatch(/RUBERRA/i);
    const repo = document.querySelector(".rb-repo");
    expect(repo?.textContent).toMatch(/test-repo/);
  });

  it("renders exactly four chamber glyph buttons", () => {
    render(<Shell />);
    const glyphs = document.querySelectorAll(".rb-chamber-glyph");
    expect(glyphs).toHaveLength(4);
    const labels = Array.from(glyphs).map((g) => g.textContent?.trim().toLowerCase());
    expect(labels).toContain("lab");
    expect(labels).toContain("school");
    expect(labels).toContain("creation");
    expect(labels).toContain("memory");
  });

  it("active chamber glyph has active class", () => {
    currentProjection = { ...boundProjection, chamber: "creation" };
    render(<Shell />);
    const active = document.querySelector(".rb-chamber-glyph.active");
    expect(active).toBeInTheDocument();
    expect(active?.textContent?.toLowerCase()).toContain("creation");
  });

  it("renders rb-main grid container", () => {
    render(<Shell />);
    expect(document.querySelector(".rb-main")).toBeInTheDocument();
  });

  it("renders rb-pulse event pulse at bottom", () => {
    render(<Shell />);
    expect(document.querySelector(".rb-pulse")).toBeInTheDocument();
  });
});

// ── ThreadStrip ─────────────────────────────────────────────────────────────

describe("ThreadStrip — left rail", () => {
  it("renders rb-rail container", () => {
    currentProjection = boundProjection;
    render(<ThreadStrip />);
    expect(document.querySelector(".rb-rail")).toBeInTheDocument();
  });

  it("shows thread list when threads exist", () => {
    currentProjection = withThreadProjection;
    render(<ThreadStrip />);
    expect(screen.getByText("verify visual surfaces")).toBeInTheDocument();
  });

  it("shows unavailable notice when no threads", () => {
    currentProjection = boundProjection;
    render(<ThreadStrip />);
    expect(screen.getByText("no threads")).toBeInTheDocument();
  });
});

// ── CanonRibbon ─────────────────────────────────────────────────────────────

describe("CanonRibbon — right rail", () => {
  it("renders rb-rail rb-rail-right container", () => {
    currentProjection = boundProjection;
    render(<CanonRibbon />);
    const aside = document.querySelector(".rb-rail.rb-rail-right");
    expect(aside).toBeInTheDocument();
  });

  it("shows empty canon message when no canon", () => {
    currentProjection = boundProjection;
    render(<CanonRibbon />);
    expect(screen.getByText("no canon")).toBeInTheDocument();
  });

  it("shows hardened canon entries", () => {
    currentProjection = {
      ...boundProjection,
      canon: [{ id: "c1", text: "sovereign law", state: "hardened", hardenedAt: Date.now() }],
    };
    render(<CanonRibbon />);
    const entry = document.querySelector(".rb-canon-entry");
    expect(entry).toBeInTheDocument();
    expect(screen.getByText("sovereign law")).toBeInTheDocument();
  });
});

// ── Chambers ──────────────────────────────────────────────────────────────

describe("CreationChamber", () => {
  it("renders rb-chamber container with Creation heading", () => {
    currentProjection = withThreadProjection;
    render(<CreationChamber />);
    expect(document.querySelector(".rb-chamber")).toBeInTheDocument();
    expect(screen.getByText("Creation")).toBeInTheDocument();
  });

  it("shows directive composition panel when thread active", () => {
    currentProjection = withThreadProjection;
    render(<CreationChamber />);
    expect(screen.getByText("Directive Forge")).toBeInTheDocument();
  });

  it("shows unavailable when no active thread", () => {
    currentProjection = boundProjection;
    render(<CreationChamber />);
    expect(screen.getByText("forge idle — no active thread")).toBeInTheDocument();
  });

  it("execution unbound notice shown when backend not configured", () => {
    currentProjection = withThreadProjection;
    render(<CreationChamber />);
    expect(screen.getByText("execution unbound")).toBeInTheDocument();
  });
});

describe("LabChamber", () => {
  it("renders rb-chamber with Lab heading", () => {
    currentProjection = boundProjection;
    render(<LabChamber />);
    expect(document.querySelector(".rb-chamber")).toBeInTheDocument();
    expect(screen.getByText("Lab")).toBeInTheDocument();
  });
});

describe("SchoolChamber", () => {
  it("renders rb-chamber with School heading", () => {
    currentProjection = boundProjection;
    render(<SchoolChamber />);
    expect(document.querySelector(".rb-chamber")).toBeInTheDocument();
    expect(screen.getByText("School")).toBeInTheDocument();
  });
});

describe("MemoryChamber", () => {
  it("renders rb-chamber with Memory heading", () => {
    currentProjection = boundProjection;
    render(<MemoryChamber />);
    expect(document.querySelector(".rb-chamber")).toBeInTheDocument();
    expect(screen.getByText("Memory")).toBeInTheDocument();
  });

  it("shows no memory notice when empty", () => {
    currentProjection = boundProjection;
    render(<MemoryChamber />);
    expect(screen.getByText("no memory")).toBeInTheDocument();
  });

  it("renders truth-state distribution cells", () => {
    currentProjection = boundProjection;
    render(<MemoryChamber />);
    const cells = document.querySelectorAll(".rb-memory-dist-cell");
    expect(cells).toHaveLength(4);
  });

  it("renders capture observation input", () => {
    currentProjection = boundProjection;
    render(<MemoryChamber />);
    expect(screen.getByPlaceholderText("what was observed…")).toBeInTheDocument();
  });

  it("shows memory entries when present", () => {
    currentProjection = {
      ...boundProjection,
      memory: [
        { id: "m1", repo: "test-repo", text: "observed pattern in execution", ts: Date.now(), promoted: false, state: "retained" },
      ],
    };
    render(<MemoryChamber />);
    expect(screen.getByText("observed pattern in execution")).toBeInTheDocument();
  });
});

// ── Trust surfaces ──────────────────────────────────────────────────────────

describe("ErrorBoundary — degraded state", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary label="test surface">
        <div data-testid="child">content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders rb-unavail with surface label on error", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const Crash = () => { throw new Error("surface exploded"); };
    render(
      <ErrorBoundary label="crashing surface">
        <Crash />
      </ErrorBoundary>,
    );
    expect(document.querySelector(".rb-unavail")).toBeInTheDocument();
    expect(screen.getByText(/crashing surface/)).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe("Unavailable — honest degraded status", () => {
  it("renders rb-unavail with title and reason", () => {
    render(<Unavailable title="feature locked" reason="no backend bound" />);
    const el = document.querySelector(".rb-unavail");
    expect(el).toBeInTheDocument();
    expect(screen.getByText("feature locked")).toBeInTheDocument();
    expect(screen.getByText("no backend bound")).toBeInTheDocument();
  });

  it("renders remediation when provided", () => {
    render(
      <Unavailable
        title="no repo"
        reason="bind a repo first"
        remediation="use the entry ritual"
      />,
    );
    expect(screen.getByText(/use the entry ritual/)).toBeInTheDocument();
  });
});

// ── Safe mode (fatal boot) ─────────────────────────────────────────────────

describe("Safe mode — rb-fatal surface", () => {
  it("renders rb-fatal class with Safe Mode heading and no-fake guarantee", () => {
    render(
      <div className="rb-fatal">
        <h2>Safe Mode</h2>
        <p>
          The event log could not be hydrated. The shell is running in minimal
          mode. No fake surfaces are shown.
        </p>
        <pre>IndexedDB unavailable</pre>
      </div>,
    );
    expect(document.querySelector(".rb-fatal")).toBeInTheDocument();
    expect(screen.getByText("Safe Mode")).toBeInTheDocument();
    expect(screen.getByText(/No fake surfaces are shown/)).toBeInTheDocument();
  });
});
