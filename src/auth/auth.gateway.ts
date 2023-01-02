import { Inject } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketWithUser } from 'src/global/types';
import { UsersService } from 'src/users/users.service';

export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  protected readonly logger: Logger;

  @Inject()
  private readonly jwtService: JwtService;
  @Inject()
  private readonly userService: UsersService;

  constructor(protected readonly namespace) {
    this.namespace = namespace;
    this.logger = new Logger(`${this.namespace.toUpperCase()}Gateway`);
  }

  handleDisconnect(client: SocketWithUser) {
    this.logger.debug(`Client ${client.id} disconnected`);
  }

  async handleConnection(client: SocketWithUser) {
    if (!(await this._authenticate(client))) return;

    Logger.log(`Client ${client.id} connected`, 'RTC');
  }

  private async _authenticate(socket: SocketWithUser) {
    try {
      const token = socket.handshake.headers.authorization.split(' ')[1];
      const jwtPayload = await this.jwtService.verify(token);
      const user = await this.userService.findOne(jwtPayload.sub);
      if (!user) {
        socket.disconnect();
        return false;
      }
      socket.data.user = user;
      return true;
    } catch (error) {
      socket.disconnect();
      return false;
    }
  }
}
