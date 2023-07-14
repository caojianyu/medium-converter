import { reactive, ref } from "vue";
import { videoFormatArr, videoParamList } from "../../constants";
import { useSelectFile } from "../file";
import { useSelectChild, useSelectSuffix, GlobalData, useOpenParamsPanel } from "../params";
import { useClearList, useDelByIndex, useStart } from "../execute";
import { DataType } from "../../enum";

/** 选择文件的扩展名称 */
const extensions = videoFormatArr;

/** 数据对应索引 */
const indexData = reactive({
    // 当前选中转换参数格式的下标
    currentSuffixIndex: 0,
    // 当前选中二级参数的下标
    currentSecondLevelIndex: 0,
    // 当前媒体数据的下标
    currentDataIndex: -1
});

/** 全局转换参数（默认显示视频转换参数） */
const globalData = reactive<GlobalData>({
    // 控制全局的格式切换
    globalSuffix: "mp4",
    // 控制全局的分辨率或比特率切换
    globalDpiOrBitRate: "同原文件",
    // 全局后缀索引
    globalSuffixIndex: 0,
    // 全局分辨率或比特率索引
    globalDpiOrBitRateIndex: 0,
});

/** 需要处理的媒体数据 */
const dataList = ref<Record<string, any>[]>([]);

/** 文件选择 */
function selectFile() {
    useSelectFile(extensions, videoParamList, dataList)
}

/**
 * 打开参数面板， 模态框和参数面板同步显示
 * 
 * @param index 对应数据项索引，为空则是统一参数
 */
function openParamsPanel(index?: number) {
    useOpenParamsPanel(dataList, indexData, globalData, index)
}

/**
 * 选择二级参数
 * 
 * @param index 对应二级参数索引
 */
function selectSuffix(index: number) {
    useSelectSuffix(index, indexData)
}

/**
 * 选择二级参数
 * 
 * @param index 对应二级参数索引
 */
function selectChild(index: number) {
    useSelectChild(index, videoParamList, indexData, dataList, globalData)
}

/** 清空数据列表 */
function clearList() {
    useClearList(dataList)
}

/**
 * 删除索引对应数据
 * 
 * @param index 对应数据索引
 */
function delByIndex(index: number) {
    useDelByIndex(index, dataList)
}

/**
 * 开始执行转换操作
 * 
 * @param index 对应转换的索引，为空时则全部转换
 */
function start(index?: number) {
    useStart(dataList, DataType.VIDEO, index)
}

export { dataList, globalData, indexData, selectFile, openParamsPanel, selectSuffix, selectChild, clearList, delByIndex, start }