<script setup>
// Tools
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useStore } from '@/store/menus.js'

// Icons
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'

// Components
import TreeNode from './TreeNode.vue'
import { emit } from 'process';

// Stores
const menusStore = useStore()

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
})

// Emits
const emits = defineEmits(['click', 'updateActiveKey'])

// Computeds
const getTreeNodeStyle = computed(() => {
  if (props.level === 0) return {}
  return {
    paddingLeft: `${props.level * 40}px`,
  }
})

// Methods
const handleItemClick = (item) => {
  emits('click', item)
  updateActiveKey(item)

  if (!getHasChildren(item)) return
  item.opened = !item.opened
}

const updateActiveKey = (item) => {
  props.item.forEach((i) => i.selfActiveKey = false)
  item.selfActiveKey = true

  emits('updateActiveKey', item)
}

const handleUpdateActiveKey = (childrenItem, item) => {
  // childrenItem 为抛事件的子组件

  props.item.forEach((i) => i.selfActiveKey = false)

  item.selfActiveKey = true
  item.children.forEach((i) => {
    if (i.id === childrenItem.id) return
    removeActiveKey(i)
  })
}

const removeActiveKey = (item) => {
  item.selfActiveKey = false
  if (!getHasChildren(item)) return
  item.children.forEach((i) => removeActiveKey(i))
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
    <div :class="['tree-node', getIsActive(item)]" @click="handleItemClick(item)">
      <div class="tree-node-box" :style="getTreeNodeStyle">
        <div class="icon">
          <component :is="item.icon"></component>
        </div>

        <div class="name">{{ item.name }}</div>

        <div v-if="getHasChildren(item)" class="right-icons">
          <DownOutlined style="font-size: 8px" />
        </div>
      </div>
    </div>

    <TreeNode v-if="getHasChildren(item) && item.opened" :item="item.children" :level="props.level + 1" @updateActiveKey="childrenItem => handleUpdateActiveKey(childrenItem, item)"></TreeNode>
  </div>
</template>

<style lang="less"></style>