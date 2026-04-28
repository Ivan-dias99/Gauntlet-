"""
Signal — Spec-to-Code Compiler (Wave J).

Surface produces SurfacePlan today (mode + fidelity + screens +
components). Wave J compiles a SurfacePlan into a **Build
Specification** that Terminal can implement without ambiguity:

    SurfacePlan
      → BuildSpecification (per-component contracts)
        → ComponentScaffold (TSX file skeletons)

This module is the bridge between Surface and Terminal.

Wave J v1 is **deterministic**: no model call, just structured
mapping from a SurfacePlan to scaffolded TSX. The output is a list
of files-to-create with deterministic content. Terminal's agent
loop can pick this up and write the files (or refine them).

A future iteration can add a model-driven step that elaborates props,
states, and validation from the SurfacePlan + ProjectContract — but
the deterministic v1 lets the operator verify the contract shape
before paying for tokens.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Literal


ComponentKind = Literal["button", "card", "rail", "input", "nav", "list"]


@dataclass
class ComponentContract:
    """One component's contract — props, states, acceptance criteria."""
    name: str           # PascalCase class/function name
    file_path: str      # relative path under src/
    kind: ComponentKind
    screen_name: str    # which screen it belongs to
    props: list[str] = field(default_factory=list)        # "label: string", "onClick: () => void"
    states: list[str] = field(default_factory=list)       # "idle", "loading", "error"
    acceptance: list[str] = field(default_factory=list)   # "renders without crash", ...
    scaffold_tsx: str = ""  # the actual TSX skeleton


@dataclass
class BuildSpecification:
    """Wave J — Spec-to-Code output. Build artefact #3 of V3.1."""
    source_plan_id: str = ""       # links back to the SurfacePlan that produced this
    source_design_system: str = "" # carried through from the brief
    components: list[ComponentContract] = field(default_factory=list)
    files_to_create: list[str] = field(default_factory=list)  # for the Terminal agent

    def to_dict(self) -> dict:
        return {
            "source_plan_id": self.source_plan_id,
            "source_design_system": self.source_design_system,
            "components": [
                {
                    "name": c.name,
                    "file_path": c.file_path,
                    "kind": c.kind,
                    "screen_name": c.screen_name,
                    "props": c.props,
                    "states": c.states,
                    "acceptance": c.acceptance,
                    "scaffold_tsx": c.scaffold_tsx,
                }
                for c in self.components
            ],
            "files_to_create": self.files_to_create,
        }


# ── Naming + scaffolding helpers ────────────────────────────────────────────

def _to_pascal(s: str) -> str:
    """`'login form'` → `'LoginForm'`. Drops non-alpha-num runs."""
    parts = re.split(r"[^A-Za-z0-9]+", s)
    return "".join(p[:1].upper() + p[1:] for p in parts if p)


def _propose_name(screen_name: str, component_name: str, kind: ComponentKind) -> str:
    """Propose a PascalCase component name from screen + component_name."""
    base = _to_pascal(component_name)
    if not base:
        base = _to_pascal(screen_name) + kind.capitalize()
    return base or "Component"


