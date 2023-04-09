import axios from 'axios'
import CONFIGS from '../configs/api'

const app = axios.create({
  baseURL: CONFIGS.baseURL
})


app.interceptors.response.use(async response => {
  let { data } = response
  return data;
}, err => console.error(err))

export default app