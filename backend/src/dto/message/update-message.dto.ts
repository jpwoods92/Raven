import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Content must be less than 2000 characters' })
  @ApiProperty({
    example: 'Hello, world!',
    description: 'Content of the message',
  })
  content: string;
}
