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
  <span class="lightbox" id="layer-upsert-page">
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
      <form action="javascript:history.back()">
        <input type="submit" value="確認" @click="onConfirmPressed" />
        &thinsp;
        <input type="submit" value="取消" @click="onCancelPressed" />
      </form>
    </div>
  </span>
</template>

<style lang="css" scoped>
.lightbox {
  /* Default to hidden */
  display: none;

  /* Overlay entire screen */
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* A bit of padding around image */
  padding: 1em;

  /* Translucent background */
  background: rgba(255, 255, 255, 0.9);
}

/* Unhide the lightbox when it's the target */
.lightbox:target {
  display: block;
}

.lightbox span {
  /* Full width and height */
  display: block;
  width: 100%;
  height: 100%;

  /* Size and position background image */
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
div {
  margin: 8px;
}
</style>
