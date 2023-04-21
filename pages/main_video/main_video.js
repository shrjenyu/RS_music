// pages/main_video/main_video.js
import {getTopMv} from "../../services/video"
Page({
  data: {
    videoList: [],
    offset: 0
  },

  onLoad() {
    //  getTopMv().then(res => {
    //   this.setData({videoList: res.data})
    // })

    this.fetchTopMv()
  },

  // 封装网络请求的函数
  async fetchTopMv() {
    const res = await getTopMv()
    this.setData({videoList: res.data})
  }
})