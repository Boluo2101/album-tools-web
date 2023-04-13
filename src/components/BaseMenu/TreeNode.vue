<script setup>
// Tools
import { defineProps, defineEmits, computed, ref } from 'vue'
// Store
import { useStore as picturesStore } from '@/store/pictures.js'
import { useStore } from '@/store/menus.js'

// Icons
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'

// Components
import TreeNode from './TreeNode.vue'

// Stores
const menusStore = useStore()
const pictureStore = picturesStore()

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  level: {
    type: Number,
    default: 0,
  },
  class: {
    type: String,
    default: '',
  },
})

// Emits
const emits = defineEmits(['click', 'updateActiveKey'])

// Computeds
const getTreeNodeStyle = computed(() => {
  if (props.level === 0) return {}
  return {
    paddingLeft: `${props.level * 30}px`,
  }
})

// Methods
const handleItemClick = (item) => {
  if (item.onClick) return item.onClick()
  console.log('handleItemClick', item)
  
  emits('click', item)
  updateActiveKey([item.id], item)

  if (!getHasChildren(item)) return
  item.opened = !item.opened
}

const updateActiveKey = async (ids, item) => {
  props.item.forEach((i) => {
    removeActiveKey(i, ids)
    if (ids.includes(i.id)) i.selfActiveKey = true
  })

  emits('updateActiveKey', ids)

  if (!item || !item.raw) return
  const path = item.raw.path
  console.log('path', path)
  await pictureStore.fetchPictures(path)
}

const removeActiveKey = (item, ids) => {
  item.selfActiveKey = ids.includes(item.id) ? true : false;
  getHasChildren(item) && (item.children.forEach((i) => removeActiveKey(i, ids)))
}

const getHasChildren = (item) => {
  return item.children && item.children.length > 0
}

const getIsActive = (item) => {
  const { id, path, selfActiveKey } = item
  return menusStore.getMenuActiveKey === path || selfActiveKey ? 'active' : ''
}

</script>

<template>
  <div v-for="(item, index) of props.item" :key="item.id">
    <div :class="['tree-node', getIsActive(item), props.class]" @click="handleItemClick(item)">
      <div class="tree-node-box" :style="getTreeNodeStyle">
        <div class="icon">
          <component :is="item.icon"></component>
        </div>

        <div class="name" :title="item.name">{{ item.name }}</div>

        <div v-if="getHasChildren(item)" class="right-icons">
          <component :is="item.opened ? UpOutlined : DownOutlined" style="font-size: 8px"></component>
        </div>
      </div>
    </div>

    <TreeNode v-if="getHasChildren(item) && item.opened" :item="item.children" :level="props.level + 1" class="children" @updateActiveKey="ids => updateActiveKey([...ids, item.id])"></TreeNode>
  </div>
</template>

<style lang="less"></style>