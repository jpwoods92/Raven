import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { AuthModule } from './modules/auth.module';
import { RoomModule } from './modules/room.module';
import { RoomMembershipModule } from './modules/room-membership.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { MessageModule } from './modules/message.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL
        ? undefined
        : String(process.env.DATABASE_HOST),
      port: process.env.DATABASE_URL
        ? undefined
        : Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_URL
        ? undefined
        : String(process.env.DATABASE_USER),
      password: process.env.DATABASE_URL
        ? undefined
        : String(process.env.DATABASE_PASSWORD),
      database: process.env.DATABASE_URL
        ? undefined
        : String(process.env.DATABASE_NAME),
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 3000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    RoomModule,
    RoomMembershipModule,
    MessageModule,
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
