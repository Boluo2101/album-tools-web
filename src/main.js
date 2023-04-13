import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/antd.dark.css' // 引入官方提供的暗色 less 样式入口文件
import router from './routes/index.js'
import { createPinia } from 'pinia'
const pinia = createPinia()
import VirtualList from 'vue-virtual-list-v3'

const app = createApp(App)
app.use(Antd)
  .use(pinia)
  .use(router)
  .use(VirtualList)
  .mount('#app')