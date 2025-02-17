import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionMessage = (
      exception.getResponse() as { message: string | string[] }
    ).message;

    response.statusCode = statusCode;
    response.json({
      code: statusCode,
      message: exceptionMessage
        ? Array.isArray(exceptionMessage)
          ? exceptionMessage.join(',')
          : exceptionMessage
        : exception.message,
      data: null,
      timestamp: new Date().toISOString(),
      path: host.switchToHttp().getRequest().url,
    });
  }
}
