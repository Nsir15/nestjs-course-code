import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('needToken')
  @UseGuards(LoginGuard)
  needTokenTest(): string {
    return 'needToken';
  }

  @Get('noNeedLogin')
  noNeedLoginTest(): string {
    return 'noNeedLogin';
  }
}
