import { IoCanActivate } from '#app/global/interfaces/io-can-activate.interface';
import { UsersService } from '#app/users/users.service';
import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Namespace, Socket } from 'socket.io';

@Injectable()
export class JwtAuthIoGuard implements IoCanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly orm: MikroORM,
  ) {}

  async canActivate(socket: Socket, io: Namespace): Promise<boolean> {
    const token = socket.handshake.auth.token;
    const jwtPayload = await this.jwtService.verify(token);
    return this.orm.em.transactional(async (em) => {
      const user = await this.userService.findOne(em, jwtPayload.sub);
      if (!user) return false;
      socket.data.user = user;

      return true;
    });
  }
}
