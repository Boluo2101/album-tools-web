<script setup>
// components
import { FolderOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PictureOutlined } from '@ant-design/icons-vue';
import TreeNode from './TreeNode.vue';

import { useRouter, useRoute } from 'vue-router'
import { ref, reactive, watch, onMounted, computed, } from 'vue'
import { sortBy, cloneDeep, first } from 'lodash'
import { useStore } from '@/store/menus.js'
// configs
import { routes } from '@/routes/index.js'

// routers
const $router = useRouter()
const $route = useRoute()

// apis
const menusStore = useStore()

// values

// computed
// 获取菜单收拢状态图标
const getMenusCollapsedComponent = computed(() => {
  return !menusStore.getMenuCollapsedStatus ? MenuFoldOutlined : MenuUnfoldOutlined
})

// vue3 响应式数组
const menus = reactive([
  {
    id: 0,
    name: '',
    icon: getMenusCollapsedComponent,
    path: '',
    onClick: () => {
      menusStore.setMenuCollapsed(!menusStore.getMenuCollapsedStatus)
    },
  },
  ...routes,
])

// lifes
onMounted(async () => {
  // 更新菜单，图片菜单的子菜单
  getAndSetPicturesDirectories()
})

// methods
// 处理菜单点击事件
const handleItemClick = (item) => {
  if (item.onClick) return item.onClick()
  setMenuActive(item.path)
  $router.push({ path: item.path })
}

// 设置菜单激活
const setMenuActive = (key) => {
  menusStore.setMenuActiveKey(key)
}

// 获取并设置图片目录
const getAndSetPicturesDirectories = () => {
  const menuItem = menus.find((item) => item.path === '/pictures')

  const childrens = [
    {
      name: '文件夹',
      icon: FolderOutlined,
      id: '1-1',
    },
    {
      name: '文件夹',
      icon: FolderOutlined,
      id: '1-2',
    },
    {
      name: '文件夹',
      icon: FolderOutlined,
      id: '1-3',
    },
    {
      name: '文件夹',
      icon: FolderOutlined,
      id: '1-4',
      children: [
        {
          name: '文件夹',
          icon: FolderOutlined,
          id: '1-4-1',
        },
        {
          name: '文件夹',
          icon: FolderOutlined,
          id: '1-4-2',
        },
        {
          name: '文件夹',
          icon: FolderOutlined,
          id: '1-4-3',
          children: [
            {
              name: '文件夹',
              icon: FolderOutlined,
              id: '1-4-3-1',
            },
            {
              name: '文件夹',
              icon: FolderOutlined,
              id: '1-4-3-2',
            },
            {
              name: '文件夹',
              icon: FolderOutlined,
              id: '1-4-3-3',
            },
          ]
        },
        {
          name: '文件夹',
          icon: FolderOutlined,
          id: '1-4-4',
        },
      ]
    },
  ]

  menuItem.children = childrens
}


// watch
// 识别当前进入的页面自动高亮菜单
watch(() => $route.path, setMenuActive)
</script>

<template>
  <div :class="['base-menu', menusStore.getMenuCollapsedStatus ? 'with-collapsed' : '']">
    <TreeNode :item="menus" :level="0" @click="handleItemClick"></TreeNode>
  </div>
</template>

<style lang="less">
.base-menu {
  @height: calc(100vh - @BaseHeaderHeight);
  @width: @BaseMenuWidth;
  background-color: #08090c;
  height: @height;
  min-height: @height;
  max-height: @height;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  margin-top: @BaseHeaderHeight;
  box-shadow: @BoxShadow;
  width: @width;
  min-width: @width;
  max-width: @width;
  transition: all 0.3s;

  &.with-collapsed {
    @width: 60px;
    width: @width;
    min-width: @width;
    max-width: @width;
    transition: all 0.3s;

    .tree-node {
      .name {
        display: none;
      }

      .icon {
        margin-right: 0 !important;
      }

      .tree-node-box {
        padding-left: 10px !important;

        .right-icons {
          display: none;
        }
      }
    }
  }

  .tree-node {
    display: flex;
    align-items: center;
    color: @DarkTextColor;
    height: 50px;
    padding: 20px 10px;
    border-bottom: 1px solid @DarkBorderSecondColor;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;

    &:hover {
      .tree-node-box {
        background-color: @BackgroudSecondColor;
      }
    }

    &.active {
      .tree-node-box {
        background-color: @BackgroudSecondColor;
        color: @PrimaryColor;

        .icon {
          &::before {
            background-color: @PrimaryColor;
            height: 14px;
            transition: all 0.3s;
            top: calc(50% - 7px);
            border-radius: @BorderRadius;
          }
        }
      }
    }

    .tree-node-box {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 2px 10px;
      border-radius: @BorderRadius;
      position: relative;

      .icon {
        margin-right: 10px;
        font-size: 20px;

        &::before {
          content: ' ';
          width: 3px;
          height: 0px;
          display: inline-block;
          border-radius: 100px;
          position: absolute;
          left: 0;
          top: 50%;
        }
      }

      .name {
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
      }
    }
  }
}
</style>