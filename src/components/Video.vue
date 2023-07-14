<script setup lang="ts">
import DataList from './DataList.vue'
import Output from './Output.vue'
import Params from './Params.vue'

import { dataList, globalData, indexData, selectFile, clearList, openParamsPanel, delByIndex, start, selectSuffix, selectChild } from "../common/script/video/video";
import { store } from '../store';
import { videoParamList } from '../common/constants';
</script>

<template>
  <div class="panel-operation">
    <CButton @click="selectFile()">+ 添加文件</CButton>
    <CButton @click="clearList()" plain>- 清空列表</CButton>

    <DataList :data-list="dataList" @open-params-panel="openParamsPanel" @del-by-index="delByIndex"
      @execute="start"></DataList>

    <Output :global-data="globalData" @open-params-panel="openParamsPanel" @execute="start()"></Output>
  </div>
  <Params v-model="store.showModel" :param-list="videoParamList" :index-data="indexData" @close="store.showModel = false"
    @select-suffix="selectSuffix" @select-child="selectChild">
  </Params>
</template>

<style lang="less" scoped>
.panel-operation {
  width: 100%;
  background: #1e1e1e;

  >button {
    margin: 10px 0 0 10px;
  }

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

    .big-btn {
      width: 120px;
      height: 34px;
      margin: 0 10px;
    }
  }
}
</style>
