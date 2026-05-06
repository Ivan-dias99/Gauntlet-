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

use serde::Serialize;
use tauri::Manager;

#[derive(Serialize, Clone, Debug)]
pub struct WindowInfo {
    pub title: String,
    pub app: String,
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
        .invoke_handler(tauri::generate_handler![
            get_active_window,
            capture_screen_region,
            start_backend,
            stop_backend,
        ])
        .setup(|app| {
            // Best-effort autostart at app launch when the operator
            // opted in. Errors here are logged but never block the
            // window from showing — the cápsula keeps working with a
            // pre-running backend.
            let _ = app.handle();
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
