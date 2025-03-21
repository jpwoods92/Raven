import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { RoomMembership } from '../entities/room-membership.entity';
import { RoomService } from '../services/room.service';
import { RoomController } from '../controllers/room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Room, RoomMembership])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
