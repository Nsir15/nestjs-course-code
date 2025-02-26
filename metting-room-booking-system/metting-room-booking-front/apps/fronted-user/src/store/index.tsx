import { Booking } from '@/types/api'
import { Storage } from '@meeting-room/shared'
import { create } from 'zustand'

export interface IStore {
  userInfo?: Booking.User
  updateUserInfo: (userInfo: Booking.User) => void
}

export const myUserStore = create<IStore>((set) => {
  return {
    userInfo: Storage.get('userInfo'),
    updateUserInfo(userInfo) {
      set({ userInfo })
      Storage.set('userInfo', userInfo)
    },
  }
})
