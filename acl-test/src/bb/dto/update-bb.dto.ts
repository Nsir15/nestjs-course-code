import { PartialType } from '@nestjs/mapped-types';
import { CreateBbDto } from './create-bb.dto';

export class UpdateBbDto extends PartialType(CreateBbDto) {}
