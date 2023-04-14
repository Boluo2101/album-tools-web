<script setup>
// Vue
import { ref, reactive, onMounted, computed, createVNode } from "vue"

// Store
import {
	CameraOutlined,
	DeleteOutlined,
	FileOutlined,
	AppstoreOutlined,
	SwapOutlined,
	CheckSquareOutlined,
	BorderOutlined,
	DownOutlined,
	FileAddOutlined,
	FileSyncOutlined,
	FontSizeOutlined,
	ArrowDownOutlined,
	ArrowUpOutlined,
	PicRightOutlined,
	PicCenterOutlined,
} from "@ant-design/icons-vue"
import { Modal, message } from "ant-design-vue"
import { useStore } from "@/store/pictures.js"

// Components
import Gallery from "./Gallery.vue"
import SimilarImages from "./SimilarImages.vue"
import ColorSelector from "@/components/ColorSelector/PageIndex.vue"

// Values
const picturesStore = useStore()

const checkedAll = ref(false)
const checkedAllStatus = ref({ value: checkedAll.value, from: "inject" })
const activeKey = ref(1)
const tabs = ref([
	{
		key: 1,
		tab: "全部图片",
		keyName: "gallery",
	},
	{
		key: 2,
		tab: "去重",
		keyName: "similar",
	},
	{
		key: 3,
		tab: "转化",
	},
	{
		key: 4,
		tab: "识别",
	},
])
const sortBy = ref("createDate")
const sortType = ref("down")
const sortBys = ref([
	{
		key: "dateTimeOriginal",
		name: "拍摄时间",
		icon: CameraOutlined,
	},
	{
		key: "createDate",
		name: "创建时间",
		icon: FileAddOutlined,
	},
	{
		key: "updateDate",
		name: "修改时间",
		icon: FileSyncOutlined,
	},
	{
		key: "name",
		name: "名称",
		icon: FontSizeOutlined,
	},
	{
		key: "size",
		name: "大小",
		icon: FileOutlined,
	},
])
const imageSize = ref("middle")
const showImageView = ref(true)

// computed
const getShowDelete = computed(() => picturesStore.checkedPictures[getActiveTabKeyName.value].size)

const getActiveTabKeyName = computed(() => tabs.value.find((i) => i.key === activeKey.value)?.keyName || "")

// lifecycle
onMounted(async () => {
	console.info("onMounted")
	await picturesStore.fetchPictures()
	await picturesStore.fetchPicturesDetails()
})

// methonds
const handleCheckAll = () => {
	checkedAll.value = !checkedAll.value
	checkedAllStatus.value = { value: checkedAll.value, from: "inject" }
}

const handleSortMenuClick = (e) => {
	console.info("handleSortMenuClick", e)
	const { key } = e
	if (sortBys.value.map((i) => i.key).includes(key)) {
		sortBy.value = key
	} else {
		sortType.value = key
	}
}

const handleCheckedImages = (set) => {
	console.info("handleCheckedImages", set.size)
}

const handleCheckAllStatusChange = (e) => {
	console.info("checkAllStatusChange", e)
	checkedAll.value = e.value.value
}

const handleColorSelectorChange = (color) => {
	console.info("color", color)
}

const handleImageSizeMenuClick = (e) => {
	console.info("handleImageSizeMenuClick", e)
	const { key } = e
	if (["small", "middle", "large"].includes(key)) {
		imageSize.value = key
	}
}

const handleDelete = () => {
	const checkedImages = picturesStore.checkedPictures[getActiveTabKeyName.value]
	const checkedImagesNumber = checkedImages.size
	console.info("handleDelete", checkedImages, checkedImagesNumber)

	Modal.confirm({
		title: "您确定要删除这些图片吗？",
		icon: createVNode(DeleteOutlined),
		content: `您将要删除选中的 ${checkedImagesNumber} 张图片，确定吗？`,
		async onOk() {
			await picturesStore.moveToTrash({ paths: picturesStore.getPictures.filter((i) => checkedImages.has(i.uuid)).map((i) => i.path) })
			message.success("删除成功")
		},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onCancel() {},
	})
}

