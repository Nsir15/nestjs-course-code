export namespace Login {
  export interface ILoginParams {
    username: string
    password: string
  }
  export interface ILoginResult {
    accessToken: string
    refreshToken: string
    userInfo: User.IUserInfoData
    [property: string]: any
  }
}

export namespace User {
  export interface IUserListSearchParams {
    username?: string
    nickname?: string
    email?: string
    limit?: number
    offset?: number
  }

  export interface IUserListResult {
    users: Record<string, any>[]
    total: number
  }

  export interface IUpdateUserInfoParams {
    nickname?: string
    email: string
    captcha: number
    headPic: string
  }

  export interface IUserInfoData {
    createTime: string
    email: string
    headPic: null
    id: number
    isAdmin: boolean
    isFrozen: boolean
    nickName: string
    phoneNumber: null
    roles: string[]
    updateTime: string
    username: string
    [property: string]: any
  }
}
