<script setup>
// Vues
import { defineProps, ref, defineEmits } from "vue"

// Props
const props = defineProps({
	tabs: {
		type: Array,
		required: true,
	},
})

// Emits
const emits = defineEmits(["change"])

// Variables
const activeKey = ref(1)

// Methods
const handleClick = (tab) => {
	console.log("handleClick", tab)
	activeKey.value = tab.key
	emits("change", tab)
}
</script>

<template>
	<div class="Tabs">
		<div class="tabs">
			<div class="tab" v-for="(tab, index) of props.tabs" :key="index" :class="[activeKey === tab.key ? 'active' : '']" @click="handleClick(tab)">
				{{ tab.tab }}
			</div>
		</div>

		<div class="right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<style lang="less" scoped>
.Tabs {
	@height: 50px;

	display: flex;
	align-items: center;
	background-color: #fff;
	margin: 0;
	border-bottom: 1px solid @DarkBorderSecondColor;
	background-color: #08090c;
	height: @height;
	user-select: none;
	width: calc(100%);

	.tabs {
		display: flex;
		flex: 1;
		.tab {
			padding: 0 10px;
			cursor: pointer;
			height: @height;
			line-height: calc(@height - 2px);
			padding: 0 calc(@PagePadding * 2);
			border-top: 2px solid transparent;

			&.active,
			&:hover {
				background-color: #fff;
				background-color: @BackgroudColor !important;
				color: @PrimaryColor;
				border-top: 2px solid @PrimaryColor;
			}

			&.active {
				&:hover {
					opacity: 1 !important;
				}
			}

			&:hover {
				opacity: 1;
			}
		}
	}

	.right {
		margin-right: @PagePadding;
	}
}
</style>
