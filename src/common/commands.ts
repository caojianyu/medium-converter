
/**
 * @author 994Ay
 * @description ffmpeg和cmd命令行
 */

import { Command } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";

/**
 * 获取媒体文件信息
 * 
 * @param filePath 文件路径
 * @example 
 * ```ffmpeg 
 * ffprobe -v quiet -show_format -show_streams -print_format json c:/1.mp4
 * ```
 * @returns 命令行对象
 */
function getMediaInfoCmd(filePath: string) {
    const cmd = `-v quiet -show_format -show_streams -print_format json`;
    // 截取获得命令行数组
    const cmdArr = cmd.split(" ");
    cmdArr.push(filePath)
    return new Command("ffprobe", cmdArr);
}

/**
 * 视频转码
 * 
 * @param localFilePath 本地文件路径
 * @param convertDpi 转换分辨率
 * @param outputFilePath 输出文件路径
 * @example 
 * ```ffmpeg 
 * ffmpeg -i c:/1.mp4 -s 1920x1080 -progress pipe:2 c:/1(1).mp4
 * ```
 * @returns 命令行对象
 */
async function videoTranscodeCmd(localFilePath: string, convertDpi: string, outputFilePath: string) {
    // 获取输出路径（需要检测重复文件名）
    const filePath = await invoke<string>("get_output_file_path", { outputFilePath });
    // 构建视频转换命令
    const cmdArr = ['-i']
    cmdArr.push(localFilePath)
    cmdArr.push('-s')
    cmdArr.push(convertDpi)
    cmdArr.push('-progress')
    cmdArr.push('pipe:2')
    cmdArr.push(filePath)
    return new Command("ffmpeg", cmdArr);
}

/**
 * 音频转码
 * 
 * @param localFilePath 本地文件路径
 * @param bitRate 转换比特率
 * @param outputFilePath 输出文件路径
 * @example 
 * ```ffmpeg 
 * ffmpeg -i c:/1.mp3 -b:v 256k -progress pipe:2 c:/1(1).mp3
 * ```
 * @returns 命令行对象
 */
async function audioTranscodeCmd(localFilePath: string, bitRate: string, outputFilePath: string) {
    // 获取输出路径（需要检测重复文件名）
    const filePath = await invoke<string>("get_output_file_path", { outputFilePath });
    // 构建音频转换命令
    const cmdArr = ['-i']
    cmdArr.push(localFilePath)
    cmdArr.push('-b:v')
    cmdArr.push(bitRate)
    cmdArr.push('-progress')
    cmdArr.push('pipe:2')
    cmdArr.push(filePath)
    return new Command("ffmpeg", cmdArr);
}

/** 以下为cmd命令行 */

/**
 * 运行windows程序，在本软件中主要用于调起windows程序播放音频和视频
 * 
 * @param param 参数
 */
async function play(param: string) {
    await new Command("cmd", ['/C', 'start', param, param]).execute();
}

export { getMediaInfoCmd, videoTranscodeCmd, audioTranscodeCmd, play }