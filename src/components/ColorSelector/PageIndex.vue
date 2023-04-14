<script setup>
// Vue
import { ref, defineEmits, defineProps } from "vue"
import { HighlightOutlined, CheckOutlined } from "@ant-design/icons-vue"

// Components
import { BgColorsOutlined } from "@ant-design/icons-vue"

// Emits
const emit = defineEmits(["change"])

// Props
const props = defineProps({
	color: {
		type: String,
		default: "",
	},
})

// Variables
const show = ref(false)
const colors = ref([
	{ color: "#E74C3C" },
	{ color: "#7D3C98" },
	{ color: "#2E86C1" },
	{ color: "#28B463" },
	{ color: "#D68910" },
	{ color: "#A6ACAF" },
	{ color: "#273746" },
])

const activeColor = ref(props.color)

// Methods
const handleClick = (color) => {
	if (color.color === activeColor.value) {
		activeColor.value = ""
	} else {
		activeColor.value = color.color
	}

	show.value = false
	emit("change", activeColor.value)
}
</script>

<template>
	<a-popover title="选择颜色" trigger="hover" overlayClassName="ColorSelector">
		<template #content>
			<div class="colors">
				<div class="color" v-for="(color, index) of colors" :key="color.color" :style="{ backgroundColor: color.color }" @click="handleClick(color)">
					<CheckOutlined v-show="color.color === activeColor" />
				</div>
			</div>
		</template>
		<a-button type="text" :style="{ color: activeColor }" @click="show = !show">
			<HighlightOutlined />
		</a-button>
	</a-popover>
</template>

<style lang="less" scoped>
.ColorSelector {
	.colors {
		display: flex;
		justify-content: space-between;

		.color {
			@width: 20px;
			cursor: pointer;
			height: @width;
			width: @width;
			min-width: @width;
			min-height: @width;
			line-height: @width;
			margin-right: 10px;
			display: block;
			border-radius: @BorderRadius;
			text-align: center;
			font-size: 10px;

			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>
