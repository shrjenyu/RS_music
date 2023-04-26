// pages/music_player/music_player.js
import {getSongDetail, getSongLyric} from "../../services/player"
import {parseLyric} from "../../utils/parse-lyric"
import playerStore from "../../store/playStore"

const app = getApp()
// 创建播放器
const audioContext = wx.createInnerAudioContext()
const audioContext1 = wx.setInnerAudioOption()
audioContext1.obeyMuteSwitch = false
const modeNames = ["order", "repeat", "random"]

Page({
  data: {
    pageTitles: ["歌曲", "歌词"],
    id: 0,
    currentSong: {},
    lyricInfos: [],
    contentHeight: 0,
    currentPage: 0,
    currentTime: 0,
    durationTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    isPlaying: true,
    currentLyricText: "",
    currentLyricIndex: -1,
    lyricScrollTop: 0,
    playSongList: [],
    playSongIndex: 0,
    isFirstPlay: true,
    playModeIndex: 0,
    playModeName: "order"
  },
  onLoad(options) {
    // 获取屏幕高度
    this.setData({
      contentHeight: app.globalData.contentHeight
    })
    const id = options.id
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    this.setupPlaySong(id)
    audioContext.play()
  },

  // ------ 歌曲播放逻辑 -------
  setupPlaySong(id) {
    this.setData({id})
    // 根据id获取详情
    getSongDetail(id).then(res => {
      this.setData({currentSong: res.songs[0], durationTime: res.songs[0].dt})
    })
    // 获取歌词
    getSongLyric(id).then(res => {
      const lrcString = res.lrc.lyric
      const lyricInfos = parseLyric(lrcString)
      this.setData({lyricInfos})
    })
    // 播放歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true

    // 获取Store中的数据
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)

    // 监听播放进度
    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false
      // 进度监听
      audioContext.onTimeUpdate(() => {
        // 没有滑动的时候,再修改时间和进度的值 -> 注意: 初始值是false,if只会在true时执行
        if (!this.data.isSliderChanging) {
          // 记录当前时间
          this.setData({currentTime: audioContext.currentTime * 1000})
          // 修改进度条值
          const sliderValue = this.data.currentTime / this.data.durationTime * 100
          this.setData({sliderValue})
        }
        // 匹配正确的歌词
        if (!this.data.lyricInfos.length) return
        let index = this.data.lyricInfos.length - 1
        for (let i = 0; i < this.data.lyricInfos.length; i++) {
          const info = this.data.lyricInfos[i]
          if (info.time > audioContext.currentTime * 1000) {
            index = i - 1
            break
          }
        }
        if (index === this.data.currentLyricIndex) return
        const currentLyricText = this.data.lyricInfos[index].text
        this.setData({
          currentLyricText, 
          currentLyricIndex: index,
          lyricScrollTop: 35 * index
        })
      })
      // 拖拽后暂停等待
      audioContext.onWaiting(() => {
        audioContext.pause()
      })
      // 等待结束继续开始
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 播放结束,下一首
      audioContext.onEnded(() => {
        if (audioContext.loop) return
        this.changeNewSong()
      })
    }

  },


  // ------ 事件监听 -----
  // 返回功能
  onNavBackTap() {
    wx.navigateBack()
    audioContext.pause()
  },
  // 轮播改变索引值
  onSwiperChange(event) {
    this.setData({currentPage: event.detail.current})
  },
  // 导航切换改变对应的索引值
  onNavTabItemTap(event) { 
    const index = event.currentTarget.dataset.index
    this.setData({currentPage: index})
  },
  // 歌曲播放进度控制
  onSliderChange(event) {
    // 获取滑块的位置
    const value = event.detail.value
    // 计算出要播放的时间位置
    const currentTime = value / 100 * this.data.durationTime
    // 设置播放器,播放计算出来的时间
    audioContext.seek(currentTime / 1000)
    this.setData({currentTime})
  },
  // 拖动进度控制
  onSliderChanging(event) {
    // 获取滑动位置的value
    const value = event.detail.value
    // 根据当前的值计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({ currentTime })
    // 修改变量值
    this.data.isSliderChanging = true
  },
  // 播放暂停控制
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({isPlaying: false})
    } else {
      audioContext.play()
      this.setData({isPlaying: true})
    }
  },
  // 播放上一首
  onPrevBtnTap() {
    this.changeNewSong(false)
  },
  // 播放下一首
  onNextBtnTap() {
    this.changeNewSong()
  },
  // 封装播放上一首下一首函数
  changeNewSong(isNext = true) {
    // 获取之前的数据
    const length = this.data.playSongList.length
    let index = this.data.playSongIndex
    // 根据之前的数据计算最新的索引
    switch(this.data.playModeIndex) {
      case 1: 
      case 0: //顺序播放
        index = isNext ? index + 1 : index - 1
        if (index === length) index = 0
        if (index === -1 ) index = length -1 
        break
      case 2: // 随机播放
        index = Math.floor(Math.random() * length)  
        break
    }

    // 根据最新的索引获取歌曲信息
    const newSong = this.data.playSongList[index]
    this.setupPlaySong(newSong.id)
    // 保存最新的索引
    playerStore.setState("playSongIndex", index)
  },
  // 模式切换
  onModeBtnTap() {
    // 计算新的模式
    let modeIndex = this.data.playModeIndex
    modeIndex = modeIndex + 1
    if (modeIndex === 3) modeIndex = 0
    // 设置是否单曲循环
    if (modeIndex === 1) {
      audioContext.loop = true
    } else {
      audioContext.loop = false
    }
    // 保存当前的模式
    this.setData({playModeIndex: modeIndex, playModeName: modeNames[modeIndex]})
  },

  // --------获取Store中的数据---------
  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({playSongList})
    }
    if (playSongIndex !== undefined) {
      this.setData({playSongIndex})
    }
  },
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
  }
})