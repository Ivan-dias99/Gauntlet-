// Gauntlet — desktop cápsula entry (Tauri 2).
//
// Sprint 6 close — adds 4 Tauri commands that move the desktop
// surface from "browser-extension visual paridade only" toward real
// off-the-web context capture and backend autonomy:
//
//   get_active_window()       OS-level foreground window title + app
//   capture_screen_region()   interactive region screenshot, returns
//                             path to a PNG in the OS temp dir
//   start_backend()           spawn the bundled Python backend as a
//                             child process (operator opt-in via
//                             GAUNTLET_DESKTOP_AUTOSTART_BACKEND=1)
//   stop_backend()            terminate the spawned backend
//
// All four use std::process::Command — no Tauri plugin required, no
// new Cargo dependencies, no JS bridge gymnastics. The trade-off: the
// shell-out binaries are platform-specific (xdotool / osascript /
// PowerShell). When a binary isn't available the command returns a
// typed error envelope the JS side surfaces in the cápsula error band.

use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Mutex;
use std::time::Duration;

use base64::{engine::general_purpose::STANDARD as B64, Engine};
use enigo::{
    Button as CuButton, Coordinate as CuCoordinate, Direction as CuDirection, Enigo, Key as CuKey,
    Keyboard as _, Mouse as _, Settings as CuSettings,
};
use serde::Serialize;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use tauri_plugin_dialog::DialogExt;

// Caps for filesystem reads — anything bigger comes back as a head
// fragment + marker. The values match `MAX_TEXT_BYTES` /
// `MAX_BINARY_BYTES` documented in `packages/composer/src/ambient.ts`.
const MAX_TEXT_BYTES: usize = 1024 * 1024;
const MAX_BINARY_BYTES: usize = 4 * 1024 * 1024;

