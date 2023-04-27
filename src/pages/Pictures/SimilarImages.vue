<script setup>
// Vues
import { ref, reactive, onMounted, onUnmounted, computed, defineProps, watch, nextTick, toRefs, defineEmits } from "vue"
import { v4 as uuidv4 } from "uuid"
import { sortBy, chunk } from "lodash"
import { useStore } from "@/store/pictures.js"
import { DarkBoxBackgroundColor, DarkBorderColor } from "@/assets/style/global.module.less"

// Worker
import Worker from "@/utils/worker.js?worker"

// Components
import ImageCard from "@/components/ImageCard/PageIndex.vue"
import ImageView from "@/components/ImageView/PageIndex.vue"
import { BlockOutlined, LoadingOutlined } from "@ant-design/icons-vue"

// APIs
import { getPicturesPHash, getPicturesPHashes } from "@/api/pictures.js"

// Props
const props = defineProps(["checkedAllStatus", "imageSize", "showImageView", "sortBy", "sortType"])
const emit = defineEmits(["checkAllStatusChange", "submit", "checkedImages"])

// Store
const picturesStore = useStore()

// Variables
const worker = new Worker()
let saveType = ref("")
let deleteType = ref("")
let steps = ref([
	{
		runningText: "分析中",
		description: "分析图片特征",
	},
	{
		runningText: "对比中",
		description: "对比重复图片",
	},
	{
		runningText: "请手动挑选",
		description: "挑选需要删除的图片",
	},
	{
		runningText: "请确认",
		description: "确认删除图片",
	},
])
let stepStatus = ref({
	current: 0,
	percent: 0,
})
let hoverImageID = ref("")
const excludesExt = ["heic", "raw", "cr2", "rw2", "dng", "raf", "arw", "nef", "gif"]

// 组
let groups = ref([])

// Computed
const getHoverImageInfo = computed(() => {
	return picturesStore.getPictures.find((i) => i.uuid === hoverImageID.value) || {}
})

const getCardHeadStyle = computed(() => {
	return {
		position: "sticky",
		top: 0,
		borderTop: "1px solid " + DarkBorderColor,
		backgroundColor: DarkBoxBackgroundColor,
		zIndex: 101,
	}
})

const getIsCheckedAll = computed(() => {
	return picturesStore.getCheckedSimilarPictures.size === picturesStore.getPictures.length
})

