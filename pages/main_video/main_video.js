// pages/main_video/main_video.js
import {getTopMv} from "../../services/video"
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true  // 用来记录数据取完
  },

  onLoad() {
    //  getTopMv().then(res => {
    //   this.setData({videoList: res.data})
    // })

    this.fetchTopMv()
  },

  // 封装网络请求的函数
  async fetchTopMv() {
    const res = await getTopMv(this.data.offset)

    const newVideoList = [...this.data.videoList, ...res.data]
    // const newVideoList = this.data.videoList.concat(res.data)

    // 小程序中空数据不要用push的方法,下面这种方法不行
    // this.data.videoList.push(res.data)

    this.setData({videoList: newVideoList})
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },

  // 监听到底部
  onReachBottom() {
    // 判断是否有更多的数据
    if (!this.data.hasMore) return
    this.fetchTopMv()
  }
})