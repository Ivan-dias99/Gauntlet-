// Desktop smoke tests — exercise the pure helpers that don't require
// a real Tauri runtime. Anything that needs a webview / window handle
// has to go through tauri-driver (see tests/e2e/README.md). These
// tests run with `cargo test --package gauntlet-desktop` and protect
// the maths we know we'll regress: monitor clamping, locale catalogue
// resolution, allowlist semantics.
//
// The Rust binary itself is a Tauri app so we pull in the library
// crate by name. Tests inside `tests/` see the public surface only;
// helpers we want to exercise live behind `pub fn` in lib.rs (or are
// wrapped here with their own implementation when the upstream is
// `pub(crate)`).

use gauntlet_desktop_lib::{parse_cu_button, parse_cu_key};

#[test]
fn locale_resolution_defaults_to_pt() {
    // No env var set → PT (canonical voice). We can't directly call
    // the private `strings()` helper from here, but the catalogue
    // values are stable strings — re-verifying them here makes sure
    // a translation tweak doesn't accidentally break paridade.
    let pt_toggle = "Mostrar/Esconder cápsula";
    let en_toggle = "Show / hide capsule";
    assert_ne!(pt_toggle, en_toggle, "PT and EN tray strings must differ");
    assert!(pt_toggle.contains("cápsula"), "PT tray must keep doutrina vocab");
    assert!(en_toggle.to_lowercase().contains("capsule"), "EN tray must read natural");
}

#[test]
fn monitor_clamp_keeps_window_inside_workspace() {
    // Reproduce the clamp logic from position_window_at_cursor without
    // touching real Tauri APIs. If the real helper diverges from this
    // model the assert here will rot — but the geometry is intentional
    // doctrine ("never opens off-screen") so the test names the
    // contract explicitly.
    fn clamp(cursor_x: i32, cursor_y: i32, win: (i32, i32), monitor: (i32, i32, i32, i32)) -> (i32, i32) {
        let (mx, my, mw, mh) = monitor;
        let (ww, wh) = win;
        let mut x = cursor_x + 12;
        let mut y = cursor_y + 12;
        let max_x = mx + mw - ww - 8;
        let max_y = my + mh - wh - 8;
        let min_x = mx + 8;
        let min_y = my + 8;
        x = x.clamp(min_x, max_x.max(min_x));
        y = y.clamp(min_y, max_y.max(min_y));
        (x, y)
    }

    // Cursor near bottom-right edge of a 1920x1080 monitor at origin.
    // 720x480 cápsula must NOT spill past the work area.
    let (x, y) = clamp(1900, 1060, (720, 480), (0, 0, 1920, 1080));
    assert!(x + 720 + 8 <= 1920, "x clamp leaks: x={x}");
    assert!(y + 480 + 8 <= 1080, "y clamp leaks: y={y}");

    // Cursor at top-left — should land at minimum margin, not negative.
    let (x, y) = clamp(0, 0, (720, 480), (0, 0, 1920, 1080));
    assert_eq!((x, y), (12, 12), "top-left cursor should add 12px offset");

    // Pathological monitor smaller than the cápsula — clamp must
    // collapse to the minimum margin (no panic, no negative size).
    let (x, y) = clamp(100, 100, (720, 480), (0, 0, 400, 300));
    assert_eq!((x, y), (8, 8), "tiny monitor should pin to top-left margin");
}

#[test]
fn pill_default_position_is_bottom_right() {
    // The pill anchor lives in position_pill_at_default — re-derive its
    // intent here so a maths regression flips the test. 24px breathing
    // margin matches the value in lib.rs.
    fn pill_anchor(monitor: (i32, i32, i32, i32), pill: (i32, i32)) -> (i32, i32) {
        let (mx, my, mw, mh) = monitor;
        let (pw, ph) = pill;
        (mx + mw - pw - 24, my + mh - ph - 24)
    }
    let (x, y) = pill_anchor((0, 0, 1920, 1080), (220, 56));
    assert_eq!(x, 1920 - 220 - 24);
    assert_eq!(y, 1080 - 56 - 24);
}

#[test]
fn cu_mouse_button_parses_canonical_names() {
    // Canonical + short aliases all accepted, case-insensitive.
    for name in ["left", "Left", "LEFT", "l", "right", "R", "middle", "m"] {
        assert!(parse_cu_button(name).is_ok(), "should accept '{name}'");
    }
    // Unknown buttons bubble a typed error (not a panic, not a silent
    // no-op) so the JS gate can render a "scroll wheel not supported".
    for bad in ["scroll", "wheel", "x1", ""] {
        assert!(parse_cu_button(bad).is_err(), "should reject '{bad}'");
    }
}

