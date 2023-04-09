<script setup>
// Tools
import { ref, onMounted, computed } from 'vue';

// APIs
// import { getDecoders, getEncoders, getHwaccels, getFormats } from '@/api/system.js'

// Vars
let searchKey = ref('')
let activeKey = ref('encoders')
let tabs = ref([
  { name: '编码器', key: 'encoders', api: getEncoders, data: [] },
  { name: '解码器', key: 'decoders', api: getDecoders, data: [] },
  { name: '硬件', key: 'hwaccels', api: getHwaccels, data: [] },
  { name: '格式', key: 'formats', api: getFormats, data: [] },
])

// Computed
const getActiveTabObj = computed(() => {
  const list = tabs.value.find(i => i.key === activeKey.value).data
  return !searchKey.value ? list : list.filter(i => i.searchValue.includes(searchKey.value.toLowerCase()))
})

// Methods
const getDatas = (list) => {
  console.info('getDatas', list)
  list.forEach(async i => {
    i.data = (await i.api())
      .map(i => {
        return { name: i, searchValue: i.toLowerCase() }
      })
  })
}

onMounted(() => {
  getDatas(tabs.value)
})
</script>

<template>
  <div class="PageFfmpeg">
    <a-tabs v-model:activeKey="activeKey" :tab-position="'left'" size="small">
      <a-tab-pane v-for="i in tabs" :key="i.key" :tab="i.name"></a-tab-pane>
    </a-tabs>

    <div class="list-box">
      <a-input v-model:value="searchKey" placeholder="输入关键词以筛选" style="width: 100%;margin-bottom: 10px" allow-clear />
      <a-list size="small" class="list" bordered :data-source="getActiveTabObj">
        <template #renderItem="{ item }">
          <a-list-item>{{ item.name }}</a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<style lang="less" scoped>
.PageFfmpeg {
  display: flex;

  .list-box {
    flex: 1;
    max-height: 400px;

    .list {
      max-height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}
</style>