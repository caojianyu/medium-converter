#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
use commands::{close_splashscreen, read_progress, remove_progress, stop_ffmpeg, video_transcode,is_exists};

fn main() {
    use std::{
        cmp::min,
        io::{Read, Seek, SeekFrom},
        path::PathBuf,
    };
    use tauri::http::{HttpRange, ResponseBuilder};

    let context = tauri::generate_context!();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            video_transcode,
            read_progress,
            remove_progress,
            stop_ffmpeg,
            close_splashscreen,
            is_exists
        ])
        .register_uri_scheme_protocol("stream", move |_app, request| {
            // prepare our response
            let mut response = ResponseBuilder::new();
            // get the wanted path
            #[cfg(target_os = "windows")]
            let path = request.uri().strip_prefix("stream://localhost/").unwrap();
            #[cfg(not(target_os = "windows"))]
            let path = request.uri().strip_prefix("stream://").unwrap();
            let path = percent_encoding::percent_decode(path.as_bytes())
                .decode_utf8_lossy()
                .to_string();

            let video_file = PathBuf::from(path);

            // read our file
            let mut content = std::fs::File::open(&video_file)?;
            let mut buf = Vec::new();

            // default status code
            let mut status_code = 200;

            // if the webview sent a range header, we need to send a 206 in return
            // Actually only macOS and Windows are supported. Linux will ALWAYS return empty headers.
            if let Some(range) = request.headers().get("range") {
                // Get the file size
                let file_size = content.metadata().unwrap().len();

                // we parse the range header with tauri helper
                let range = HttpRange::parse(range.to_str().unwrap(), file_size).unwrap();
                // let support only 1 range for now
                let first_range = range.first();
                if let Some(range) = first_range {
                    let mut real_length = range.length;

                    // prevent max_length;
                    // specially on webview2
                    if range.length > file_size / 3 {
                        // max size sent (400ko / request)
                        // as it's local file system we can afford to read more often
                        real_length = min(file_size - range.start, 1024 * 400);
                    }

                    // last byte we are reading, the length of the range include the last byte
                    // who should be skipped on the header
                    let last_byte = range.start + real_length - 1;
                    // partial content
                    status_code = 206;

                    // Only macOS and Windows are supported, if you set headers in linux they are ignored
                    response = response
                        .header("Connection", "Keep-Alive")
                        .header("Accept-Ranges", "bytes")
                        .header("Content-Length", real_length)
                        .header(
                            "Content-Range",
                            format!("bytes {}-{}/{}", range.start, last_byte, file_size),
                        );

                    // FIXME: Add ETag support (caching on the webview)

                    // seek our file bytes
                    content.seek(SeekFrom::Start(range.start))?;
                    content.take(real_length).read_to_end(&mut buf)?;
                } else {
                    content.read_to_end(&mut buf)?;
                }
            }

            response.mimetype("video/*").status(status_code).body(buf)
        })
        .menu(if cfg!(target_os = "macos") {
            tauri::Menu::os_default(&context.package_info().name)
        } else {
            tauri::Menu::default()
        })
        .run(context)
        .expect("error while running tauri application");
}
