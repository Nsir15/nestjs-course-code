import { IsOptional } from 'class-validator';

export class QueryBookingDto {
  @IsOptional()
  username: string;
  meetingRoomName: string;
  status: '申请中' | '审批通过' | '审批驳回' | '已解除'; //申请中，审批通过，审批驳回，已解除;
  startTime: string;
  endTime: string;
  current: number;
  pageSize: number;
}
