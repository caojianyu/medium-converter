<script setup lang="ts">
import { store } from "../store";
import { GlobalData } from "../common/script/params";
import { useChangeOutputDir } from "../common/script/file";

defineProps<{
    globalData: GlobalData
}>()

const emit = defineEmits(['execute', 'openParamsPanel'])

/** 执行全部转换 */
function _execute() {
    emit('execute')
}

/** 打开参数面板（用于设置全局） */
function _openParamsPanel() {
    emit('openParamsPanel')
}
</script>

<template>
    <div class="params">
        <div>
            <div>
                <span>输出格式</span>
                <div @click="_openParamsPanel()" class="output">
                    <span>{{ globalData.globalSuffix }} {{ globalData.globalDpiOrBitRate }}</span>
                    <i class="iconfont icon-arrow-down"></i>
                </div>
            </div>
            <div>
                <span>输出路径</span>
                <div class="output output-dir">
                    <span>{{ store.outputDir }}</span>
                </div>
                <CButton @click="useChangeOutputDir()">更改目录</CButton>
            </div>
        </div>
        <CButton @click="_execute()" size="medium">全部转换</CButton>
    </div>
</template>


<style lang="less" scoped>
.params {
    height: 112px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #252526;
    padding: 10px;

    >div {

        span {
            margin-right: 10px;
        }

        >div {
            height: 30px;
            display: flex;
            align-items: center;
        }
    }
}

.output {
    width: 200px;
    border: 1px solid #cccccc;
    color: #cccccc;
    padding: 2px 10px;
    position: relative;
    border-radius: 2px;
    z-index: 0;

    .iconfont {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
    }
}

.output-dir {
    width: 400px;
    margin-right: 10px;
}
</style>