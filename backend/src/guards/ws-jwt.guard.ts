import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { User } from 'src/entities/user.entity';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      interface SocketClient {
        data?: {
          user?: User;
        };
        handshake?: {
          auth?: {
            token?: string;
          };
        };
      }

      const client: SocketClient = context.switchToWs().getClient();

      // If user data already exists on the socket (connection handler extracted it),
      // then we don't need to verify the token again
      if (client.data?.user) {
        return true;
      }

      // Get token from socket handshake auth
      const token = client.handshake?.auth?.token;

      if (!token) {
        throw new WsException('Unauthorized - No token provided');
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync<User>(token);

      // Attach decoded user to socket data for future use
      client.data = {
        ...client.data,
        user: payload,
      };

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new WsException('Unauthorized - Invalid token');
    }
  }
}
