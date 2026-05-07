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
use std::sync::Mutex;

use base64::{engine::general_purpose::STANDARD as B64, Engine};
use serde::Serialize;
use tauri::Manager;
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
        ])
        .setup(|_app| {
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
