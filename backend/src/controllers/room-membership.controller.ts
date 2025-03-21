import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomMembershipService } from '../services/room-membership.service';
import { CreateRoomMembershipDto } from '../dto/room-membership/create-room-membership.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoomMembershipResponseDto } from '../dto/room-membership/room-membership-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('room-memberships')
@UseGuards(JwtAuthGuard)
export class RoomMembershipController {
  constructor(private readonly roomMembershipService: RoomMembershipService) {}

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createRoomMembershipDto: CreateRoomMembershipDto,
  ) {
    const membership = await this.roomMembershipService.create(
      req.user.id,
      createRoomMembershipDto,
    );
    return plainToClass(RoomMembershipResponseDto, membership);
  }

  @Get('rooms/:roomId/members')
  async findAll(
    @Param('roomId') roomId: string,
    @Request() req: { user: { id: string } },
  ) {
    const memberships = await this.roomMembershipService.findAll(
      roomId,
      req.user.id,
    );
    return memberships.map((membership) =>
      plainToClass(RoomMembershipResponseDto, membership),
    );
  }

  @Get('my-rooms')
  async findUserRooms(@Request() req: { user: { id: string } }) {
    const memberships = await this.roomMembershipService.findUserRooms(
      req.user.id,
    );
    return memberships.map((membership) =>
      plainToClass(RoomMembershipResponseDto, membership),
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const membership = await this.roomMembershipService.findOne(
      id,
      req.user.id,
    );
    return plainToClass(RoomMembershipResponseDto, membership);
  }

  @Delete('rooms/:roomId/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomMembershipService.remove(roomId, memberId, req.user.id);
  }
}
