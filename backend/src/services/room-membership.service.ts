import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomMembership } from '../entities/room-membership.entity';
import { Room } from '../entities/room.entity';
import { CreateRoomMembershipDto } from '../dto/room-membership/create-room-membership.dto';

@Injectable()
export class RoomMembershipService {
  constructor(
    @InjectRepository(RoomMembership)
    private roomMembershipRepository: Repository<RoomMembership>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(
    currentUserId: string,
    createRoomMembershipDto: CreateRoomMembershipDto,
  ): Promise<RoomMembership> {
    const { roomId, userId } = createRoomMembershipDto;

    // Check if the room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check if the current user is the owner of the room (authorization check)
    if (room.ownerId !== currentUserId) {
      throw new ForbiddenException('Only room owners can add members');
    }

    // Check if membership already exists
    const existingMembership = await this.roomMembershipRepository.findOne({
      where: { roomId, userId },
    });

    if (existingMembership) {
      throw new ConflictException('User is already a member of this room');
    }

    // Create new membership
    const roomMembership = this.roomMembershipRepository.create({
      roomId,
      userId,
    });

    return this.roomMembershipRepository.save(roomMembership);
  }

  async findAll(
    roomId: string,
    currentUserId: string,
  ): Promise<RoomMembership[]> {
    // Check if room exists and user has access
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // For private rooms, verify that the user is a member
    if (room.isPrivate) {
      const isMember = await this.roomMembershipRepository.findOne({
        where: { roomId, userId: currentUserId },
      });

      if (!isMember && room.ownerId !== currentUserId) {
        throw new ForbiddenException('You do not have access to this room');
      }
    }

    return this.roomMembershipRepository.find({
      where: { roomId },
      relations: ['user'], // Include user data with each membership
    });
  }

  async findUserRooms(userId: string): Promise<RoomMembership[]> {
    return this.roomMembershipRepository.find({
      where: { userId },
      relations: ['room'], // Include room data with each membership
    });
  }

  async findOne(id: string, currentUserId: string): Promise<RoomMembership> {
    const membership = await this.roomMembershipRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!membership) {
      throw new NotFoundException(`Room membership with ID ${id} not found`);
    }

    // Check if the current user has permission to view this membership
    const room = membership.room;

    if (room.isPrivate) {
      const isMember = await this.roomMembershipRepository.findOne({
        where: { roomId: room.id, userId: currentUserId },
      });

      if (!isMember && room.ownerId !== currentUserId) {
        throw new ForbiddenException(
          'You do not have access to this membership information',
        );
      }
    }

    return membership;
  }

  async remove(
    roomId: string,
    memberId: string,
    currentUserId: string,
  ): Promise<void> {
    // Check if room exists
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Find the membership to remove
    const membership = await this.roomMembershipRepository.findOne({
      where: { roomId, userId: memberId },
    });

    if (!membership) {
      throw new NotFoundException(`User is not a member of this room`);
    }

    // Authorization: Check if current user is removing themselves, or is the room owner
    if (currentUserId !== memberId && currentUserId !== room.ownerId) {
      throw new ForbiddenException(
        'You do not have permission to remove this member',
      );
    }

    // Don't allow removing the room owner
    if (memberId === room.ownerId) {
      throw new ForbiddenException(
        'Cannot remove the room owner from the room',
      );
    }

    await this.roomMembershipRepository.remove(membership);
  }
}
