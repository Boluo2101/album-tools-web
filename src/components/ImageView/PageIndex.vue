<script setup>
// Vue
import { defineProps, ref, computed, watch, toRefs, toRef } from "vue"
import { computeFileSize } from "@/utils/tools.js"

// APIs
import { getPicturesExif } from "@/api/pictures.js"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

// Props
const props = defineProps(["details"])

// Variables
const exif = ref({})
const exifMap = {
	DateTimeOriginal: "拍摄时间",
	DateTimeDigitized: "写入时间",
	ExifImageLength: "图像高度",
	ExifImageHeight: "图像高度",
	ExifImageWidth: "图像宽度",
	Make: "生产商",
	Model: "型号",
	Orientation: "方向",
	XResolution: "水平方向分辨率",
	YResolution: "垂直方向分辨率",
	ResolutionUnit: "分辨率单位",
	Software: "软件",
	DateTime: "日期和时间",
	YCbCrPositioning: "YCbCr定位",
	ExifOffset: "Exif子IFD偏移量",
	ExposureTime: "曝光时间",
	FNumber: "光圈系数",
	ExposureProgram: "曝光程序",
	ISOSpeedRatings: "ISO感光度",
	// ExifVersion: 'Exif 版本',
	ExposureBiasValue: "曝光补偿",
	MaxApertureValue: "最大光圈",
	MeteringMode: "测光模式",
	Lightsource: "光源",
	Flash: "闪光灯",
	FocalLength: "镜头焦距",
	// MakerNote: '厂商注释',
	// UserComment: '用户注释',
	FlashPixVersion: "FlashPix版本",
	ColorSpace: "色彩空间",
	LensMake: "镜头生产商",
	LensModel: "镜头型号",
}
const format = "YYYY-MM-DD HH:mm:ss"

// Computed
const getItems = computed(() => {
	if (!props.details.uuid) return []

	const { birthtime, mtime } = props.details.stat

	let arr = [
		{ name: "路径", value: props.details.path, span: 2 },
		{ name: "格式", value: (props.details.extname || "").replaceAll(".", "").toUpperCase() },
		{ name: "大小", value: computeFileSize(props.details.stat.size) },
		{ name: "创建时间", value: dayjs(birthtime).format(format) + getDateFromNow(birthtime), span: 2 },
		{ name: "修改时间", value: dayjs(mtime).format(format) + getDateFromNow(mtime), span: 2 },
	]

	// 获取对象属性的index
	const exifMapArray = Object.values(exifMap)
	const getIndex = (key) => exifMapArray.indexOf(key)
	arr = arr.concat(
		Object.entries(exif.value)
			.map(([key, value]) => {
				const name = exifMap[key]
				if (!name) return null

				// 如果是创建时间，则格式化
				if (key === "DateTimeOriginal") {
					value = dayjs(value).format(format) + getDateFromNow(value)
				}

				return {
					name,
					value,
					span: (String(value) + String(name)).length >= 20 ? 2 : 1,
				}
			})
			.filter((i) => i)
			.sort((a, b) => (getIndex(a.name) > getIndex(b.name) ? 1 : -1))
	)

	return arr
})

// Methods
const getExif = async () => {
	return new Promise(async (resolve, reject) => {
		const { code, data } = await getPicturesExif({ path: props.details.path })
		resolve(code === 200 ? data : {})
	})
}

const handleImageClick = () => {
	console.log("handleImageClick")
}

const getDateFromNow = (date) => {
	return ` (${dayjs(date).fromNow()})`
}

// Watches
watch(
	() => props.details,
	async (newVal, oldVal) => {
		if (newVal.uuid === oldVal.uuid) return
		exif.value = {}
		exif.value = await getExif()
	}
)
</script>

<template>
	<div class="ImageView view-box">
		<div class="title-box">
			<div class="title">预览</div>
		</div>

		<div class="image-view-box">
			<img :src="details.url" class="img" alt="" @click="handleImageClick" />
			<a-descriptions :title="details.name" :column="2" size="small" class="descriptions">
				<a-descriptions-item v-for="(item, index) of getItems" :key="index" :span="item.span || 1" :label="item.name">{{
					item.value
				}}</a-descriptions-item>
			</a-descriptions>
		</div>
	</div>
</template>

<style lang="less" scoped>
.ImageView {
	&.view-box {
		border: 1px solid #303030;
		height: 100%;
		border-radius: 2px;
		background-color: @DarkBoxBackgroundColor;
		@height: calc(100vh - 62px - 60px - @PagePadding * 2 - 10px);
		min-height: @height;
		max-height: @height;
		display: flex;
		flex-direction: column;

		.title-box {
			padding: 8px 12px;
			border-bottom: 1px solid #303030;
		}

		.image-view-box {
			padding: 12px;
			flex: 1;
			overflow-y: auto;

			.descriptions {
				font-size: 14px;
				margin-top: 20px;
			}
			.img {
				width: 100%;
				border-radius: @BorderRadius;
				display: block;
				cursor: pointer;
			}
		}
	}
}
</style>
