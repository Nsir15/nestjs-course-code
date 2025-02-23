import { Booking } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getBookingList = (params: Partial<Booking.IListQueryParams>) => {
  return request.get<Booking.IBookingQueryData>('/booking/list', params)
}
