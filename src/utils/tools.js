/** 格式化数字每三位加逗号
 * @description
 * @author 张超越
 * @param {number} [num=0]
 * @return {*} 
 */
export const toThousands = (num = 0) => {
  let result = '', counter = 0
  num = num.toString()
  for (var i = num.length - 1; i >= 0; i--) {
    counter++
    result = num.charAt(i) + result
    if (!(counter % 3) && i != 0) { result = ',' + result; }
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
    const afterLength = zhLength + ((str.length - zhLength) / 2)
    return afterLength
  }

  const maxLength = Math.max(...arr.map((i = '') => computeRealStr(i)))
  return Number((maxLength * strWidth).toFixed(0))
}

export const computeFileSize = (num = 0) => {
  const number = 1024
  const value = (num / number / 1024).toFixed(2)
  switch (true) {
    case value < 1:
      return (num / number).toFixed(2) + ' KB'
    case value < number:
      return value + ' MB'
    case value < number * number:
      return (value / number).toFixed(2) + ' GB'
    case value < number * number * number:
      return (value / number / number).toFixed(2) + ' TB'
    case value < number * number * number * number:
      return (value / number / number / number).toFixed(2) + ' PB'
    case value < number * number * number * number * number:
      return (value / number / number / number / number).toFixed(2) + ' EB'
    default:
      return num
  }
}

// 对比pHash
export const compareHashes = (s1, s2) => {
  let counter = 0;
  for (let k = 0; k < s1.length; k++) {
    if (s1[k] !== s2[k]) {
      counter++
    }
  }
  return counter / s1.length;
}