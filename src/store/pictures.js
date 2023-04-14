import { defineStore } from "pinia"
import dayjs from "dayjs"
import { FolderOutlined } from "@ant-design/icons-vue"
import { getDirectories, getPictures, getPicturesPHash, deletePicture, moveToTrash, getPicturesDetails } from "../api/pictures"
import CONFIGS from "@/configs/api"

export const useStore = defineStore("pictures", {
	// 推荐使用 完整类型推断的箭头函数
	state: () => ({
		caches: new Map(),
		directories: [],
		pictures: [],
		picturesDetails: new Map(),

		// 已删除的图片路径
		picturesPathsDeleted: [],

		// 不同页面选中的图片的缓存
		checkedPictures: {
			gallery: new Set(),
			similar: new Set(),
		},
	}),
	getters: {
		getCheckedGalleryPictures() {
			return this.checkedPictures.gallery
		},
		getCheckedSimilarPictures() {
			return this.checkedPictures.similar
		},
		getDirectories() {
			const handle = (i) => {
				const children = i.children.map((i) => handle(i))
				return {
					icon: FolderOutlined,
					id: i.uuid,
					name: i.name,
					raw: i,
					children,
				}
			}

			return this.directories.map((i) => handle(i)).sort((a, b) => b.children.length - a.children.length)
		},
		getPictures() {
			return this.pictures
		},
		getPicturesPathsDeleted() {
			return this.picturesPathsDeleted
		},
	},
	actions: {
		setCheckedPictures(keyName, value) {
			this.checkedPictures[keyName] = new Set(value)
		},
		updateCheckedPictures(keyName, type, value) {
			console.info("updateCheckedPictures", keyName, value)
			if (!type) {
				this.checkedPictures[keyName].delete(value)
			} else {
				this.checkedPictures[keyName].add(value)
			}
		},
		setPictures(value, cacheName = "/") {
			this.caches.set(cacheName, this.pictures)
			this.pictures = value.map((i) => {
				const { birthtimeMs: createDate = "", mtimeMs: updateDate = "", size } = i.stat

				return {
					...i,
					size,
					createDate,
					updateDate,
					cacheUrl: `${CONFIGS.baseURL}/pictures/cache/${encodeURI(i.path)}`,
					url: `${CONFIGS.baseURL}/pictures/raw/${encodeURI(i.path)}`,
				}
			})
		},
		setPicturesDetails(array) {
			array.forEach((i) => {
				this.picturesDetails.set(i.path, i)
				// 以下需要优化
				// const dbDetails = i
				// let picture = this.pictures.find(i => i.path === dbDetails.path) || {}
				// const {
				//   createDate = 0, updateDate = 0
				// } = picture
				// let {
				//   dateTimeOriginal = 0
				// } = dbDetails
				// dateTimeOriginal = dateTimeOriginal ? dayjs(dateTimeOriginal).valueOf() : Math.min(createDate, updateDate)

				// picture = {
				//   ...i,
				//   ...picture,
				//   dateTimeOriginal,
				//   dbDetails
				// }
			})
		},
		async fetchPictures(path = "") {
			path = encodeURIComponent(path)
			const {
				msg,
				code,
				data: pictures = [],
			} = await getPictures({
				path,
			})
			if (code !== 200) {
				console.error(msg)
				return
			}
			this.setPictures(pictures, path)
		},
		async fetchPicturesDetails() {
			const { msg, code, data: picturesDetails = [] } = await getPicturesDetails()
			if (code !== 200) {
				console.error(msg)
				return
			}
			this.setPicturesDetails(picturesDetails)
		},
		setDirectories(value) {
			console.info("setDirectories", value)
			this.directories = value
		},
		async fetchDirectories() {
			const { msg, code, data: directories = [] } = await getDirectories()
			if (code !== 200) {
				console.error(msg)
				return
			}
			this.setDirectories(directories)
		},
		async deletePicture(params) {
			const { msg, code } = await deletePicture(params)
			if (code !== 200) {
				console.error(msg)
			}
		},
		async moveToTrash(params) {
			const { msg, code } = await moveToTrash(params)
			if (code !== 200) {
				console.error(msg)
				return false
			}

			const uuidsByPaths = params.paths.map((i) => this.pictures.get(i).uuid)
			uuidsByPaths.forEach((i) => {
				this.updateCheckedPictures("gallery", false, i)
				this.updateCheckedPictures("similar", false, i)
			})

			params.paths.forEach((i) => {
				this.pictures.delete(i)
				this.picturesPathsDeleted.push(i)
			})
			return true
		},
	},
})
