<script setup lang="ts">
import { reactive, onUnmounted, onMounted } from "vue";
import { open, message, confirm } from "@tauri-apps/api/dialog";
import { appDir } from "@tauri-apps/api/path";
import { invoke, convertFileSrc } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";

const data = reactive({
  exportPath: "",
  showPath: "",
  filePath: "",
  fileName: "",
  videoFormats: ["MP4", "WMV", "FLV", "MKV", "AVI"],
  currentFormatIndex: 0,
  queryProcess: -1,
  processData: [] as String[],
  dpiArr: ["480x320", "640x480", "1024x720", "1920x1080"],
  currentDpiIndex: -1,
  isProcessing: false,
});

const selectFile = async () => {
  const selected = await open({
    multiple: true,
    filters: [
      {
        name: "Video",
        extensions: data.videoFormats,
      },
    ],
  });

  if (Array.isArray(selected)) {
    // user selected multiple files
    data.filePath = selected[0];
  } else if (selected === null) {
    // user cancelled the selection
    return;
  } else {
    // user selected a single file
    data.filePath = selected[0];
  }

  const splitIndex = data.filePath.lastIndexOf("\\");
  data.exportPath = data.filePath.substring(0, splitIndex);
  data.fileName = data.filePath.substring(splitIndex + 1);
  data.showPath = convertFileSrc(data.filePath, "stream");
};

const selectDir = async () => {
  // Open a selection dialog for directories
  const selected = await open({
    directory: true,
    multiple: true,
    defaultPath: await appDir(),
  });

  if (Array.isArray(selected)) {
    // user selected multiple directories
    data.exportPath = selected[0];
  } else if (selected === null) {
    // user cancelled the selection
    return;
  } else {
    // user selected a single directory
    data.exportPath = selected[0];
  }
};

const transcode = async () => {
  if (data.isProcessing) {
    await message("有任务正在处理，请等待处理完成！", "提示");
    return;
  }
  data.isProcessing = true;

  let name = data.fileName.substring(0, data.fileName.lastIndexOf(".") + 1);
  name += data.videoFormats[data.currentFormatIndex].toLowerCase();

  let exportPath = data.exportPath + "\\" + name;

  if (data.filePath == exportPath && data.currentDpiIndex == -1) {
    data.isProcessing = false;
    await message("转码后的文件格式没有变化，请选择参数！", "提示");
    return;
  }

  // sign
  let isCover = false;
  // cancel
  let isCancel = false;

  // format
  await invoke("is_exists", { exportPath: exportPath }).then(async (res) => {
    if (res) {
      await confirm("导出的路径下已经有相同的文件，是否覆盖?", {
        title: "警告",
        type: "warning",
      }).then((result) => {
        if (!result) {
          data.isProcessing = false;
          isCancel = true;
        }
        isCover = result;
      });
    }
  });

  if (isCancel) {
    data.isProcessing = false;
    return;
  }

  let dpi = "";
  if (data.currentDpiIndex != -1) {
    dpi = data.dpiArr[data.currentDpiIndex];
  }

  await invoke("video_transcode", {
    filePath: data.filePath,
    exportPath: exportPath,
    dpi: dpi,
    isCover: isCover,
  });

  setTimeout(() => {
    data.queryProcess = window.setInterval(async () => {
      await invoke("read_progress").then(async (res: any) => {
        data.processData = [];
        res.forEach(async (item: String) => {
          data.processData.push(item.split("=")[1]);
          if (item == "progress=end") {
            // remove file
            await invoke("remove_progress");
            // stop timer
            window.clearInterval(data.queryProcess);
            data.isProcessing = false;
          }
        });
      });
    }, 100);
  }, 1500);
};

const minimizeWindow = () => {
  appWindow.minimize();
};

const closeWindow = () => {
  // stop ffmpeg
  invoke("stop_ffmpeg");
  appWindow.close();
};

const clearTimer = () => {
  if (data.queryProcess != -1) {
    window.clearInterval(data.queryProcess);
  }
};

