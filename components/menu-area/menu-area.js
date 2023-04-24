// components/menu-area/menu-area.js
const app = getApp()

Component({
  properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    menuList: {
      type: Array,
      value: []
    }
  },

  data: {
    screenWidth: 375,
  },

  lifetimes: {
    attached() {
      // 获取屏幕尺寸
      this.setData({ screenWidth: app.globalData.screenWidth })
    }
  },
  methods: {
    onMenuMoreClick() {
      wx.navigateTo({
        url: '/pages/detail_menu/detail_menu',
      })
    }
  }


})
