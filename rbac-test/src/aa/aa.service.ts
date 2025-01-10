import { Injectable } from '@nestjs/common';
import { CreateAaDto } from './dto/create-aa.dto';
import { UpdateAaDto } from './dto/update-aa.dto';

@Injectable()
export class AaService {
  create(createAaDto: CreateAaDto) {
    return 'This action adds a new aa';
  }

  findAll() {
    return `This action returns all aa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aa`;
  }

  update(id: number, updateAaDto: UpdateAaDto) {
    return `This action updates a #${id} aa`;
  }

  remove(id: number) {
    return `This action removes a #${id} aa`;
  }
}
