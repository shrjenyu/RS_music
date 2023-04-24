// pages/detail_video/detail_video.js
import {getMVUrl, getMVInfo, getMVRelated} from "../../services/video"

Page({
  data: {
    id: 0,
    mvUrl: "",
    mvInfo: {},
    relatedVideo: [],
  },

  // 获取子组件传递过来的id
  onLoad(options) {
    const id = options.id
    this.setData({id})
    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchMVRelated()
  },


  // 封装请求函数
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({mvUrl: res.data.url})
  },

  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({mvInfo: res.data})
  },

  async fetchMVRelated() {
    const res = await getMVRelated(this.data.id)
    this.setData({relatedVideo: res.data})
  }


})