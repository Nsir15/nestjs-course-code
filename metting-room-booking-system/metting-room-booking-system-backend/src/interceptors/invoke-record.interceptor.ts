import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const { ip, path, method } = request;
    const userAgent = request.headers['user-agent'];
    this.logger.debug(
      `当前用户：${request.user?.username}，用户ID：${request.user?.userId}`,
    );
    this.logger.debug(
      `${ip}访问了${path},请求方式为: ${method},用户代理是：${userAgent}-【${context.getHandler().name}】`,
    );
    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${ip}访问了${path},请求方式为: ${method},用户代理是：${userAgent}-【耗时：${
            Date.now() - now
          }ms】,返回状态码：${response.statusCode}, by-【${context.getHandler().name}】`,
        );
        this.logger.debug(`返回结果：${JSON.stringify(res)}`);
      }),
    );
  }
}
