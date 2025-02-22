import { MeetingRoom } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getMeetingRoomList = (params: MeetingRoom.IListParams) => {
  return request.get<MeetingRoom.IListData>('/meeting-room/list', params)
}
