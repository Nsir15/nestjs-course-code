import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MeetingRoomStatus {
  AVAILABLE = 'available', //空闲
  REVERSED = 'reversed', //被预定
}

@Entity()
export class MeetingRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '会议室名称',
    unique: true,
  })
  name: string;

  @Column({
    comment: '会议室容量',
  })
  capacity: number;

  @Column({
    comment: '会议室位置',
  })
  location: string;

  @Column({
    comment: '会议室状态',
    type: 'enum',
    enum: MeetingRoomStatus,
    default: MeetingRoomStatus.AVAILABLE,
  })
  status: MeetingRoomStatus;

  @Column({
    comment: '设备',
  })
  equipment: string;

  @Column({
    comment: '描述',
  })
  description: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
