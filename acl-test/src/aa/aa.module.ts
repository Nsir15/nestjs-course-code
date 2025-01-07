import { Module } from '@nestjs/common';
import { AaService } from './aa.service';
import { AaController } from './aa.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AaController],
  providers: [AaService],
})
export class AaModule {}
