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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('room-memberships')
@UseGuards(JwtAuthGuard)
@ApiTags('room-memberships')
export class RoomMembershipController {
  constructor(private readonly roomMembershipService: RoomMembershipService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room membership' })
  @ApiResponse({
    status: 201,
    description: 'Room membership created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all members of a room' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all rooms a user is a member of' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findUserRooms(@Request() req: { user: { id: string } }) {
    const memberships = await this.roomMembershipService.findUserRooms(
      req.user.id,
    );
    return memberships.map((membership) =>
      plainToClass(RoomMembershipResponseDto, membership),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room membership by ID' })
  @ApiResponse({
    status: 200,
    description: 'Room membership retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Remove a member from a room' })
  @ApiResponse({ status: 204, description: 'Member removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomMembershipService.remove(roomId, memberId, req.user.id);
  }
}
