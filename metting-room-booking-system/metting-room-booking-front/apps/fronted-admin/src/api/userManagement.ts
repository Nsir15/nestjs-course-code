import { User } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getUserList = (params: User.IUserListSearchParams) => {
  return request.get<User.IUserListResult>('/user/list', params)
}

export const freezeUser = (userId: number) => {
  return request.get('/user/freeze', { userId })
}
