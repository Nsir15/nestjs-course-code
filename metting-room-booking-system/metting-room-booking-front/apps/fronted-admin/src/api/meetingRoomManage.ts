import { MeetingRoom } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getMeetingRoomList = (params: MeetingRoom.IListParams) => {
  return request.get<MeetingRoom.IListData>('/meeting-room/list', params)
}

export const deleteMeetingRoom = (id: number) => {
  return request.delete('/meeting-room/' + id)
}

export const createMeetingRoom = (params: MeetingRoom.ICreateParams) => {
  return request.post('/meeting-room/create', params)
}

export const updateMeetingRoom = (params: MeetingRoom.IUpdateParams) => {
  const { id, ...rest } = params
  return request.patch('/meeting-room/' + id, rest)
}

export const getMeetingRoomDetail = (id: number) => {
  return request.get<MeetingRoom.ListItem>('/meeting-room/' + id)
}
