import axios from "./index.js";
export const getDirectories = (params) => axios.get(`/directories/only`, { params })

export const getPictures = (params) => axios.get(`/pictures`, { params })

export const getPicturesPHash = (params) => axios.get(`/pictures/pHash/${ encodeURI(params.path)}`, { params })

export const getPicturesPHashes = (params) => axios.post(`/pictures/pHashes`, params)

export const getCompareHashes = (pHash1, pHash2) => axios.get(`/pictures/compareHashes/${pHash1}/${pHash2}`, { })

export const deletePicture = (params) => axios.delete(`/pictures/${ encodeURI(params.path)}`, { params })

export const getPicturesExif = (params) => axios.get(`/pictures/exif/${ encodeURI(params.path)}`, { params })

export const moveToTrash = (params) => axios.post(`/pictures/moveToTrash`, params)

export const getPicturesDetails = (params) => axios.get(`/pictures/details`, { params })