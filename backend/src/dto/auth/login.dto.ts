import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john123', description: 'Username' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  @ApiProperty({ example: 'password123', description: 'Password' })
  password: string;
}
