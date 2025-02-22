import { MeetingRoomStatus } from '../entities/meeting-room.entity';

export class MeetingRoomListQueryDto {
  offset?: number;
  limit?: number;
  name?: string;
  capacity?: number;
  status?: MeetingRoomStatus;
}
