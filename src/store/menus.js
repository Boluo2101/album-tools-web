import { defineStore } from 'pinia'

export const useStore = defineStore('menus', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      collapsed: true,
      activeMenuKey: 0,
    }
  },
  getters: {
    getMenuCollapsedStatus() {
      return this.collapsed
    },
    getMenuActiveKey() {
      return this.activeMenuKey
    }
  },
  actions: {
    setMenuCollapsed(value) {
      console.info('setMenuCollapsed', value)
      this.collapsed = value
    },
    setMenuActiveKey(value) {
      console.info('setMenuActiveKey', value)
      this.activeMenuKey = value
    }
  }
})

