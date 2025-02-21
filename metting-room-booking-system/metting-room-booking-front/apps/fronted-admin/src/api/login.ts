import { Login } from '@/types/api'
import { request } from '@meeting-room/shared'

export const login = (params: Login.ILoginParams) => {
  return request.post<Login.ILoginResult>('/user/admin/login', params)
}
