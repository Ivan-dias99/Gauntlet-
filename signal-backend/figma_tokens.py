"""Signal — Figma token import. Walks Figma file JSON → TokenSet."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional


@dataclass
class ColorToken:
    name: str
    value_hex: str
    description: Optional[str] = None


@dataclass
class SpacingToken:
    name: str
    value_px: float
    description: Optional[str] = None


@dataclass
class TypeToken:
    name: str
    family: str
    weight: int
    size_px: float
    line_height_px: float
    description: Optional[str] = None


@dataclass
class RadiusToken:
    name: str
    value_px: float
    description: Optional[str] = None


@dataclass
class TokenSet:
    name: str
    source_file_id: str
    imported_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    colors: list[ColorToken] = field(default_factory=list)
    spacings: list[SpacingToken] = field(default_factory=list)
    types: list[TypeToken] = field(default_factory=list)
    radii: list[RadiusToken] = field(default_factory=list)
    raw_warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "source_file_id": self.source_file_id,
            "imported_at": self.imported_at,
            "colors": [{"name": c.name, "value_hex": c.value_hex, "description": c.description} for c in self.colors],
            "spacings": [{"name": s.name, "value_px": s.value_px, "description": s.description} for s in self.spacings],
            "types": [{"name": t.name, "family": t.family, "weight": t.weight, "size_px": t.size_px, "line_height_px": t.line_height_px, "description": t.description} for t in self.types],
            "radii": [{"name": r.name, "value_px": r.value_px, "description": r.description} for r in self.radii],
            "raw_warnings": self.raw_warnings,
        }


def _rgba_to_hex(r: float, g: float, b: float, a: float = 1.0) -> str:
    def chan(c: float) -> int:
        return max(0, min(255, int(round(c * 255))))
    if a >= 0.999:
        return f"#{chan(r):02x}{chan(g):02x}{chan(b):02x}"
    return f"#{chan(r):02x}{chan(g):02x}{chan(b):02x}{chan(a):02x}"


def _slug(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "token"


def tokens_from_figma_json(file_id: str, body: dict[str, Any], *, name: Optional[str] = None) -> TokenSet:
    out = TokenSet(name=name or body.get("name") or file_id, source_file_id=file_id)

    styles = body.get("styles") or {}
    if isinstance(styles, dict):
        for sid, raw in styles.items():
            if not isinstance(raw, dict):
                continue
            style_type = raw.get("styleType") or raw.get("type")
            sname = raw.get("name", sid)
            description = raw.get("description")
            if style_type in ("FILL", "PAINT"):
                out.colors.append(ColorToken(name=_slug(sname), value_hex="#000000", description=description))
                out.raw_warnings.append(f"color {sname!r} requires node walk to resolve hex")
            elif style_type == "TEXT":
                out.types.append(TypeToken(name=_slug(sname), family="Inter", weight=400, size_px=16, line_height_px=24, description=description))
                out.raw_warnings.append(f"type {sname!r} requires node walk to resolve family/size")
    else:
        out.raw_warnings.append("no styles map in body")

    variables = (body.get("meta") or {}).get("variables") if isinstance(body.get("meta"), dict) else None
    if isinstance(variables, dict):
        for vid, raw in variables.items():
            if not isinstance(raw, dict):
                continue
            vtype = raw.get("type")
            vname = raw.get("name", vid)
            value = raw.get("valuesByMode") or raw.get("value")
            description = raw.get("description")
            if isinstance(value, dict) and value:
                value = next(iter(value.values()))
            if vtype == "COLOR" and isinstance(value, dict):
                hex_value = _rgba_to_hex(
                    float(value.get("r", 0)), float(value.get("g", 0)),
                    float(value.get("b", 0)), float(value.get("a", 1)),
                )
                out.colors.append(ColorToken(name=_slug(vname), value_hex=hex_value, description=description))
            elif vtype == "FLOAT" and isinstance(value, (int, float)):
                if "radius" in vname.lower() or "round" in vname.lower():
                    out.radii.append(RadiusToken(name=_slug(vname), value_px=float(value), description=description))
                else:
                    out.spacings.append(SpacingToken(name=_slug(vname), value_px=float(value), description=description))
    elif "meta" in body:
        out.raw_warnings.append("meta present but no variables map")
    else:
        out.raw_warnings.append("no meta.variables in body (older Figma file?)")

    return out
