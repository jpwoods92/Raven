import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Room } from '../entities/room.entity';
import { RoomMembership } from '../entities/room-membership.entity';
import { CreateMessageDto } from '../dto/message/create-message.dto';
import { UpdateMessageDto } from '../dto/message/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private roomMembershipRepository: Repository<RoomMembership>,
  ) {}

  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const { roomId, content } = createMessageDto;

    // Check if the room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check if the user is a member of the room
    const membership = await this.roomMembershipRepository.findOne({
      where: { roomId, userId },
    });

    if (!membership && room.ownerId !== userId) {
      throw new ForbiddenException(
        'You must be a member of the room to send messages',
      );
    }

    // Create and save the message
    const message = this.messageRepository.create({
      content,
      roomId,
      userId,
    });

    return this.messageRepository.save(message);
  }

  async findAllByRoom(
    roomId: string,
    userId: string,
    options?: { limit?: number; before?: Date },
  ): Promise<Message[]> {
    // Check if the room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check if the user is a member of the room if it's private
    if (room.isPrivate) {
      const membership = await this.roomMembershipRepository.findOne({
        where: { roomId, userId },
      });

      if (!membership && room.ownerId !== userId) {
        throw new ForbiddenException(
          'You must be a member of the room to view messages',
        );
      }
    }

    // Build query with optional pagination
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .where('message.roomId = :roomId', { roomId })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.createdAt', 'DESC');

    if (options?.before) {
      queryBuilder.andWhere('message.createdAt < :before', {
        before: options.before,
      });
    }

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Check if the user can access the room where the message is
    const room = message.room;

    if (room.isPrivate) {
      const membership = await this.roomMembershipRepository.findOne({
        where: { roomId: room.id, userId },
      });

      if (!membership && room.ownerId !== userId) {
        throw new ForbiddenException('You do not have access to this message');
      }
    }

    return message;
  }

  async update(
    id: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['room'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Only the author can update their message
    if (message.userId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    await this.messageRepository.update(id, updateMessageDto);

    const updatedMessage = await this.messageRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });

    if (!updatedMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return updatedMessage;
  }
  async remove(id: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['room'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Only the message author or room owner can delete the message
    if (message.userId !== userId && message.room.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own messages or messages in rooms you own',
      );
    }

    await this.messageRepository.remove(message);
  }
}
