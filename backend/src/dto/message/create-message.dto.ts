import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Content must be less than 2000 characters' })
  content: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;
}
