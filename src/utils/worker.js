import { comparePHashArray, mapToArray } from "@/utils/tools.js"

onmessage = function (event) {
  const { data } = event
  const { type, msgData } = data
  const { pictures } = msgData

  console.info("worker", type, msgData)
  const stepStatusPercent = 2
  this.postMessage({
    type: "stepStatus",
    msgData: {
      stepStatusPercent,
    },
  })


  // 组装需要对比的数据
  const objArray = pictures.map((i, index) => {
    const { pHash } = i


    return { index, pHash }
  })

  // 对比数据
  const comparesed = mapToArray(comparePHashArray(objArray))
  console.info("comparesed", comparesed.length)

  // 组装对比结果
  const groups = []
  for (let iIndex in comparesed) {
    const i = comparesed[iIndex]
    const { index, indexs, } = i
    const picture = pictures[index]
    const picturesOfIndexs = indexs.map(i => pictures[i])

    const stepStatusPercent = Math.floor(((Number(iIndex) + 1) / comparesed.length) * 98) + 2
    this.postMessage({
      type: "stepStatus",
      msgData: {
        stepStatusPercent,
      },
    })

    groups.push({
      gUuid: picture.uuid,
      ...picture,
      images: [picture, ...picturesOfIndexs]
    })
  }

  this.postMessage({
    type: "groups",
    msgData: groups,
  })
}
