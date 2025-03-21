import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../user/user-response.dto';

@Exclude()
export class RoomResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  isPrivate: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  ownerId: string;

  @Expose()
  @Type(() => UserResponseDto)
  owner?: UserResponseDto;

  @Expose()
  memberCount?: number;

  constructor(partial: Partial<RoomResponseDto>) {
    Object.assign(this, partial);
  }
}
