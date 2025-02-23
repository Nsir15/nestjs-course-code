import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({
    message: '会议室id不能为空',
  })
  roomId: number;

  // @IsNotEmpty({
  //   message: '会议室名称不能为空',
  // })
  meetingRoomName: string;

  @IsNotEmpty({
    message: '开始时间不能为空',
  })
  startTime: Date;

  @IsNotEmpty({
    message: '结束时间不能为空',
  })
  endTime: Date;

  remark: string;
}
