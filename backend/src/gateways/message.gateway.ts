import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/message/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake
      const token = client.handshake.auth.token;
      if (!token) {
        await client.disconnect();
        return;
      }

      // Validate token
      const payload = await this.jwtService.verify(token);
      client.data.user = payload;

      // Join user to their user-specific room for private messages
      await client.join(`user:${payload.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Connection error:', err.message);
      }
      await client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    // Clean up any resources if needed
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    // Add user to room channel
    client.join(`room:${roomId}`);

    // Could notify other users that this user joined the room
    this.server.to(`room:${roomId}`).emit('userJoined', {
      userId: client.data.user.id,
      roomId,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(`room:${roomId}`);

    // Could notify other users that this user left the room
    this.server.to(`room:${roomId}`).emit('userLeft', {
      userId: client.data.user.id,
      roomId,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const userId = client.data.user.id;
      const message = await this.messageService.create(
        userId,
        createMessageDto,
      );

      // Broadcast the message to all clients in the room
      this.server
        .to(`room:${createMessageDto.roomId}`)
        .emit('newMessage', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
