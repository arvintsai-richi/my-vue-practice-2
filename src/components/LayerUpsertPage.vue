<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'

const props = defineProps<{
  defaultName: string
  defaultCategory: string
}>()
const emits = defineEmits<{
  confirm: [layerName: string, layerCategory: string]
  cancel: []
}>()

const LAYER_CATEGORY_OPTIONS = ['基礎', '警戒', '監測']
const layerName = ref('')
const layerCategory = ref<string>(LAYER_CATEGORY_OPTIONS[0]!)

onMounted(() => {
  layerName.value = props.defaultName
  layerCategory.value = props.defaultCategory
})

function onConfirmPressed() {
  if (layerName.value.trim() == '' || layerCategory.value.trim() == '') return
  emits('confirm', layerName.value, layerCategory.value)
}

function onCancelPressed() {
  emits('cancel')
}
</script>

<template>
  <div>
    圖層名稱
    <input v-model="layerName" />
  </div>
  <div>
    圖層類別
    <select v-model="layerCategory">
      <option
        v-for="layerCategoryOption in LAYER_CATEGORY_OPTIONS"
        :key="layerCategoryOption"
      >
        {{ layerCategoryOption }}
      </option>
    </select>
  </div>
  <div>
    <button @click="onConfirmPressed">確認</button>
    <button @click="onCancelPressed">取消</button>
  </div>
</template>
