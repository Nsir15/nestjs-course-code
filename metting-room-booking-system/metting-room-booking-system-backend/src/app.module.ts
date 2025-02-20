import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';

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
  providers: [
    AppService,
    {
      provide: 'APP_GUARD', // 在模块中注册全局守卫,这种方式注册的守卫同样会应用到整个应用的所有路由处理程序上
      useClass: LoginGuard,
    },
    {
      provide: 'APP_GUARD', // 在模块中注册全局守卫
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
