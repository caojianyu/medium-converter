use std::ffi::OsStr;
use std::path::Path;

use tauri::command;
use tauri::Manager;

/// 关闭开屏界面，并打开主界面（通常在关闭之前初始化）
#[command]
pub async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

/// 获取不重复的输出路径
#[command]
pub fn get_output_file_path(output_file_path: String) -> String {
    // 获取路径后缀
    let suffix = Path::new(&output_file_path)
        .extension()
        .and_then(OsStr::to_str)
        .unwrap();
    // 获取除路径的部分
    let filename_path = output_file_path.strip_suffix(suffix).unwrap().to_string();
    // 开始递归处理
    let file_path = create_file_path(0, output_file_path.clone(), filename_path, suffix);
    file_path
}

/// 递归查询并生成不重复的输出路径
fn create_file_path(
    mut number: i32,
    output_file_path: String,
    filename_path: String,
    suffix: &str,
) -> String {
    let file_path = Path::new(&output_file_path);
    if file_path.exists() {
        // 文件存在的情况
        // 序号加1
        number += 1;
        // 按序号拼接新的文件名
        let mut new_output_file_path = filename_path.clone();
        new_output_file_path.push_str("(");
        new_output_file_path.push_str(&number.to_string());
        new_output_file_path.push_str(").");
        new_output_file_path.push_str(suffix);
        create_file_path(number, new_output_file_path, filename_path, suffix)
    } else {
        // 文件不存在直接返回
        output_file_path
    }
}
