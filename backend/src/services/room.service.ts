import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomMembership } from '../entities/room-membership.entity';
import { CreateRoomDto } from '../dto/room/create-room.dto';
import { UpdateRoomDto } from '../dto/room/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private roomMembershipRepository: Repository<RoomMembership>,
  ) {}

  async create(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create({
      ...createRoomDto,
      ownerId: userId,
    });

    await this.roomRepository.save(room);

    // Add the creator as a member of the room
    const membership = this.roomMembershipRepository.create({
      userId,
      roomId: room.id,
    });

    await this.roomMembershipRepository.save(membership);

    return room;
  }

  async findAll(userId: string): Promise<Room[]> {
    // Get all public rooms
    const publicRooms = await this.roomRepository.find({
      where: { isPrivate: false },
    });

    // Get private rooms that the user is a member of
    const userMemberships = await this.roomMembershipRepository.find({
      where: { userId },
      relations: ['room'],
    });

    const privateMemberRooms = userMemberships
      .map((membership) => membership.room)
      .filter((room) => room.isPrivate);

    return [...publicRooms, ...privateMemberRooms];
  }

  async findOne(id: string, userId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomMemberships'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Check if the room is private and if the user is a member
    if (room.isPrivate) {
      const isMember = room.roomMemberships.some(
        (membership) => membership.userId === userId,
      );

      if (!isMember) {
        throw new ForbiddenException(
          'You are not a member of this private room',
        );
      }
    }

    return room;
  }

  async update(
    id: string,
    userId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Check if the user is the owner of the room
    if (room.ownerId !== userId) {
      throw new ForbiddenException('Only the room owner can update it');
    }

    await this.roomRepository.update(id, updateRoomDto);

    const updatedRoom = await this.roomRepository.findOne({
      where: { id },
    });

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found after update`);
    }

    return updatedRoom;
  }
  async remove(id: string, userId: string): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Check if the user is the owner of the room
    if (room.ownerId !== userId) {
      throw new ForbiddenException('Only the room owner can delete it');
    }

    await this.roomRepository.delete(id);
  }

  async addMember(
    roomId: string,
    userId: string,
    newMemberId: string,
  ): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check if the user is the owner of the room
    if (room.ownerId !== userId) {
      throw new ForbiddenException('Only the room owner can add members');
    }

    // Check if the new member is already a member
    const existingMembership = await this.roomMembershipRepository.findOne({
      where: { roomId, userId: newMemberId },
    });

    if (existingMembership) {
      // Member already exists, don't try to add them again
      return;
    }

    // Create new membership only if it doesn't exist
    const membership = this.roomMembershipRepository.create({
      userId: newMemberId,
      roomId,
    });

    await this.roomMembershipRepository.save(membership);
  }

  async removeMember(
    roomId: string,
    userId: string,
    memberId: string,
  ): Promise<void> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // Check if the user is the owner of the room or removing themself
    if (room.ownerId !== userId && userId !== memberId) {
      throw new ForbiddenException(
        'Only the room owner can remove other members',
      );
    }

    // Cannot remove the owner from their own room
    if (memberId === room.ownerId) {
      throw new ForbiddenException(
        'Cannot remove the owner from their own room',
      );
    }

    await this.roomMembershipRepository.delete({
      roomId,
      userId: memberId,
    });
  }
}