#[derive(Serialize, Clone, Debug)]
pub struct WindowInfo {
    pub title: String,
    pub app: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct PickedFile {
    pub path: String,
    pub name: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct Base64Payload {
    pub base64: String,
    pub mime: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct ScreenCapture {
    pub base64: String,
    pub path: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct ShellResult {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub duration_ms: u64,
}

/// Backend child handle — global because lifetime is process-wide and
/// only one autostarted backend is ever supported. Mutex over Option
/// lets start_backend / stop_backend coordinate without a custom state
/// struct.
static BACKEND_PROCESS: Mutex<Option<Child>> = Mutex::new(None);

/// Pill cursor-follow flag. When true, a background ticker repositions
/// the pill window to track the OS cursor at ~30Hz. Doctrine — "ponta
/// do cursor": the pill is the persistent anchor that lives where the
/// operator's attention is. Default on; the operator can flip it via
/// the `set_pill_follow_cursor` command (control-center setting).
static PILL_FOLLOW_CURSOR: AtomicBool = AtomicBool::new(true);

/// Tray + health-probe localised strings. Read at boot from
/// `GAUNTLET_LOCALE` (defaults to "pt"). Mirrors the operator-facing
/// vocabulary of the control-center i18n catalogue: "pt" is the
/// canonical voice, "en" is the polite-shell fallback.
struct Strings {
    tray_toggle: &'static str,
    tray_pill: &'static str,
    tray_quit: &'static str,
    health_ok: &'static str,
    health_off: &'static str,
}

const STRINGS_PT: Strings = Strings {
    tray_toggle: "Mostrar/Esconder cápsula",
    tray_pill: "Mostrar/Esconder pill",
    tray_quit: "Sair do Gauntlet",
    health_ok: "Gauntlet — backend conectado",
    health_off: "Gauntlet — backend offline",
};

const STRINGS_EN: Strings = Strings {
    tray_toggle: "Show / hide capsule",
    tray_pill: "Show / hide pill",
    tray_quit: "Quit Gauntlet",
    health_ok: "Gauntlet — backend connected",
    health_off: "Gauntlet — backend offline",
};

fn strings() -> &'static Strings {
    match std::env::var("GAUNTLET_LOCALE")
        .unwrap_or_default()
        .to_lowercase()
        .as_str()
    {
        "en" | "en-us" | "en-gb" => &STRINGS_EN,
        _ => &STRINGS_PT,
    }
}

#[tauri::command]
fn get_active_window() -> Result<WindowInfo, String> {
    #[cfg(target_os = "macos")]
    {
        // System Events: `name of (process where frontmost is true)`
        // returns the active app name; window title is the frontmost
        // window's name. Two narrow osascript calls — bundling them
        // into one would need quoting heroics.
        let app = run_capture(
            "osascript",
            &["-e", "tell application \"System Events\" to get name of (process where frontmost is true)"],
        )?;
        let title = run_capture(
            "osascript",
            &["-e", "tell application \"System Events\" to get name of front window of (process where frontmost is true)"],
        ).unwrap_or_default();
        return Ok(WindowInfo {
            title: title.trim().to_string(),
            app: app.trim().to_string(),
        });
    }
    #[cfg(target_os = "linux")]
    {
        // xdotool ships with most Linux desktops. When it's missing the
        // operator gets a clean "xdotool not found" error instead of a
        // crash. Wayland sessions need different tooling (swaymsg etc)
        // — out of scope for the Sprint 6 close; we surface the
        // limitation.
        let title = run_capture("xdotool", &["getactivewindow", "getwindowname"])
            .map_err(|e| format!(
                "active window via xdotool failed: {e}. \
                On Wayland, install + use 'gnome-shell-eval' or set \
                GAUNTLET_DESKTOP_DISABLE_ACTIVE_WINDOW=1 to skip."
            ))?;
        return Ok(WindowInfo {
            title: title.trim().to_string(),
            app: String::new(),
        });
    }
    #[cfg(target_os = "windows")]
    {
        // PowerShell one-liner querying GetForegroundWindow + the
        // process owner. Returns "TITLE | EXENAME" so we can split
        // without keeping a multi-statement script.
        let raw = run_capture(
            "powershell",
            &[
                "-NoProfile",
                "-Command",
                r#"
                Add-Type @"
                using System;
                using System.Runtime.InteropServices;
                using System.Text;
                public class W {
                  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
                  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h,StringBuilder s,int n);
                  [DllImport("user32.dll")] public static extern int GetWindowThreadProcessId(IntPtr h,out int p);
                }
"@
                $h = [W]::GetForegroundWindow()
                $sb = New-Object System.Text.StringBuilder 256
                [void][W]::GetWindowText($h,$sb,256)
                $pid = 0; [void][W]::GetWindowThreadProcessId($h,[ref]$pid)
                $p = Get-Process -Id $pid
                "$($sb.ToString())|$($p.ProcessName)"
                "#,
            ],
        )?;
        let mut parts = raw.trim().splitn(2, '|');
        let title = parts.next().unwrap_or("").to_string();
        let app = parts.next().unwrap_or("").to_string();
        return Ok(WindowInfo { title, app });
    }
    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    Err("active window lookup not implemented for this OS".into())
}

#[tauri::command]
fn capture_screen_region() -> Result<String, String> {
    let mut path: PathBuf = std::env::temp_dir();
    path.push(format!(
        "gauntlet-shot-{}.png",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0),
    ));
    let path_str = path.to_string_lossy().to_string();

    #[cfg(target_os = "macos")]
    {
        // -i = interactive selection; -x = no shutter sound.
        let status = Command::new("screencapture")
            .args(["-i", "-x", &path_str])
            .status()
            .map_err(|e| format!("screencapture not found: {e}"))?;
        if !status.success() {
            return Err(format!("screencapture exited {:?}", status.code()));
        }
        return Ok(path_str);
    }
    #[cfg(target_os = "linux")]
    {
        // Try gnome-screenshot first, fall back to scrot. Both ship
        // with most desktops; if neither is installed the operator
        // gets a clean error and a hint.
        let attempts: &[(&str, &[&str])] = &[
            ("gnome-screenshot", &["-a", "-f"]),
            ("scrot", &["-s"]),
            ("flameshot", &["gui", "-p"]),
        ];
        for (bin, args) in attempts {
            let mut cmd_args: Vec<&str> = args.to_vec();
            cmd_args.push(&path_str);
            let result = Command::new(bin).args(&cmd_args).status();
            if let Ok(s) = result {
                if s.success() {
                    return Ok(path_str);
                }
            }
        }
        return Err(
            "no screenshot binary found (tried gnome-screenshot, scrot, flameshot). \
             Install one of them or capture manually."
                .into(),
        );
    }
    #[cfg(target_os = "windows")]
    {
        // SnippingTool /clip exists but isn't scriptable to a file.
        // Operator can use Win+Shift+S; the cápsula gets the path via
        // clipboard which the existing flow already reads.
        let _ = path_str;
        return Err(
            "Windows interactive screenshot needs Win+Shift+S — paste from \
             clipboard into the cápsula instead."
                .into(),
        );
    }
    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    Err("screen region capture not implemented for this OS".into())
}

#[tauri::command]
fn start_backend() -> Result<(), String> {
    if std::env::var("GAUNTLET_DESKTOP_AUTOSTART_BACKEND")
        .map(|v| v != "1" && v.to_lowercase() != "true")
        .unwrap_or(true)
    {
        return Err(
            "backend autostart disabled — set \
             GAUNTLET_DESKTOP_AUTOSTART_BACKEND=1 to opt in"
                .into(),
        );
    }

    let mut guard = BACKEND_PROCESS
        .lock()
        .map_err(|e| format!("backend mutex poisoned: {e}"))?;
    if guard.is_some() {
        return Ok(()); // already running, idempotent
    }

    // Operator chooses how the backend is launched. Default: spawn the
    // local "python" interpreter against the shipped backend dir.
    // Override via GAUNTLET_BACKEND_CMD ("python /path/to/main.py" or
    // a sidecar binary path).
    let cmd_str = std::env::var("GAUNTLET_BACKEND_CMD")
        .unwrap_or_else(|_| "python main.py".to_string());
    let parts: Vec<&str> = cmd_str.split_whitespace().collect();
    if parts.is_empty() {
        return Err("GAUNTLET_BACKEND_CMD is empty".into());
    }
    let backend_dir = std::env::var("GAUNTLET_BACKEND_DIR")
        .unwrap_or_else(|_| "../../backend".to_string());

    let child = Command::new(parts[0])
        .args(&parts[1..])
        .current_dir(&backend_dir)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("failed to spawn backend ({cmd_str} in {backend_dir}): {e}"))?;
    *guard = Some(child);
    Ok(())
}

