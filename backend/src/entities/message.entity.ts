import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'body', type: 'text', nullable: false })
  body: string;

  @Column({ name: 'parent_message_id', nullable: true })
  parentMessageId: string | null;

  @Column({ name: 'room_id', nullable: false })
  roomId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  author: User;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Message, (message) => message.replies, { nullable: true })
  @JoinColumn({ name: 'parent_message_id' })
  parentMessage: Message | null;

  @OneToMany(() => Message, (message) => message.parentMessage)
  replies: Message[];
}
