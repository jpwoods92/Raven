import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';
import { RoomResponseDto } from '../room/room-response.dto';

@Exclude()
export class RoomMembershipResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  roomId: string;

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @Type(() => RoomResponseDto)
  room?: RoomResponseDto;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<RoomMembershipResponseDto>) {
    Object.assign(this, partial);
  }
}
