import { desktopDir, videoDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { Ref } from "vue";
import { getMediaInfoCmd } from "../commands";
import { isVideo, uuid, byteConversion, formatDateTime } from "../util";
import { store } from "../../store";


/**
 * 选择文件并解析
 * 
 * @param extensions 可选文件扩展名（区分视频和音频）
 * @param paramList 可转换格式参数数组
 * @param dataList 已选择数据列表
 */
export async function useSelectFile(extensions: string[], paramList: Record<string, any>[], dataList: Ref<Record<string, any>[]>) {
    const selected = (await open({
        multiple: true,
        filters: [
            {
                name: "Video",
                extensions,
            },
        ],
        defaultPath: await videoDir(),
    })) as string[];

    // 判断是否选择了文件
    if (selected && selected.length > 0) {
        // 循环选中的媒体列表
        selected.forEach(async (item) => {
            // 截取路径得到文件名（不包含后缀）
            const filename = item.substring(
                item.lastIndexOf("\\") + 1,
                item.lastIndexOf(".")
            );
            // 截取字符串得到后缀，也是文件格式
            const suffix = item.substring(item.lastIndexOf(".") + 1);
            // 将本地媒体路径转换成可以在前端直接访问的路径
            const src = convertFileSrc(item);
            let jsonResultStr = "";
            // ffmpeg获取媒体信息命令
            const command = getMediaInfoCmd(item);
            // 命令执行结束时触发
            command.on("close", (data) => {
                // 将命令行输入的字符串转换为js对象
                const jsonResult = JSON.parse(jsonResultStr);
                // 读取媒体总体信息
                const format = jsonResult.format;
                // 读取媒体流参数对象，0为视频信息，1为音频信息
                const streams = jsonResult.streams[0];

                // 判断是否是视频数据
                const video = isVideo(suffix);

                // 数据对象
                const dataObj: Record<string, any> = {
                    // 唯一id
                    id: uuid(),
                    // 标识（不是视频则是音频）
                    isVideo: video,
                    // 文件名
                    filename,
                    // 后缀
                    suffix,
                    // 可访问路径
                    src,
                    // 大小
                    size: byteConversion(format.size),
                    // 时长
                    time: formatDateTime(parseInt(format.duration)),
                    // 本地路径，也就是没有转换的路径
                    localFilePath: item,
                    // 总时长
                    duration: format.duration,
                    // 转换格式的下标，默认为0，即第1个
                    convertSuffixIndex: 0,
                    // 转换格式，即转换格式下标对应的name值，默认为第1个name值
                    convertSuffix: paramList[0].name,
                    // 转换描述信息
                    convertDescribe: paramList[0].children[0].name,
                    // 转化分辨率或比例率的下标，默认为0，即第1个
                    convertDpiOrBitRateIndex: 0
                }

                // 根据不同的数据类型来赋值
                if (video) {
                    // 视频数据独有的，分辨率相关
                    dataObj.dpiOrBitRate = streams.width + 'x' + streams.height
                    // 转换分辨率，默认为原媒体分辨率
                    dataObj.convertDpiOrBitRate = paramList[0].children[0].value
                } else {
                    // 音频数据独有的，比特率相关
                    // 原始比特率
                    dataObj.dpiOrBitRate = format.bit_rate
                    // 转换比特率（默认为原始比特率）
                    dataObj.convertDpiOrBitRate = format.bit_rate
                }

                // 将媒体的信息push到数组
                dataList.value.push(dataObj);
            });
            // 命令执行错误时候触发
            command.on("error", (error) => console.log(`command error: "${error}"`));
            // 监听执行命令输出的信息
            command.stdout.on("data", (line) => {
                // 拼接每行输出数据
                jsonResultStr += line;
            });
            // 监听执行命令错误时输出的信息
            command.stderr.on("data", (line) =>
                console.log(`command stderr: "${line}"`)
            );

            // 使用子进程执行
            await command.spawn();
        });
    }
};


/** 更改输出目录 */
export async function useChangeOutputDir() {
    // Open a selection dialog for directories
    const selected = (await open({
        directory: true,
        multiple: false,
        defaultPath: await desktopDir(),
    })) as string;

    if (selected) {
        store.outputDir = selected;
    }
}