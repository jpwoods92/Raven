import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Content must be less than 2000 characters' })
  content: string;
}
