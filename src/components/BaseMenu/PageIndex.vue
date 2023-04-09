<script setup>
// components
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';

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

// watch
// 识别当前进入的页面自动高亮菜单
watch(() => $route.path, setMenuActive)
</script>

<template>
  <div :class="['base-menu', menusStore.getMenuCollapsedStatus ? 'with-collapsed' : '']">
    <div :class="['tree-node', menusStore.getMenuActiveKey === item.path ? 'active' : '']" v-for="(item, index) of menus" :key="item.id" @click="handleItemClick(item)">
      <div class="tree-node-box">
        <div class="icon">
          <component :is="item.icon"></component>
        </div>

        <div class="name">{{ item.name }}</div>
      </div>
    </div>
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

      .tree-node-box {}
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
      }
    }
  }
}
</style>