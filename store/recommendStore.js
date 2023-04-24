import {HYEventStore} from "hy-event-store"
import {getPlaylistDetail} from "../services/music"

const recommendStore = new HYEventStore({
  state: {
    recommendSongsInfo: {}
  },
  actions: {
    fetchRecommendSongsAction(ctx) {
      getPlaylistDetail(3778678).then(res => {
        ctx.recommendSongsInfo = res.playlist
      })
    }
  }
})

export default recommendStore