def _scaffold_for(kind: ComponentKind, name: str, props: list[str]) -> str:
    """Deterministic TSX skeleton per kind. No model call."""
    prop_decls = "\n  ".join(f"{p};" for p in props) if props else "// no props"
    prop_destructure = ", ".join(p.split(":")[0].strip() for p in props) if props else ""
    if kind == "button":
        body = f'''  return (
    <button data-component="{name}" onClick={{onClick}}>
      {{label}}
    </button>
  );'''
        if "label: string" not in props and "label" not in (p.split(":")[0].strip() for p in props):
            props = props + ["label: string", "onClick: () => void"]
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)
    elif kind == "input":
        body = f'''  return (
    <label data-component="{name}">
      <span>{{label}}</span>
      <input value={{value}} onChange={{(e) => onChange(e.target.value)}} />
    </label>
  );'''
        if not any("value" in p for p in props):
            props = ["label: string", "value: string", "onChange: (v: string) => void"]
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)
    elif kind == "card":
        body = f'''  return (
    <article data-component="{name}">
      <header>{{title}}</header>
      <div>{{children}}</div>
    </article>
  );'''
        if not any("title" in p for p in props):
            props = ["title: string", "children?: React.ReactNode"]
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)
    elif kind == "list":
        body = f'''  return (
    <ul data-component="{name}">
      {{items.map((it, i) => <li key={{i}}>{{it}}</li>)}}
    </ul>
  );'''
        if not any("items" in p for p in props):
            props = ["items: string[]"]
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)
    elif kind == "nav":
        body = f'''  return (
    <nav data-component="{name}">
      {{links.map((l, i) => <a key={{i}} href={{l.href}}>{{l.label}}</a>)}}
    </nav>
  );'''
        if not any("links" in p for p in props):
            props = ['links: Array<{ href: string; label: string }>']
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)
    else:  # rail / fallback
        body = f'''  return (
    <aside data-component="{name}">
      {{children}}
    </aside>
  );'''
        if not props:
            props = ["children?: React.ReactNode"]
            prop_destructure = ", ".join(p.split(":")[0].strip() for p in props)
            prop_decls = "\n  ".join(f"{p};" for p in props)

    return f'''import * as React from "react";

// Generated by Signal Spec-to-Code (Wave J).
// Source: SurfacePlan component "{name}".
// Edit freely; the spec lives in the build_specification artefact.

interface {name}Props {{
  {prop_decls}
}}

export default function {name}({{ {prop_destructure} }}: {name}Props) {{
{body}
}}
'''


# ── Compiler ────────────────────────────────────────────────────────────────


def compile_plan_to_spec(
    plan: dict,
    *,
    project_id: str = "",
    output_dir: str = "src/components",
) -> BuildSpecification:
    """Deterministic compile of a SurfacePlan dict (as emitted by
    chambers/surface.py) into a BuildSpecification.

    Plan shape (mirrors SurfacePlan in chambers/surface.py):
        {
          "mode": "prototype",
          "fidelity": "hi-fi",
          "design_system_binding": "Signal Canon",
          "screens": [{"name": "...", "purpose": "..."}],
          "components": [{"screen": "...", "name": "...", "kind": "card"}],
          "notes": [...],
          "mock": false,
        }
    """
    spec = BuildSpecification(
        source_plan_id=project_id,
        source_design_system=plan.get("design_system_binding", "") or "",
    )

    raw_components = plan.get("components", []) or []
    for raw in raw_components:
        screen = raw.get("screen", "Unknown") or "Unknown"
        kind_raw = raw.get("kind", "card") or "card"
        kind: ComponentKind = kind_raw if kind_raw in {
            "button", "card", "rail", "input", "nav", "list",
        } else "card"
        component_name = raw.get("name", "") or ""
        name = _propose_name(screen, component_name, kind)
        file_path = f"{output_dir}/{name}.tsx"
        # Default props per kind; the scaffold helper overrides with
        # canonical sets when missing.
        props: list[str] = []
        states = ["idle"]
        if kind in ("button", "input"):
            states = ["idle", "active", "disabled"]
        elif kind == "list":
            states = ["empty", "populated", "loading"]
        acceptance = [
            f"renders inside the {screen} screen",
            "matches design system " + (spec.source_design_system or "(none)"),
            "no console errors on first render",
        ]
        scaffold = _scaffold_for(kind, name, props)
        spec.components.append(ComponentContract(
            name=name,
            file_path=file_path,
            kind=kind,
            screen_name=screen,
            props=props,
            states=states,
            acceptance=acceptance,
            scaffold_tsx=scaffold,
        ))
        spec.files_to_create.append(file_path)

    # Dedupe file_path while keeping order
    seen = set()
    deduped = []
    for fp in spec.files_to_create:
        if fp not in seen:
            seen.add(fp)
            deduped.append(fp)
    spec.files_to_create = deduped

    return spec
