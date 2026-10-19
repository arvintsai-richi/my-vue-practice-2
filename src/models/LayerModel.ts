export type ParentLayerGroup = {
  id: number
  name: string
}

export type LayerGroup = {
  id: number
  name: string
  parentId: number
}

export type Layer = {
  id: number
  name: string
  groupId: number
  category: string
  createTime: string
}
