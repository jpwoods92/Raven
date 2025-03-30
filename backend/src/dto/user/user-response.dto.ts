import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '123', description: 'User ID' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;

  @Expose()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  })
  avatar: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Online status' })
  isOnline: boolean;

  @Expose()
  @ApiProperty({ example: '2024-05-21T12:00:00Z', description: 'Created at' })
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
