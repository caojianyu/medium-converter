import { reactive } from 'vue'

/** 通用存储 */
const store = reactive({
    // 缓存输出目录路径，用于全局
    outputDir: "",
    // 控制参数弹框及模态框的显示
    showModel: false
})

export { store }