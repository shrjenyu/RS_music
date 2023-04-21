import {hyRequest} from "./index"

export function getTopMv(offset=0, limit=20) {
  return  hyRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}