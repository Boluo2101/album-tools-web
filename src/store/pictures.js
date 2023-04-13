import CONFIGS from '@/configs/api'
import {
  defineStore
} from 'pinia'
import {
  getDirectories,
  getPictures,
  getPicturesPHash,
  deletePicture,
  moveToTrash,
  getPicturesDetails
} from '../api/pictures'
import dayjs from 'dayjs'
import { FolderOutlined } from '@ant-design/icons-vue';

export const useStore = defineStore('pictures', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      directories: [],
      pictures: new Map(),
      picturesDetails: new Map(),
      picturesPathsDeleted: [],
      checkedPictures: {
        gallery: new Set(),
        similar: new Set(),
      },
    }
  },
  getters: {
    getCheckedGalleryPictures() {
      return this.checkedPictures.gallery
    },
    getCheckedSimilarPictures() {
      return this.checkedPictures.similar
    },
    getDirectories() {
      const handle = (i) => {
        const children = i.children.map(i => handle(i))
        return {
          icon: FolderOutlined,
          id: i.uuid,
          name: i.name,
          children
        }
      }

      return this.directories.map(i => handle(i)).sort((a, b) => b.children.length - a.children.length)
    },
    getPictures() {
      const pictures = [...this.pictures.values()]
      return pictures
    },
    getPicturesPathsDeleted() {
      return this.picturesPathsDeleted
    }
  },
  actions: {
    setCheckedPictures(keyName, value) {
      this.checkedPictures[keyName] = new Set(value)
    },
    updateCheckedPictures(keyName, type, value) {
      console.info('updateCheckedPictures', keyName, value)
      if (!type) {
        this.checkedPictures[keyName].delete(value)
      } else {
        this.checkedPictures[keyName].add(value)
      }
    },
    setPictures(value) {
      value.forEach(i => {
        const {
          birthtimeMs: createDate = '',
          mtimeMs: updateDate = '',
          size
        } = i.stat

        this.pictures.set(i.path, {
          ...i,
          size,
          createDate,
          updateDate,
          cacheUrl: CONFIGS.baseURL + '/pictures/cache/' + encodeURI(i.path),
          url: CONFIGS.baseURL + '/pictures/raw/' + encodeURI(i.path),
        })
      })
    },
    setPicturesDetails(array) {
      array.forEach(i => {
        this.picturesDetails.set(i.path, i)

        const picture = this.pictures.get(i.path) || {}
        const {
          createDate = 0, updateDate = 0
        } = picture
        const dbDetails = i
        let {
          dateTimeOriginal = 0
        } = dbDetails
        dateTimeOriginal = dateTimeOriginal ? dayjs(dateTimeOriginal).valueOf() : Math.min(createDate, updateDate)

        this.pictures.set(i.path, {
          ...i,
          ...picture,
          dateTimeOriginal,
          dbDetails
        })
      })
    },
    async fetchPictures() {
      const {
        msg,
        code,
        data: pictures = []
      } = await getPictures()
      if (code !== 200) {
        console.error(msg)
        return
      }
      this.setPictures(pictures)
    },
    async fetchPicturesDetails() {
      const {
        msg,
        code,
        data: picturesDetails = []
      } = await getPicturesDetails()
      if (code !== 200) {
        console.error(msg)
        return
      }
      this.setPicturesDetails(picturesDetails)
    },
    setDirectories(value) {
      console.info('setDirectories', value)
      this.directories = value
    },
    async fetchDirectories() {
      const {
        msg,
        code,
        data: directories = []
      } = await getDirectories()
      if (code !== 200) {
        console.error(msg)
        return
      }
      this.setDirectories(directories)
    },
    async deletePicture(params) {
      const {
        msg,
        code
      } = await deletePicture(params)
      if (code !== 200) {
        console.error(msg)
        return
      }
    },
    async moveToTrash(params) {
      const {
        msg,
        code
      } = await moveToTrash(params)
      if (code !== 200) {
        console.error(msg)
        return false
      }

      const uuidsByPaths = params.paths.map(i => this.pictures.get(i).uuid)
      uuidsByPaths.forEach(i => {
        this.updateCheckedPictures('gallery', false, i)
        this.updateCheckedPictures('similar', false, i)
      })

      params.paths.forEach(i => {
        this.pictures.delete(i)
        this.picturesPathsDeleted.push(i)

      })
      return true
    },
  }
})