import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';
import { RoomResponseDto } from '../room/room-response.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class MessageResponseDto {
  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the message',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'Hello, world!',
    description: 'Content of the message',
  })
  content: string;

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
  @ApiProperty({
    type: UserResponseDto,
    description: 'User who sent the message',
  })
  user?: UserResponseDto;

  @Expose()
  @Type(() => RoomResponseDto)
  @ApiProperty({
    type: RoomResponseDto,
    description: 'Room where the message was sent',
  })
  room?: RoomResponseDto;

  @Expose()
  @ApiProperty({
    example: '2024-05-21T12:00:00Z',
    description: 'Timestamp when the message was created',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-05-21T12:00:00Z',
    description: 'Timestamp when the message was updated',
  })
  updatedAt: Date;

  constructor(partial: Partial<MessageResponseDto>) {
    Object.assign(this, partial);
  }
}
