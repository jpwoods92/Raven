import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class RoomResponseDto {
  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the room',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'My Room',
    description: 'Title of the room',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: true,
    description: 'Whether the room is private',
  })
  isPrivate: boolean;

  @Expose()
  @ApiProperty({
    example: '2024-05-21T12:00:00Z',
    description: 'Timestamp when the room was created',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-05-21T12:00:00Z',
    description: 'Timestamp when the room was updated',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the owner',
  })
  ownerId: string;

  @Expose()
  @Type(() => UserResponseDto)
  @ApiProperty({ type: UserResponseDto })
  owner?: UserResponseDto;

  @Expose()
  @ApiProperty({
    example: 5,
    description: 'Number of members in the room',
  })
  memberCount?: number;

  constructor(partial: Partial<RoomResponseDto>) {
    Object.assign(this, partial);
  }
}
