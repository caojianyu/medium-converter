<script setup lang="ts">
// vue3
import { ref, onMounted, reactive } from "vue";

// tauri
import { appWindow } from "@tauri-apps/api/window";
import { createDir, BaseDirectory, exists } from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";
import { desktopDir } from "@tauri-apps/api/path";

// 全局管理
import { store } from "../store/index";

/** 默认转换后存储文件夹名称（桌面） */
const folderName = ref('音视频转换器');
/** 菜单索引 */
const currentMenuIndex = ref(0);
/** 菜单列表 */
const menuList = reactive([{
    label: '视频转码',
    icon: 'icon-shipin',
    value: '/video'
}, {
    label: '音频转码',
    icon: 'icon-24gf-headphones',
    value: '/audio'
}])

onMounted(() => {
    init();
    setTimeout(() => {
        invoke("close_splashscreen");
    }, 2000);
});

/** 初始化操作 */
async function init() {
    // 判断文件夹是否存在，不存在则创建
    const isExists = await exists(folderName.value, { dir: BaseDirectory.Desktop });
    if (!isExists) {
        // 创建转换视频默认的存放目录
        await createDir(folderName.value, {
            dir: BaseDirectory.Desktop,
            recursive: true,
        });
    }

    getDefaultDir();
};

/** 获取默认目录路径 */
async function getDefaultDir() {
    store.outputDir = (await desktopDir()) + '音视频转换器';
};

/** 最小化窗口 */
function minimizeWindow() {
    appWindow.minimize();
};

/** 关闭窗口 */
function closeWindow() {
    appWindow.close();
};

/**
 * 跳转指定菜单，页面跳转时，更改索引
 * 
 * @param index 菜单索引值
 */
function jump(index: number) {
    currentMenuIndex.value = index;
};
</script>

<template>
    <div data-tauri-drag-region class="titlebar">
        <div>音视频转换器</div>
        <div>
            <div @click="minimizeWindow()" class="titlebar-button">
                <i class="iconfont icon-subtract"></i>
            </div>
            <div @click="closeWindow()" class="titlebar-button close-btn">
                <i class="iconfont icon-close1"></i>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="sidebar">
            <div @click="jump(index)" v-for="(item, index) in menuList" :key="index" class="item"
                :style="currentMenuIndex == index ? 'background: #37373d' : ''">
                <RouterLink :to="item.value">
                    <i class="iconfont" :class="item.icon"></i> {{ item.label }}
                </RouterLink>
            </div>
        </div>
        <RouterView v-slot="{ Component }">
            <KeepAlive>
                <component :is="Component" />
            </KeepAlive>
        </RouterView>
    </div>
</template>

<style lang="less" scoped>
.titlebar {
    height: 30px;
    background: #323233;
    user-select: none;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    color: #cccccc;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
}

.titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 46px;
    height: 30px;
}

.titlebar-button:hover {
    background: #474748;
}

.close-btn:hover {
    background: #d61425;
    color: #fefcfc;
}

.titlebar>div:first-of-type {
    line-height: 30px;
    padding: 0 10px;
    font-size: 14px;
}

.content {
    width: 100%;
    height: calc(100vh - 30px);
    margin-top: 30px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    color: #cccccc;
    font-size: 14px;
    display: flex;
    overflow: hidden;

    .sidebar {
        width: 200px;
        height: 100%;
        background: #252526;
        padding: 30px;
        flex-shrink: 0;

        .item {
            border-radius: 8px;
        }
    }
}

a {
    text-decoration: none;
    color: #cccccc;
    display: block;
    padding: 15px;
}
</style>
