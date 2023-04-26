<script setup>
// Configs
import CONFIGS from "@/configs/index.js"

// Stores
import { useStore } from "@/store/menus.js"

// Icons
import { SettingOutlined } from "@ant-design/icons-vue"

// Components
import PageSetting from "../PageSetting/PageIndex.vue"
import TitleButtons from "../TitleButtons/PageIndex.vue"

// Tools
import { ref } from "vue"

// Variables
let visibleSetting = ref(false)
const { APP_NAME } = CONFIGS
const NAME_FIRST = String(APP_NAME[0]).toLocaleUpperCase()
const NAME_LAST = String(APP_NAME[1]).toLocaleUpperCase()

// Methods
const handleSettingPage = () => {
	visibleSetting.value = !visibleSetting.value
}

const handleClose = (value) => {
	visibleSetting.value = false
}
</script>

<template>
	<div class="base-header" draggable="false">
		<div class="logo-box">
			<span class="text color">{{ NAME_FIRST }}</span>
			<span class="text">{{ NAME_LAST }}</span>
		</div>
		<!-- <div class="icons">
			<div class="icon" @click="handleSettingPage">
				<setting-outlined />
			</div>
		</div> -->

    <TitleButtons></TitleButtons>
	</div>

	<PageSetting :status="visibleSetting" @close="handleClose"></PageSetting>
</template>

<style lang="less" scoped>
@height: @BaseHeaderHeight;

.base-header {
	height: @height;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	background-color: #08090c;
	border-bottom: 1px solid @DarkBorderSecondColor;
	z-index: 110;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	-webkit-app-region: drag;

	.icons {
		padding: 0 10px;
		cursor: pointer;
		-webkit-app-region: no-drag;

		.icon {
			@height: 40px;
			height: @height;
			line-height: @height;
			width: calc(@height * 1);
			text-align: center;
			color: #eee;
			border-radius: @BorderRadius;

			&:hover {
				background-color: @DarkBorderColor;
			}
		}
	}

	.logo-box {
		height: @height;
		line-height: @height;
		padding: 0 14px;
		font-size: 22px;
		user-select: none;
		font-weight: lighter;

		span {
			margin-right: 5px;
			color: #eee;
		}

		.text {
			animation-duration: 5s;

			&:hover {
				animation-name: hoverWhite;
				animation-iteration-count: infinite;
				animation-direction: alternate;
			}
		}

		.color {
			color: @PrimaryColor;
			animation-duration: 5s;
			font-weight: 300;

			&:hover {
				animation-name: hover;
				animation-iteration-count: infinite;
				animation-direction: alternate;
			}
		}

		@keyframes hover {
			from {
				text-shadow: 0px 0px 0px @PrimaryColor;
			}

			to {
				text-shadow: 0px 0px 20px @PrimaryColor;
			}
		}

		@keyframes hoverWhite {
			from {
				text-shadow: 0px 0px 0px #fff;
			}

			to {
				text-shadow: 0px 0px 20px #fff;
			}
		}
	}
}
</style>
