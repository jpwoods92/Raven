import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, password, username } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    // Generate token
    const token = this.jwtService.sign({
      sub: newUser._id,
      email: newUser.email,
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{
    token: string;
    user: { id: string; email: string; username: string };
  }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password as string,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  }
  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