#[tauri::command]
fn stop_backend() -> Result<(), String> {
    let mut guard = BACKEND_PROCESS
        .lock()
        .map_err(|e| format!("backend mutex poisoned: {e}"))?;
    if let Some(mut child) = guard.take() {
        // SIGKILL on the child PID. The Python backend handles its own
        // cleanup on shutdown when SIGTERM is delivered, but Rust's
        // Child::kill is platform-portable and we don't need graceful
        // here — the operator dismissed the cápsula.
        child
            .kill()
            .map_err(|e| format!("failed to kill backend: {e}"))?;
        let _ = child.wait();
    }
    Ok(())
}

// Filesystem — operator-driven access. The dialog plugin provides the
// consent ("operator picked this file"); std::fs reads it. We bypass
// plugin-fs scopes intentionally because the picker IS the gate, not a
// statically-declared scope list. Caps protect the prompt from being
// flooded by a 50 MB blob.
#[tauri::command]
async fn pick_file(
    app: tauri::AppHandle,
    accept: Option<Vec<String>>,
) -> Result<Option<PickedFile>, String> {
    let (tx, rx) = std::sync::mpsc::channel::<Option<tauri_plugin_dialog::FilePath>>();
    let mut dialog = app.dialog().file();
    if let Some(exts) = accept {
        let lifted: Vec<String> = exts
            .into_iter()
            .map(|e| e.trim_start_matches('.').to_string())
            .filter(|e| !e.is_empty())
            .collect();
        if !lifted.is_empty() {
            let refs: Vec<&str> = lifted.iter().map(|s| s.as_str()).collect();
            dialog = dialog.add_filter("Filtered", &refs);
        }
    }
    dialog.pick_file(move |path| {
        let _ = tx.send(path);
    });
    let picked = rx
        .recv()
        .map_err(|e| format!("file picker channel closed: {e}"))?;
    let Some(file_path) = picked else {
        return Ok(None);
    };
    let path_buf: PathBuf = file_path
        .into_path()
        .map_err(|e| format!("file picker returned a non-filesystem URI: {e}"))?;
    let name = path_buf
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_default();
    Ok(Some(PickedFile {
        path: path_buf.to_string_lossy().to_string(),
        name,
    }))
}

#[tauri::command]
fn read_text_file_at(path: String) -> Result<String, String> {
    let buf = PathBuf::from(&path);
    let metadata = std::fs::metadata(&buf).map_err(|e| format!("stat {path}: {e}"))?;
    if !metadata.is_file() {
        return Err(format!("{path} is not a regular file"));
    }
    let raw = std::fs::read(&buf).map_err(|e| format!("read {path}: {e}"))?;
    if raw.len() > MAX_TEXT_BYTES {
        let head = String::from_utf8_lossy(&raw[..MAX_TEXT_BYTES]).to_string();
        return Ok(format!(
            "{head}\n\n[gauntlet:truncated — file is {} bytes, capped at {} bytes]",
            raw.len(),
            MAX_TEXT_BYTES
        ));
    }
    String::from_utf8(raw).map_err(|e| format!("not valid UTF-8: {e}"))
}

// A2 — operator-driven write. The dialog save IS the consent gate:
// the operator chooses where the file goes, every time. We never
// auto-overwrite a path the operator didn't just confirm.
#[tauri::command]
async fn pick_save_path(
    app: tauri::AppHandle,
    suggested_name: Option<String>,
    accept: Option<Vec<String>>,
) -> Result<Option<String>, String> {
    let (tx, rx) = std::sync::mpsc::channel::<Option<tauri_plugin_dialog::FilePath>>();
    let mut dialog = app.dialog().file();
    if let Some(name) = suggested_name.as_deref() {
        if !name.is_empty() {
            dialog = dialog.set_file_name(name);
        }
    }
    if let Some(exts) = accept {
        let lifted: Vec<String> = exts
            .into_iter()
            .map(|e| e.trim_start_matches('.').to_string())
            .filter(|e| !e.is_empty())
            .collect();
        if !lifted.is_empty() {
            let refs: Vec<&str> = lifted.iter().map(|s| s.as_str()).collect();
            dialog = dialog.add_filter("Filtered", &refs);
        }
    }
    dialog.save_file(move |path| {
        let _ = tx.send(path);
    });
    let picked = rx
        .recv()
        .map_err(|e| format!("save picker channel closed: {e}"))?;
    let Some(file_path) = picked else {
        return Ok(None);
    };
    let path_buf: PathBuf = file_path
        .into_path()
        .map_err(|e| format!("save picker returned a non-filesystem URI: {e}"))?;
    Ok(Some(path_buf.to_string_lossy().to_string()))
}

#[tauri::command]
fn write_text_file_at(path: String, content: String) -> Result<u64, String> {
    let buf = PathBuf::from(&path);
    if let Some(parent) = buf.parent() {
        if !parent.as_os_str().is_empty() && !parent.exists() {
            return Err(format!(
                "parent directory does not exist: {}",
                parent.display()
            ));
        }
    }
    std::fs::write(&buf, content.as_bytes()).map_err(|e| format!("write {path}: {e}"))?;
    let bytes = content.as_bytes().len() as u64;
    Ok(bytes)
}

