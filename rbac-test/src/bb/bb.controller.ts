import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BbService } from './bb.service';
import { CreateBbDto } from './dto/create-bb.dto';
import { UpdateBbDto } from './dto/update-bb.dto';

@Controller('bb')
export class BbController {
  constructor(private readonly bbService: BbService) {}

  @Post()
  create(@Body() createBbDto: CreateBbDto) {
    return this.bbService.create(createBbDto);
  }

  @Get()
  findAll() {
    return this.bbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bbService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBbDto: UpdateBbDto) {
    return this.bbService.update(+id, updateBbDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bbService.remove(+id);
  }
}
