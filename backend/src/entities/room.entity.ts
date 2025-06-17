import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomMembership } from './room-membership.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id', nullable: false })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.ownedRooms)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'is_private', default: true, nullable: false })
  isPrivate: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RoomMembership, (membership) => membership.room)
  roomMemberships: RoomMembership[];

  @OneToMany(() => Message, (message) => message.room, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
