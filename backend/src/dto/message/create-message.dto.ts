import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Content must be less than 2000 characters' })
  @ApiProperty({
    example: 'Hello, world!',
    description: 'Content of the message',
  })
  content: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the room',
  })
  roomId: string;
}
