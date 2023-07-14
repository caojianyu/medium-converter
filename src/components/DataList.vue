<script setup lang="ts">
import { play } from "../common/commands";

defineProps<{
    dataList: Record<string, any>[]
}>()

const emit = defineEmits(['openParamsPanel', 'execute', 'delByIndex'])

/**
 * 打开参数面板
 * 
 * @param index 对应选择的数据索引
 */
function _openParamsPanel(index: number) {
    emit('openParamsPanel', index)
}

/**
 * 执行转换
 * 
 * @param index 对应选择的数据索引
 */
function _execute(index: number) {
    emit('execute', index)
}

/**
 * 删除索引对应的数据
 * 
 * @param index 对应选择的数据索引
 */
function _delByIndex(index: number) {
    emit('delByIndex', index)
}
</script>

<template>
    <div class="list">
        <div class="item" v-for="(item, index) in dataList" :key="index">
            <!-- 进度条 -->
            <div v-if="item.progress" class="progress-bar">
                <div :style="{ width: item.progress }"></div>
            </div>
            <!-- 左边源文件展示 -->
            <div class="left">
                <video :src="item.src" width="160" height="90"></video>
                <!-- 视频标签遮罩，点击可调用本机程序播放，也可直接播放 -->
                <div @click="play(item.localFilePath)" class="video-mask">
                    <i class="iconfont icon-boshiweb_bofangliang"></i>
                </div>
                <div class="info">
                    <p>{{ item.filename }}</p>
                    <div>
                        <span class="label">格式：{{ item.suffix }}</span>
                        <span>{{ item.isVideo ? '分辨率：' : '比特率：' }} {{ item.dpiOrBitRate }}</span>
                        <span class="label">时长：{{ item.time }}</span>
                        <span>大小：{{ item.size }}</span>
                    </div>
                </div>
            </div>
            <!-- 转换图标 -->
            <i class="iconfont icon-suijibofang"></i>
            <!-- 右边转换结果展示 -->
            <div class="right">
                <div class="info">
                    <p>{{ item.filename }}</p>
                    <div>
                        <span class="label">格式：{{ item.convertSuffix }}</span>
                        <span>{{ item.isVideo ? '分辨率：' : '比特率：' }} {{ item.convertDpiOrBitRate }}</span>
                        <span class="label">时长：{{ item.time }}</span>
                        <div @click="_openParamsPanel(index)" class="output">
                            <span>{{ item.convertSuffix }} {{ item.convertDescribe }}</span>
                            <i class="iconfont icon-arrow-down"></i>
                        </div>
                    </div>
                </div>
                <!-- 单个转换按钮，正在转换时显示转换进度 -->
                <CButton v-if="!item.progress" @click="_execute(index)">转换</CButton>
                <div v-else class="percentage-value">{{ item.progress }}</div>
            </div>
            <!-- 删除指定索引条目 -->
            <div @click="_delByIndex(index)" class="close">
                <i class="iconfont icon-close1"></i>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.list {
    margin: 10px;
    height: 520px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 12px;
    }

    &::-webkit-scrollbar-thumb:vertical {
        border-radius: 12px;
        background-color: #424242;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #4f4f4f;
    }

    .item {
        padding: 5px;
        height: 110px;
        background: #2d2d2d;
        margin-bottom: 10px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;

        .progress-bar {
            position: absolute;
            left: 165px;
            width: calc(100% - 165px);
            height: 100%;
            z-index: 1;

            >div {
                height: 100%;
                background: rgba(255, 255, 255, 0.06);
                transition: 1s;
            }
        }

        &:hover .close {
            opacity: 1;
            z-index: 1;
        }

        .close {
            opacity: 0;
            z-index: -1;
            width: 34px;
            height: 20px;
            position: absolute;
            right: 0;
            top: 0;
            border-top-right-radius: 8px;
            border-bottom-left-radius: 8px;
            background: #d61425;
            color: #fefcfc;
            display: flex;
            justify-content: center;
            align-items: center;

            .iconfont {
                font-size: 14px;
            }
        }

        >div {
            height: 100%;
            display: flex;
            align-items: center;
        }

        .left {
            width: 48%;
        }

        .right {
            width: 43%;
        }

        .left,
        .right {
            video {
                flex-shrink: 0;
                margin-right: 10px;
            }

            .video-mask {
                width: 160px;
                height: 90px;
                background: rgba(0, 0, 0, 0.1);
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s;

                .iconfont {
                    font-size: 30px;
                    color: #f8f6f6;
                }

                &:hover {
                    background: rgba(0, 0, 0, 0.35);
                }

                &:hover .iconfont {
                    color: #fff;
                }
            }

            button {
                flex-shrink: 0;
                margin: 0 10px 0 20px;
                width: 60px;
            }

            .info {
                width: 100%;

                >div {
                    display: flex;
                    flex-wrap: wrap;

                    // justify-content: space-between;
                    >span {
                        margin-top: 5px;
                        width: 60%;
                        color: #939393;
                    }

                    .label {
                        width: 40%;
                    }

                    .output {
                        width: 50%;
                        margin-top: 5px;
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
                }
            }
        }

        >.iconfont {
            font-size: 20px;
        }
    }
}

.percentage-value {
    width: 60px;
    margin: 0 10px 0 20px;
    flex-shrink: 0;
    text-align: center;
}
</style>