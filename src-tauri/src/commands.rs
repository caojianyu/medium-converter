// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

use rev_lines::RevLines;
use std::{
    fs::{remove_file, File},
    io::{BufReader, Write},
    path::Path,
    process::Command,
    thread,
};

use tauri::command;
use tauri::Manager;

use encoding::all::GBK;
use encoding::{EncoderTrap, Encoding};

// #[command]
// pub fn stateful_command(argument: Option<String>, state: State<'_, super::MyState>) {
//   println!("{:?} {:?}", argument, state.inner());
// }

const PROGRESS_PATH: &str = "progress.txt";

#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

#[command]
pub fn is_exists(export_path: &str) -> bool {
    let path = Path::new(export_path);
    path.exists()
}

#[command]
pub fn stop_ffmpeg() {
    Command::new("wscript.exe")
        .arg("exit.vbs")
        .status()
        .expect("failed to execute process");
}

#[command]
pub fn remove_progress() {
    let path = Path::new(PROGRESS_PATH);
    if path.exists() {
        remove_file(path).expect("remove file failed");
    }
}

#[command]
pub fn read_progress() -> Vec<String> {
    // let progress_file = OpenOptions::new()
    //     .read(true)
    //     .write(true)
    //     .open("progress.txt")
    //     .unwrap();

    let progress_file = File::open(PROGRESS_PATH).expect("open file failed");

    let rev_lines = RevLines::new(BufReader::new(progress_file)).expect("read file failed");

    let n_last_lines = 12;
    let mut lines: Vec<String> = Vec::new();
    let mut counter = 0;
    for line in rev_lines {
        if counter >= n_last_lines {
            break;
        }
        counter = counter + 1;
        lines.push(line);
    }

    lines
}

#[command]
pub fn video_transcode(file_path: String, export_path: String, dpi: String, is_cover: bool) {
    let mut ffmpeg_path = std::env::current_dir().unwrap();
    ffmpeg_path.push("ffmpeg");

    // let mut args: Vec<String> = Vec::new();
    // args.push(String::from("-i"));

    let mut command = String::from(" -i ");
    command.push_str(" \"");
    command.push_str(file_path.as_str());
    command.push_str("\" ");

    if !dpi.is_empty() {
        command.push_str(" -s ");
        command.push_str(dpi.as_str());
    }

    command.push_str(" -progress ");
    command.push_str(" progress.txt ");
    command.push_str(" \"");
    command.push_str(export_path.as_str());
    command.push_str("\" ");

    thread::spawn(move || {
        if cfg!(target_os = "windows") {
            ffmpeg_path.push("windows-x86_64");
            ffmpeg_path.push("app_ffmpeg.exe");

            let ffmpeg_path_str = ffmpeg_path.into_os_string().into_string().unwrap();

            let mut ffmpeg_format_str = String::from("\"");
            ffmpeg_format_str.push_str(ffmpeg_path_str.as_str());
            ffmpeg_format_str.push_str("\" ");

            ffmpeg_format_str.push_str(command.as_str());
            if is_cover {
                ffmpeg_format_str.push_str(" -y ");
            }

            write_command_to_file(ffmpeg_format_str);

            Command::new("wscript.exe")
                .arg("start.vbs")
                .status()
                .expect("failed to execute process")
        } else {
            ffmpeg_path.push("linux-x86_64");
            ffmpeg_path.push("ffmpeg");

            // let ffmpeg_path_str = ffmpeg_path.into_os_string().into_string().unwrap();
            Command::new("sh")
                .arg("-c")
                .arg("echo hello")
                .status()
                .expect("failed to execute process")
        };
    });
    // some work here
    // let res = thread_join_handle.join();
}

fn write_command_to_file(command: String) {
    let mut file = File::create("run.bat").expect("create failed");

    let arr = GBK
        .encode(command.as_str(), EncoderTrap::Strict)
        .expect("encode error");
    // GBK.decode(command.as_bytes(), DecoderTrap::Strict);
    file.write_all(&arr).expect("write failed");
}

// #[command]
// pub fn video_transcode(file_path: String, export_path: String, dpi: String) {
//     let mut ffmpeg_path = std::env::current_dir().unwrap();
//     ffmpeg_path.push("ffmpeg");

//     let mut args: Vec<String> = Vec::new();
//     args.push(String::from("-i"));
//     args.push(file_path);

//     if !dpi.is_empty() {
//         args.push(String::from("-s"));
//         args.push(dpi);
//     }

//     args.push(String::from("-progress"));
//     args.push(String::from("progress.txt"));
//     args.push(export_path);

//     thread::spawn(move || {
//         if cfg!(target_os = "windows") {
//             ffmpeg_path.push("windows-x86_64");
//             ffmpeg_path.push("ffmpeg.exe");

//             let ffmpeg_path_str = ffmpeg_path.into_os_string().into_string().unwrap();
//             args.insert(0, ffmpeg_path_str);
//             args.push(String::from("-loglevel"));
//             args.push(String::from("quiet"));

//             Command::new("cmd")
//                 .arg("/C")
//                 .args(args)
//                 .output()
//                 .expect("failed to execute process")
//         } else {
//             ffmpeg_path.push("linux-x86_64");
//             ffmpeg_path.push("ffmpeg");

//             let ffmpeg_path_str = ffmpeg_path.into_os_string().into_string().unwrap();
//             args.insert(0, ffmpeg_path_str);
//             Command::new("sh")
//                 .arg("-c")
//                 .arg("echo hello")
//                 .output()
//                 .expect("failed to execute process")
//         };
//     });
//     // some work here
//     // let res = thread_join_handle.join();
// }
