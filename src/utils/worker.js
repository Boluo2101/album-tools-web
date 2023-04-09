import {
  compareHashes as compareHashesFun
} from '@/utils/tools.js'
import {
  v4 as uuidv4
} from 'uuid'
import {
  ref,
  reactive
} from 'vue'

onmessage = function (event) {
  const {
    data
  } = event
  const {
    type,
    msgData
  } = data
  const {
    pictures,
  } = msgData

  console.info('worker', type, msgData)

  const seted = new Set()
  const setedMap = new Map()
  const groups = new Map()
  pictures.forEach((item, index) => {
    let newObj = {
      ...item,
      images: [item],
      likeUuids: [item.uuid],
      title: `第 ${Number(index + 1)} 组`,
      gUuid: uuidv4()
    }
    groups.set(item.path, newObj)
  })

  let i = 0

  // for比较
  groups.forEach((iItem, key) => {
    ++i
    const stepStatusPercent = Math.floor((Number(i) + 1) / groups.size * 100)

    this.postMessage({
      type: 'stepStatus',
      msgData: {
        stepStatusPercent,
      }
    })
    // console.info('createGroupsPHash', '开始', i, key, value)
    groups.forEach((jItem, key2) => {
      if (key === key2) return
      if (seted.has(jItem.path)) return

      const pHash1 = iItem.pHash
      const pHash2 = jItem.pHash

      // if (!pHash1 || !pHash2 || pHash1 == errorValue || pHash2 == errorValue) continue
      if (!pHash1 || !pHash2) return

      // const compareHashes = await getCompareHashes(pHash1, pHash2)
      const compareHashes = compareHashesFun(pHash1, pHash2)
      if (compareHashes <= 0.01) {
        // console.info('createGroupsPHash', '相似', i, compareHashes)

        if (setedMap.has(jItem.path)) {
          const groupPath = setedMap.get(jItem.path)
          const group = groups.get(groupPath)
          if (group) {
            group.images.push(jItem)
            group.likeUuids.push(jItem.uuid)
            seted.add(jItem.path)
          }
          return false
        }

        // 判断是否存在 不存在则添加
        if (!iItem.likeUuids.includes(jItem.uuid)) {
          iItem.images.push(jItem)
          iItem.likeUuids.push(jItem.uuid)
          seted.add(jItem.path)
          setedMap.set(jItem.path, iItem.path)
        }
      }
    })
  })

  this.postMessage({
    type: 'groups',
    msgData: [...groups.values()]
  })
}