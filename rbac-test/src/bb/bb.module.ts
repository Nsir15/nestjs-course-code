import { Module } from '@nestjs/common';
import { BbService } from './bb.service';
import { BbController } from './bb.controller';

@Module({
  controllers: [BbController],
  providers: [BbService],
})
export class BbModule {}
