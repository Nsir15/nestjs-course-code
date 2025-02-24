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

export namespace MeetingRoom {
  export interface IListParams {
    limit?: number
    name?: string
    offset?: number
    status?: Status
    [property: string]: any
  }

  export enum Status {
    Available = 'available',
    Reversed = 'reversed',
  }

  export interface IListData {
    limit: number
    list: ListItem[]
    offset: number
    total: number
    [property: string]: any
  }

  export interface ListItem {
    capacity: number
    createTime: string
    description: string
    equipment: string
    id: number
    location: string
    name: string
    status: string
    updateTime: string
    [property: string]: any
  }

  export interface IBookingApplyParams {
    endTime: string
    remark: string
    roomId: number
    startTime: string
    [property: string]: any
  }
}

export namespace Booking {
  export interface IBookingQueryParams {
    meetingRoomName: string
    startTime: string
    endTime: string
    pageSize?: number
    current?: number
    [key: string]: any
  }

  export interface IBookingData {
    list: IBookingItem[]
    total: number
    [property: string]: any
  }

  export interface IBookingItem {
    createTime?: string
    endTime?: string
    id?: number
    room?: MeetingRoom.ListItem
    startTime?: string
    status?: string
    updateTime?: string
    user?: User
    [property: string]: any
  }

  export interface User {
    createTime: string
    email: string
    headPic: null
    id: number
    isAdmin: boolean
    isFrozen: boolean
    nickName: string
    password: string
    phoneNumber: null
    updateTime: string
    username: string
    [property: string]: any
  }
}
