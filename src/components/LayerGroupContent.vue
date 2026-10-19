<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, computed, watch } from 'vue'
import { useLayerData } from '../composables/useLayerData.js'
import LayerUpsertPage from './LayerUpsertPage.vue'
import { type Layer } from '../models/LayerModel'

type UpsertOption = 'insert' | 'update' | 'none'

const props = defineProps<{
  layerGroupId: number
}>()

const { layers } = useLayerData()
const selectedLayers = ref<Set<Layer>>(new Set())
const layerToUpdate = ref<Layer>()
const currentUpsertOption = ref<UpsertOption>('none')

const layerList = computed(() =>
  layers.value.filter((layer) => layer.groupId == props.layerGroupId),
)

const isAllSelected = computed(() => {
  return (
    selectedLayers.value.size > 0 &&
    selectedLayers.value.size == layerList.value.length
  )
})

const isSomeSelected = computed(() => {
  return selectedLayers.value.size > 0
})

watch(
  () => props.layerGroupId,
  () => {
    resetUpsert()
    resetSelected()
  },
)

function resetUpsert() {
  layerToUpdate.value = undefined
  currentUpsertOption.value = 'none'
}

function resetSelected() {
  selectedLayers.value.clear()
}

function toggleSelectAll(event: InputEvent) {
  if ((event.target as HTMLInputElement).checked == false) {
    selectedLayers.value.clear()
  } else {
    selectedLayers.value = new Set(layerList.value)
  }
}

function toggleSelectLayer(event: InputEvent, layer: Layer) {
  if ((event.target as HTMLInputElement).checked == false) {
    selectedLayers.value.delete(layer)
  } else {
    selectedLayers.value.add(layer)
  }
}

function startInsert() {
  layerToUpdate.value = undefined
  currentUpsertOption.value = 'insert'
}

function startUpdate(layer: Layer) {
  layerToUpdate.value = layer
  currentUpsertOption.value = 'update'
}

function insertLayer(layerName: string, layerCategory: string) {
  layers.value.push({
    id: getUniqueId(),
    name: layerName,
    groupId: props.layerGroupId,
    category: layerCategory,
    createTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
  })
}

function updateLayer(layerName: string, layerCategory: string) {
  if (layerToUpdate.value !== undefined) {
    layerToUpdate.value.name = layerName
    layerToUpdate.value.category = layerCategory
  }
}

function deleteLayer() {
  layers.value = layers.value.filter(
    (layer) => !selectedLayers.value.has(layer),
  )
}

function confirmUpsert(layerName: string, layerCategory: string) {
  if (currentUpsertOption.value == 'update') {
    updateLayer(layerName, layerCategory)
  } else if (currentUpsertOption.value == 'insert') {
    insertLayer(layerName, layerCategory)
  }
  resetUpsert()
}

function getUniqueId() {
  return 10000 + layers.value.length
}
</script>

<template>
  <LayerUpsertPage
    v-if="currentUpsertOption != 'none'"
    class="lightbox"
    id="layer-upsert-page"
    :defaultName="layerToUpdate?.name ?? ''"
    :defaultCategory="layerToUpdate?.category ?? ''"
    @confirm="confirmUpsert"
    @cancel="resetUpsert"
  />
  <div>
    <div id="header">
      <label for="check-all">全選</label>
      <input
        id="check-all"
        type="checkbox"
        :checked="isAllSelected"
        @input="toggleSelectAll"
      />
      <button :disabled="!isSomeSelected" @click="deleteLayer">刪除圖層</button>
      <a href="#layer-upsert-page"
        ><button @click="startInsert">新增圖層</button>
      </a>
    </div>
    <hr />
    <div id="body">
      <text v-if="layerList.length == 0">群組內無圖層</text>
      <table v-else>
        <colgroup>
          <col class="one" />
          <col class="ten" />
          <col class="ten" />
          <col class="ten" />
          <col class="ten" />
        </colgroup>
        <thead>
          <tr>
            <td></td>
            <td>名稱</td>
            <td class="center">類別</td>
            <td class="center">建立時間</td>
            <td class="center">編輯</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer in layerList" :key="layer.id">
            <td>
              <input
                type="checkbox"
                :checked="selectedLayers.has(layer)"
                @input="(e) => toggleSelectLayer(e, layer)"
              />
            </td>
            <td>{{ layer.name }}</td>
            <td class="center">
              {{ layer.category }}
            </td>
            <td class="center">
              {{ dayjs(layer.createTime).format('YYYY/MM/DD HH:mm') }}
            </td>
            <td class="center">
              <a href="#layer-upsert-page">
                <button @click="startUpdate(layer)">編輯</button>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
#header {
  padding: 8px 8px 0px 8px;
}
#header > * {
  margin-right: 4px;
}
#body {
  width: 80%;
  padding-left: 2%;
  table-layout: fixed;
}
.one {
  width: 1%;
}
.ten {
  width: 10%;
}
#body > * {
  width: 100%;
}
.center {
  text-align: center;
  align-items: center;
}
</style>
