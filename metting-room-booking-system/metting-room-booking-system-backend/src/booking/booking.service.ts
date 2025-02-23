import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Between, EntityManager, Like, Raw, Repository } from 'typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BookingService {
  @InjectRepository(Booking)
  private readonly bookingRepository: Repository<Booking>;

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async getList(queryBookingDto: QueryBookingDto) {
    const { username, meetingRoomName, startTime, endTime, status } =
      queryBookingDto;
    let { current, pageSize } = queryBookingDto;
    current = current ? Number(current) : 1;
    pageSize = pageSize ? Number(pageSize) : 10;
    const skip = (current - 1) * pageSize;

    const condition: AnyMap = {};
    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }
    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`),
      };
    }

    if (startTime && endTime) {
      condition.startTime = Between(new Date(startTime), new Date(endTime));
    }

    if (status) {
      condition.status = status;
    }

    const [list, total] = await this.bookingRepository.findAndCount({
      where: condition,
      skip,
      take: pageSize,
      relations: {
        user: true,
        room: true,
      },
    });
    return {
      list,
      total,
    };
  }

  //
  async createBooking(booking: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOne(MeetingRoom, {
      where: {
        id: booking.roomId,
      },
    });
    if (!meetingRoom) {
      throw new HttpException('会议室不存在', HttpStatus.BAD_REQUEST);
    }

    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
    });

    // 查询当前会议室是有有预定记录 和 预定的时间段内重叠
    const res = await this.entityManager.findOne(Booking, {
      where: {
        room: meetingRoom,
        // startTime: Raw(
        //   (alias) =>
        //     `${alias} <= '${booking.endTime}' and ${alias} >= '${booking.startTime}' `, // 当前的写法存在 SQL 注入的风险，因为你直接将用户输入的日期值插入到 SQL 字符串中
        // ),
        startTime: Raw(
          (alias) => `${alias} <= :endTime AND endTime >= :startTime`,
          { startTime: booking.startTime, endTime: booking.endTime },
        ),
      },
    });

    if (res) {
      throw new HttpException(
        '当前会议室在该时间段已被预定',
        HttpStatus.BAD_REQUEST,
      );
    }

    const bookingInfo = this.entityManager.create(Booking, {
      ...booking,
      user,
      room: meetingRoom,
    });

    await this.entityManager.insert(Booking, bookingInfo);
    return '预定成功';
  }

  async approveBooking(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException('预定记录不存在', HttpStatus.BAD_REQUEST);
    }
    if (booking.status === '审批通过') {
      throw new HttpException('该预定记录已审批通过', HttpStatus.BAD_REQUEST);
    }
    await this.bookingRepository.update(id, {
      status: '审批通过',
    });
    return '审批成功';
  }

  async rejectBooking(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException('预定记录不存在', HttpStatus.BAD_REQUEST);
    }
    if (booking.status === '审批驳回') {
      throw new HttpException('该预定记录已审批驳回', HttpStatus.BAD_REQUEST);
    }
    await this.bookingRepository.update(id, {
      status: '审批驳回',
    });
    return '操作成功';
  }
  async unbindBooking(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new HttpException('预定记录不存在', HttpStatus.BAD_REQUEST);
    }
    if (booking.status === '已解除') {
      throw new HttpException('该预定记录已解除', HttpStatus.BAD_REQUEST);
    }
    await this.bookingRepository.update(id, {
      status: '已解除',
    });
    return '取消成功';
  }

  async urgeBooking(id: number) {
    return '催办成功';
  }
}
