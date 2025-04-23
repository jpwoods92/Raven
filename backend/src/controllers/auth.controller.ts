import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Set up MFA for a user' })
  setupMfa(@Request() req: { user: { userId: string } }) {
    return this.authService.setupMfa(req.user.userId);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify and enable MFA for a user' })
  verifyMfa(
    @Request() req: { user: { userId: string } },
    @Body() body: { token: string },
  ) {
    return this.authService.verifyMfaAndEnableForUser(
      req.user.userId,
      body.token,
    );
  }

  @Post('mfa/login')
  @ApiOperation({ summary: 'Complete login with MFA token' })
  verifyMfaLogin(@Body() body: { tempToken: string; token: string }) {
    return this.authService.verifyMfaToken(body.tempToken, body.token);
  }
}
