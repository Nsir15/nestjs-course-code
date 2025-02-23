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

  export interface ICreateParams extends Omit<ListItem, 'createTime' | 'updateTime' | 'id'> {}

  export interface IUpdateParams extends Partial<ICreateParams> {
    id: number
  }
}

export namespace Booking {
  export interface IListQueryParams {
    meetingRoomName: string
    status: string
    username: string
    current: number
    pageSize: number
    [property: string]: any
  }

  export interface IBookingQueryData {
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
    user?: User.IUserInfoData
    [property: string]: any
  }
}
