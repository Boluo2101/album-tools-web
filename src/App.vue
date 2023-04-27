<script setup>
import BaseHeader from "./components/BaseHeader/PageIndex.vue"
import BaseMenu from "./components/BaseMenu/PageIndex.vue"
import PageContainer from "./components/PageContainer/PageIndex.vue"

// Stores
import { useStore } from '@/store/userinfo.js'
const userinfoStore = useStore()
</script>

<template>
	<!-- 头部导航栏 -->
	<BaseHeader v-if="userinfoStore.getIsLogined"></BaseHeader>

	<!-- 菜单 -->
	<BaseMenu v-if="userinfoStore.getIsLogined"></BaseMenu>

	<!-- 路由视图 -->
	<PageContainer></PageContainer>
</template>

<style lang="less">
html,
body {
	@height: 100%;
	@width: 100%;
	margin: 0px;
	padding: 0px;
	height: @height;
	min-height: @height;
	max-height: @height;
	width: @height;
	min-width: @height;
	max-width: @height;
	overflow: hidden;
	background-color: @BackgroudColor !important;
}

// 美化滚动条
::-webkit-scrollbar {
	width: 5px;
	height: 5px;
}

::-webkit-scrollbar-track {
	width: 6px;
	background: rgba(#101f1c, 0);
	border-radius: 2em;
}

::-webkit-scrollbar-thumb {
	background-color: @DarkBorderColor;
	background-clip: padding-box;
	min-height: 28px;
	border-radius: 2em;
	transition: background-color 0.3s;
	cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
	background-color: rgba(144, 147, 153, 0.3);
}
</style>
