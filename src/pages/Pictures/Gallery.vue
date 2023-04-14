<script setup>
// Vue
import { ref, reactive, onMounted, computed, onUnmounted, defineProps, watch, defineEmits } from "vue"
import { v4 as uuidv4 } from "uuid"
import { useStore } from "@/store/pictures.js"
import { chunk, sortBy } from "lodash"

// Components
import ImageCard from "@/components/ImageCard/PageIndex.vue"
import ImageView from "@/components/ImageView/PageIndex.vue"

// Props
const props = defineProps(["checkedAllStatus", "imageSize", "showImageView", "sortBy", "sortType"])
const emit = defineEmits(["checkAllStatusChange", "submit", "checkedImages"])

// Store
const picturesStore = useStore()

// Variables

// 选中的图片
let hoverImageID = ref("")

// Computed
const getIsCheckedAll = computed(() => {
	return picturesStore.getCheckedGalleryPictures.size === picturesStore.getPictures.length
})

const getHoverImageInfo = computed(() => {
	return picturesStore.getPictures.find((i) => i.uuid === hoverImageID.value) || {}
})

const getPicturesSorted = computed(() => {
	// String 转 为数字用于排序
	return picturesStore.getPictures.sort((a, b) => {
		const aValue = a[props.sortBy]
		const bValue = b[props.sortBy]

		if (props.sortBy === "name") {
			if (props.sortType === "up") {
				return aValue.localeCompare(bValue)
			} else {
				return bValue.localeCompare(aValue)
			}
		}

		if (props.sortType === "up") {
			return aValue - bValue
		} else {
			return bValue - aValue
		}
	})
})

const getPicturesGroup = computed(() => {
	// 如果imageSize 为 'small' 或则 'middle'，则一行显示 10 张图片，将数组转化为二维数组
	const chunkSize = ["small", "middle"].includes(props.imageSize) ? 10 : 3
	return chunk(getPicturesSorted.value, chunkSize).map((i) => {
		return {
			uuid: uuidv4(),
			images: i,
		}
	})
})

const getKeeps = computed(() => {
	// 如果 imageSize 为 'small'，则keeps 为 20
	// 如果 imageSize 为 'middle'，则keeps 为 10
	// 如果 imageSize 为 'large'，则keeps 为 6

	switch (props.imageSize) {
		case "small":
			return 20
		case "middle":
			return 10
		case "large":
			return 6
		default:
			return 10
	}
})

const getEstimateSize = computed(() => {
	// 如果 imageSize 为 'small'，则 estimateSize 为 100
	// 如果 imageSize 为 'middle'，则 estimateSize 为 200
	// 如果 imageSize 为 'large'，则 estimateSize 为 300

	switch (props.imageSize) {
		case "small":
			return document.body.clientWidth / 10
		case "middle":
			return document.body.clientWidth / 5
		case "large":
			return document.body.clientWidth / 3
		default:
			return document.body.clientWidth / 5
	}
})

// Lives
onMounted(() => {
	handleCheckAll(props.checkedAllStatus)
})

onUnmounted(() => {})

// Methods

const handleImageCheckChange = ({ value, image, index }) => {
	console.log("handleImageCheckChange", value, image, index)
	picturesStore.updateCheckedPictures("gallery", value, image.uuid)

	emit("checkAllStatusChange", { value: getIsCheckedAll, from: "emit" })
	emit("checkedImages", picturesStore.getCheckedGalleryPictures)
}

const handleCheckAll = ({ value, from = "inject" }) => {
	if (from === "emit") return
	console.log("handleCheckAll", value)

	picturesStore.setCheckedPictures("gallery", value ? picturesStore.getPictures.map((i) => i.uuid) : [])
}

const handleImageMouseEnter = (e, image) => {
	hoverImageID.value = image.path
}

// Watchs
watch(
	() => props.checkedAllStatus,
	(value) => {
		console.log("watch props.checkedAllStatus", value)
		handleCheckAll(value)
	}
)
</script>

<template>
	<div class="Gallery">
		<VirtualList
			class="images-box"
			:data-key="'uuid'"
			:data-sources="getPicturesGroup"
			:keeps="getKeeps"
			:estimate-size="getEstimateSize"
			ref="virtualList"
			item-class="images"
		>
			<template v-slot="{ source }">
				<ImageCard
					v-for="(image, index) of source.images"
					:key="image.uuid"
					:imageSize="props.imageSize"
					:withCheckbox="true"
					:checked="picturesStore.getCheckedGalleryPictures.has(image.uuid)"
					:details="image"
					@checkChange="handleImageCheckChange"
					@mouseEnter="handleImageMouseEnter"
				>
				</ImageCard>
			</template>
		</VirtualList>

		<ImageView v-show="props.showImageView" class="view-box" :details="getHoverImageInfo"></ImageView>
	</div>
</template>

<style lang="less">
.Gallery {
	max-width: 100%;
	display: flex;

	.images-box {
		flex: 1;
		@height: calc(100vh - 62px - 60px - 20px);
		height: @height;
		overflow-y: auto;
		width: 100%;
		margin-right: 10px;
	}

	.images {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		flex: 1;
	}

	.view-box {
		position: sticky;
		right: 0;
		top: 62px;
		min-width: 340px;
		max-width: 340px;
	}
}
</style>
