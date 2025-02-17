import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(),
    new InvokeRecordInterceptor(),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  const configService = app.get(ConfigService);
  // 当在 axios 里配置了 withCredentials: true，同时 Nest 服务项目通过 enableCors 开启跨域却仍然报跨域错误，这通常是因为在处理携带凭证的跨域请求时，需要满足更严格的跨域策略。下面为你详细分析可能的原因及对应的解决办法。
  app.enableCors();
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
