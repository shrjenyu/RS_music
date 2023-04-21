// pages/main_video/main_video.js
import {hyRequest} from "../../services/index"
Page({
  data: {
    videoList: [],
    offset: 0
  },

  onLoad() {
    hyRequest.get({
      url: "/top/mv",
      data: {
        limit: 20, 
        offset: 0
      }
    }).then(res => {
      console.log(res);
    })
  }
})