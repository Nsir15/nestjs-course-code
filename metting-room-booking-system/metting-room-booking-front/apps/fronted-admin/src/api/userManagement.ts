import { User } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getUserList = (params: User.IUserListSearchParams) => {
  return request.get<User.IUserListResult>('/user/list', params)
}

export const freezeUser = (userId: number) => {
  return request.get('/user/freeze', { userId })
}

export const getUserInfo = () => {
  return request.get<User.IUserInfoData>('/user/userInfo')
}

export const updateUserInfo = (params: any) => {
  return request.post('user/admin/updateUser', params)
}

export const getUpdateUserCaptcha = () => {
  return request.get('/user/updateUser/getCaptcha')
}
