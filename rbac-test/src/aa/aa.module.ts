import { Module } from '@nestjs/common';
import { AaService } from './aa.service';
import { AaController } from './aa.controller';

@Module({
  controllers: [AaController],
  providers: [AaService],
})
export class AaModule {}
