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

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<RoomResponseDto> {
    const room = await this.roomService.create(req.user.id, createRoomDto);
    return plainToClass(RoomResponseDto, room);
  }
  @Get()
  async findAll(@Request() req: { user: { id: string } }) {
    const rooms = await this.roomService.findAll(req.user.id);
    return rooms.map((room) => plainToClass(RoomResponseDto, room));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const room = await this.roomService.findOne(id, req.user.id);
    return plainToClass(RoomResponseDto, room);
  }

  @Patch(':id')
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
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.remove(id, req.user.id);
  }

  @Post(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addMember(
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.addMember(roomId, req.user.id, memberId);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('id') roomId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.roomService.removeMember(roomId, req.user.id, memberId);
  }
}
