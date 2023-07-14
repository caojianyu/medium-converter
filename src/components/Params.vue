<script setup lang="ts">
defineProps<{
    modelValue: boolean
    paramList: Record<string, any>[],
    indexData: Record<string, number>
}>()

const emit = defineEmits(['close', 'selectSuffix', 'selectChild'])

/** 关闭参数选择弹框 */
function _close() {
    emit('close')
}

/**
 * 选择转换参数索引
 * 
 * @param index 索引
 */
function _selectSuffix(index: number) {
    emit('selectSuffix', index)
}

/**
 * 选择转换二级参数索引
 * 
 * @param index 索引
 */
function _selectChild(index: number) {
    emit('selectChild', index)
}
</script>

<template>
    <div v-show="modelValue" class="modal" @click="_close()"></div>
    <div v-show="modelValue" class="params-panel">
        <div class="type">
            <span>格式</span>
        </div>
        <div class="params-list">
            <div>
                <p @click="_selectSuffix(index)" v-for="(item, index) in paramList" :key="index"
                    :class="indexData.currentSuffixIndex == index ? 'selected' : ''">
                    {{ item.name }}
                </p>
            </div>
            <div>
                <div @click="_selectChild(index)" v-for="(item, index) in paramList[indexData.currentSuffixIndex].children"
                    :key="index" :class="indexData.currentSecondLevelIndex == index ? 'selected' : ''
                        ">
                    <p>{{ item.name }}</p>
                    <p :style="indexData.currentSecondLevelIndex == index ? 'color:#fff' : ''">
                        {{ item.value }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="less" scoped>
.modal {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 100;
    background: rgba(0, 0, 0, 0.2);
}

.params-panel {
    color: #cccccc;
    font-size: 14px;
    width: 260px;
    height: 250px;
    padding: 10px 0;
    position: fixed;
    left: calc(50% + 100px);
    top: 50%;
    transform: translate(-50%, -50%);
    background: #303031;
    box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.4);
    z-index: 101;
    border-radius: 4px;

    .type {
        margin-bottom: 10px;

        span {
            padding: 0 10px;
            color: #00c1cd;
        }
    }

    .params-list {
        display: flex;
        height: calc(100% - 40px);

        >div {
            &::-webkit-scrollbar {
                width: 8px;
            }

            &::-webkit-scrollbar-thumb:vertical {
                border-radius: 8px;
                background-color: #424242;
            }

            &::-webkit-scrollbar-thumb:hover {
                background-color: #4f4f4f;
            }

            overflow-y: auto;

            &:first-of-type {
                width: 80px;

                p {
                    padding: 5px 10px;

                    &:hover {
                        background: #00c1cd;
                        color: #ffffff;
                    }
                }
            }

            &:nth-of-type(2) {
                width: 180px;

                >div {
                    padding: 5px 10px;

                    p:last-of-type {
                        font-size: 12px;
                        color: #939393;
                    }

                    &:hover {
                        background: #00c1cd;
                        color: #ffffff;
                    }

                    &:hover p {
                        color: #ffffff;
                    }
                }
            }
        }
    }
}

.selected {
    background: #00c1cd;
    color: #fff
}
</style>