/*
 * @Author: 张超越
 * @Date: 2023-04-14 12:13:46
 * @Last Modified by:   张超越
 * @Last Modified time: 2023-04-14 12:13:46
 */

import axios from "axios"
import CONFIGS from "../configs/api"

const app = axios.create({
	baseURL: CONFIGS.baseURL,
})

app.interceptors.response.use(
	async (response) => {
		const { data } = response
		return data
	},
	(err) => console.error(err)
)

export default app
