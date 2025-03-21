import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMembership } from '../entities/room-membership.entity';
import { Room } from '../entities/room.entity';
import { RoomMembershipService } from '../services/room-membership.service';
import { RoomMembershipController } from '../controllers/room-membership.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomMembership, Room])],
  controllers: [RoomMembershipController],
  providers: [RoomMembershipService],
  exports: [RoomMembershipService],
})
export class RoomMembershipModule {}
