import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  type ParentLayerGroup,
  type LayerGroup,
  type Layer,
} from '../models/LayerModel'

const parentLayerGroups = ref<ParentLayerGroup[]>([])
const layerGroups = ref<LayerGroup[]>([])
const layers = ref<Layer[]>([])

/**
 * 一個 layer 相關的資料的集合
 * @returns 包含 parentLayerGroups, layerGroups, layers, 皆為陣列
 */
export function useLayerData() {
  onMounted(async () => {
    layers.value = (await axios.get<Layer[]>('/data/Layers.json')).data
    layerGroups.value = (
      await axios.get<LayerGroup[]>('/data/LayerGroups.json')
    ).data
    parentLayerGroups.value = (
      await axios.get<ParentLayerGroup[]>('/data/ParentLayerGroups.json')
    ).data
  })

  return { parentLayerGroups, layerGroups, layers }
}
