/*
 * @Author: 张超越
 * @Date: 2022-05-27 17:40:15
 * @Last Modified by: 张超越
 * @Last Modified time: 2023-04-27 11:20:40
 */

import { createRouter, createWebHistory } from "vue-router"
import { PictureOutlined, VideoCameraOutlined, ReadOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue"

// Stores
import { useStore } from "@/store/userinfo.js"
let userinfoStore = null

// Configs
const allowedRoutes = ["/login"]

export const routes = [
	{
		path: "/pictures",
		name: "图片",
		component: () => import("@/pages/Pictures/PageIndex.vue"),
		icon: PictureOutlined,
		id: 1,
		isMenu: true,
		raw: {
			path: "",
		},
	},
	{
		path: "/videos",
		name: "视频",
		component: () => import("@/pages/Videos/PageIndex.vue"),
		icon: VideoCameraOutlined,
		id: 2,
		isMenu: true,
	},
	{
		path: "/documents",
		name: "文档",
		component: () => import("@/pages/Documents/PageIndex.vue"),
		icon: ReadOutlined,
		id: 3,
		isMenu: true,
	},
	{
		path: "/login",
		name: "登录",
		component: () => import("@/pages/Login/PageIndex.vue"),
		id: 4,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})

const interceptor = (to, from, next) => {
	// 初始化store放在这里
	if (!userinfoStore) {
		userinfoStore = useStore()
  }
  
	if (!allowedRoutes.includes(to.path) && !userinfoStore.getIsLogined) {
		next("/login")
		return
	}

	next()
}

// 注册全局前置钩子
router.beforeEach(interceptor)
// 注册全局后置钩子
router.afterEach((to, from) => {
	if (userinfoStore === null) {
		userinfoStore = useStore()
	}
})

export default router
