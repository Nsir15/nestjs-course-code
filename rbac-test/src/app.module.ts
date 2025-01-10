import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user/entities/user.entity';
// import { Role } from './user/entities/role.entity';
// import { Permission } from './user/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { AaModule } from './aa/aa.module';
import { BbModule } from './bb/bb.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'mrnan',
      database: 'rbac_test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // entities: [User, Role, Permission],
      synchronize: true,
      poolSize: 10,
      logging: true,
      connectorPackage: 'mysql2',
      extra: {
        authPlugins: 'sha256_password',
      },
    }),
    JwtModule.register({
      global: true,
      secret: 'mrnan',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    AaModule,
    BbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // 注册全局的登录守卫，拦截所有路由
      useClass: LoginGuard,
    },
  ],
})
export class AppModule {}
