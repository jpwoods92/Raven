import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { User } from '../entities/user.entity';
import { MfaService } from './mfa.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mfaService: MfaService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    token: string;
    user: Partial<User>;
  }> {
    const { email, password, username, displayName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw new UnauthorizedException(`${field} already in use`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      username,
      displayName,
    });

    await this.userRepository.save(newUser);

    // Generate token
    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        username: newUser.username,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<{
    token?: string;
    user?: Partial<User>;
    requiresMfa?: boolean;
    tempToken?: string;
  }> {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked. Try again later.');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await this.userRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await this.userRepository.save(user);

    if (user.mfaEnabled) {
      // Generate a temporary token that only allows MFA verification
      const tempToken = this.jwtService.sign(
        { sub: user.id, email: user.email, requiresMfa: true },
        { expiresIn: '5m' },
      );

      return {
        requiresMfa: true,
        tempToken,
      };
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        displayName: user.displayName,
        username: user.username,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async setupMfa(userId: string): Promise<{ qrCodeUrl: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { otpAuthUrl, base32 } = this.mfaService.generateSecret(
      user.username,
    );

    // Store the secret in the user record
    user.mfaSecret = base32;
    await this.userRepository.save(user);

    // Generate QR code
    const qrCodeUrl = await this.mfaService.generateQrCode(otpAuthUrl);

    return { qrCodeUrl };
  }

  async verifyMfaAndEnableForUser(
    userId: string,
    token: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValid = this.mfaService.verifyToken(token, user.mfaSecret);

    if (isValid) {
      user.mfaEnabled = true;
      await this.userRepository.save(user);
    }

    return isValid;
  }

  async verifyMfaToken(
    userId: string,
    token: string,
  ): Promise<{
    token: string;
    user: Partial<User>;
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isValid = this.mfaService.verifyToken(token, user.mfaSecret);

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    // Generate the full access token
    const accessToken = this.jwtService.sign({
      sub: user.id.toString(),
      email: user.email,
    });

    return {
      token: accessToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  }

  async generateTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    // Store hashed refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded: { sub: string } = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '15m' },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
