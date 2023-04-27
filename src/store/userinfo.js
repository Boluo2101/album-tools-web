import { defineStore } from "pinia"

function getUserinfoFromLocalStorage() {
  const userinfo = localStorage.getItem("userinfo")
  if (!userinfo) return null

  return JSON.parse(userinfo)
}

export const useStore = defineStore("userinfo", {
	// 推荐使用 完整类型推断的箭头函数
  state: () => ({
    userinfo: getUserinfoFromLocalStorage()
	}),
  getters: {
    getUserinfo() {
      return this.userinfo
    },
    getIsLogined() {
      if (!this.getUserinfo) return false

      return this.getUserinfo.sid !== ""
    }
	},
  actions: {
    async setUserinfo(userinfo) {
      console.log("setUserinfo", userinfo)
      localStorage.setItem("userinfo", JSON.stringify(userinfo))
      this.userinfo = userinfo
    }
	},
})
