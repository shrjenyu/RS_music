// pages/detail_song/detail_song.js
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import { getPlaylistDetail } from "../../services/music"


Page({
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {},
    id: ""
  },



  onLoad(options) {
    const type = options.type
    this.setData({type})
    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if (type === "recommend") {
      recommendStore.onState("recommendSongsInfo", this.handleRanking)
    } else if (type === "menu") {
      const id = options.id
      this.data.id = id 
      this.fetchMenuSongInfo()
    }
  },

  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({songInfo: res.playlist})
  },

  handleRanking(value) {
    this.setData({songInfo: value})
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongsInfo", this.handleRanking)
    }
  }
})