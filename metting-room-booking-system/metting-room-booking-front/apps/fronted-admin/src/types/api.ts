export namespace Login {
  export interface ILoginParams {
    username: string
    password: string
  }

  export interface ILoginResult {
    accessToken: string
    refreshToken: string
    userInfo: {
      id: number
      username: string
      nickname: string
      headPic: string
      phoneNumber: string
      isFrozen: boolean
      isAdmin: boolean
      roles: string[]
    }
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
}
