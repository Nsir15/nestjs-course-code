import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { MeetingRoomStatus } from '../entities/meeting-room.entity';

export class CreateMeetingRoomDto {
  @IsNotEmpty({
    message: '会议室名称不能为空',
  })
  @MaxLength(15, {
    message: '会议室名称长度不能超过15',
  })
  name: string;

  @IsNotEmpty({
    message: '会议室容量不能为空',
  })
  capacity: number;

  @IsNotEmpty({
    message: '会议室位置不能为空',
  })
  location: string;

  @IsNotEmpty({
    message: '请输入会议室设备',
  })
  equipment: string;

  @IsOptional()
  @IsEnum(MeetingRoomStatus)
  status: MeetingRoomStatus = MeetingRoomStatus.AVAILABLE;

  @IsOptional()
  description: string;
}
