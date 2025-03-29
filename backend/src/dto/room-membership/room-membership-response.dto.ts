import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';
import { RoomResponseDto } from '../room/room-response.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RoomMembershipResponseDto {
  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the room membership',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user',
  })
  userId: string;

  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the room',
  })
  roomId: string;

  @Expose()
  @Type(() => UserResponseDto)
  @ApiProperty({ type: UserResponseDto })
  user?: UserResponseDto;

  @Expose()
  @Type(() => RoomResponseDto)
  @ApiProperty({ type: RoomResponseDto })
  room?: RoomResponseDto;

  @Expose()
  @ApiProperty({
    example: '2024-05-21T12:00:00Z',
    description: 'Timestamp when the room membership was created',
  })
  createdAt: Date;

  constructor(partial: Partial<RoomMembershipResponseDto>) {
    Object.assign(this, partial);
  }
}
