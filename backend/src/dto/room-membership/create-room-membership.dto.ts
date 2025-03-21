import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoomMembershipDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;
}
