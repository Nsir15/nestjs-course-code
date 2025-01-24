import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '权限code',
  })
  code: string;

  @Column({
    comment: '权限描述',
  })
  desc: string;
}
