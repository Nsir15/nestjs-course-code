import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';
import * as minio from 'minio';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = new minio.Client({
          endPoint: configService.get('MINIO_ENDPOINT'),
          port: configService.get('MINIO_PORT'),
          useSSL: false,
          accessKey: configService.get('MINIO_ACCESS_KEY'),
          secretKey: configService.get('MINIO_SECRET_KEY'),
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
