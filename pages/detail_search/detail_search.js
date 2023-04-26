// pages/detail_search/detail_search.js
const id = 1363948882
Page({
  onLoad() {
    const audioContext = wx.createInnerAudioContext()
    audioContext.obeyMuteSwitch = false
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3` 
    audioContext.autoplay = true
  }
})