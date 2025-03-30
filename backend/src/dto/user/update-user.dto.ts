import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  })
  avatar?: string;
}
