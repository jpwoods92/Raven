import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/message/create-message.dto';
import { UpdateMessageDto } from '../dto/message/update-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { MessageResponseDto } from '../dto/message/message-response.dto';
import { plainToClass } from 'class-transformer';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.messageService.create(
      req.user.id,
      createMessageDto,
    );
    return plainToClass(MessageResponseDto, message);
  }

  @Get('room/:roomId')
  async findAllByRoom(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Request() req: { user: { id: string } },
    @Query('limit') limit?: number,
    @Query('before') before?: string,
  ) {
    const options = {
      limit: limit ? parseInt(limit.toString(), 10) : undefined,
      before: before ? new Date(before) : undefined,
    };

    const messages = await this.messageService.findAllByRoom(
      roomId,
      req.user.id,
      options,
    );
    return messages.map((message) => plainToClass(MessageResponseDto, message));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    const message = await this.messageService.findOne(id, req.user.id);
    return plainToClass(MessageResponseDto, message);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req: { user: { id: string } },
  ) {
    const message = await this.messageService.update(
      id,
      req.user.id,
      updateMessageDto,
    );
    return plainToClass(MessageResponseDto, message);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.messageService.remove(id, req.user.id);
  }
}
