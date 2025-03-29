import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({ example: 'password123', description: 'Password' })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;
}
