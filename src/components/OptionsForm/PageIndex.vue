<script setup>
// Tools
import { ref, onMounted } from 'vue';

// APIs
import { getHwaccels } from '@/api/system.js'


let formState = ref({
  layout: 'inline',
  data: {
    codes: '',
    fps: '',
    hwaccel: '',
    outputPath: ''
  }
})

let options = ref({
  hwaccel: {
    value: '',
    name: '硬件加速',
    formKey: 'hwaccel',
    items: []
  },
  codes: {
    value: '',
    name: '编码',
    formKey: 'codes',
    items: [
      { value: '', name: '默认' },
      { value: 'h264', name: 'H.264', description: '最常见的压缩方式，更加通用' },
      { value: 'hevc', name: 'HEVC(H.265)', description: '高效压缩方式，更节省空间' },
    ]
  },
  fps: {
    value: '',
    name: '帧率',
    formKey: 'fps',
    items: [
      { value: '', name: '默认' },
      { value: 24, name: '24fps' },
      { value: 25, name: '25fps' },
      { value: 50, name: '50fps' },
      { value: 60, name: '60fps' },
    ]
  },
  output: {
    value: '',
    name: '导出目录',
    formKey: 'outputPath',
    items: [
      { value: '', name: '源目录' }
    ]
  }
})

// Methods
const getAnndSetHwaccels = async () => {
  let list = await getHwaccels()
  options.value.hwaccel.items = list.map((i, index) => {
    if (!index) return { value: '', name: '默认' }
    return { value: i, name: i }
  })
}

onMounted(() => {
  getAnndSetHwaccels()
})
</script>

<template>
  <a-form :layout="formState.layout" :model="formState" style="width: 100%">
    <a-form-item v-for="(item, index) of options" :key="index" :label="item.name" style="flex: 1">
      <a-select v-model:value="formState.data[item.formKey]" style="width: 100%">
        <a-select-option v-for="(option, indexOption) of item.items" :value="option.value">{{ option.name }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<style lang="less" scoped>

</style>