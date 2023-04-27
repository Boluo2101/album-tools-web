import { defineStore } from "pinia"

// APIs
import { getCategoriesByUsersUUID } from "@/api/feeds"

export const useStore = defineStore("feeds", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => ({
		// 分类
		categories: [],
	}),
	getters: {
		getCategories() {
			return this.categories
		},
		// get categories length
		getCategoriesLength() {
			return this.categories.length
		},
	},
	actions: {
		setCategories(arr = []) {
			console.info("setCategories", arr)
			if (!Array.isArray(arr)) {
				throw new Error("setCategories value must be array")
			}
			this.categories = arr
		},
    async fetchCategoriesByUsersUUID(uuid) {
      if (!uuid) {
        throw new Error("fetchCategoriesByUsersUUID uuid is required")
      }
			const { msg, code, data: categories = [] } = await getCategoriesByUsersUUID({ uuid })
			if (code !== 200) {
				console.error(msg)
				return
			}
			this.setCategories(categories)
		},
	},
})
