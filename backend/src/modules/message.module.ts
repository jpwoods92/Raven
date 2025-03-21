import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message } from '../entities/message.entity';
import { Room } from '../entities/room.entity';
import { RoomMembership } from '../entities/room-membership.entity';
import { MessageService } from '../services/message.service';
import { MessageController } from '../controllers/message.controller';
import { MessageGateway } from '../gateways/message.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Room, RoomMembership]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d',
        },
      }),
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
