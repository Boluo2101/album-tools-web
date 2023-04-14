import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import * as path from 'path'
import electron from 'vite-plugin-electron'
// import electronRender from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: 'electron/index.ts',
    }),
    // electronRender(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名
    },
    extensions: ['.js', '.json', '.vue'], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/style/global.module.less";',
      },
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 分包
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
