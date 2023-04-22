import type { RequestWithUser, SocketWithUser } from '#app/global/types/common.types';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const UserParam = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser;
    return request.user;
  } else {
    const socket = ctx.switchToWs().getClient() as SocketWithUser;
    return socket.data.user;
  }
});
