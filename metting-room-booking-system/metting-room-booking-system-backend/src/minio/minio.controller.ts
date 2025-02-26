import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as minio from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private readonly minioClient: minio.Client;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Get('preSignedUrl')
  async preSignedUrl(@Query('name') name: string) {
    return await this.minioClient.presignedUrl(
      'PUT',
      this.configService.get('MINIO_BUCKET_NAME'),
      name,
      60 * 60,
    );
  }
}
