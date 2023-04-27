/** 格式化数字每三位加逗号
 * @description
 * @author 张超越
 * @param {number} [num=0]
 * @return {*}
 */
export const toThousands = (num = 0) => {
  let result = "",
    counter = 0
  num = num.toString()
  for (var i = num.length - 1; i >= 0; i--) {
    counter++
    result = num.charAt(i) + result
    if (!(counter % 3) && i != 0) {
      result = "," + result
    }
  }
  return result
}

/**
 * @description 通过字符串数组计算最大字符串所需宽度
 * @author 张超越
 * @param {string} [str='']
 * @param {number} [strWidth=20]
 * @return {*}
 */
export const computeMaxWidthByStringArray = (arr = [], strWidth = 17) => {
  const computeRealStr = (str) => {
    const zh = (str.match(/[\u4e00-\u9fa5]+/g) || []).join() // 提取中文
    const zhLength = zh.length // 提取中文
    const afterLength = zhLength + (str.length - zhLength) / 2
    return afterLength
  }

  const maxLength = Math.max(...arr.map((i = "") => computeRealStr(i)))
  return Number((maxLength * strWidth).toFixed(0))
}

export const computeFileSize = (num = 0) => {
  const number = 1024
  const value = (num / number / 1024).toFixed(2)
  switch (true) {
    case value < 1:
      return (num / number).toFixed(2) + " KB"
    case value < number:
      return value + " MB"
    case value < number * number:
      return (value / number).toFixed(2) + " GB"
    case value < number * number * number:
      return (value / number / number).toFixed(2) + " TB"
    case value < number * number * number * number:
      return (value / number / number / number).toFixed(2) + " PB"
    case value < number * number * number * number * number:
      return (value / number / number / number / number).toFixed(2) + " EB"
    default:
      return num
  }
}

// 对比pHash
export const compareHashes = (s1, s2) => {
  let counter = 0
  for (let k = 0; k < s1.length; k++) {
    if (s1[k] !== s2[k]) {
      counter++
    }
  }
  return counter / s1.length
}

export const comparePHash = (pHash1, pHash2, fPercent = 1) => {
  let n = 0
  const len = pHash1.length
  if (len !== pHash2.length) return 1
  for (let i = 0; i < len; i++) {
    // 如果百分比已经大于fPercent，则直接返回
    const nowPercent = n / len
    if (nowPercent > fPercent) return nowPercent

    // 如果两个字符不相等，则n计数+1
    if (pHash1[i] !== pHash2[i]) {
      n++
    }
  }
  return n / len
}

export const comparePHashArray = (pHashArray = [], fPercent = 0.15) => {
  const map = new Map()
  const setted = new Map()

  let times = 0

  console.time('comparePHashArray')
  for (let i = 0; i < pHashArray.length; i++) {
    for (let j = i + 1; j < pHashArray.length; j++) {
      const res = comparePHash(pHashArray[i].pHash, pHashArray[j].pHash, fPercent)

      if (res > fPercent) continue

      const iItem = pHashArray[i]
      const jItem = pHashArray[j]
      const isSetted = setted.has(jItem.index)
      if (!map.has(iItem.index) && !isSetted) {
        map.set(iItem.index, new Set())
      }

      const key = isSetted ? setted.get(jItem.index) : iItem.index
      map.get(key).add(jItem.index)
      setted.set(jItem.index, key)
    }
    times++
  }

  console.timeEnd('comparePHashArray')
  console.log('times', times)

  return map
}


export const mapToArray = (map) => {
  const result = []

  let groupIndex = 0
  for (let arr of map) {
    let [index, value] = arr
    groupIndex++
    result.push({
      index,
      indexs: Array.from(value),
      title: `第${groupIndex + 1}组`,
      description: `第${groupIndex + 1}组，共${value.size + 1}张图片`
    })
  }

  return result
}