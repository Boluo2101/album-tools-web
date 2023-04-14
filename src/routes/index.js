/*
 * @Author: 张超越
 * @Date: 2022-05-27 17:40:15
 * @Last Modified by: 张超越
 * @Last Modified time: 2023-04-14 12:16:52
 */

import { createRouter, createWebHistory } from "vue-router"
import { PictureOutlined, VideoCameraOutlined, ReadOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue"

export const routes = [
	{
		path: "/pictures",
		name: "图片",
		component: () => import("@/pages/Pictures/PageIndex.vue"),
		icon: PictureOutlined,
		id: 1,
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
	},
	{
		path: "/documents",
		name: "文档",
		component: () => import("@/pages/Documents/PageIndex.vue"),
		icon: ReadOutlined,
		id: 3,
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