#[tauri::command]
fn write_file_base64_at(path: String, base64: String) -> Result<u64, String> {
    let buf = PathBuf::from(&path);
    if let Some(parent) = buf.parent() {
        if !parent.as_os_str().is_empty() && !parent.exists() {
            return Err(format!(
                "parent directory does not exist: {}",
                parent.display()
            ));
        }
    }
    let raw = B64
        .decode(base64.as_bytes())
        .map_err(|e| format!("base64 decode failed: {e}"))?;
    std::fs::write(&buf, &raw).map_err(|e| format!("write {path}: {e}"))?;
    Ok(raw.len() as u64)
}

#[tauri::command]
fn read_file_base64_at(path: String) -> Result<Base64Payload, String> {
    let buf = PathBuf::from(&path);
    let metadata = std::fs::metadata(&buf).map_err(|e| format!("stat {path}: {e}"))?;
    if !metadata.is_file() {
        return Err(format!("{path} is not a regular file"));
    }
    if metadata.len() as usize > MAX_BINARY_BYTES {
        return Err(format!(
            "file is {} bytes, capped at {} bytes",
            metadata.len(),
            MAX_BINARY_BYTES
        ));
    }
    let raw = std::fs::read(&buf).map_err(|e| format!("read {path}: {e}"))?;
    let mime = guess_mime(&buf, &raw);
    Ok(Base64Payload {
        base64: B64.encode(&raw),
        mime,
    })
}

fn guess_mime(path: &std::path::Path, bytes: &[u8]) -> String {
    let ext = path
        .extension()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_ascii_lowercase();
    match ext.as_str() {
        "png" => "image/png".into(),
        "jpg" | "jpeg" => "image/jpeg".into(),
        "gif" => "image/gif".into(),
        "webp" => "image/webp".into(),
        "svg" => "image/svg+xml".into(),
        "pdf" => "application/pdf".into(),
        "json" => "application/json".into(),
        "md" | "markdown" => "text/markdown".into(),
        "txt" => "text/plain".into(),
        _ => {
            // Magic bytes fallback for the few cases we care about.
            if bytes.starts_with(b"\x89PNG") {
                "image/png".into()
            } else if bytes.starts_with(&[0xFF, 0xD8, 0xFF]) {
                "image/jpeg".into()
            } else {
                "application/octet-stream".into()
            }
        }
    }
}

// A3 — operator-driven shell execution. Two layers of safety:
//
//   1. Env gate. `GAUNTLET_ALLOW_CODE_EXEC` must be exactly "1" or
//      "true" (case-insensitive) — same gate the backend already uses
//      for run_command in tools.py. No way to flip it from the JS side.
//   2. Binary allowlist. Even with the env on, only a curated set of
//      binaries can run. Anything else gets rejected before spawn.
//
// We do NOT pipe stdin and we cap output at 256 KB per stream so a
// runaway command can't blow the cápsula's memory.
const SHELL_ALLOWLIST: &[&str] = &[
    "git", "ls", "dir", "pwd", "cat", "echo", "head", "tail",
    "node", "npm", "npx", "python", "python3", "pip", "pip3",
    "ps", "whoami", "uname", "hostname", "date", "df", "du",
    "wc", "grep", "find", "which", "where", "rg",
];
const SHELL_OUTPUT_CAP: usize = 256 * 1024;

#[tauri::command]
fn run_shell(
    cmd: String,
    args: Option<Vec<String>>,
    cwd: Option<String>,
) -> Result<ShellResult, String> {
    let env_gate = std::env::var("GAUNTLET_ALLOW_CODE_EXEC")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);
    if !env_gate {
        return Err(
            "shell execution disabled — set GAUNTLET_ALLOW_CODE_EXEC=1 to opt in".into(),
        );
    }
    let cmd_trimmed = cmd.trim();
    if cmd_trimmed.is_empty() {
        return Err("empty command".into());
    }
    // Reject any path-shaped command — allowlist is by basename only.
    if cmd_trimmed.contains('/') || cmd_trimmed.contains('\\') {
        return Err(format!(
            "{cmd_trimmed} is path-shaped — allowlist matches by basename only"
        ));
    }
    let lower = cmd_trimmed.to_ascii_lowercase();
    let is_allowed = SHELL_ALLOWLIST
        .iter()
        .any(|allowed| lower == *allowed || lower == format!("{allowed}.exe"));
    if !is_allowed {
        return Err(format!(
            "{cmd_trimmed} is not in the shell allowlist ({} entries) — see SHELL_ALLOWLIST in src-tauri/src/lib.rs",
            SHELL_ALLOWLIST.len()
        ));
    }

    let started = std::time::Instant::now();
    let mut command = Command::new(cmd_trimmed);
    if let Some(args) = args {
        command.args(args);
    }
    if let Some(cwd) = cwd.as_deref() {
        if !cwd.is_empty() {
            command.current_dir(cwd);
        }
    }
    let output = command
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .stdin(Stdio::null())
        .output()
        .map_err(|e| format!("spawn {cmd_trimmed}: {e}"))?;

    let mut stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let mut stderr = String::from_utf8_lossy(&output.stderr).to_string();
    if stdout.len() > SHELL_OUTPUT_CAP {
        stdout.truncate(SHELL_OUTPUT_CAP);
        stdout.push_str("\n[gauntlet:truncated]");
    }
    if stderr.len() > SHELL_OUTPUT_CAP {
        stderr.truncate(SHELL_OUTPUT_CAP);
        stderr.push_str("\n[gauntlet:truncated]");
    }

    Ok(ShellResult {
        stdout,
        stderr,
        exit_code: output.status.code(),
        duration_ms: started.elapsed().as_millis() as u64,
    })
}

