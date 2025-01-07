import { PartialType } from '@nestjs/mapped-types';
import { CreateAaDto } from './create-aa.dto';

export class UpdateAaDto extends PartialType(CreateAaDto) {}
