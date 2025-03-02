import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '会议开始时间',
  })
  startTime: Date;

  @Column({
    comment: '会议结束时间',
  })
  endTime: Date;

  @Column({
    comment: '会议室状态:(申请中，审批通过，审批驳回，已解除)',
    default: '申请中',
  })
  status: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => MeetingRoom)
  room: MeetingRoom;

  @ManyToOne(() => User)
  user: User;
}