// Full-screen capture (non-interactive). Sibling to capture_screen_region
// — that one prompts the operator to drag-select; this one shoots the
// primary display straight to a temp file and returns base64 + path so
// the cápsula can both preview the image and reference it on disk.
#[tauri::command]
fn capture_screen_full() -> Result<ScreenCapture, String> {
    let mut path: PathBuf = std::env::temp_dir();
    path.push(format!(
        "gauntlet-screen-{}.png",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0),
    ));
    let path_str = path.to_string_lossy().to_string();

    #[cfg(target_os = "macos")]
    {
        // -x = no shutter sound, -t png = explicit format. No -i means
        // we capture the whole screen without a selection prompt.
        let status = Command::new("screencapture")
            .args(["-x", "-t", "png", &path_str])
            .status()
            .map_err(|e| format!("screencapture not found: {e}"))?;
        if !status.success() {
            return Err(format!("screencapture exited {:?}", status.code()));
        }
    }
    #[cfg(target_os = "linux")]
    {
        // gnome-screenshot -f writes the active display; scrot has the
        // same behaviour without -s. Either covers the common desktops.
        let attempts: &[(&str, &[&str])] = &[
            ("gnome-screenshot", &["-f"]),
            ("scrot", &[]),
            ("import", &["-window", "root"]),
        ];
        let mut last_err: Option<String> = None;
        let mut ok = false;
        for (bin, args) in attempts {
            let mut cmd_args: Vec<&str> = args.to_vec();
            cmd_args.push(&path_str);
            match Command::new(bin).args(&cmd_args).status() {
                Ok(s) if s.success() => {
                    ok = true;
                    break;
                }
                Ok(s) => last_err = Some(format!("{bin} exited {:?}", s.code())),
                Err(e) => last_err = Some(format!("{bin}: {e}")),
            }
        }
        if !ok {
            return Err(last_err.unwrap_or_else(|| {
                "no screenshot binary found (tried gnome-screenshot, scrot, import)".into()
            }));
        }
    }
    #[cfg(target_os = "windows")]
    {
        // PowerShell + System.Drawing. CopyFromScreen captures the
        // primary display in its native resolution. The script is one
        // string so we keep it scriptable; the caller doesn't depend
        // on a specific PowerShell version.
        let escaped = path_str.replace("'", "''");
        let script = format!(
            "Add-Type -AssemblyName System.Windows.Forms; \
             Add-Type -AssemblyName System.Drawing; \
             $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; \
             $img = New-Object System.Drawing.Bitmap $b.Width, $b.Height; \
             $g = [System.Drawing.Graphics]::FromImage($img); \
             $g.CopyFromScreen([System.Drawing.Point]::Empty, [System.Drawing.Point]::Empty, $b.Size); \
             $img.Save('{}', [System.Drawing.Imaging.ImageFormat]::Png); \
             $g.Dispose(); $img.Dispose();",
            escaped
        );
        let status = Command::new("powershell")
            .args(["-NoProfile", "-Command", &script])
            .status()
            .map_err(|e| format!("powershell not found: {e}"))?;
        if !status.success() {
            return Err(format!("powershell exited {:?}", status.code()));
        }
    }
    #[cfg(not(any(target_os = "macos", target_os = "linux", target_os = "windows")))]
    {
        return Err("full-screen capture not implemented for this OS".into());
    }

    let raw = std::fs::read(&path).map_err(|e| format!("read screenshot: {e}"))?;
    Ok(ScreenCapture {
        base64: B64.encode(&raw),
        path: path_str,
    })
}

// Shared toggle helper used by tray click + tray menu + the existing
// global shortcut path (which lives in the JS adapter and calls
// chrome.windows / Tauri's window APIs directly). Centralising the
// "is the window currently visible?" check here means tray and
// shortcut produce identical behaviour.
fn toggle_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let visible = window.is_visible().unwrap_or(false);
        if visible {
            let _ = window.hide();
        } else {
            let _ = position_window_at_cursor(app, &window);
            let _ = window.show();
            let _ = window.set_focus();
        }
    }
}