const handleImageView = () => {
	showImageView.value = !showImageView.value
}

const handleTabChange = (key) => {
	console.info("handleTabChange", key)
	checkedImages.value = []
	checkedAll.value = false
}
</script>

<template>
	<div class="PicturesPage">
		<!-- Tabs -->
		<a-tabs v-model:activeKey="activeKey" class="tab-box">
			<a-tab-pane v-for="(tab, index) of tabs" :key="tab.key" :tab="tab.tab" @change="handleTabChange"></a-tab-pane>
			<template #rightExtra>
				<!-- 删除 -->
				<a-button v-show="getShowDelete" type="text" @click="handleDelete">
					<DeleteOutlined />
				</a-button>

				<!-- 全选 -->
				<a-button v-show="activeKey != 2" type="text" @click="handleCheckAll">
					<component :is="checkedAll ? CheckSquareOutlined : BorderOutlined" />
				</a-button>

				<!-- 资源预览器 -->
				<a-button type="text" @click="handleImageView">
					<component :is="!showImageView ? PicCenterOutlined : PicRightOutlined" />
				</a-button>

				<!-- 主题是选择器 -->
				<ColorSelector @change="handleColorSelectorChange" />

				<!-- 列表大小选择 -->

				<a-dropdown overlayClassName="PicturesPage">
					<template #overlay>
						<a-menu class="menu" @click="handleImageSizeMenuClick">
							<a-menu-item key="small" :class="['item', imageSize === 'small' ? 'active' : '']"> 小 </a-menu-item>
							<a-menu-item key="middle" :class="['item', imageSize === 'middle' ? 'active' : '']"> 中 </a-menu-item>
							<a-menu-item key="large" :class="['item', imageSize === 'large' ? 'active' : '']"> 大 </a-menu-item>
						</a-menu>
					</template>
					<a-button type="text">
						<AppstoreOutlined />
						<DownOutlined />
					</a-button>
				</a-dropdown>

				<!-- 排序 -->
				<a-dropdown overlayClassName="PicturesPage">
					<template #overlay>
						<a-menu class="menu" @click="handleSortMenuClick">
							<a-menu-item v-for="(item, index) of sortBys" :key="item.key" :class="['item', sortBy === item.key ? 'active' : '']">
								<component :is="item.icon" class="icon" /> {{ item.name }}
							</a-menu-item>
							<a-menu-divider />
							<a-menu-item key="down" :class="['item', sortType === 'down' ? 'active' : '']"> <ArrowDownOutlined class="icon" /> 降序 </a-menu-item>
							<a-menu-item key="up" :class="['item', sortType === 'up' ? 'active' : '']"> <ArrowUpOutlined class="icon" /> 升序 </a-menu-item>
						</a-menu>
					</template>
					<a-button type="text">
						<SwapOutlined />
						<DownOutlined />
					</a-button>
				</a-dropdown>
			</template>
		</a-tabs>

		<!-- gallery -->
		<Gallery
			v-show="activeKey === 1"
			:sortBy="sortBy"
			:sortType="sortType"
			:showImageView="showImageView"
			:imageSize="imageSize"
			:checkedAllStatus="checkedAllStatus"
			@checkAllStatusChange="handleCheckAllStatusChange"
			@checkedImages="handleCheckedImages"
		/>

		<!-- remove similar pictures -->
		<SimilarImages
			v-show="activeKey === 2"
			:sortBy="sortBy"
			:sortType="sortType"
			:showImageView="showImageView"
			:imageSize="imageSize"
			@checkedImages="handleCheckedImages"
		></SimilarImages>
	</div>
</template>

<style lang="less">
.PicturesPage {
	.tab-box {
		position: sticky;
		top: 0;
		z-index: 200;
		background-color: @BackgroudColor;
	}

	.menu {
		border-radius: @BorderRadius;

		.item {
			.icon {
				margin-right: 8px;
			}
		}

		.active {
			color: @PrimaryColor !important;
		}
	}
}
</style>
