import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { AaModule } from './aa/aa.module';
import { BbModule } from './bb/bb.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mrnan',
      database: 'acl_test',
      connectorPackage: 'mysql2',
      logging: true,
      poolSize: 10,
      entities: [User, Permission],
      synchronize: true,
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    UserModule,
    AaModule,
    BbModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
