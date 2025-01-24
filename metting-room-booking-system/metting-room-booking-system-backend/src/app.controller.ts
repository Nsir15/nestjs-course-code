import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission } from './decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @RequireLogin()
  @RequirePermission('user:manage')
  @Get('aa')
  aa(): string {
    return 'aa';
  }

  @Get('bb')
  bb(): string {
    return 'bb';
  }
}
