import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AaService } from './aa.service';
import { CreateAaDto } from './dto/create-aa.dto';
import { UpdateAaDto } from './dto/update-aa.dto';
import { LoginGuard } from 'src/login.guard';
import { PermissionGuard } from 'src/permission.guard';

@Controller('aa')
export class AaController {
  constructor(private readonly aaService: AaService) {}

  @Post()
  @UseGuards(LoginGuard)
  create(@Body() createAaDto: CreateAaDto) {
    return this.aaService.create(createAaDto);
  }

  @Get()
  @UseGuards(LoginGuard, PermissionGuard)
  @SetMetadata('permission', 'query_aa')
  findAll() {
    return this.aaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAaDto: UpdateAaDto) {
    return this.aaService.update(+id, updateAaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aaService.remove(+id);
  }
}