const getGroups = computed(() => {
	return groups.value
		.filter((group) => group.images.length > 1)
		.sort((a, b) => b.images.length - a.images.length)
		.map((item, index) => {
			item.title = `第 ${index + 1} 组，共 ${item.images.length} 张`
			item.images = item.images
				.filter((i) => picturesStore.getPicturesPathsDeleted.includes(i.path) === false)
				.sort((a, b) => {
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
			return item
		})
})

const getShowDeleteTools = computed(() => {
	return stepStatus.value.current == 2 && stepStatus.value.percent == 0
})

// Lives
onMounted(() => {
	worker.onmessage = (e) => {
		const { type, msgData } = e.data
		if (type === "stepStatus") {
			const { stepStatusPercent } = msgData
			stepStatus.value.percent = stepStatusPercent

			if (stepStatusPercent == 100) {
				groups.value = groups.value
					.filter((group) => group.images.length > 1)
					.sort((a, b) => b.images.length - a.images.length)
					.map((item, index) => {
						item.title = `第 ${index + 1} 组，共 ${item.images.length} 张`
						return item
					})

				stepStatus.value.current = 2
				stepStatus.value.percent = 0
			}
		}

		if (type === "groups") {
			groups.value = reactive(msgData)
		}
	}
})

onUnmounted(() => {})

// Methods
const handleImageMouseEnter = (e, image) => {
	hoverImageID.value = image.uuid
}

const createGroupsPHash = async (callback) => {
	const imagesArray = chunk(picturesStore.getPictures, 100)

	let phashsObj = new Map()

	for (let index in imagesArray) {
		const { code, data = [], msg } = await getPicturesPHashes({ paths: imagesArray[index].map((i) => encodeURI(i.path)) })
		const newPercents = Math.floor(((Number(index) + 1) / imagesArray.length) * 100)
		stepStatus.value.percent = newPercents > 100 ? 100 : newPercents
		// console.info('createGroupsPHash newPercents', stepStatus.value.percent)

		// console.info('createGroupsPHash', code, msg, data.length)
		if (code === 200) {
			data.forEach((item) => {
				phashsObj.set(item.path, item.pHash)
			})
		} else {
			console.error(msg)
		}
	}

	for (let i of picturesStore.getPictures) {
		i.pHash = phashsObj.get(i.path) || ""
	}

	stepStatus.value.percent = 100
	callback && callback()
}

const handleImageCheckChange = ({ value, image, index }) => {
	console.log("handleImageCheckChange", value, image, index)
	picturesStore.updateCheckedPictures("similar", value, image.uuid)

	emit("checkAllStatusChange", { value: getIsCheckedAll, from: "emit" })
	emit("checkedImages", picturesStore.getCheckedSimilarPictures)
}

const handleComparePictures = () => {
  console.info("handleComparePictures")
	groups.value = []

	worker.postMessage({
		type: "compareHashes",
		msgData: {
			pictures: picturesStore.getPictures.map((i) => JSON.parse(JSON.stringify(i))),
		},
  })

  console.info("worker", worker)
}

const getStepTitle = (step, index) => {
	if (stepStatus.value.current == index) {
		if (stepStatus.value.percent == 0) {
			return "未开始"
		} else if (stepStatus.value.percent == 100) {
			return "已完成"
		} else {
			return step.runningText
		}
	} else if (stepStatus.value.current > index) {
		return "已完成"
	} else {
		return "未开始"
	}
}

const handleOKBtn = () => {
	console.info("handleOKBtn", stepStatus.value)

	if (![0, 100].includes(stepStatus.value.percent)) return

	// 第一步
	if (stepStatus.value.current == 0) {
		if (stepStatus.value.percent == 0) {
			stepStatus.value.percent = 1
			createGroupsPHash(handleOKBtn)
		} else if (stepStatus.value.percent == 100) {
			stepStatus.value.current = 1
			stepStatus.value.percent = 0
			handleComparePictures()
		}
	} else if (stepStatus.value.current == 1) {
		if (stepStatus.value.percent == 100) {
			stepStatus.value.current = 3
			stepStatus.value.percent = 1
		}
	}
}

const handleSaveTypeChange = (value) => {
  console.info("handleSaveTypeChange", value)
  const { target: { value: val } } = value
  switch (val) {
    case "sizeSmall":
      autoCheckSizeSmall()
      break
    case "recently":
      break
    case "formerly":
      break
    default:
      break
  }
}

const autoCheckSizeSmall = () => {
  getGroups.value.forEach((group) => {
    const images = group.images.filter(i => !excludesExt.includes(i.extname.replace('.', ''))) || []
    if (images.length === 0) return

    // 排除的格式
    const minSizeImage = images.reduce((prev, next) => {
      return prev.size > next.size ? next : prev
    })
    handleImageCheckChange({ value: true, image: minSizeImage })
  })
}

// Watchs
watch(
	() => picturesStore.getPictures,
	(value) => {
		// createGroupsPHash()
	}
)
</script>

<template>
	<div class="SimilarImages">
		<div class="cards">
			<!-- 步骤条 -->
			<div class="step-box">
				<a-steps :percent="stepStatus.percent" :current="stepStatus.current" style="padding-bottom: 20px">
					<a-step
						v-for="(step, index) of steps"
						:key="step.description"
						:title="getStepTitle(step, index)"
						sub-title=""
						:description="step.description"
					/>
				</a-steps>
			</div>

			<VirtualList class="images-box" :data-key="'gUuid'" :data-sources="getGroups" :keeps="10" ref="virtualList">
				<template v-slot="{ source }">
					<a-card :title="source.title" size="small" class="card" :headStyle="getCardHeadStyle" style="border-top: none">
            <template #extra>
              <a-radio-group class="right-tools" size="small">
                <a-radio-button value="sizeSmall" class="text">小文件</a-radio-button>
                <a-radio-button value="sizeLarge" class="text">大文件</a-radio-button>
                <a-radio-button value="formerly" class="text">时间远</a-radio-button>
                <a-radio-button value="recently" class="text">时间近</a-radio-button>
              </a-radio-group>
            </template>

						<div class="images">
							<ImageCard
								v-for="(image, index) of source.images"
								:key="image.uuid"
								:imageSize="props.imageSize"
								:deleteStyle="true"
								:withCheckbox="true"
								:details="image"
								:checked="picturesStore.getCheckedSimilarPictures.has(image.uuid)"
								:deleted="picturesStore.getPicturesPathsDeleted.includes(image.path)"
								@checkChange="handleImageCheckChange"
								@mouseEnter="handleImageMouseEnter"
							/>
						</div>
					</a-card>
				</template>
			</VirtualList>

			<div class="tools-box">
				<div v-if="getShowDeleteTools" class="radios">
					你将自动勾选
					<a-radio-group v-model:value="saveType" size="small" @change="handleSaveTypeChange">
						<a-radio-button value="sizeSmall">文件最小</a-radio-button>
						<a-radio-button value="recently">时间更近</a-radio-button>
						<a-radio-button value="formerly">时间更早</a-radio-button>
					</a-radio-group>
					的图片，随后将其
					<a-radio-group v-model:value="deleteType" size="small">
						<a-radio-button value="recycleBin">移动到回收站</a-radio-button>
						<!-- <a-radio-button disabled value="delete">直接删除</a-radio-button> -->
					</a-radio-group>
				</div>
				<div v-else style="flex: 1"></div>

				<a-button type="primary" @click="handleOKBtn">
					<template #icon>
						<component :is="[0, 100].includes(stepStatus.percent) ? BlockOutlined : LoadingOutlined" />
					</template>
					{{ [0, 100].includes(stepStatus.percent) ? "开始处理" : "处理中" }}
				</a-button>
			</div>
		</div>

		<ImageView v-show="props.showImageView" class="view-box" :details="getHoverImageInfo"></ImageView>
	</div>
</template>

<style lang="less">
.SimilarImages {
	max-width: 100%;
	display: flex;

	.step-box {
    margin-bottom: 10px;
	}

	.images-box {
		flex: 1;
		overflow-y: auto;
	}

	.tools-box {
		position: sticky;
		bottom: 0;
		z-index: 100;
		background-color: @BackgroudColor;
		padding: 20px 0;
		border-top: 1px solid @DarkBorderColor;
		box-shadow: @BoxShadow;
		display: flex;
		align-items: center;

		.radios {
			flex: 1;
		}
	}

	.view-box {
		position: sticky;
		right: @PagePadding * 2;
    margin-top: @PagePadding * 2;
		min-width: 340px;
		max-width: 340px;
    margin-left: 10px;
	}

	.images {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		width: 100%;
		margin-bottom: -10px;
	}

	.cards {
		flex: 1;
		@height: calc(100vh - 123px - @PagePadding * 1);
		height: @height;
		max-height: @height;
		overflow: hidden;
		display: flex;
		flex-direction: column;
    margin-right: calc(@PagePadding * 2);
    margin-top: @PagePadding * 2;
    margin-left: @PagePadding * 2;

		.card {
			margin-bottom: 15px;
     
      .right-tools {
        .text {
          font-size: 12px;
        }
      }
		}
	}
}
</style>
