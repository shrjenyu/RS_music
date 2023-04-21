import {hyRequest} from "./index"

export function getTopMv(limit=20, offset=0) {
  return  hyRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}