import { User } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getUserList = (params: User.IUserListSearchParams) => {
  return request.get('/user/list', params)
}
