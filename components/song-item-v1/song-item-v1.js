// components/song-item-v1/song-item-v1.js
Component({
 properties: {
   itemData: {
     type: Object,
     value: {}
   }
 },
 methods: {
  onSongItemTap() {
    const id = this.properties.itemData.id
    wx.navigateTo({
      url: `/pages/music_player/music_player?id=${id}`
    })
  }
 }
})
