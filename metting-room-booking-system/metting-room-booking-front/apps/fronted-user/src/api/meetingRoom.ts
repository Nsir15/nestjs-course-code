import { MeetingRoom } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getMeetingRoomList = (params: MeetingRoom.IListParams) => {
  return request.get<MeetingRoom.IListData>('/meeting-room/list', params)
}

/** 预定会议室 */
export const applyMeetingRoom = (params: MeetingRoom.IBookingApplyParams) => {
  return request.post('/booking/apply', params)
}
