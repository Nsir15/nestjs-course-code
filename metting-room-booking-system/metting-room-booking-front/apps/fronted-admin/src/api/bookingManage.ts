import { Booking } from '@/types/api'
import { request } from '@meeting-room/shared'

export const getBookingList = (params: Partial<Booking.IListQueryParams>) => {
  return request.get<Booking.IBookingQueryData>('/booking/list', params)
}

export const approveBooking = (bookingId: number) => {
  return request.post('/booking/approve', { bookingId })
}

export const rejectBooking = (bookingId: number) => {
  return request.post('/booking/reject', { bookingId })
}

export const unbindBooking = (bookingId: number) => {
  return request.post('/booking/unbind', { bookingId })
}
