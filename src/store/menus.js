import { defineStore } from "pinia"
import { routes } from "@/routes/index.js"

export const useStore = defineStore("menus", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => ({
		collapsed: true,
    activeMenuKey: 0,
    createCategoryModalVisible: false,
	}),
	getters: {
		getMenuCollapsedStatus() {
			return this.collapsed
		},
		getMenuActiveKey() {
			return this.activeMenuKey
    },
    getMenuRouters() {
      return routes.filter(item => item.isMenu)
    },
    getCategoryModalVisible() {
      return this.createCategoryModalVisible
    }
	},
	actions: {
		setMenuCollapsed(value) {
			console.info("setMenuCollapsed", value)
			this.collapsed = value
		},
		setMenuActiveKey(value) {
			console.info("setMenuActiveKey", value)
			this.activeMenuKey = value
    },
    setCreateCategoryModalVisible(value) {
      console.info("setCreateCategoryModalVisible", value)
      this.createCategoryModalVisible = value
    }
	},
})
