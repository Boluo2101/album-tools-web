/*
 * @Author: 张超越
 * @Date: 2023-04-14 12:13:53
 * @Last Modified by: 张超越
 * @Last Modified time: 2023-04-15 21:11:32
 */

import axios from "./index.js"

export const getDirectories = (params) => axios.get("/directories/only", { params })

export const getPictures = (params) => axios.get("/pictures", { params })

export const getPicturesPHash = (params) => axios.get(`/pictures/pHash/${encodeURI(params.path)}`, { params })

export const getPicturesPHashes = (params) => axios.post("/pictures/pHashes", params)

export const getCompareHashes = (pHash1, pHash2) => axios.post(`/pictures/compareHashes`, params)

export const deletePicture = (params) => axios.delete(`/pictures/${encodeURI(params.path)}`, { params })

export const getPicturesExif = (params) => axios.get(`/pictures/exif/${encodeURI(params.path)}`, { params })

export const moveToTrash = (params) => axios.post("/pictures/moveToTrash", params)

export const getPicturesDetails = (params) => axios.get("/pictures/details", { params })