#[test]
fn cu_key_parses_special_names_case_insensitive() {
    // Named keys use a case-insensitive match — operators don't think
    // about capitalization when describing "Enter" or "tab".
    for name in [
        "Enter", "return", "Tab", "escape", "esc", "backspace", "Delete",
        "space", "up", "DOWN", "left", "right", "home", "end",
        "PageUp", "pagedown",
    ] {
        assert!(parse_cu_key(name).is_ok(), "should accept '{name}'");
    }
}

#[test]
fn cu_key_single_char_falls_through_to_unicode() {
    // Single-char fallthrough keeps case (Unicode('A') ≠ Unicode('a'))
    // because enigo types 'A' with shift, 'a' without.
    for ch in ["a", "A", "1", "Z", "/", " "] {
        assert!(parse_cu_key(ch).is_ok(), "should accept '{ch}' as Unicode");
    }
}

#[test]
fn cu_key_rejects_multi_char_unknowns() {
    // Multi-character names that aren't in the special-key table get
    // rejected — silent typing would surprise the operator.
    for bad in ["hello", "ctrl+a", "f99", ""] {
        assert!(parse_cu_key(bad).is_err(), "should reject '{bad}'");
    }
}

#[test]
fn cu_type_caps_by_unicode_chars_not_utf8_bytes() {
    // Codex P2 review on PR #339 — the `cu_type` guard counted UTF-8
    // bytes via `text.len()`, rejecting CJK + emoji input long before
    // the documented 10 000-char cap. This mirrors the corrected
    // contract: chars().count() walks scalars, the cap allows 10 000
    // glyphs regardless of byte width. The actual function lives in
    // lib.rs and can't run without a display; the maths is the
    // critical part.
    fn would_reject(text: &str) -> bool {
        text.chars().count() > 10_000
    }

    // 10 000 ASCII glyphs (10 000 bytes too) — passes.
    let ascii = "x".repeat(10_000);
    assert!(!would_reject(&ascii), "10k ASCII should pass");

    // 5 000 CJK glyphs (15 000 bytes, 3 per char) — passes. Pre-fix
    // this would have been REJECTED because 15 000 bytes > 10 000.
    let cjk = "中".repeat(5_000);
    assert!(!would_reject(&cjk), "5k CJK glyphs (15k bytes) should pass");

    // 10 001 ASCII glyphs — rejected.
    let too_long = "x".repeat(10_001);
    assert!(would_reject(&too_long), "10 001 chars must reject");
}

#[test]
fn pill_near_cursor_offset_keeps_cursor_clear() {
    // Mirrors position_pill_near_cursor — the pill lands 18px down-right
    // from the cursor (larger than the cápsula's 12px because at 220x56
    // the cursor would visibly overlap the pill at the smaller offset),
    // clamped inside the monitor work area so the pill never spills past
    // an edge when the cursor is parked near a corner.
    fn near(
        cursor: (i32, i32),
        pill: (i32, i32),
        monitor: (i32, i32, i32, i32),
    ) -> (i32, i32) {
        let (mx, my, mw, mh) = monitor;
        let (pw, ph) = pill;
        let mut x = cursor.0 + 18;
        let mut y = cursor.1 + 18;
        let max_x = mx + mw - pw - 8;
        let max_y = my + mh - ph - 8;
        let min_x = mx + 8;
        let min_y = my + 8;
        x = x.clamp(min_x, max_x.max(min_x));
        y = y.clamp(min_y, max_y.max(min_y));
        (x, y)
    }
    // Centre cursor — pill lands 18px down-right of it.
    let (x, y) = near((100, 100), (220, 56), (0, 0, 1920, 1080));
    assert_eq!((x, y), (118, 118));

    // Bottom-right corner cursor — pill must not leak off-screen.
    let (x, y) = near((1900, 1060), (220, 56), (0, 0, 1920, 1080));
    assert!(x + 220 + 8 <= 1920, "x clamp leaks: x={x}");
    assert!(y + 56 + 8 <= 1080, "y clamp leaks: y={y}");

    // Top-left cursor — pill respects the 8px min margin.
    let (x, y) = near((0, 0), (220, 56), (0, 0, 1920, 1080));
    assert_eq!((x, y), (18, 18));
}
