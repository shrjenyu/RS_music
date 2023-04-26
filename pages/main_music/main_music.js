// pages/main_music/main_music.js
import {getMusicBanner, getSongMenuList} from "../../services/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playStore"



Page({
  data: {
    banners: [],
    recommendSongs: [],
    hotMenuList: [],
    recMenuList: [],
    rankingInfos: {}
  },

  // 点击监听
  onSearchClick() {
    wx.navigateTo({ url: '/pages/detail_search/detail_search'})
  },

  // banner
  onLoad() {
    this.fetchMusicBanner()
    this.fetchSongMenuList()
    // this.fetchRecommendSongs()

    // 发起Store中的action
    recommendStore.onState("recommendSongsInfo", this.handleRecommendSongs)
    recommendStore.dispatch("fetchRecommendSongsAction")

    rankingStore.onState("newRanking", this.handleNewRanking)
    rankingStore.onState("originRanking", this.handleOriginRanking)
    rankingStore.onState("upRanking", this.handleUpRanking)
    rankingStore.dispatch("fetchRankingDataAction")




  },

  // 请求banner函数
  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({banners: res.banners})
  },

  // 请求推荐歌曲
  // async fetchRecommendSongs() {
  //   const res = await getPlaylistDetail(3778678)
  //   const playlist = res.playlist
  //   const recommendSongs = playlist.tracks.slice(0, 6)
  //   this.setData({recommendSongs})
  // },

  // 请求歌单
  async fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({hotMenuList: res.playlists})
    })
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
  },


  // 事件监听
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail_song/detail_song?type=recommend',
    })
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },

  // ------store中获取数据-----
  
  // 封装调用函数
  handleRecommendSongs(value) {
    if (!value.tracks) return
    this.setData({recommendSongs: value.tracks.slice(0, 6)})
  },
  handleNewRanking(value) {
    // console.log("新歌榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, newRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },
  handleOriginRanking(value) {
    // console.log("原创榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, originRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },
  handleUpRanking(value) {
    // console.log("飙升榜:", value);
    if (!value.name) return
    this.setData({ isRankingData: true })
    const newRankingInfos = { ...this.data.rankingInfos, upRanking: value }
    this.setData({ rankingInfos: newRankingInfos })
  },

  onUnload() {
    recommendStore.offState("recommendSongsInfo", this.handleRecommendSongs)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
    rankingStore.offState("upRanking", this.handleUpRanking)
  }


  

})