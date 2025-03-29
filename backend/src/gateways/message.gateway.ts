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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@ApiTags('messages')
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Handle WebSocket connection' })
  @ApiResponse({ status: 200, description: 'Connection successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake
      const token = client.handshake.auth.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      // Validate token
      const payload: { id: string } = await this.jwtService.verify(token);
      client.data = { user: payload };

      // Join user to their user-specific room for private messages
      await client.join(`user:${payload.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Connection error:', err.message);
      }
      client.disconnect();
    }
  }
  handleDisconnect() {
    // Clean up any resources if needed
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  @ApiOperation({ summary: 'Join a room' })
  @ApiResponse({ status: 200, description: 'Joined room successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    // Add user to room channel
    await client.join(`room:${roomId}`);

    const userId = (client.data as { user: { id: string } }).user.id;

    // Could notify other users that this user joined the room
    this.server.to(`room:${roomId}`).emit('userJoined', {
      userId,
      roomId,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  @ApiOperation({ summary: 'Leave a room' })
  @ApiResponse({ status: 200, description: 'Left room successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.leave(`room:${roomId}`);
    const userId = (client.data as { user: { id: string } }).user.id;

    // Could notify other users that this user left the room
    this.server.to(`room:${roomId}`).emit('userLeft', {
      userId,
      roomId,
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const userId = (client.data as { user: { id: string } }).user.id;
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
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'An unknown error occurred' };
    }
  }
}
