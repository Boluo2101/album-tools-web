<script setup>
// Vues
import { ref } from "vue"
import { Modal } from "ant-design-vue"

// Icons
import { CloseOutlined, MinusOutlined, BorderOutlined, FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons-vue"

// Stores
import { useStore } from "@/store/bus.js"
const EventBus = useStore()

// Methods
const handleHide = () => {
	EventBus.sentMessage("hideWindow")
}

const handleFullScreen = () => {
	EventBus.sentMessage("fullScreenToggle")
}

const handleClose = () => {
	Modal.confirm({
		title: "您确定要退出吗？",
		content: "确定后，所以任务将停止并退出程序！",
		onOk() {
			EventBus.sentMessage("closeWindow")
		},
		onCancel() {
			console.log("Cancel")
		},
	})
}
</script>

<template>
	<div class="title-buttons">
		<div class="buttons">
			<!-- 最小化 -->
			<MinusOutlined class="button min" @click="handleHide" />

			<!-- 最大化/中等 -->
			<BorderOutlined class="button max" @click="handleFullScreen" />

			<!-- 关闭 -->
			<CloseOutlined class="button close" @click="handleClose" />
		</div>
	</div>
</template>

<style scoped lang="less">
.title-buttons {
	@height: @BaseHeaderHeight;

	z-index: 101;
	padding: 0 10px;
	height: @height;
	display: flex;
	align-items: center;
	-webkit-app-region: no-drag;

	.button {
		@height: 40px;
		height: @height;
		line-height: @height;
		width: calc(@height * 1);
		text-align: center;
		color: #eee;
		border-radius: @BorderRadius;
		cursor: pointer;
		box-sizing: border-box;

		&:hover {
			background-color: @DarkBorderColor;
		}

		&.close {
			&:hover {
				background-color: #e81123;
			}
		}
	}
}
</style>
