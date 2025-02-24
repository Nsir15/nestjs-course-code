import { Booking } from '@/types/api'
import { request } from '@meeting-room/shared'

export const fetchBookingList = (params: Booking.IBookingQueryParams) => {
  return request.get<Booking.IBookingData>('/booking/list', params)
}
