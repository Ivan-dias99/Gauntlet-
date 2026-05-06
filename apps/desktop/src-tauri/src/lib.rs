// Gauntlet — desktop cápsula entry (Tauri 2 / Sprint 6).
//
// The Rust side is intentionally thin: register the clipboard + global
// shortcut plugins, hand control to the JS front-end. The cápsula's
// composer-client.ts talks straight to the local FastAPI backend over
// fetch (allow-listed in capabilities/default.json's CSP).
//
// Sprint 6 deliberately stops at "shell + capsule visible". Tray icon,
// in-process FastAPI sidecar, and OS-level screenshot region all land
// in Sprint 7+ — they require platform-specific plugins (some still in
// flux for Tauri 2) that are not in scope this sprint.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|_app| {
            // The global shortcut is registered from the JS side via the
            // adapter so the binding is colocated with the handler that
            // toggles the window. Doing it here would split that logic
            // across languages for no upside.
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running gauntlet desktop");
}
