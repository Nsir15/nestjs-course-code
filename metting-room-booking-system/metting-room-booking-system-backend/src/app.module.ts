import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    // TypeOrmModule.forRootAsync({
    //   // imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       type: 'mysql',
    //       host: configService.get('DB_HOST'),
    //       port: parseInt(configService.get('DB_PORT')),
    //       username: configService.get('DB_USER'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_NAME'),
    //       autoLoadEntities: true,
    //       synchronize: true,
    //       logging: true,
    //       poolSize: 10,
    //       entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //       connectorPackage: 'mysql2',
    //       extra: {
    //         authPlugin: 'sha256_password',
    //       },
    //       // name: 'default',
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mrnan',
      database: 'metting_room_booking_system',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      poolSize: 10,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRESIN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
