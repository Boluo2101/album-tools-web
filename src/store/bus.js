import { defineStore } from "pinia"
import { useIpcRenderer } from "@vueuse/electron"

export const useStore = defineStore("EventBus", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => ({
		EventBus: useIpcRenderer(),
	}),
	getters: {
		getEventBus() {
			return this.EventBus
		},
	},
	actions: {
		sentMessage(channel, ...args) {
			this.EventBus.send(channel, ...args)
		},
	},
})
