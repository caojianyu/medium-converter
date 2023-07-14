import { Ref } from "vue";
import { store } from "../../store";

/** 全局转换参数 */
export interface GlobalData {
    // 控制全局的格式切换
    globalSuffix: string,
    // 控制全局的分辨率或比特率切换
    globalDpiOrBitRate: string,
    // 全局后缀索引
    globalSuffixIndex: number,
    // 全局分辨率或比特率索引
    globalDpiOrBitRateIndex: number
}

/**
 * 打开参数面板， 模态框和参数面板同步显示
 * 
 * @param dataList 已选择并解析好的数据列表
 * @param indexData 对应存储当前索引值的对象
 * @param globalData 作为输出的全局参数
 * @param index 对应数据项索引，为空则是统一参数
 */
export function useOpenParamsPanel(dataList: Ref<Record<string, any>[]>, indexData: Record<string, number>, globalData: GlobalData, index?: number) {
    // 显示模态框及弹框
    store.showModel = true;
    if (index != undefined) {
        // 单个参数设置
        indexData.currentDataIndex = index;
        indexData.currentSuffixIndex = dataList.value[index].convertSuffixIndex;
        indexData.currentSecondLevelIndex = dataList.value[index].convertDpiOrBitRateIndex;
    } else {
        // 统一参数设置
        indexData.currentDataIndex = -1;
        indexData.currentSuffixIndex = globalData.globalSuffixIndex;
        indexData.currentSecondLevelIndex = globalData.globalDpiOrBitRateIndex;
    }
};

/**
 * 选择格式参数
 * 
 * @param index 对应格式参数索引
 * @param indexData 对应存储当前索引值的对象
 */
export function useSelectSuffix(index: number, indexData: Record<string, number>) {
    indexData.currentSuffixIndex = index;
};

/**
 * 选择二级参数
 * 
 * @param index 对应二级参数索引
 * @param paramList 可转换格式参数数组
 * @param indexData 对应存储当前索引值的对象
 * @param dataList 已选择并解析好的数据列表
 * @param globalData 作为输出的全局参数
 */
export function useSelectChild(index: number, paramList: Record<string, any>[], indexData: Record<string, number>, dataList: Ref<Record<string, any>[]>, globalData: GlobalData) {

    // 获取转换参数
    const params = paramList[indexData.currentSuffixIndex];
    // 通过currentDataIndex下标的值来判断，是针对所有还是单个媒体
    if (indexData.currentDataIndex != -1) {
        dataList.value[indexData.currentDataIndex].convertDpiOrBitRateIndex =
            indexData.currentSecondLevelIndex = index;
        // 赋值选中的参数
        dataList.value[indexData.currentDataIndex].convertSuffix = params.name;
        dataList.value[indexData.currentDataIndex].convertSuffixIndex =
            indexData.currentSuffixIndex;
        dataList.value[indexData.currentDataIndex].convertDpiOrBitRate =
            params.children[index].value;
        dataList.value[indexData.currentDataIndex].convertDescribe =
            params.children[indexData.currentSecondLevelIndex].name;
    } else {
        // 全局赋值
        globalData.globalSuffix = params.name;
        globalData.globalSuffixIndex = indexData.currentSuffixIndex;

        globalData.globalDpiOrBitRate = params.children[index].name;
        globalData.globalDpiOrBitRateIndex = index;
        // 循环给所有赋值
        dataList.value.forEach((item) => {
            item.convertSuffixIndex = indexData.currentSuffixIndex;
            item.convertSuffix = params.name;

            item.convertDpiOrBitRateIndex = index;
            item.convertDpiOrBitRate = params.children[index].value;

            item.convertDescribe = params.children[index].name;
        });
    }
    // 关闭弹框
    store.showModel = false;
}