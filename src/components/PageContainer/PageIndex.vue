<script setup>
// Stores
import { useStore } from '@/store/menus.js'

// Values
const menusStore = useStore()
</script>

<template>
  <router-view :class="['page-container', 'padding', menusStore.getMenuCollapsedStatus ? 'with-collapsed': '']"></router-view>
</template>

<style lang="less" scoped>
.page-container {
  margin-left: calc(@BaseMenuWidth);
  margin-top: @BaseHeaderHeight;
  max-height: calc(100vh - @BaseHeaderHeight);
  overflow: auto;
  transition: all 0.3s;

  &.with-collapsed {
    margin-left: calc(60px);
    transition: all 0.3s;
  }

  &.padding{
    padding: 0 calc(@PagePadding * 2);
  }
}
</style>