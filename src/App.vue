<script setup lang="ts">
import { ref } from 'vue'
import LayerGroupAccordion from './components/LayerGroupAccordion.vue'
import LayerGroupContent from './components/LayerGroupContent.vue'

const selectedLayerGroupId = ref<number>()

function onLayerGroupSelected(id: number | undefined) {
  selectedLayerGroupId.value = id
}
</script>

<template>
  <div id="root">
    <div id="left-panel">
      <LayerGroupAccordion @onLayerGroupSelected="onLayerGroupSelected" />
    </div>
    <div id="right-panel">
      <div v-if="selectedLayerGroupId === undefined">請選擇圖層群組</div>
      <LayerGroupContent v-else :layerGroupId="selectedLayerGroupId" />
    </div>
  </div>
</template>

<style scoped>
#root {
  height: 500px;
  width: 100%;
  display: flex;
}

#left-panel {
  border: 1px solid black;
  flex: 1;
  padding: 8px;
}

#right-panel {
  border: 1px solid black;
  flex: 4;
  padding: 8px;
}
</style>

<style>
* {
  font-family: 'Noto Sans TC'; /* 微軟正黑體 */
  font-size: 14px;
}
</style>
