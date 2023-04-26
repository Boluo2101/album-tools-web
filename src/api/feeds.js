import axios from "./index.js"

export const getCategoriesByUsersUUID = (params) => axios.get("/categories/users/uuid/" + params.uuid, { params })

export const getCategoryByUUID = (params) => axios.get("/categories/uuid/" + params.uuid, { params })

export const createCategory = (data) => axios.post("/categories", data)

export const deleteCategoryByUUID = (params) => axios.delete("/categories", { params })
