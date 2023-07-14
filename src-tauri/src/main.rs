// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use commands::{close_splashscreen, get_output_file_path};
mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            get_output_file_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
