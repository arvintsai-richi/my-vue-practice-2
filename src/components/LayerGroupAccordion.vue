<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLayerData } from '../composables/useLayerData'

const emits = defineEmits<{
  onLayerGroupSelected: [selectedLayerGroupId: number | undefined]
}>()

const { parentLayerGroups, layerGroups } = useLayerData()

const selectedLayerGroupId = ref<number>()

const layerGroupsMap = computed(() => {
  return layerGroups.value?.reduce((map, layerGroup) => {
    if (map.has(layerGroup.parentId)) {
      map.get(layerGroup.parentId).push(layerGroup)
    } else {
      map.set(layerGroup.parentId, [layerGroup])
    }
    return map
  }, new Map())
})
watch(selectedLayerGroupId, () => {
  emits('onLayerGroupSelected', selectedLayerGroupId.value)
})

function isSelected(layerGroupId: number) {
  return selectedLayerGroupId.value == layerGroupId
}
</script>

<template>
  <details
    class="accordion"
    v-for="parentLayerGroup in parentLayerGroups"
    :key="parentLayerGroup.id"
  >
    <summary class="layer-btn">{{ parentLayerGroup.name }}</summary>
    <div class="content">
      <div
        :class="isSelected(layerGroup.id) ? 'layer-btn-selected' : 'layer-btn'"
        v-for="layerGroup in layerGroupsMap.get(parentLayerGroup.id)"
        :key="layerGroup.id"
        @click="selectedLayerGroupId = layerGroup.id"
      >
        {{ layerGroup.name }}
      </div>
    </div>
  </details>
</template>

<style scoped>
.accordion summary {
  list-style: none; /* 隱藏原生箭頭 */
  display: flex;
  align-items: center;
}

/* 自定義箭頭 */
.accordion summary::before {
  content: '＋';
  font-weight: bold;
}

/* 當標籤展開時旋轉箭頭 */
.accordion[open] summary::before {
  content: '－';
  font-weight: bold;
}

.accordion .content {
  padding-left: 16px;
}

.layer-btn {
  cursor: pointer;
}
.layer-btn:hover {
  background-color: #a6ccfb;
}
.layer-btn-selected {
  cursor: pointer;
  background-color: #a6ccfb;
}
</style>
