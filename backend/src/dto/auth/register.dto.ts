import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(10, {
    message: 'Password must be at least 10 characters long',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  @ApiProperty({
    example: 'P@ssw0rd123!',
    description:
      'Password (min 10 chars, must include uppercase, lowercase, number, and special character)',
  })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;
}
