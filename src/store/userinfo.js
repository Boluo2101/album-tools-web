import { defineStore } from "pinia"

export const useStore = defineStore("userinfo", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => ({
		userinfo: null
	}),
	getters: {
    getUserinfo() {
      return this.userinfo
    }
	},
	actions: {
    setUserinfo(value) {
      console.info("setUserinfo", value)
      this.userinfo = value
    },
	},
})
