import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingRoomDto } from './create-meeting-room.dto';
// import { IsNotEmpty } from 'class-validator';

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
  // @IsNotEmpty({
  //   message: '会议室id不能为空',
  // })
  // id: number;
}