// Move the cápsula window so its top-left sits a few pixels right + down
// from the global OS cursor. Tauri 2's `cursor_position()` returns a
// physical position; `set_position` takes the same unit so we pass it
// through. Best-effort — if the cursor lookup fails we leave the window
// where it last was, the operator can drag it (no chrome though, so
// dragging requires `data-tauri-drag-region` zones in the cápsula). We
// also clamp against the cursor's monitor work area so the cápsula
// never opens off-screen when the operator hits the shortcut near the
// bottom-right edge.
fn position_window_at_cursor(
    app: &tauri::AppHandle,
    window: &tauri::WebviewWindow,
) -> Result<(), String> {
    let cursor = app.cursor_position().map_err(|e| e.to_string())?;
    let size = window.outer_size().map_err(|e| e.to_string())?;

    let mut x = cursor.x as i32 + 12;
    let mut y = cursor.y as i32 + 12;

    // Clamp inside the monitor that owns the window's current placement
    // so the cápsula never opens half-off-screen near a screen edge.
    // Using current_monitor (rather than per-cursor lookup) keeps the
    // call surface tight; multi-monitor edge cases will be revisited
    // when we tackle the desktop pill.
    if let Ok(Some(monitor)) = window.current_monitor() {
        let mpos = monitor.position();
        let msize = monitor.size();
        let max_x = mpos.x + msize.width as i32 - size.width as i32 - 8;
        let max_y = mpos.y + msize.height as i32 - size.height as i32 - 8;
        let min_x = mpos.x + 8;
        let min_y = mpos.y + 8;
        x = x.clamp(min_x, max_x.max(min_x));
        y = y.clamp(min_y, max_y.max(min_y));
    }

    window
        .set_position(tauri::PhysicalPosition { x, y })
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn move_window_to_cursor(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;
    position_window_at_cursor(&app, &window)
}

#[tauri::command]
fn show_capsule(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;
    let _ = position_window_at_cursor(&app, &window);
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn hide_capsule(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

// Pill window — small persistent surface that follows the cursor (or
// anchors to a screen corner when follow mode is off). Click →
// show_capsule; right-click → hide_pill (collapses to tray-only
// mode). The pill lives outside the cápsula's render tree so it
// survives every cápsula open/close.
fn position_pill_at_default(
    _app: &tauri::AppHandle,
    window: &tauri::WebviewWindow,
) -> Result<(), String> {
    let size = window.outer_size().map_err(|e| e.to_string())?;
    if let Ok(Some(monitor)) = window.current_monitor() {
        let mpos = monitor.position();
        let msize = monitor.size();
        // Bottom-right with a 24px breathing margin.
        let x = mpos.x + msize.width as i32 - size.width as i32 - 24;
        let y = mpos.y + msize.height as i32 - size.height as i32 - 24;
        window
            .set_position(tauri::PhysicalPosition { x, y })
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

// Same shape as position_window_at_cursor but with an 18px offset
// (larger than the cápsula's 12px because the pill is small enough
// that the cursor would visibly overlap it at the smaller offset, and
// the cursor must remain clickable next to the pill — not under it).
// Best-effort — when cursor lookup fails the caller falls back to
// position_pill_at_default.
fn position_pill_near_cursor(
    app: &tauri::AppHandle,
    window: &tauri::WebviewWindow,
) -> Result<(), String> {
    let cursor = app.cursor_position().map_err(|e| e.to_string())?;
    let size = window.outer_size().map_err(|e| e.to_string())?;

    let mut x = cursor.x as i32 + 18;
    let mut y = cursor.y as i32 + 18;

    if let Ok(Some(monitor)) = window.current_monitor() {
        let mpos = monitor.position();
        let msize = monitor.size();
        let max_x = mpos.x + msize.width as i32 - size.width as i32 - 8;
        let max_y = mpos.y + msize.height as i32 - size.height as i32 - 8;
        let min_x = mpos.x + 8;
        let min_y = mpos.y + 8;
        x = x.clamp(min_x, max_x.max(min_x));
        y = y.clamp(min_y, max_y.max(min_y));
    }

    window
        .set_position(tauri::PhysicalPosition { x, y })
        .map_err(|e| e.to_string())?;
    Ok(())
}

// Place the pill at the right anchor for the current mode: cursor
// when follow is on (and the OS cursor lookup works), otherwise the
// bottom-right corner default. Used at every entry point that turns
// the pill visible (boot, show, toggle, tray, ticker init) so the
// behaviour stays consistent across surfaces.
fn place_pill(app: &tauri::AppHandle, window: &tauri::WebviewWindow) {
    if PILL_FOLLOW_CURSOR.load(Ordering::Relaxed)
        && position_pill_near_cursor(app, window).is_ok()
    {
        return;
    }
    let _ = position_pill_at_default(app, window);
}

#[tauri::command]
fn show_pill(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("pill")
        .ok_or_else(|| "pill window not found".to_string())?;
    let visible = window.is_visible().unwrap_or(false);
    if !visible {
        place_pill(&app, &window);
    }
    window.show().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn hide_pill(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("pill")
        .ok_or_else(|| "pill window not found".to_string())?;
    window.hide().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn toggle_pill(app: tauri::AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("pill")
        .ok_or_else(|| "pill window not found".to_string())?;
    let visible = window.is_visible().unwrap_or(false);
    if visible {
        window.hide().map_err(|e| e.to_string())?;
    } else {
        place_pill(&app, &window);
        window.show().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn set_pill_follow_cursor(enabled: bool) {
    PILL_FOLLOW_CURSOR.store(enabled, Ordering::Relaxed);
}

#[tauri::command]
fn get_pill_follow_cursor() -> bool {
    PILL_FOLLOW_CURSOR.load(Ordering::Relaxed)
}

// ── Computer-use primitives (Phase 3 MVP) ─────────────────────────────────
//
// Four narrow Tauri commands wrapping `enigo` for cross-platform mouse +
// keyboard control. Naming uses the `cu_` prefix so the JS bridge can
// search-and-find the family without grepping every Tauri command.
//
// Doctrine: these are PRIMITIVES — they do exactly what the caller asks
// and nothing else. The consent gate (modal asking the operator "click
// here?" before each action) lives in the Composer, not here. Reason:
// the gate UI must reflect doctrine ("denso, viciante") + survive future
// MCP migration; pinning it inside Rust would freeze it to one shape.
//
// Caps (defensive):
// * cu_type: 10k chars max — typical paste size, stops a runaway loop
//   from holding the keyboard for minutes.
// * cu_mouse_move: no clamp here. Caller (Composer gate) clamps to the
//   monitor work area before submitting; off-screen requests are also
//   safely no-op on most platforms.
// * Wayland sessions return a NewConError from `Enigo::new`; the JS
//   side surfaces it as the typed error string so the gate can fall
//   back to "this OS not supported".

const CU_MAX_TEXT_LEN: usize = 10_000;

fn cu_new_enigo() -> Result<Enigo, String> {
    Enigo::new(&CuSettings::default()).map_err(|e| e.to_string())
}

#[tauri::command]
fn cu_mouse_move(x: i32, y: i32) -> Result<(), String> {
    let mut enigo = cu_new_enigo()?;
    enigo
        .move_mouse(x, y, CuCoordinate::Abs)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn cu_mouse_click(button: String) -> Result<(), String> {
    let btn = parse_cu_button(&button)?;
    let mut enigo = cu_new_enigo()?;
    enigo
        .button(btn, CuDirection::Click)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn cu_type(text: String) -> Result<(), String> {
    if text.is_empty() {
        return Err("cu_type: empty text".to_string());
    }
    if text.len() > CU_MAX_TEXT_LEN {
        return Err(format!(
            "cu_type: text too long ({} chars > {} max)",
            text.len(),
            CU_MAX_TEXT_LEN
        ));
    }
    let mut enigo = cu_new_enigo()?;
    enigo.text(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn cu_press(key: String) -> Result<(), String> {
    let k = parse_cu_key(&key)?;
    let mut enigo = cu_new_enigo()?;
    enigo
        .key(k, CuDirection::Click)
        .map_err(|e| e.to_string())
}

pub fn parse_cu_button(name: &str) -> Result<CuButton, String> {
    match name.to_lowercase().as_str() {
        "left" | "l" => Ok(CuButton::Left),
        "right" | "r" => Ok(CuButton::Right),
        "middle" | "m" => Ok(CuButton::Middle),
        other => Err(format!("cu_mouse_click: unknown button '{other}'")),
    }
}

pub fn parse_cu_key(name: &str) -> Result<CuKey, String> {
    // Named-key match is case-insensitive ("Enter" == "enter") because
    // operator-typed names shouldn't care about case.
    match name.to_lowercase().as_str() {
        "enter" | "return" => return Ok(CuKey::Return),
        "tab" => return Ok(CuKey::Tab),
        "escape" | "esc" => return Ok(CuKey::Escape),
        "backspace" => return Ok(CuKey::Backspace),
        "delete" | "del" => return Ok(CuKey::Delete),
        "space" => return Ok(CuKey::Space),
        "up" | "uparrow" => return Ok(CuKey::UpArrow),
        "down" | "downarrow" => return Ok(CuKey::DownArrow),
        "left" | "leftarrow" => return Ok(CuKey::LeftArrow),
        "right" | "rightarrow" => return Ok(CuKey::RightArrow),
        "home" => return Ok(CuKey::Home),
        "end" => return Ok(CuKey::End),
        "pageup" => return Ok(CuKey::PageUp),
        "pagedown" => return Ok(CuKey::PageDown),
        _ => {}
    }
    // Single-character keys (a, b, 1, 2, … plus uppercase) → Unicode
    // variant. Case is preserved here so `Key::Unicode('A')` types 'A'
    // (with shift) while `Key::Unicode('a')` types 'a'. Anything longer
    // than one char is rejected so the JS side gets a clean error
    // rather than a silent no-op.
    let mut chars = name.chars();
    match (chars.next(), chars.next()) {
        (Some(c), None) => Ok(CuKey::Unicode(c)),
        _ => Err(format!("cu_press: unknown key '{name}'")),
    }
}

fn run_capture(bin: &str, args: &[&str]) -> Result<String, String> {
    let output = Command::new(bin)
        .args(args)
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("{bin} not found or not executable: {e}"))?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "{bin} exited {:?}: {}",
            output.status.code(),
            stderr.trim()
        ));
    }
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            get_active_window,
            capture_screen_region,
            capture_screen_full,
            pick_file,
            pick_save_path,
            read_text_file_at,
            read_file_base64_at,
            write_text_file_at,
            write_file_base64_at,
            run_shell,
            start_backend,
            stop_backend,
            move_window_to_cursor,
            show_capsule,
            hide_capsule,
            show_pill,
            hide_pill,
            toggle_pill,
            set_pill_follow_cursor,
            get_pill_follow_cursor,
            cu_mouse_move,
            cu_mouse_click,
            cu_type,
            cu_press,
        ])
        .setup(|app| {
            // A5 — system tray. The cápsula lives in the OS menu bar
            // even when the window is hidden, so the operator can
            // re-summon with one click instead of digging through Alt-Tab.
            // Two menu items: toggle (mirrors the global shortcut) and
            // quit. Left-click on the icon also toggles the window.
            let s = strings();
            let toggle_item = MenuItem::with_id(
                app,
                "tray-toggle",
                s.tray_toggle,
                true,
                None::<&str>,
            )?;
            let pill_item = MenuItem::with_id(
                app,
                "tray-pill",
                s.tray_pill,
                true,
                None::<&str>,
            )?;
            let quit_item = MenuItem::with_id(
                app,
                "tray-quit",
                s.tray_quit,
                true,
                None::<&str>,
            )?;
            let tray_menu = Menu::with_items(app, &[&toggle_item, &pill_item, &quit_item])?;

            let _tray = TrayIconBuilder::with_id("gauntlet-tray")
                .icon(app.default_window_icon().cloned().ok_or_else(|| {
                    tauri::Error::AssetNotFound("default window icon".to_string())
                })?)
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "tray-toggle" => toggle_main_window(app),
                    "tray-pill" => {
                        if let Some(window) = app.get_webview_window("pill") {
                            let visible = window.is_visible().unwrap_or(false);
                            if visible {
                                let _ = window.hide();
                            } else {
                                place_pill(app, &window);
                                let _ = window.show();
                            }
                        }
                    }
                    "tray-quit" => {
                        let _ = stop_backend();
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_main_window(tray.app_handle());
                    }
                })
                .build(app)?;

            // Best-effort autostart at app launch when the operator
            // opted in. Errors here are logged but never block the
            // window from showing — the cápsula keeps working with a
            // pre-running backend.
            if std::env::var("GAUNTLET_DESKTOP_AUTOSTART_BACKEND")
                .map(|v| v == "1" || v.to_lowercase() == "true")
                .unwrap_or(false)
            {
                if let Err(e) = start_backend() {
                    eprintln!("[gauntlet/desktop] backend autostart failed: {e}");
                }
            }

            // Show the pill window at boot so the operator has a
            // visible anchor without needing to dig into the tray. The
            // cápsula stays hidden — the pill is the resting state.
            if let Some(pill) = app.get_webview_window("pill") {
                place_pill(app.handle(), &pill);
                let _ = pill.show();
            }

            // Pill cursor-follow ticker. Repositions the pill to track
            // the OS cursor at ~30Hz when the pill is visible, the
            // cápsula is hidden, and PILL_FOLLOW_CURSOR is on. Sleeps
            // 500ms on idle so the CPU stays near zero when the pill
            // is dormant. This is what closes the "ponta do cursor"
            // doctrine on the desktop shell — the pill is no longer
            // pinned to a corner, it lives where the operator's
            // attention is.
            let follow_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                loop {
                    let mut painted = false;
                    if PILL_FOLLOW_CURSOR.load(Ordering::Relaxed) {
                        let pill = follow_handle.get_webview_window("pill");
                        let capsule = follow_handle.get_webview_window("main");
                        let pill_visible = pill
                            .as_ref()
                            .and_then(|w| w.is_visible().ok())
                            .unwrap_or(false);
                        let capsule_visible = capsule
                            .as_ref()
                            .and_then(|w| w.is_visible().ok())
                            .unwrap_or(false);
                        if pill_visible && !capsule_visible {
                            if let Some(window) = pill {
                                let _ = position_pill_near_cursor(&follow_handle, &window);
                                painted = true;
                            }
                        }
                    }
                    let nap = if painted {
                        Duration::from_millis(33)
                    } else {
                        Duration::from_millis(500)
                    };
                    tokio::time::sleep(nap).await;
                }
            });

            // Background health probe — every 5s we open a TCP socket
            // to 127.0.0.1:3002 (default backend port). When it answers
            // the tray tooltip says "backend conectado"; on failure it
            // says "backend offline". Operator sees the state without
            // opening the cápsula. Pure stdlib — no reqwest dep just
            // for a connect() probe. Backend autostart already covers
            // boot races; this just reports.
            let probe_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                use std::net::{SocketAddr, TcpStream};
                use std::time::Duration;
                let target: SocketAddr = "127.0.0.1:3002".parse().expect("valid addr");
                let mut last_state: Option<bool> = None;
                loop {
                    let healthy = tokio::task::spawn_blocking(move || {
                        TcpStream::connect_timeout(&target, Duration::from_millis(800)).is_ok()
                    })
                    .await
                    .unwrap_or(false);
                    if last_state != Some(healthy) {
                        if let Some(tray) = probe_handle.tray_by_id("gauntlet-tray") {
                            let s = strings();
                            let label = if healthy { s.health_ok } else { s.health_off };
                            let _ = tray.set_tooltip(Some(label));
                        }
                        last_state = Some(healthy);
                    }
                    tokio::time::sleep(Duration::from_secs(5)).await;
                }
            });

            Ok(())
        })
        .on_window_event(|_window, event| {
            // Reap the backend process on app exit so we don't leak a
            // zombie listening on :3002 across reloads.
            if let tauri::WindowEvent::Destroyed = event {
                let _ = stop_backend();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running gauntlet desktop");
}
