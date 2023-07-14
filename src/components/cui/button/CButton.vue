<script setup lang="ts">

/** 参数 */
export interface Props {
    size?: string,
    plain?: boolean
}

/** 带默认值 */
withDefaults(defineProps<Props>(), {
    size: 'small',
    plain: false
})

/** 声明 */
const emit = defineEmits(['click'])

/** 触发 */
function _click() {
    emit('click')
}
</script>

<template>
    <button @click="_click()" :class="[size, plain ? 'plain' : '']">
        <slot></slot>
    </button>
</template>

<style lang="less" scoped>
button {
    background: #00c1cd;
    color: #fafafa;
    border: none;
    border-radius: 4px;
    padding: 0 15px;
    outline: none;
}

.medium {
    width: 120px;
    height: 34px;
    margin: 0 10px;
}

.small {
    height: 28px;
}

.plain {
    background: none;
    color: #cccccc;
    border: 1px solid #cccccc;
}
</style>
