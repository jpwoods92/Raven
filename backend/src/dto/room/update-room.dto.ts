import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'My Room', description: 'Title of the room' })
  title?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, description: 'Whether the room is private' })
  isPrivate?: boolean;
}
