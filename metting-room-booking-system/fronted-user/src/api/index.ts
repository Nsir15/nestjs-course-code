import request from '@/request/request'
import { Login } from '@/types/api'

export const loginRequest = (params: Login.ILoginUser) => {
  return request.post('/login', params)
}
