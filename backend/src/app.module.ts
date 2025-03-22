import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { AuthModule } from './modules/auth.module';
import { RoomModule } from './modules/room.module';
import { RoomMembershipModule } from './modules/room-membership.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { MessageModule } from './modules/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.DATABASE_HOST),
      port: parseInt(process.env.DATABASE_PORT as string),
      username: String(process.env.DATABASE_USER),
      password: String(process.env.DATABASE_PASSWORD),
      database: String(process.env.DATABASE_NAME),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
