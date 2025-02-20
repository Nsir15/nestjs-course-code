export namespace Login {
  export interface ILoginUser {
    username: string
    password: string
  }

  export interface ILoginResponse {
    accessToken: string
    refreshToken: string
    userInfo: Record<string, any>
  }

  export interface IRegisterUser {
    username: string
    nickName: string
    password: string
    email: string
    captcha: string
  }

  export interface IUpdatePassword {
    username: string
    password: string
    email: string
    captcha: string
  }
}

export interface IUpdateUserParams {
  headPic: string
  nickName: string
  captcha: string
}

export enum EGetCaptchaAllowTypes {
  Register = 'Register',
  UpdatePassword = 'UpdatePassword',
  UpdateUser = 'UpdateUser',
}
