import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomMembership } from './room-membership.entity';
import { SchemaFactory } from '@nestjs/mongoose';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ name: 'avatar_url', nullable: false, length: 245 })
  avatarUrl: string;

  @Column({ name: 'password_digest', nullable: false })
  passwordDigest: string;

  @Column({ name: 'session_token', unique: true, nullable: false })
  sessionToken: string;

  @Column({ default: 'guest', nullable: false, unique: true })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RoomMembership, (roomMembership) => roomMembership.user)
  roomMemberships: RoomMembership[];

  // This is a virtual property (not stored in DB)
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
