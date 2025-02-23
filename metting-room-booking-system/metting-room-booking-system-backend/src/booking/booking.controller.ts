import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { RequireLogin, UserInfo } from 'src/decorator';

@RequireLogin()
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('list')
  getList(@Query() params: QueryBookingDto) {
    return this.bookingService.getList(params);
  }

  // 申请预定会议室
  @Post('apply')
  applyRoom(
    @Body() booking: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.bookingService.createBooking(booking, userId);
  }

  // 批准/通过预定申请
  @Post('approve')
  approve(@Body('bookingId') bookingId: number) {
    return this.bookingService.approveBooking(bookingId);
  }

  @Post('reject')
  reject(@Body('bookingId') bookingId: number) {
    return this.bookingService.rejectBooking(bookingId);
  }

  @Post('unbind')
  unbind(@Body('bookingId') bookingId: number) {
    return this.bookingService.unbindBooking(bookingId);
  }

  // 催办
  @Post('urge')
  urge(@Body('bookingId') bookingId: number) {
    return this.bookingService.urgeBooking(bookingId);
  }
}