onMounted(() => {
  invoke("remove_progress");
  setTimeout(() => {
    invoke("close_splashscreen");
  }, 4000);
});

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div data-tauri-drag-region class="titlebar">
    <div data-tauri-drag-region class="titlebar-right-box"></div>
    <div @click="minimizeWindow()" class="titlebar-button">
      <i class="iconfont icon-jianhao"></i>
    </div>
    <div @click="closeWindow()" class="titlebar-button close-btn">
      <i class="iconfont icon-guanbi"></i>
    </div>
  </div>
  <div class="panel">
    <div class="sidebar">
      <!-- <div class="item">音频转码</div> -->
      <div class="item" style="background: #242425">
        <i class="iconfont icon-shipin"></i> 视频转码
      </div>
    </div>
    <div class="content">
      <div class="file-list">
        <div v-if="data.filePath" class="file">
          <video
            @click="selectFile()"
            class="cover"
            :src="data.showPath"
          ></video>
          <div>
            <span @click="selectFile()">{{ data.fileName }}</span>
          </div>
        </div>
        <div v-else class="file import-box">
          <button @click="selectFile()" class="btn-style import-btn">
            + 导入文件
          </button>
        </div>
      </div>
      <div class="config progress">
        <span v-if="data.processData.length <= 0">控制台</span>
        <span
          :style="
            item == 'continue'
              ? 'color:#67C23A;'
              : item == 'end'
              ? 'color:#F56C6C;'
              : ''
          "
          v-for="(item, index) in data.processData"
          :key="index"
          >{{ item }}
        </span>
      </div>
      <div class="config">
        <div class="config-item">
          <span>转码格式</span>
          <div>
            <label
              @click="data.currentFormatIndex = index"
              v-for="(item, index) in data.videoFormats"
              :key="index"
              ><input
                name="video"
                type="radio"
                :checked="data.currentFormatIndex == index"
              />
              {{ item }}
            </label>
          </div>
        </div>
        <div class="config-item">
          <span>画面大小</span>
          <div>
            <label @click="data.currentDpiIndex = -1"
              ><input
                name="size"
                type="radio"
                :checked="data.currentDpiIndex == -1"
              />
              原视频大小
            </label>
            <label
              @click="data.currentDpiIndex = index"
              v-for="(item, index) in data.dpiArr"
              :key="index"
              ><input
                name="size"
                type="radio"
                :checked="data.currentDpiIndex == index"
              />
              {{ item }}
            </label>
          </div>
        </div>
        <div class="file-path-box">
          <span>保存路径</span>
          <input v-model="data.exportPath" class="path" type="text" />
          <div>
            <button @click="selectDir()" class="choose-btn btn-style">
              选择
            </button>
          </div>
        </div>
      </div>
      <button @click="transcode()" class="btn btn-style">开始转码</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.titlebar-right-box {
  width: 220px;
  height: 100%;
  background: #1b1b1c;
  margin-right: auto;
}
.titlebar {
  height: 30px;
  background: #121212;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  color: #999999;
}
.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 30px;
  i {
    font-size: 20px;
  }
}
.titlebar-button:hover {
  background: #1b1b1c;
}
.close-btn:hover {
  background: #d71526;
  color: #fff;
}
.panel {
  display: flex;
  height: 100%;
  color: #fafafa;
  font-size: 14px;
}
.sidebar {
  width: 220px;
  height: 100%;
  background: #1b1b1c;
  padding: 30px;
  flex-shrink: 0;
  .item {
    padding: 15px;
    border-radius: 8px;
  }
}
.content {
  width: 100%;
  height: 100%;
  background: #121212;
  padding: 40px;
  .file-list {
    .file {
      background: #1b1b1c;
      display: flex;
      border-radius: 8px;
      padding: 20px;
      min-height: 130px;
      > div {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        > span {
          word-break: break-word;
        }
      }
    }
    .import-box {
      justify-content: center;
      align-items: center;
    }
  }
  .config {
    border-radius: 8px;
    margin-top: 30px;
    padding: 20px;
    background: #1b1b1c;
    .config-item {
      display: flex;
      > span {
        flex-shrink: 0;
      }
      > div {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 20px;
        label {
          margin: 0 20px 20px 0;
        }
      }
    }
    .file-path-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      span,
      .button {
        flex-shrink: 0;
      }
      .choose-btn {
        height: 22px;
        width: 50px;
      }
      input {
        margin: 0 20px;
        width: 100%;
      }
    }
  }
}

// common
.icon-shipin {
  margin-right: 10px;
}
.progress {
  font-size: 12px;
  color: #808080;
  display: flex;
  flex-wrap: wrap;
  > span {
    margin-right: 6px;
  }
}
.import-btn {
  height: 38px;
  width: 150px;
}
.btn-style {
  background: #00c1cd;
  color: #fafafa;
  border: none;
  border-radius: 4px;
}
.btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 150px;
  height: 38px;
}

.cover {
  width: 160px;
  height: 90px;
  border-radius: 8px;
}

.path {
  outline: none;
  border: 1px solid #242425;
  background: #242425;
  border-radius: 4px;
  height: 22px;
  padding: 0 5px;
  color: #fafafa;
}
</style>
