import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomListQueryDto } from './dto/list-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private readonly repository: Repository<MeetingRoom>;

  initData() {
    const meeting1 = new MeetingRoom();
    meeting1.name = '会议室1';
    meeting1.capacity = 10;
    meeting1.equipment = '投影仪, 电视,白板';
    meeting1.location = '35F-3501';
    meeting1.description = '会议室1';

    const meeting2 = new MeetingRoom();
    meeting2.name = '会议室 2';
    meeting2.capacity = 15;
    meeting2.equipment = '白板';
    meeting2.location = '35F-3512';
    meeting2.description = '会议室2';

    this.repository.insert([meeting1, meeting2]);
  }

  async getList(query?: MeetingRoomListQueryDto) {
    const { name, status, capacity } = query || {};
    let { offset, limit } = query;
    if (offset < 1) offset = 1;
    const where: Record<string, any> = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (capacity) {
      where.capacity = Like(`%${capacity}%`);
    }
    if (status) {
      where.status = status;
    }

    offset = offset ? Number(offset) : 1;
    limit = limit ? Number(limit) : 10;
    const skip = offset - 1;
    const take = limit * skip;

    const [list, total] = await this.repository.findAndCount({
      skip,
      take,
      where,
    });

    return {
      list,
      total,
      offset,
      limit,
    };
  }

  create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const foundMeetingRoom = this.repository.findOneBy({
      name: createMeetingRoomDto.name,
    });
    if (foundMeetingRoom) {
      throw new BadRequestException('会议室名称已存在');
    }

    const meetingRoom = new MeetingRoom();
    Object.assign(meetingRoom, createMeetingRoomDto);

    return this.repository.insert(meetingRoom);
  }

  async findOne(id: number) {
    return this.repository.findOneBy({
      id,
    });
  }

  async update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const foundMeetingRoom = await this.repository.findOneBy({
      id,
    });
    if (!foundMeetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    await this.repository.update(id, updateMeetingRoomDto);

    return '更新成功';
  }

  async remove(id: number) {
    await this.repository.delete(id);
    return `删除成功`;
  }
}
