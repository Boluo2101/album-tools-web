<script setup>
// Tools
import { defineProps, ref, watch, defineEmits } from 'vue';

// Components
import PageFfmpeg from './PageFfmpeg.vue'

// Props
const props = defineProps({
  status: Boolean,
})

// Vars
let visible = ref(props.status)

// tabs
let activeKey = ref('ffmpeg')
let tabs = [
  { name: '目录', key: 'pathSetting' },
  { name: 'FFMPEG', key: 'ffmpeg' },
]

watch(() => props.status, (newValues) => {
  console.info('watch status', newValues)
  visible.value = newValues
})

// Methods
const emit = defineEmits(["showDetails"]);

const handleClose = val => {
  emit('close', val)
}
</script>

<template>
  <a-modal v-model:visible="visible" width="1000px" title="设置" @cancel="handleClose" @ok="handleClose">
    <a-tabs
      v-model:activeKey="activeKey"
      :style="{ height: '100%' }"
      size="small"
    >
      <a-tab-pane v-for="i in tabs" :key="i.key" :tab="i.name"></a-tab-pane>
    </a-tabs>

    <PageFfmpeg v-show="activeKey === 'ffmpeg'"></PageFfmpeg>
  </a-modal>
</template>