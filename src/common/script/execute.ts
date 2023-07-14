import { Child, Command } from "@tauri-apps/api/shell";
import { Ref, ref } from "vue";
import { audioTranscodeCmd, videoTranscodeCmd } from "../commands";
import { store } from "../../store";
import { dateTimeToSecond } from "../util";
import { DataType } from "../enum";

/** 执行转换时保存的进程对象 */
const processMap = ref(new Map<string, Child>());

/** 数据处理类型 */
let dataType: DataType;

/**
 * 清空列表
 * 
 * @param dataList 数据列表
 */
export function useClearList(dataList: Ref<Record<string, any>[]>) {
    dataList.value = [];
    // 将所有任务都结束掉
    for (const child of processMap.value.values()) {
        child.kill();
    }
    // 清空保存进程对象的map
    processMap.value.clear();
};

/**
 * 删除对应索引数据
 * 
 * @param index 对应删除数据的索引
 * @param dataList 数据列表
 */
export async function useDelByIndex(index: number, dataList: Ref<Record<string, any>[]>) {
    // 删除对应进度字段
    // delete dataList.value[index].progress;
    // 获取媒体信息唯一id
    const video = dataList.value[index];
    // 如果已经在转换中，则关闭进程
    const child = processMap.value.get(video.id);
    await child?.kill();
    // 删除map中的进程对象
    processMap.value.delete(video.id);
    // 删除数组中的元素
    dataList.value.splice(index, 1);
};

/**
 * 执行转换
 * 
 * @param dataList 数据列表
 * @param index 对应转换的数据索引，为空则全部转换
 */
export async function useStart(dataList: Ref<Record<string, any>[]>, type: DataType, index?: number) {
    dataType = type;
    if (index != undefined) {
        // 单个媒体转换
        await execute(dataList.value[index]);
    } else {
        // 所有媒体转换
        dataList.value.forEach(async (item) => {
            // 有转换进度则表示已经在转换中或转换完成，只处理未转换的
            if (!item.progress) {
                await execute(item);
            }
        });
    }
};

/**
 * 执行命令行
 * 
 * @param data 参数
 */
async function execute(data: Record<string, any>) {
    // 分辨率是原分辨率则直接将媒体原值赋值过去，否则赋值选中的分辨率
    const convertDpiOrBitRate =
        data.convertDpiOrBitRateIndex == 0
            ? data.dpiOrBitRate
            : data.convertDpiOrBitRate;
    // 媒体转换命令：progress是进度条，pipe:2是指定输出到stderr，如果为1则表示输出到stdout。
    // ffmpeg默认输出到stderr，但进度条必须指定输出，可以是文件或者上述的stderr或stdout
    // 示例： ffmpeg -i input.mkv -s 640x320 -progress pipe:2 output.mp4
    const path = `${store.outputDir}/${data.filename}.${data.convertSuffix}`;

    // 获取执行对象（根据数据类型来确定处理的视频还是音频）
    let command: Command;
    switch (dataType) {
        case DataType.AUDIO:
            command = await audioTranscodeCmd(data.localFilePath, convertDpiOrBitRate, path)
            break;
        case DataType.VIDEO:
            command = await videoTranscodeCmd(data.localFilePath, convertDpiOrBitRate, path)
            break;
    }

    // 命令执行结束时触发
    command.on("close", (data) => {
        // TODO 结束触发
    });
    // 命令执行错误时候触发
    command.on("error", (error) => console.log(`command error: "${error}"`));

    // 标准输出，行缓冲
    command.stdout.on("data", (line) => {
        console.log(line);
    });
    // 标准错误，无缓冲
    command.stderr.on("data", (line) => {
        // 通过输出字段获取时间
        if (line.includes("out_time=")) {
            // 截取获取时分秒的时间值
            const time = line.split("=")[1];
            // 通过转换为秒与媒体总时长来计算百分比
            const duration = dateTimeToSecond(time);
            // 计算得到进度比例
            const percentage = duration / Math.floor(data.duration);
            // 转换为以%号显示的数值
            data.progress = (percentage * 100).toFixed() + "%";
        }

        // 转码结束赋值为100%
        if (line == "progress=end") {
            data.progress = "100%";
        }
    });
    // 执行命令为子进程
    const child = await command.spawn();
    // 将进程对象保存至数组
    processMap.value.set(data.id, child);
};