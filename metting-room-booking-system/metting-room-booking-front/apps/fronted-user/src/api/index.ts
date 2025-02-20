import { request } from '@meeting-room/shared'
import { EGetCaptchaAllowTypes, Login } from '@/types/api'

export const loginRequest = (params: Login.ILoginUser) => {
  return request.post<Login.ILoginResponse>('/user/login', params)
}

export const registerRequest = (params: Login.IRegisterUser) => {
  return request.post<any>('/user/register', params)
}

export const getRegisterCaptcha = (email: string) => {
  return request.get<any>('/user/register-captcha', { address: email })
}

export const updatePassword = (params: Login.IUpdatePassword) => {
  return request.post<any>('/user/updatePassword', params)
}

export const getCaptcha = ({ email, type }: { email?: string; type: EGetCaptchaAllowTypes }) => {
  return request.get<any>('/user/getCaptcha', {
    address: email,
    type,
  })
}

export const getUpdateUserCaptcha = () => {
  return request.get<any>('/user/updateUser/getCaptcha')
}

export const getUserInfo = () => {
  return request.get<any>('/user/userInfo')
}

export const updateUserInfo = (params: any) => {
  return request.post<any>('/user/updateUser', params)
}
