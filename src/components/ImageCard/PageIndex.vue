<script setup>
// Vue
import { defineProps, defineEmits, ref, watch, computed, onMounted, nextTick } from 'vue'
import { v4 as uuid } from 'uuid'
import { debounce } from 'lodash'
import { DarkBoxBackgroundColor, DarkBorderColor } from '@/assets/style/global.module.less'

// Components
import { CheckSquareFilled, DeleteOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons-vue'

// Props
const props = defineProps(['checked', 'details', 'style', 'withCheckbox', 'deleteStyle', 'imageSize', 'deleted'])
const emit = defineEmits(['checkChange', 'mouseEnter'])

// Variables
// 图片宽度（后计算）
const imageWidth = ref(0)
const imageBoxName = 'image' + uuid().replaceAll('-', '')
const timer = ref(null)

// Computed
const getImageStyle = computed(() => {
  const value = imageWidth.value
  if (!value) return props.style
  return {
    // width: `${value}px`,
    // height: `${value}px`,
    ...(props.style || {})
  }
})

const getTags = computed(() => {
  let tags = []
  const allowedExt = ['heic', 'raw', 'cr2', 'rw2', 'dng', 'raf', 'arw', 'nef', 'gif']
  if (props.details.fileType) {
    tags.push({
      text: (props.details?.fileType?.ext || '').toUpperCase(),
      color: DarkBorderColor
    })
  }
  return tags.filter(tag => allowedExt.includes(tag.text.toLowerCase()))
})

const getShowTags = computed(() => {
  return getTags.value && getTags.value.length
})

// Lives
onMounted(() => {
  setImageWidth()
})

// Methods
const handleImageClick = (type, e, image, index) => {
  console.log(type, e, image, index)
  props.withCheckbox && emit('checkChange', { value: !props.checked, image, index })
}

const setImageWidth = () => {
  imageWidth.value = document.querySelector(`.${imageBoxName} img`)?.offsetWidth || 0
}

const handleMouseEnter = (e) => {
  // console.log('mouse enter')
  timer.value = setTimeout(() => {
    emit('mouseEnter', e, props.details)
  }, 500)
}

const handleMouseLeave = (e) => {
  // console.log('mouse leave')
  timer.value && clearInterval(timer.value)
}

// Watchs
</script>

<template>
  <div v-if="!deleted"
    :class="[imageBoxName, 'ImageCard', 'image', props.imageSize, props.deleteStyle ? 'with-delete' : '', props.checked ? 'with-checked' : '', props.withCheckbox ? 'with-checkbox' : '']"
    :style="getImageStyle" @click.stop="e => handleImageClick('click', e, props.details, index)"
    @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="img-box">
      <div v-if="getShowTags" class="tags">
        <a-tag v-for="(tag, index) of getTags" :key="tag.text" :color="tag.color || DarkBorderColor">{{ tag.text }}</a-tag>
      </div>

      <CloseOutlined class="delete" />
      <component :is="props.checked ? CheckSquareFilled : BorderOutlined" class="checkbox"></component>
      <img class="img" :src="props.details.cacheUrl" alt="">
    </div>
  </div>
</template>

<style lang="less" scoped>
.ImageCard {
  user-select: none;

  &.image {
    width: calc(20% - 8px);
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: @BorderRadius;
    border: 2px solid rgba(0, 0, 0, 0);
    box-sizing: border-box;
    transition: width 0.3s ease-in-out, height 0.3s ease-in-out;

    &:nth-child(5n) {
      margin-right: 0;
    }

    &.small {
      width: calc(10% - 9px);

      &:nth-child(5n) {
        margin-right: 10px;
      }

      &:nth-child(10n) {
        margin-right: 0;
      }
    }

    &.large {
      width: calc(33.33333% - 7px);

      &:nth-child(3n) {
        margin-right: 0px !important;
      }

      &:nth-child(5n) {
        margin-right: 10px !important;
      }
    }

    &.with-delete {
      @deleteColor: #ff0000a3;
      border-color: @deleteColor;

      .delete {
        @fontSize: 20px;
        display: block !important;
        position: absolute;
        top: calc(50% - @fontSize/2);
        right: calc(50% - @fontSize/2);
        font-size: @fontSize;
        color: @deleteColor;
        z-index: 100;
      }
    }

    .img-box {
      position: relative;
      width: 100%;
      padding-top: 100%;
      z-index: 100;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        /*相当父元素的100%是100px*/
        height: 100%;
        /*相当父元素的100%是100px*/
        cursor: pointer;
        object-fit: cover;
        object-position: center;
        border-radius: @BorderRadius;
      }

      .delete {
        display: none;
      }

    }

    // 使用选中功能
    &.with-checkbox {
      cursor: pointer;

      &:hover {
        border-color: @DarkTextColor;

        .img-box {
          .checkbox {
            display: block !important;
            color: @DarkTextColor;
          }
        }
      }

      &:active,
      &.with-checked {
        border-color: @DarkPrimaryColor;

        .img-box {
          .delete {
            display: none !important;
          }

          .checkbox {
            display: block !important;
            color: @PrimaryColor;
          }
        }
      }

      .checkbox {
        display: none;
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        color: @PrimaryColor;
      }
    }

    .checkbox {
      display: none;
      z-index: 100;
    }

    .tags {
      display: flex;
      align-items: center;
      position: absolute;
      top: 10px;
      z-index: 100;
      left: 10px;
      font-size: 14px;
      font-family: cursive;
    }
  }

}
</style>