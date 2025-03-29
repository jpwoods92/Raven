import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
} from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { CreateRoomDto } from '../dto/room/create-room.dto';
import { UpdateRoomDto } from '../dto/room/update-room.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoomResponseDto } from '../dto/room/room-response.dto';
import { plainToClass } from 'class-transformer';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiTags('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Request() req: { user: { id: string } },
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.create(req.user.id, createRoomDto);
    return plainToClass(RoomResponseDto, room);
  }
  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll(@Request() req: { user: { id: string } }) {
    const rooms = await this.roomService.findAll(req.user.id);
    return rooms.map((room) => plainToClass(RoomResponseDto, room));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room by ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const room = await this.roomService.findOne(id, req.user.id);
    return plainToClass(RoomResponseDto, room);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a room by ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Request() req: { user: { id: string } },
  ) {
    const room = await this.roomService.update(id, req.user.id, updateRoomDto);
    return plainToClass(RoomResponseDto, room);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a room by ID' })
  @ApiResponse({ status: 204, description: 'Room deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.remove(id, req.user.id);
  }

  @Post(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add a member to a room' })
  @ApiResponse({ status: 204, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addMember(
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.addMember(roomId, req.user.id, memberId);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a member from a room' })
  @ApiResponse({ status: 204, description: 'Member removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async removeMember(
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.removeMember(roomId, req.user.id, memberId);
  }
}
